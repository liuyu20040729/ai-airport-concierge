const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const clickableCards = document.querySelectorAll("[data-target]");

function showPage(pageId) {
    localStorage.setItem("currentPage", pageId);
    pages.forEach(p => p.classList.remove("active-page"));
    navItems.forEach(n => n.classList.remove("active"));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add("active-page");
    const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (targetNav) targetNav.classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" });
}

navItems.forEach(item => item.addEventListener("click", () => showPage(item.dataset.page)));
clickableCards.forEach(card => card.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") return;
    const target = card.dataset.target;
    if (target) showPage(target);
}));

const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");
const loginForm = document.getElementById("loginForm");
const currentUser = document.getElementById("currentUser");
const logoutButton = document.getElementById("logoutButton");

const analyticsNavItem = document.querySelector('.nav-item[data-page="analytics"]');

function updateNavigationByRole(role) {
    if (!analyticsNavItem) return;
    if (role === "staff") {
        analyticsNavItem.style.display = "inline-block";
    } else {
        analyticsNavItem.style.display = "none";
        const currentPage = localStorage.getItem("currentPage");
        if (currentPage === "analytics") {
            showPage("dashboard");
        }
    }
}

function checkLoginStatus() {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const username = localStorage.getItem("username") || "Passenger";
    const role = localStorage.getItem("userRole") || "passenger";
    if (loggedIn) {
        currentUser.textContent = username;
        loginPage.classList.add("hidden");
        app.classList.remove("hidden");
        updateNavigationByRole(role);
        const lastPage = localStorage.getItem("currentPage") || "dashboard";
        if (lastPage === "analytics" && role !== "staff") {
            showPage("dashboard");
        } else {
            showPage(lastPage);
        }
        return true;
    }
    return false;
}

loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if ((username === "passenger" || username === "staff") && password === "123456") {
        const role = username === "staff" ? "staff" : "passenger";
        const displayName = username === "staff" ? "Staff 👨‍💼" : "Passenger 🧑‍🤝‍🧑";

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", displayName);
        localStorage.setItem("userRole", role);

        currentUser.textContent = displayName;
        loginPage.classList.add("hidden");
        app.classList.remove("hidden");
        updateNavigationByRole(role);
        showPage("dashboard");
    } else {
        alert("Invalid username or password.\n\nDemo accounts:\npassenger / 123456\nstaff / 123456");
    }
});

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentPage");
    app.classList.add("hidden");
    loginPage.classList.remove("hidden");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    if (analyticsNavItem) {
        analyticsNavItem.style.display = "inline-block";
    }
    showPage("dashboard");
});

if (!checkLoginStatus()) {}

const flightData = [
    { "flight_number": "SQ318", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "London (LHR)", "flight_type": "departures", "date": "2026-08-13", "departure": "23:55", "arrival": "06:15", "terminal": "Terminal 3", "gate": "B12", "baggage_belt": "42", "status": "On Time" },
    { "flight_number": "SQ12", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Tokyo (NRT)", "flight_type": "departures", "date": "2026-08-13", "departure": "09:20", "arrival": "17:10", "terminal": "Terminal 3", "gate": "A18", "baggage_belt": "18", "status": "Boarding" },
    { "flight_number": "SQ856", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Hong Kong (HKG)", "flight_type": "departures", "date": "2026-08-13", "departure": "14:30", "arrival": "18:20", "terminal": "Terminal 3", "gate": "C22", "baggage_belt": "31", "status": "Delayed" },
    { "flight_number": "SQ221", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Sydney (SYD)", "flight_type": "departures", "date": "2026-08-13", "departure": "20:40", "arrival": "06:10", "terminal": "Terminal 3", "gate": "-", "baggage_belt": "-", "status": "Cancelled" },
    { "flight_number": "SQ308", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "London (LHR)", "flight_type": "departures", "date": "2026-08-13", "departure": "09:00", "arrival": "15:10", "terminal": "Terminal 3", "gate": "B08", "baggage_belt": "40", "status": "Departed" },
    { "flight_number": "SQ826", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Shanghai (PVG)", "flight_type": "departures", "date": "2026-08-13", "departure": "16:45", "arrival": "22:00", "terminal": "Terminal 3", "gate": "A21", "baggage_belt": "27", "status": "On Time" },
    { "flight_number": "SQ706", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Bangkok (BKK)", "flight_type": "departures", "date": "2026-08-13", "departure": "11:15", "arrival": "12:35", "terminal": "Terminal 2", "gate": "F31", "baggage_belt": "12", "status": "On Time" },
    { "flight_number": "SQ424", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Mumbai (BOM)", "flight_type": "departures", "date": "2026-08-13", "departure": "18:10", "arrival": "21:05", "terminal": "Terminal 3", "gate": "B15", "baggage_belt": "36", "status": "Boarding" },
    { "flight_number": "SQ976", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Phnom Penh (PNH)", "flight_type": "departures", "date": "2026-08-13", "departure": "13:25", "arrival": "14:25", "terminal": "Terminal 2", "gate": "F12", "baggage_belt": "09", "status": "On Time" },
    { "flight_number": "SQ638", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Seoul (ICN)", "flight_type": "departures", "date": "2026-08-13", "departure": "23:10", "arrival": "06:40", "terminal": "Terminal 3", "gate": "A06", "baggage_belt": "22", "status": "On Time" },
    { "flight_number": "SQ104", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Kuala Lumpur (KUL)", "flight_type": "departures", "date": "2026-08-13", "departure": "08:30", "arrival": "09:25", "terminal": "Terminal 2", "gate": "F18", "baggage_belt": "07", "status": "Departed" },
    { "flight_number": "SQ446", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Dhaka (DAC)", "flight_type": "departures", "date": "2026-08-13", "departure": "21:30", "arrival": "00:45", "terminal": "Terminal 3", "gate": "B19", "baggage_belt": "35", "status": "On Time" },
    { "flight_number": "SQ478", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Johannesburg (JNB)", "flight_type": "departures", "date": "2026-08-13", "departure": "01:30", "arrival": "06:20", "terminal": "Terminal 3", "gate": "C08", "baggage_belt": "44", "status": "On Time" },
    { "flight_number": "SQ36", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Los Angeles (LAX)", "flight_type": "departures", "date": "2026-08-13", "departure": "20:25", "arrival": "19:10", "terminal": "Terminal 3", "gate": "B28", "baggage_belt": "39", "status": "Delayed" },
    { "flight_number": "SQ22", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "New York (JFK)", "flight_type": "departures", "date": "2026-08-13", "departure": "23:55", "arrival": "00:15", "terminal": "Terminal 3", "gate": "C15", "baggage_belt": "45", "status": "On Time" },
    { "flight_number": "SQ890", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Taipei (TPE)", "flight_type": "departures", "date": "2026-08-13", "departure": "07:50", "arrival": "12:30", "terminal": "Terminal 3", "gate": "A11", "baggage_belt": "15", "status": "Boarding" },
    { "flight_number": "SQ882", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Beijing (PEK)", "flight_type": "departures", "date": "2026-08-13", "departure": "15:20", "arrival": "21:25", "terminal": "Terminal 3", "gate": "B22", "baggage_belt": "29", "status": "On Time" },
    { "flight_number": "SQ934", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Jakarta (CGK)", "flight_type": "departures", "date": "2026-08-13", "departure": "10:15", "arrival": "11:05", "terminal": "Terminal 2", "gate": "F08", "baggage_belt": "11", "status": "Departed" },
    { "flight_number": "SQ548", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Manchester (MAN)", "flight_type": "departures", "date": "2026-08-13", "departure": "02:15", "arrival": "09:10", "terminal": "Terminal 3", "gate": "C03", "baggage_belt": "41", "status": "On Time" },
    { "flight_number": "SQ332", "airline": "Singapore Airlines", "origin": "Singapore (SIN)", "destination": "Paris (CDG)", "flight_type": "departures", "date": "2026-08-13", "departure": "23:30", "arrival": "06:45", "terminal": "Terminal 3", "gate": "B31", "baggage_belt": "38", "status": "On Time" },
    { "flight_number": "SQ319", "airline": "Singapore Airlines", "origin": "London (LHR)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "09:00", "arrival": "16:30", "terminal": "Terminal 3", "gate": "B12", "baggage_belt": "42", "status": "On Time" },
    { "flight_number": "SQ11", "airline": "Singapore Airlines", "origin": "Tokyo (NRT)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "08:00", "arrival": "15:45", "terminal": "Terminal 3", "gate": "A18", "baggage_belt": "18", "status": "Landed" },
    { "flight_number": "SQ857", "airline": "Singapore Airlines", "origin": "Hong Kong (HKG)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "11:30", "arrival": "15:20", "terminal": "Terminal 3", "gate": "C22", "baggage_belt": "31", "status": "On Time" },
    { "flight_number": "SQ222", "airline": "Singapore Airlines", "origin": "Sydney (SYD)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "12:00", "arrival": "18:15", "terminal": "Terminal 3", "gate": "B08", "baggage_belt": "40", "status": "Delayed" },
    { "flight_number": "SQ827", "airline": "Singapore Airlines", "origin": "Shanghai (PVG)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "10:00", "arrival": "15:30", "terminal": "Terminal 3", "gate": "A21", "baggage_belt": "27", "status": "Landed" },
    { "flight_number": "SQ707", "airline": "Singapore Airlines", "origin": "Bangkok (BKK)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "08:30", "arrival": "10:15", "terminal": "Terminal 2", "gate": "F31", "baggage_belt": "12", "status": "Landed" },
    { "flight_number": "SQ425", "airline": "Singapore Airlines", "origin": "Mumbai (BOM)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "07:00", "arrival": "14:30", "terminal": "Terminal 3", "gate": "B15", "baggage_belt": "36", "status": "On Time" },
    { "flight_number": "SQ977", "airline": "Singapore Airlines", "origin": "Phnom Penh (PNH)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "09:00", "arrival": "10:30", "terminal": "Terminal 2", "gate": "F12", "baggage_belt": "09", "status": "Landed" },
    { "flight_number": "SQ639", "airline": "Singapore Airlines", "origin": "Seoul (ICN)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "06:00", "arrival": "13:20", "terminal": "Terminal 3", "gate": "A06", "baggage_belt": "22", "status": "On Time" },
    { "flight_number": "SQ105", "airline": "Singapore Airlines", "origin": "Kuala Lumpur (KUL)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "08:00", "arrival": "08:55", "terminal": "Terminal 2", "gate": "F18", "baggage_belt": "07", "status": "Landed" },
    { "flight_number": "SQ447", "airline": "Singapore Airlines", "origin": "Dhaka (DAC)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "06:00", "arrival": "13:00", "terminal": "Terminal 3", "gate": "B19", "baggage_belt": "35", "status": "On Time" },
    { "flight_number": "SQ479", "airline": "Singapore Airlines", "origin": "Johannesburg (JNB)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "05:00", "arrival": "14:45", "terminal": "Terminal 3", "gate": "C08", "baggage_belt": "44", "status": "Delayed" },
    { "flight_number": "SQ37", "airline": "Singapore Airlines", "origin": "Los Angeles (LAX)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "03:00", "arrival": "12:15", "terminal": "Terminal 3", "gate": "B28", "baggage_belt": "39", "status": "On Time" },
    { "flight_number": "SQ23", "airline": "Singapore Airlines", "origin": "New York (JFK)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "02:00", "arrival": "11:30", "terminal": "Terminal 3", "gate": "C15", "baggage_belt": "45", "status": "On Time" },
    { "flight_number": "SQ891", "airline": "Singapore Airlines", "origin": "Taipei (TPE)", "destination": "Singapore (SIN)", "flight_type": "arrivals", "date": "2026-08-13", "departure": "07:00", "arrival": "11:30", "terminal": "Terminal 3", "gate": "A11", "baggage_belt": "15", "status": "Landed" }
];

console.log("✅ flightData loaded, count:", flightData.length);

const serviceDirectory = {
    restaurants: [
        { id: 1, name: "Crystal Jade Palace", terminal: "T3", location: "Departure Hall, Level 2", cuisine: "Chinese", hours: "11:00 - 22:00", icon: "🍜", price: "S$$$" },
        { id: 2, name: "Starbucks", terminal: "T2", location: "Arrival Hall, Level 1", cuisine: "Coffee", hours: "06:00 - 23:00", icon: "☕", price: "S$" },
        { id: 3, name: "Sushi Tei", terminal: "T1", location: "Level 2, Near Gate D", cuisine: "Japanese", hours: "10:00 - 21:00", icon: "🍣", price: "S$$" },
        { id: 4, name: "Pizza Hut", terminal: "T3", location: "Level 3, Food Court", cuisine: "Italian", hours: "10:00 - 22:00", icon: "🍕", price: "S$" },
        { id: 5, name: "Ya Kun Kaya Toast", terminal: "T2", location: "Level 2, Departure Hall", cuisine: "Singaporean", hours: "07:00 - 21:00", icon: "🍞", price: "S$" },
        { id: 6, name: "Din Tai Fung", terminal: "T1", location: "Level 3, Food Court", cuisine: "Taiwanese", hours: "10:00 - 21:30", icon: "🥟", price: "S$$" },
        { id: 7, name: "The Coffee Bean & Tea Leaf", terminal: "T3", location: "Arrival Hall", cuisine: "Coffee", hours: "06:00 - 22:00", icon: "☕", price: "S$" },
        { id: 8, name: "Bangkok Thai", terminal: "T2", location: "Level 3, Food Court", cuisine: "Thai", hours: "10:00 - 21:00", icon: "🌶️", price: "S$$" },
        { id: 9, name: "McDonald's", terminal: "T1", location: "Level 2, Departure Hall", cuisine: "Fast Food", hours: "24 Hours", icon: "🍔", price: "S$" },
        { id: 10, name: "KFC", terminal: "T3", location: "Level 2, Food Court", cuisine: "Fast Food", hours: "08:00 - 22:00", icon: "🍗", price: "S$" },
        { id: 11, name: "Sakae Sushi", terminal: "T2", location: "Level 2, Departure Hall", cuisine: "Japanese", hours: "10:00 - 21:00", icon: "🍣", price: "S$$" },
        { id: 12, name: "Prima Taste", terminal: "T3", location: "Level 3, Departure Hall", cuisine: "Singaporean", hours: "09:00 - 21:00", icon: "🍜", price: "S$$" }
    ],
    lounges: [
        { id: 101, name: "SilverKris Lounge", terminal: "T3", location: "Near Gate A1-A8", amenities: "Showers, Buffet, Bar, Wi-Fi", hours: "06:00 - 00:00", icon: "🛋️" },
        { id: 102, name: "KrisFlyer Gold Lounge", terminal: "T2", location: "Near Gate F1-F10", amenities: "Snacks, Wi-Fi, Showers", hours: "06:00 - 00:00", icon: "🛋️" },
        { id: 103, name: "SATS Premier Lounge", terminal: "T1", location: "Level 3, Near Gate C", amenities: "Buffet, Bar, Rest Area", hours: "24 Hours", icon: "🛋️" },
        { id: 104, name: "Dnata Lounge", terminal: "T3", location: "Near Gate B1-B8", amenities: "Snacks, Beverages, Wi-Fi", hours: "06:00 - 23:00", icon: "🛋️" },
        { id: 105, name: "Plaza Premium Lounge", terminal: "T2", location: "Level 2, Departure Hall", amenities: "Hot Meals, Showers, Bar", hours: "24 Hours", icon: "🛋️" },
        { id: 106, name: "Marhaba Lounge", terminal: "T1", location: "Level 3, Near Gate D", amenities: "Buffet, Wi-Fi, Relax Area", hours: "06:00 - 23:00", icon: "🛋️" }
    ],
    shops: [
        { id: 201, name: "DFS Duty Free", terminal: "T3", location: "Departure Hall, Level 2", category: "Luxury Goods", hours: "06:00 - 00:00", icon: "🛍️" },
        { id: 202, name: "The Shilla Duty Free", terminal: "T2", location: "Level 2, Departure Hall", category: "Beauty, Perfume", hours: "06:00 - 00:00", icon: "🛍️" },
        { id: 203, name: "TWG Tea Boutique", terminal: "T1", location: "Level 2", category: "Tea", hours: "08:00 - 22:00", icon: "🍵" },
        { id: 204, name: "Bacha Coffee", terminal: "T3", location: "Departure Hall", category: "Coffee", hours: "07:00 - 22:00", icon: "☕" },
        { id: 205, name: "Lotte Duty Free", terminal: "T1", location: "Level 2, Departure Hall", category: "Cosmetics, Fragrance", hours: "06:00 - 00:00", icon: "🛍️" },
        { id: 206, name: "Samsung Store", terminal: "T3", location: "Departure Hall, Level 2", category: "Electronics", hours: "08:00 - 22:00", icon: "📱" },
        { id: 207, name: "Apple Store", terminal: "T2", location: "Level 3, Departure Hall", category: "Electronics", hours: "09:00 - 21:00", icon: "📱" }
    ],
    facilities: [
        { id: 301, name: "Information Desk", terminal: "All", location: "Arrival Hall", services: "General Enquiries, Maps, Assistance", hours: "24 Hours", icon: "ℹ️" },
        { id: 302, name: "Lost & Found", terminal: "T3", location: "Level 1, Arrival Hall", services: "Lost Items Reporting, Retrieval", hours: "06:00 - 00:00", icon: "🔍" },
        { id: 303, name: "Medical Clinic", terminal: "T2", location: "Level 3", services: "Medical Assistance, First Aid, Vaccination", hours: "24 Hours", icon: "🏥" },
        { id: 304, name: "Baby Care Room", terminal: "All", location: "Near Gates", services: "Nursing Room, Baby Supplies, Diaper Changing", hours: "24 Hours", icon: "👶" },
        { id: 305, name: "Smoking Area", terminal: "All", location: "Designated Outdoor Areas", services: "Smoking Permitted", hours: "24 Hours", icon: "🚬" },
        { id: 306, name: "ATM Machines", terminal: "All", location: "Arrival Hall, Departure Hall", services: "Cash Withdrawal, Currency Exchange", hours: "24 Hours", icon: "🏧" },
        { id: 307, name: "Prayer Room", terminal: "T3", location: "Level 2, Near Gate B", services: "Multi-faith Prayer Room", hours: "24 Hours", icon: "🕌" },
        { id: 308, name: "Post Office", terminal: "T2", location: "Level 1, Arrival Hall", services: "Mail, Parcel Services", hours: "09:00 - 18:00", icon: "📮" },
        { id: 309, name: "Luggage Storage", terminal: "T1", location: "Level 1, Arrival Hall", services: "Short-term Luggage Storage", hours: "06:00 - 00:00", icon: "🧳" },
        { id: 310, name: "Changi Lounge", terminal: "T1", location: "Level 2, Departure Hall", services: "Rest Area, Wi-Fi, Refreshments", hours: "24 Hours", icon: "🛋️" }
    ],
    transport: [
        { id: 401, name: "Taxi Stand", terminal: "All", location: "Arrival Hall, Level 1", details: "Official taxis available 24/7. Estimated fare to city: S$20-35", icon: "🚕" },
        { id: 402, name: "MRT Station", terminal: "T3", location: "Basement 2", details: "Direct train to city centre in 25 minutes. Operating hours: 05:30 - 23:30", icon: "🚇" },
        { id: 403, name: "Bus Terminal", terminal: "T2", location: "Level 1", details: "Public buses to city and surrounding areas. Routes: 24, 27, 34, 36, 53, 110", icon: "🚌" },
        { id: 404, name: "Car Rental Desk", terminal: "T1", location: "Arrival Hall", details: "Avis, Hertz, Budget, Sixt available. Advance booking recommended", icon: "🚗" },
        { id: 405, name: "Shuttle Bus", terminal: "All", location: "Pickup points at each terminal", details: "Free inter-terminal shuttle bus. Frequency: Every 10 minutes", icon: "🚌" },
        { id: 406, name: "Changi Airport Skytrain", terminal: "All", location: "Airside, after security", details: "Free automated people mover between terminals (T1-T2-T3)", icon: "🚆" }
    ]
};

function getAllServices() {
    const all = [];
    Object.keys(serviceDirectory).forEach(category => {
        serviceDirectory[category].forEach(item => {
            all.push({ ...item, category: category });
        });
    });
    return all;
}

function loadAnalytics() {
    try {
        const saved = localStorage.getItem("analyticsData");
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
        totalQueries: 0,
        escalationCount: 0,
        queryTypes: { flights: 0, facilities: 0, transport: 0, wayfinding: 0, other: 0 },
        recentQueries: [],
        flightSearches: {},
        flightTypeCounts: { departures: 0, arrivals: 0 }
    };
}

function saveAnalytics() {
    try {
        localStorage.setItem("analyticsData", JSON.stringify(analyticsData));
    } catch (e) {}
}

let analyticsData = loadAnalytics();

function recordQuery(message, needsHuman = false) {
    analyticsData.totalQueries++;
    if (needsHuman) analyticsData.escalationCount++;

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('flight') || lowerMsg.includes('航班') || lowerMsg.includes('gate') || lowerMsg.includes('登机口')) {
        analyticsData.queryTypes.flights++;
    } else if (lowerMsg.includes('facility') || lowerMsg.includes('设施') || lowerMsg.includes('restaurant') || lowerMsg.includes('餐厅') || lowerMsg.includes('lounge') || lowerMsg.includes('休息室') || lowerMsg.includes('shop') || lowerMsg.includes('商店') || lowerMsg.includes('coffee') || lowerMsg.includes('咖啡') || lowerMsg.includes('food') || lowerMsg.includes('吃')) {
        analyticsData.queryTypes.facilities++;
    } else if (lowerMsg.includes('taxi') || lowerMsg.includes('bus') || lowerMsg.includes('train') || lowerMsg.includes('地铁') || lowerMsg.includes('交通') || lowerMsg.includes('skytrain') || lowerMsg.includes('shuttle')) {
        analyticsData.queryTypes.transport++;
    } else if (lowerMsg.includes('terminal') || lowerMsg.includes('航站楼') || lowerMsg.includes('wayfinding') || lowerMsg.includes('导航') || lowerMsg.includes('gate') || lowerMsg.includes('登机口')) {
        analyticsData.queryTypes.wayfinding++;
    } else {
        analyticsData.queryTypes.other++;
    }

    analyticsData.recentQueries.unshift({
        time: new Date().toLocaleString(),
        message: message.length > 50 ? message.substring(0, 50) + '...' : message,
        needsHuman: needsHuman
    });
    if (analyticsData.recentQueries.length > 10) analyticsData.recentQueries.pop();

    saveAnalytics();
    updateAnalyticsDashboard();
}

function recordFlightSearch(query, flightType = null) {
    if (!query) return;
    const key = query.toUpperCase();
    analyticsData.flightSearches[key] = (analyticsData.flightSearches[key] || 0) + 1;
    if (flightType) {
        analyticsData.flightTypeCounts[flightType] = (analyticsData.flightTypeCounts[flightType] || 0) + 1;
    }
    saveAnalytics();
    updateAnalyticsDashboard();
}

function updateAnalyticsDashboard() {
    const totalQueriesEl = document.getElementById('totalQueries');
    const escalationRateEl = document.getElementById('escalationRate');
    const topEnquiryEl = document.getElementById('topEnquiry');
    const topFlightEl = document.getElementById('topFlight');
    const recentListEl = document.getElementById('recentQueriesList');
    const queryTypeBarsEl = document.getElementById('queryTypeBars');
    const departureQueriesEl = document.getElementById('departureQueries');
    const arrivalQueriesEl = document.getElementById('arrivalQueries');
    const aiSuccessRateEl = document.getElementById('aiSuccessRate');
    const totalFlightSearchesEl = document.getElementById('totalFlightSearches');

    if (totalQueriesEl) totalQueriesEl.textContent = analyticsData.totalQueries;
    if (escalationRateEl) {
        const rate = analyticsData.totalQueries > 0 ? Math.round((analyticsData.escalationCount / analyticsData.totalQueries) * 100) : 0;
        escalationRateEl.textContent = rate + '%';
    }
    if (topEnquiryEl) {
        const types = analyticsData.queryTypes;
        const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]);
        const top = sorted.length > 0 && sorted[0][1] > 0 ? sorted[0][0] : '-';
        const labels = { flights: 'Flights', facilities: 'Facilities', transport: 'Transport', wayfinding: 'Wayfinding', other: 'Other' };
        topEnquiryEl.textContent = labels[top] || '-';
    }
    if (topFlightEl) {
        const sorted = Object.entries(analyticsData.flightSearches).sort((a, b) => b[1] - a[1]);
        if (sorted.length > 0 && sorted[0][1] > 0) {
            topFlightEl.textContent = sorted[0][0] + ' (' + sorted[0][1] + 'x)';
        } else {
            topFlightEl.textContent = '-';
        }
    }
    if (departureQueriesEl) departureQueriesEl.textContent = analyticsData.flightTypeCounts.departures || 0;
    if (arrivalQueriesEl) arrivalQueriesEl.textContent = analyticsData.flightTypeCounts.arrivals || 0;
    if (aiSuccessRateEl) {
        if (analyticsData.totalQueries === 0) {
            aiSuccessRateEl.textContent = '-';
        } else {
            const successRate = Math.round(((analyticsData.totalQueries - analyticsData.escalationCount) / analyticsData.totalQueries) * 100);
            aiSuccessRateEl.textContent = successRate + '%';
        }
    }
    const totalSearches = Object.values(analyticsData.flightSearches).reduce((a, b) => a + b, 0);
    if (totalFlightSearchesEl) totalFlightSearchesEl.textContent = totalSearches;

    if (recentListEl) {
        if (analyticsData.recentQueries.length === 0) {
            recentListEl.innerHTML = '<p style="color: #788698;">No queries recorded yet.</p>';
        } else {
            recentListEl.innerHTML = analyticsData.recentQueries.map(q =>
                `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f2f5;">
                    <span>${escapeHtml(q.message)}</span>
                    <span style="color: #aab3c0; font-size: 12px;">${q.time} ${q.needsHuman ? '🔴' : '✅'}</span>
                </div>`
            ).join('');
        }
    }

    if (queryTypeBarsEl) {
        const types = analyticsData.queryTypes;
        const total = Object.values(types).reduce((a, b) => a + b, 0);
        if (total === 0) {
            queryTypeBarsEl.innerHTML = '<p style="color: #788698; font-size: 13px;">No data yet. Start asking questions to the AI Assistant!</p>';
        } else {
            const labels = { flights: 'Flights', facilities: 'Facilities', transport: 'Transport', wayfinding: 'Wayfinding', other: 'Other' };
            const colors = { flights: '#f97316', facilities: '#3b82f6', transport: '#22c55e', wayfinding: '#8b5cf6', other: '#6b7280' };
            queryTypeBarsEl.innerHTML = Object.entries(types).filter(([_, count]) => count > 0).map(([key, count]) => {
                const pct = Math.round((count / total) * 100);
                return `<div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 3px;">
                        <span>${labels[key] || key}</span>
                        <span>${count} (${pct}%)</span>
                    </div>
                    <div style="background: #f0f2f5; border-radius: 6px; height: 8px; overflow: hidden;">
                        <div style="background: ${colors[key] || '#6b7280'}; height: 100%; width: ${pct}%; border-radius: 6px; transition: width 0.3s;"></div>
                    </div>
                </div>`;
            }).join('');
        }
    }
}

const flightNumberSearch = document.getElementById("flightNumberSearch");
const originSearch = document.getElementById("originSearch");
const destinationSearch = document.getElementById("destinationSearch");
const flightTypeFilter = document.getElementById("flightTypeFilter");
const searchByFlightNumberBtn = document.getElementById("searchByFlightNumberBtn");
const searchByRouteBtn = document.getElementById("searchByRouteBtn");
const resetFlightButton = document.getElementById("resetFlightButton");
const flightTableBody = document.getElementById("flightTableBody");
const noFlightResults = document.getElementById("noFlightResults");
const flightResultText = document.getElementById("flightResultText");

function getFilteredData() {
    const type = flightTypeFilter ? flightTypeFilter.value : "all";
    if (type === "all") return flightData;
    return flightData.filter(f => f.flight_type === type);
}

function escapeHtml(v) {
    if (v == null) return "";
    return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function getStatusClass(status) {
    const map = { "On Time":"flight-status-on-time", "Boarding":"flight-status-boarding", "Delayed":"flight-status-delayed", "Departed":"flight-status-departed", "Arrived":"flight-status-arrived", "Landed":"flight-status-arrived", "Cancelled":"flight-status-cancelled" };
    return map[status] || "";
}

function renderResults(flights, message) {
    flightTableBody.innerHTML = "";
    if (!flights || flights.length === 0) {
        noFlightResults.classList.remove("hidden");
        flightResultText.textContent = message || "No flights found.";
        return;
    }
    noFlightResults.classList.add("hidden");
    flightResultText.textContent = message || `Showing ${flights.length} flights`;
    flights.forEach(f => {
        const row = document.createElement("tr");
        const typeLabel = f.flight_type === "departures" ? "🛫 Depart" : "🛬 Arrive";
        row.innerHTML = `
            <td><strong>${escapeHtml(f.flight_number)}</strong></td>
            <td>${escapeHtml(f.airline)}</td>
            <td>${escapeHtml(f.origin)}</td>
            <td>${escapeHtml(f.destination)}</td>
            <td>${escapeHtml(f.date)}</td>
            <td>${escapeHtml(f.departure)}</td>
            <td>${escapeHtml(f.arrival)}</td>
            <td>${escapeHtml(f.terminal)}</td>
            <td>${escapeHtml(f.gate)}</td>
            <td>${escapeHtml(f.baggage_belt)}</td>
            <td><span class="flight-status ${getStatusClass(f.status)}">${escapeHtml(f.status)}</span></td>
            <td style="font-size: 11px; color: #6b7280;">${typeLabel}</td>
        `;
        flightTableBody.appendChild(row);
    });
}

function searchByFlightNumber() {
    const q = flightNumberSearch.value.trim();
    if (!q) {
        renderResults([], "Please enter a flight number.");
        return;
    }
    const lower = q.toLowerCase();
    const data = getFilteredData();
    const results = data.filter(f => f.flight_number.toLowerCase().includes(lower));
    recordFlightSearch(q, flightTypeFilter ? flightTypeFilter.value : null);
    if (results.length === 0) {
        renderResults([], "No flights found.");
    } else {
        renderResults(results, `Results for flight number "${q}"`);
    }
}

function searchByRoute() {
    const origin = originSearch.value.trim().toLowerCase();
    const dest = destinationSearch.value.trim().toLowerCase();
    if (!origin && !dest) {
        renderResults([], "Please enter an origin or destination.");
        return;
    }
    const data = getFilteredData();
    const results = data.filter(f => {
        const o = origin ? f.origin.toLowerCase().includes(origin) : true;
        const d = dest ? f.destination.toLowerCase().includes(dest) : true;
        return o && d;
    });
    if (origin) recordFlightSearch(origin, flightTypeFilter ? flightTypeFilter.value : null);
    if (dest) recordFlightSearch(dest, flightTypeFilter ? flightTypeFilter.value : null);
    if (results.length === 0) {
        renderResults([], "No flights found.");
    } else {
        let msg = `Found ${results.length} flights`;
        if (origin) msg += ` from "${origin}"`;
        if (dest) msg += ` to "${dest}"`;
        renderResults(results, msg);
    }
}

function resetSearch() {
    flightNumberSearch.value = "";
    originSearch.value = "";
    destinationSearch.value = "";
    const data = getFilteredData();
    renderResults(data, `Showing all ${data.length} flights`);
}

searchByFlightNumberBtn.onclick = function(e) {
    e.preventDefault();
    searchByFlightNumber();
};
searchByRouteBtn.onclick = function(e) {
    e.preventDefault();
    searchByRoute();
};
resetFlightButton.onclick = function(e) {
    e.preventDefault();
    resetSearch();
};
if (flightTypeFilter) {
    flightTypeFilter.onchange = function() {
        resetSearch();
    };
}

flightNumberSearch.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchByFlightNumber();
    }
});
originSearch.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchByRoute();
    }
});
destinationSearch.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchByRoute();
    }
});

function searchServices(query, categoryFilter = "all") {
    const lower = query.toLowerCase().trim();
    let results = [];

    if (categoryFilter !== "all") {
        results = serviceDirectory[categoryFilter] ? [...serviceDirectory[categoryFilter]] : [];
    } else {
        results = getAllServices();
    }

    if (lower) {
        results = results.filter(item => {
            const searchText = (item.name + " " + (item.terminal || "") + " " + (item.location || "") + " " + (item.cuisine || "") + " " + (item.services || "") + " " + (item.details || "") + " " + (item.category || "") + " " + (item.amenities || "") + " " + (item.price || "")).toLowerCase();
            return searchText.includes(lower);
        });
    }

    return results;
}

function renderServices(services) {
    const container = document.getElementById('serviceResults');
    if (!container) return;

    if (services.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #788698;">
                <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
                <h3 style="color: #15273c;">No services found</h3>
                <p>Try a different search term or category.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = services.map(item => `
        <div style="background: white; border-radius: 14px; padding: 20px; border: 1px solid #e5ebf2; transition: 0.2s; cursor: default;">
            <div style="display: flex; align-items: start; gap: 12px;">
                <div style="font-size: 28px; line-height: 1;">${item.icon || '📌'}</div>
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 4px 0; color: #15273c; font-size: 16px;">${escapeHtml(item.name)}</h3>
                    <div style="font-size: 12px; color: #788698; margin-bottom: 8px;">
                        ${item.terminal ? '🛫 ' + escapeHtml(item.terminal) : ''}
                        ${item.location ? '📍 ' + escapeHtml(item.location) : ''}
                        ${item.price ? '<span style="background: #f0f2f5; padding: 2px 8px; border-radius: 4px; margin-left: 5px;">' + escapeHtml(item.price) + '</span>' : ''}
                        ${item.category ? '<span style="background: #f0f2f5; padding: 2px 8px; border-radius: 4px; margin-left: 5px;">' + escapeHtml(item.category) + '</span>' : ''}
                    </div>
                    ${item.cuisine ? `<div style="font-size: 13px; color: #465568;"><strong>Cuisine:</strong> ${escapeHtml(item.cuisine)}</div>` : ''}
                    ${item.services ? `<div style="font-size: 13px; color: #465568;"><strong>Services:</strong> ${escapeHtml(item.services)}</div>` : ''}
                    ${item.details ? `<div style="font-size: 13px; color: #465568;">${escapeHtml(item.details)}</div>` : ''}
                    ${item.amenities ? `<div style="font-size: 13px; color: #465568;"><strong>Amenities:</strong> ${escapeHtml(item.amenities)}</div>` : ''}
                    ${item.hours ? `<div style="font-size: 12px; color: #6b7280; margin-top: 6px;">🕐 ${escapeHtml(item.hours)}</div>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function handleServiceQuery(userMessage) {
    const lower = userMessage.toLowerCase();

    const serviceKeywords = ['restaurant', '餐厅', 'food', '吃', 'lounge', '休息室', 'shop', '商店', '购物', 'facility', '设施', 'ATM', '厕所', '洗手间', 'toilet', 'bathroom', 'information', '柜台', 'medical', '医疗', 'clinic', '诊所', '咖啡', 'coffee', 'gate', '登机口', 'terminal', '航站楼'];
    const hasServiceIntent = serviceKeywords.some(keyword => lower.includes(keyword));

    if (!hasServiceIntent) return null;

    let terminal = "all";
    if (lower.includes('t3') || lower.includes('terminal 3') || lower.includes('三号航站楼') || lower.includes('三号航站')) terminal = "T3";
    else if (lower.includes('t2') || lower.includes('terminal 2') || lower.includes('二号航站楼') || lower.includes('二号航站')) terminal = "T2";
    else if (lower.includes('t1') || lower.includes('terminal 1') || lower.includes('一号航站楼') || lower.includes('一号航站')) terminal = "T1";

    let category = "all";
    if (lower.includes('restaurant') || lower.includes('餐厅') || lower.includes('food') || lower.includes('吃') || lower.includes('咖啡') || lower.includes('coffee')) category = "restaurants";
    else if (lower.includes('lounge') || lower.includes('休息室')) category = "lounges";
    else if (lower.includes('shop') || lower.includes('商店') || lower.includes('购物')) category = "shops";
    else if (lower.includes('facility') || lower.includes('设施') || lower.includes('ATM') || lower.includes('厕所') || lower.includes('洗手间') || lower.includes('toilet') || lower.includes('bathroom') || lower.includes('medical') || lower.includes('医疗') || lower.includes('clinic') || lower.includes('诊所') || lower.includes('information') || lower.includes('柜台')) category = "facilities";
    else if (lower.includes('taxi') || lower.includes('bus') || lower.includes('train') || lower.includes('地铁') || lower.includes('交通') || lower.includes('skytrain') || lower.includes('shuttle')) category = "transport";

    let results = [];
    if (category !== "all") {
        results = serviceDirectory[category] ? [...serviceDirectory[category]] : [];
    } else {
        results = getAllServices();
    }

    if (terminal !== "all") {
        results = results.filter(item => item.terminal === terminal || item.terminal === "All");
    }

    const searchTerms = lower.split(' ');
    results = results.filter(item => {
        const searchText = (item.name + " " + (item.terminal || "") + " " + (item.location || "") + " " + (item.cuisine || "") + " " + (item.services || "") + " " + (item.details || "") + " " + (item.amenities || "") + " " + (item.price || "")).toLowerCase();
        return searchTerms.some(term => term.length > 2 && searchText.includes(term));
    });

    if (results.length === 0) return null;

    const terminalLabel = terminal !== "all" ? ` in ${terminal}` : "";
    const categoryLabel = category !== "all" ? category : "services";

    let response = `📍 Found ${results.length} ${categoryLabel}${terminalLabel}:\n\n`;
    results.slice(0, 5).forEach(item => {
        response += `• **${item.name}**`;
        if (item.terminal) response += ` (${item.terminal})`;
        if (item.location) response += ` - ${item.location}`;
        if (item.cuisine) response += ` - ${item.cuisine}`;
        if (item.services) response += ` - ${item.services}`;
        if (item.amenities) response += ` - ${item.amenities}`;
        if (item.price) response += ` - ${item.price}`;
        if (item.hours) response += `\n  🕐 ${item.hours}`;
        response += '\n';
    });

    if (results.length > 5) {
        response += `\n... and ${results.length - 5} more. Visit the Facilities page for full details.`;
    }

    return response;
}

const serviceSearchInput = document.getElementById('serviceSearchInput');
const serviceSearchBtn = document.getElementById('serviceSearchBtn');
const serviceResetBtn = document.getElementById('serviceResetBtn');
const serviceFilterBtns = document.querySelectorAll('.service-filter-btn');

let currentServiceCategory = 'all';

function performServiceSearch() {
    const query = serviceSearchInput ? serviceSearchInput.value : '';
    const results = searchServices(query, currentServiceCategory);
    renderServices(results);
}

if (serviceSearchBtn) {
    serviceSearchBtn.addEventListener('click', performServiceSearch);
}

if (serviceSearchInput) {
    serviceSearchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performServiceSearch();
        }
    });
}

if (serviceResetBtn) {
    serviceResetBtn.addEventListener('click', () => {
        if (serviceSearchInput) serviceSearchInput.value = '';
        currentServiceCategory = 'all';
        document.querySelectorAll('.service-filter-btn').forEach(btn => {
            btn.style.borderColor = '#e5ebf2';
            btn.style.background = 'white';
            btn.style.color = '#465568';
        });
        const allBtn = document.querySelector('.service-filter-btn[data-category="all"]');
        if (allBtn) {
            allBtn.style.borderColor = '#f97316';
            allBtn.style.background = '#f97316';
            allBtn.style.color = 'white';
        }
        performServiceSearch();
    });
}

if (serviceFilterBtns.length > 0) {
    serviceFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            serviceFilterBtns.forEach(b => {
                b.style.borderColor = '#e5ebf2';
                b.style.background = 'white';
                b.style.color = '#465568';
            });
            btn.style.borderColor = '#f97316';
            btn.style.background = '#f97316';
            btn.style.color = 'white';
            currentServiceCategory = btn.dataset.category;
            performServiceSearch();
        });
    });
}

if (document.getElementById('serviceResults')) {
    renderServices(getAllServices());
}

resetSearch();
updateAnalyticsDashboard();

const videoCallButton = document.getElementById('videoCallButton');
const videoStatus = document.getElementById('videoStatus');

if (videoCallButton) {
    videoCallButton.addEventListener('click', function() {
        this.disabled = true;
        this.textContent = '⏳ Connecting...';
        if (videoStatus) {
            videoStatus.style.display = 'inline-block';
            videoStatus.textContent = '● Connecting to staff...';
            videoStatus.style.color = '#f97316';
        }

        recordQuery('Video assistance requested', true);

        setTimeout(() => {
            if (videoStatus) {
                videoStatus.textContent = '✅ Connected to staff (Demo)';
                videoStatus.style.color = '#22c55e';
            }

            alert('🎥 Video call connected! (Demo Mode)\n\n' +
                  'This is a simulated video assistance session.\n' +
                  'In a production environment, this would connect to a real staff member via WebRTC or video SDK.\n\n' +
                  '✨ Staff can see you and guide you through the airport.');

            videoCallButton.disabled = false;
            videoCallButton.textContent = '📹 Request Video Call';
            if (videoStatus) {
                setTimeout(() => {
                    videoStatus.style.display = 'none';
                }, 3000);
            }
        }, 2000);
    });
}

const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

function addMessage(message, sender) {
    const el = document.createElement("div");
    el.className = `message ${sender}`;
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = sender === "assistant" ? "🤖" : "👤";
    const content = document.createElement("div");
    content.className = "message-content";
    const p = document.createElement("p");
    p.textContent = message;
    content.appendChild(p);
    el.appendChild(avatar);
    el.appendChild(content);
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    addMessage(message, "user");
    userInput.value = "";
    sendButton.disabled = true;
    sendButton.textContent = "Sending...";

    const serviceResponse = handleServiceQuery(message);
    if (serviceResponse) {
        addMessage(serviceResponse, "assistant");
        recordQuery(message, false);
        sendButton.disabled = false;
        sendButton.textContent = "Send";
        return;
    }

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        const needsHuman = data.needs_human || false;
        addMessage(data.response, "assistant");
        recordQuery(message, needsHuman);
    } catch (error) {
        console.error(error);
        addMessage("Sorry, I could not connect to the airport assistant.", "assistant");
        recordQuery(message, true);
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = "Send";
    }
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

document.querySelectorAll(".quick-button").forEach(btn => {
    btn.addEventListener("click", () => {
        userInput.value = btn.dataset.question;
        sendMessage();
    });
});

const humanAssistanceButton = document.getElementById("humanAssistanceButton");
const staffMessage = document.getElementById("staffMessage");
humanAssistanceButton.addEventListener("click", () => {
    staffMessage.classList.remove("hidden");
    humanAssistanceButton.disabled = true;
    humanAssistanceButton.textContent = "Request Submitted";
    recordQuery("Human assistance requested at Contact Staff page", true);
});