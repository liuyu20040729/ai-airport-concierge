import os
from pathlib import Path
import math
import json

import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from openai import OpenAI
from pydantic import BaseModel


load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    raise RuntimeError("OPENROUTER_API_KEY is not configured. Please check your .env file.")

client = OpenAI(api_key=api_key, base_url="https://openrouter.ai/api/v1")
OPENROUTER_URL = "https://openrouter.ai/api/v1"

app = FastAPI(title="AI Airport Passenger Assistant", description="AI-powered airport passenger support prototype", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="frontend"), name="static")


class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    needs_human: bool = False

DATA_DIR = Path("data")
FLIGHTS_FILE = DATA_DIR / "flights.json"
if FLIGHTS_FILE.exists():
    with open(FLIGHTS_FILE, "r", encoding="utf-8") as f:
        FLIGHTS = json.load(f)
else:
    FLIGHTS = []
    print("⚠️ Warning: data/flights.json not found. Using empty list.")

@app.get("/api/flights")
def get_flights():
    return {"success": True, "count": len(FLIGHTS), "results": FLIGHTS}

KNOWLEDGE_DIR = Path("knowledge")

def load_knowledge_base():
    documents = []
    if not KNOWLEDGE_DIR.exists():
        print("Knowledge directory not found.")
        return documents
    for file_path in KNOWLEDGE_DIR.glob("*.txt"):
        try:
            content = file_path.read_text(encoding="utf-8")
            documents.append({"filename": file_path.name, "content": content})
        except Exception as e:
            print(f"Failed to read {file_path}: {e}")
    return documents

KNOWLEDGE_BASE = load_knowledge_base()
print(f"Loaded {len(KNOWLEDGE_BASE)} knowledge documents.")


def get_embedding(text: str):
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    data = {"model": "nvidia/nemotron-3-embed-1b:free", "input": [text]}
    response = requests.post(f"{OPENROUTER_URL}/embeddings", headers=headers, json=data, timeout=30)
    response.raise_for_status()
    return response.json()["data"][0]["embedding"]


def cosine_similarity(vector_a, vector_b):
    dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
    magnitude_a = math.sqrt(sum(a * a for a in vector_a))
    magnitude_b = math.sqrt(sum(b * b for b in vector_b))
    if magnitude_a == 0 or magnitude_b == 0:
        return 0
    return dot_product / (magnitude_a * magnitude_b)


def build_knowledge_embeddings():
    print("Building knowledge embeddings...")
    for document in KNOWLEDGE_BASE:
        try:
            document["embedding"] = get_embedding(document["content"])
            print(f"Embedded: {document['filename']}")
        except Exception as e:
            print(f"Failed to embed {document['filename']}: {e}")
            document["embedding"] = None

build_knowledge_embeddings()


def retrieve_relevant_knowledge(user_message: str, max_documents: int = 2):
    if not KNOWLEDGE_BASE:
        return ""
    try:
        query_embedding = get_embedding(user_message)
    except Exception as e:
        print("Embedding error:", e)
        return ""
    scored_documents = []
    for document in KNOWLEDGE_BASE:
        document_embedding = document.get("embedding")
        if not document_embedding:
            continue
        similarity = cosine_similarity(query_embedding, document_embedding)
        scored_documents.append((similarity, document))
    scored_documents.sort(key=lambda x: x[0], reverse=True)
    selected_content = []
    for similarity, document in scored_documents[:max_documents]:
        if similarity >= 0.2:
            selected_content.append(document["content"].strip())
    return "\n\n".join(selected_content) if selected_content else ""

def detect_language(text: str) -> str:
    """Simple language detection based on character ranges"""
    for char in text:
        if 0x3040 <= ord(char) <= 0x30FF:
            return "japanese"
        if 0xAC00 <= ord(char) <= 0xD7AF:
            return "korean"
        if 0x4E00 <= ord(char) <= 0x9FFF:
            return "chinese"
    return "english"

def quick_knowledge_match(user_message: str) -> str:
    """Quick keyword match for common English questions only.
       Returns cleaned content without Q:/A: prefixes.
    """
    msg = user_message.lower()
    
    if detect_language(user_message) != "english":
        return ""
    
    all_content = ""
    for doc in KNOWLEDGE_BASE:
        all_content += doc["content"] + "\n\n"
    
    english_keywords = {
        "taxi": ["taxi", "cab", "pickup", "ground transportation"],
        "restroom": ["restroom", "toilet", "bathroom", "washroom"],
        "wifi": ["wifi", "wireless", "internet", "wi-fi"],
        "atm": ["atm", "cash", "withdrawal"],
        "information desk": ["information desk", "help desk", "assistance"],
        "lost and found": ["lost", "found", "lost property"],
        "first aid": ["first aid", "medical", "clinic", "doctor"],
        "accessibility": ["wheelchair", "accessible", "disabled"],
        "baggage claim": ["baggage claim", "luggage", "carousel"],
        "check-in": ["check-in", "counter", "kiosk"],
        "security": ["security", "screening"],
        "boarding gate": ["gate", "boarding"],
        "food": ["restaurant", "cafe", "dining", "food", "eat"],
        "shopping": ["shop", "duty free", "store", "retail"],
        "swimming": ["swimming", "pool", "swim"],
    }
    
    for category, words in english_keywords.items():
        if any(word in msg for word in words):
            lines = all_content.split("\n")
            matched_lines = []
            for i, line in enumerate(lines):
                line_stripped = line.strip()
                if not line_stripped:
                    continue
                line_lower = line_stripped.lower()
                if any(word in line_lower for word in words):
                    if line_stripped.startswith("Q:") or line_stripped.startswith("A:"):
                        continue
                    matched_lines.append(line_stripped)
                elif i > 0:
                    prev_line = lines[i-1].strip().lower()
                    if any(word in prev_line for word in words) and len(line_stripped) > 10:
                        if not line_stripped.startswith("Q:") and not line_stripped.startswith("A:"):
                            matched_lines.append(line_stripped)
            
            if matched_lines:
                matched_lines = list(dict.fromkeys(matched_lines))[:6]
                return "\n".join(f"• {line}" for line in matched_lines if line)
    
    return ""


@app.get("/")
def root():
    return FileResponse("frontend/index.html")


@app.get("/health")
def health_check():
    return {"status": "healthy", "knowledge_documents": len(KNOWLEDGE_BASE), "virtual_flights": len(FLIGHTS)}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    user_message = request.message.strip()
    if not user_message:
        return {"response": "Please enter a question.", "needs_human": False}

    user_lang = detect_language(user_message)

    quick_response = quick_knowledge_match(user_message)
    if quick_response:
        return {"response": quick_response, "needs_human": False}

    context = retrieve_relevant_knowledge(user_message)

    needs_human = False

    language_instruction = {
        "english": "Answer in English.",
        "chinese": "用中文回答。",
        "japanese": "日本語で回答してください。",
        "korean": "한국어로 답변해주세요。"
    }.get(user_lang, "Answer in English.")

    format_instruction = """
FORMAT REQUIREMENTS:
- If your answer has multiple points, use bullet points with the symbol "•".
- Each bullet point MUST be on its own separate line (use \n).
- If it's a single piece of information, use a clean paragraph.
- Do NOT use markdown, bold, or any special formatting.
- Do NOT include any introduction, sources, Q:/A: labels, or meta-commentary.
- Give ONLY the direct answer with NO preface.
- Example format for multiple points:
  • First point.
  • Second point.
  • Third point.
"""

    if context:
        system_prompt = f"""
You are an AI airport passenger support assistant.

Answer the passenger's question based ONLY on the provided airport information.

RULES:
1. {language_instruction}
2. Use ONLY the information below. Do not add extra details.
3. Do not mention the knowledge base, sources, or any technical details.
4. {format_instruction}

CONTEXT:
{context}

Passenger question: {user_message}

Your answer (ONLY the direct answer, no introductions):
"""
    else:
        all_content = ""
        for doc in KNOWLEDGE_BASE:
            all_content += doc["content"] + "\n\n"
        
        if not all_content:
            all_content = "No specific airport information available."

        system_prompt = f"""
You are an AI airport passenger support assistant.

Answer the passenger's question using general knowledge and the provided airport information (if relevant).

RULES:
1. {language_instruction}
2. Use common sense when specific info is not in the provided content.
3. Do not invent specific airport facilities.
4. Do not mention the knowledge base, sources, or technical details.
5. {format_instruction}

REFERENCE INFORMATION:
{all_content}

Passenger question: {user_message}

Your answer (ONLY the direct answer, no introductions):
"""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        ai_response = completion.choices[0].message.content

        prefixes = ["Based on", "According to", "From the", "The information", "Here is", "Q:", "A:"]
        for prefix in prefixes:
            if ai_response.startswith(prefix):
                lines = ai_response.split("\n", 1)
                if len(lines) > 1:
                    ai_response = lines[1].strip()
                else:
                    ai_response = ai_response.split(".", 1)[-1].strip()
                break

        lines = ai_response.split("\n")
        cleaned_lines = []
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("Q:") or stripped.startswith("A:"):
                continue
            cleaned_lines.append(line)
        ai_response = "\n".join(cleaned_lines).strip()

        if len(ai_response) < 10 or "cannot confirm" in ai_response.lower():
            needs_human = True

        return {"response": ai_response, "needs_human": needs_human}
    except Exception as e:
        print("OpenRouter API error:", e)
        return {
            "response": "Sorry, I am currently unable to process your request. Please contact airport staff for assistance.",
            "needs_human": True
        }