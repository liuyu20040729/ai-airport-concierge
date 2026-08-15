# AI Airport Passenger Assistant

An AI-powered passenger support prototype for airports, built as part of a technical assessment. The system combines a RAG-based chatbot, flight search, service directory, analytics dashboard, and human escalation into a single web application.

Live Demo: https://your-app.onrender.com (Update after deployment)


## Features

AI Chatbot - Natural language Q&A using OpenRouter LLM (gpt-oss-20b:free)

RAG Knowledge Base - Airport documents (facilities, FAQ, transport, wayfinding) with embeddings for accurate responses

Flight Search - Search by flight number or origin/destination with departure/arrival filtering

Service Directory - Natural language search for restaurants, lounges, shops, facilities, and transport

Analytics Dashboard - Track queries, escalation rate, popular topics, and most searched flights

Video Assistance - Simulated video call escalation to staff (demo mode)

Human Escalation - Auto-detection (knowledge not found) plus manual request via Staff page

Multilingual Support - AI detects and responds in the user's language (Chinese/English)

Dual-Role Login - Passenger (standard) and Staff (with analytics access) roles


## Tech Stack

Backend: FastAPI (Python)

Frontend: HTML + CSS + JavaScript (Vanilla, single-page app)

AI Model (Chat): OpenRouter API - openai/gpt-oss-20b:free

AI Model (Embeddings): OpenRouter API - nvidia/nemotron-3-embed-1b:free

Vector Search: Cosine similarity on embeddings

Data Storage: In-memory (flights + service directory) + Knowledge base (.txt files)

Analytics: localStorage (client-side persistence)


## Project Structure

ai-airport-concierge/
├── backend/
│   ├── __pycache__/
│   │   └── main.cpython-312.pyc
│   └── main.py
├── data/
│   └── flights.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── knowledge/
│   ├── facilities.txt
│   ├── faq.txt
│   ├── transportation.txt
│   └── wayfinding.txt
├── venv/
│   ├── Include/
│   ├── Lib/site-packages/
│   ├── Scripts/
│   └── pyvenv.cfg
├── .env
├── .gitignore
├── README.md
└── requirements.txt


## Setup Instructions

Prerequisites:
- Python 3.8 or higher
- OpenRouter API key (Get one at https://openrouter.ai/keys)

1. Clone the repository

git clone https://github.com/your-username/ai-airport-assistant.git
cd ai-airport-assistant

2. Create and activate virtual environment (recommended)

Windows:
python -m venv venv
venv\Scripts\activate

Mac / Linux:
python3 -m venv venv
source venv/bin/activate

3. Install dependencies

pip install -r requirements.txt

4. Set up environment variables

Create a .env file in the project root with:
OPENROUTER_API_KEY=your_api_key_here

5. Run the application

uvicorn main:app --reload

6. Open the application

Visit: http://localhost:8000


## Demo Login

Username: passenger
Password: 123456
Role: Passenger
Access: All features except Analytics

Username: staff
Password: 123456
Role: Staff
Access: All features including Analytics


## AI Models Used

openai/gpt-oss-20b:free - Chat/response generation (OpenRouter)
nvidia/nemotron-3-embed-1b:free - Document embeddings for RAG (OpenRouter)

Note: The free tier has a daily limit of 50 requests. If you hit the rate limit (429), wait for the daily reset (UTC 00:00) or add credits to your OpenRouter account.


## How It Works

RAG Workflow:
1. User asks a question
2. System retrieves relevant documents from knowledge/ folder
3. Embedding + cosine similarity finds the best match
4. Matched content is injected into the LLM prompt
5. LLM generates a response based on the provided context

Flight Search:
- Singapore Airlines flight data (35 flights)
- Search by flight number (e.g., SQ318) or route (origin to destination)
- Filter by flight type: All, Departures, Arrivals

Service Directory:
- 40+ services across 5 categories
- Natural language understanding in chat (e.g., "What's in T3?")
- Search and category filters in the Facilities page

Analytics Dashboard:
- All queries and escalations tracked in localStorage
- Displays: total queries, escalation rate, top enquiry types, most searched flights, recent queries

Human Escalation:
- Auto-escalation: When no relevant knowledge is found, needs_human: true is returned
- Manual escalation: Request Staff Assistance button and Request Video Call button

Dual-Role Login:
- Passenger: Standard user experience, Analytics navigation hidden
- Staff: Full access including Analytics dashboard


## Evaluation Mapping

Requirement | Implementation
AI-powered FAQ chatbot using an LLM | OpenRouter LLM integration
RAG-based knowledge assistant | 4 knowledge documents + embeddings
Human escalation | Auto + manual escalation
Service directory with natural language search | 40+ services + chat intent detection
AI agent for wayfinding/flight enquiries | Flight search by number + route
Multilingual AI assistant | System prompt supports any language
AI-powered analytics dashboard | Full dashboard with query tracking
Video assistance | Simulated video call demo


## License

This project was created as part of a technical assessment for Hipster. All rights reserved.


## Author

Liu Yu


