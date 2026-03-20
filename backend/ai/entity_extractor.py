import re
from typing import Dict, List
from loguru import logger


PHONE_PATTERNS = [
    r"\+91[-\s]?[6-9]\d{9}",
    r"0[6-9]\d{9}",
    r"\b[6-9]\d{9}\b",
]

UPI_PATTERN = r"[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}"

TELEGRAM_PATTERN = r"@[a-zA-Z][a-zA-Z0-9_]{4,31}"

URL_PATTERN = r"https?://[^\s]+"

LOCATION_KEYWORDS = {
    "Maharashtra": ["maharashtra", "mumbai", "pune", "nagpur", "nashik"],
    "Uttar Pradesh": ["uttar pradesh", "up", "lucknow", "kanpur", "varanasi", "agra"],
    "Bihar": ["bihar", "patna", "gaya"],
    "Delhi": ["delhi", "new delhi", "ncr"],
    "Karnataka": ["karnataka", "bangalore", "bengaluru", "mysore"],
    "Tamil Nadu": ["tamil nadu", "chennai", "coimbatore"],
    "West Bengal": ["west bengal", "kolkata", "calcutta"],
    "Gujarat": ["gujarat", "ahmedabad", "surat", "vadodara"],
    "Rajasthan": ["rajasthan", "jaipur", "jodhpur"],
    "Andhra Pradesh": ["andhra", "hyderabad", "visakhapatnam"],
}

SCAM_KEYWORDS = {
    "investment_scam": [
        "return", "profit", "invest", "trading", "crypto", "bitcoin",
        "double money", "guaranteed returns", "share market", "IPO",
        "ambani", "adani", "sebi approved", "telegram group",
        "निवेश", "मुनाफा", "रिटर्न",
    ],
    "voice_clone": [
        "urgent", "emergency", "hospital", "accident", "police",
        "family member", "relative", "please help", "transfer now",
        "मदद", "जरूरी", "परिवार",
    ],
    "fake_upi_refund": [
        "refund", "cashback", "UPI failed", "transaction failed",
        "bank reverse", "RBI refund", "NPCI", "customer care",
        "रिफंड", "वापसी",
    ],
    "phishing": [
        "OTP", "KYC", "account block", "verify now", "click link",
        "login", "password", "ATM PIN", "CVV",
        "ओटीपी", "खाता बंद",
    ],
    "mule_recruitment": [
        "earn from home", "part time job", "commission", "per transaction",
        "bank account rent", "work from home", "ghar baithe",
        "घर बैठे कमाएं",
    ],
    "deepfake_celebrity": [
        "exclusive offer", "celebrity", "bollywood", "cricketer",
        "virat", "modi", "shah rukh", "amitabh",
    ],
    "lottery_scam": [
        "lottery", "winner", "prize", "lucky draw", "congratulations",
        "KBC", "jio lottery", "लॉटरी", "इनाम",
    ],
}


def extract_entities(text: str) -> dict:
    text_lower = text.lower()
    entities = {
        "phones": [],
        "upi_ids": [],
        "telegram_handles": [],
        "urls": [],
        "target_states": [],
        "scam_keywords_found": [],
    }

    for pattern in PHONE_PATTERNS:
        phones = re.findall(pattern, text)
        entities["phones"].extend(phones)
    entities["phones"] = list(set(
        re.sub(r"[\s\-]", "", p) for p in entities["phones"]
    ))

    upi_ids = re.findall(UPI_PATTERN, text)
    entities["upi_ids"] = list(set(upi_ids))

    handles = re.findall(TELEGRAM_PATTERN, text)
    entities["telegram_handles"] = list(set(handles))

    urls = re.findall(URL_PATTERN, text)
    entities["urls"] = list(set(urls))

    for state, keywords in LOCATION_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            entities["target_states"].append(state)

    for category, keywords in SCAM_KEYWORDS.items():
        found = [kw for kw in keywords if kw.lower() in text_lower]
        if found:
            entities["scam_keywords_found"].append({
                "category": category,
                "keywords": found,
                "count": len(found),
            })

    return entities


def get_dominant_category_from_keywords(entities: dict) -> tuple:
    if not entities.get("scam_keywords_found"):
        return "unknown", 0.4

    sorted_cats = sorted(
        entities["scam_keywords_found"],
        key=lambda x: x["count"],
        reverse=True
    )

    top = sorted_cats[0]
    keyword_confidence = min(0.4 + (top["count"] * 0.08), 0.78)
    return top["category"], keyword_confidence
