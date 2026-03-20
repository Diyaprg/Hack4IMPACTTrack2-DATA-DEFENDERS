"""
Run this before the demo:
    python scripts/seed_demo_data.py

Seeds 3 campaigns, 60 threats, 3 alerts, and a populated operator network graph.
Your entire dashboard will look like a system running in production for 2 days.
"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import db
from ingestion.pipeline import process
from ai.campaign_detector import run_campaign_detection
from ai.graph_builder import persist_graph
from datetime import datetime, timedelta
import random

DEMO_THREATS = [
    # Investment scam — Ambani deepfake
    "EXCLUSIVE: Mukesh Ambani personal investment group. WhatsApp me for 40% monthly returns. UPI: ambani.invest@ybl Phone: 9876543210",
    "Sir ji Ambani sir ka special group join karo. Guaranteed profit. Telegram: @ambanireturns2026 Send ₹10000 to 8765432109@paytm",
    "Friends! Reliance ne new scheme launch ki hai. 3 month mein double money. Contact @relianceinvest99 or call 7654321098",
    "Dear investor, Ambani group exclusive offer for limited members. 60% returns guaranteed. Register now: bit.ly/ambanigroup UPI: profit2026@oksbi",
    "Ambani sahab ne personally mujhe add kiya group mein. Abhi join karo! WhatsApp: 9988776655 invest@icici",

    # SBI refund phishing
    "URGENT: Your SBI account will be blocked in 24 hours. Complete KYC immediately. Click: http://sbi-kyc-update.in OTP required. Call 9876543211",
    "SBI customer alert: Transaction of ₹15000 failed. Refund processing. Share OTP on 9123456789 to complete refund.",
    "Dear SBI user, your net banking has been temporarily suspended. Verify now: sbi-secure-login.com Enter PIN to restore access.",
    "RBI ne naya guideline issue kiya. Sab SBI customers ko KYC update karna hoga. Link: rbi-kyc-2026.in Aaj hi karein.",
    "SBI ALERT: Suspicious login detected from Mumbai. If not you, call 9876540000 immediately and share OTP to secure account.",

    # Voice clone emergency
    "Hi yaar, main accident mein hoon. Hospital mein hoon Delhi. Turant 50000 chahiye. 9898989898@paytm pe bhejo. Baad mein bata dena ghar pe.",
    "Beta main police station mein hoon. FIR ho gayi. Bail ke liye ₹75000 chahiye. Aaj raat. 7777888899@upi Kisi ko mat batana.",
    "Urgent. Mummy hospital. Operation tonight. ₹1 lakh chahiye. Please help. 8899001122@phonepe. Will return tomorrow I promise.",
    "Bhai yaar please help. Ghar wale ko pata nahi. ₹25000 do. 6655443322@paytm. Medical emergency.",
    "Dost please help karo. Captured by goons. Need bail money ₹2 lakh. 9900112233@oksbi. Come alone dont tell police.",

    # KBC lottery
    "CONGRATULATIONS! You have won KBC lottery ₹25,00,000. Your number was selected by Amitabh Bachchan team. Send Aadhaar to claim. Contact: 9111222333",
    "JIO LOTTERY WINNER! You have won iPhone 15 Pro and ₹5 lakh cash. Claim within 24 hours. Call: 8222333444 Share bank details.",
    "You are selected for Kaun Banega Crorepati Season 16. Prize: ₹1 crore. Send registration fee ₹999 to claim. UPI: kbcofficial@ybl",
    "WINNER WINNER! Your mobile number won lucky draw. Prize: ₹10 lakh. Contact lottery officer: 7333444555 for claim process.",
    "Dear customer, your number won Paytm grand lottery ₹50 lakh. Verify identity by sending Aadhaar photo to: paytm.lottery2026@gmail.com",

    # Mule recruitment
    "Work from home opportunity! Earn ₹500-2000 per UPI transaction. Need your bank account for 2 hours daily. No investment. Telegram: @wfhjob2026",
    "Part time job. Ghar baithe ₹50000/month. Just need to receive and forward UPI payments. @earnhomeofficial Join now!",
    "Bank account rent karo. ₹10000/month milega. Sirf receive forward karna hai. Safe and legal. 9444555666 pe call karo.",
    "Earn without investment! Register your UPI on our platform. We send money, you forward. Commission 10%. @cryptoearnindia",
    "Dear friend, work from home job. Daily ₹3000. Sirf account use karna hai transactions ke liye. 8555666777 WhatsApp karo.",
]

CAMPAIGN_DEFINITIONS = [
    {
        "name": "Operation Ambani Returns",
        "category": "investment_scam",
        "severity": "critical",
        "status": "active",
        "target_states": ["Maharashtra", "Gujarat", "Delhi", "Karnataka"],
        "threat_count": 24,
        "score": 0.94,
        "summary": "Coordinated investment fraud campaign impersonating Mukesh Ambani and Reliance Industries to lure victims into fake high-return investment schemes via WhatsApp and Telegram. Campaign uses deepfake promotional videos and stolen brand assets. Targets high-net-worth individuals in metro cities.",
        "alert_fired": True,
        "operator_count": 14,
    },
    {
        "name": "Wave SBI Phishing 2026",
        "category": "phishing",
        "severity": "high",
        "status": "active",
        "target_states": ["Uttar Pradesh", "Bihar", "Madhya Pradesh", "Rajasthan"],
        "threat_count": 18,
        "score": 0.87,
        "summary": "Mass phishing campaign targeting SBI customers through SMS and WhatsApp messages claiming account suspension or failed transactions. Victims are directed to spoofed SBI portals to harvest credentials and OTPs. Campaign shows coordinated infrastructure with common hosting patterns.",
        "alert_fired": True,
        "operator_count": 8,
    },
    {
        "name": "Surge KBC Lottery Trap",
        "category": "lottery_scam",
        "severity": "medium",
        "status": "monitoring",
        "target_states": ["West Bengal", "Odisha", "Jharkhand", "Assam"],
        "threat_count": 12,
        "score": 0.76,
        "summary": "Lottery fraud campaign exploiting KBC brand identity to solicit Aadhaar documents and advance fees from victims in eastern Indian states. Lower digital literacy in target regions makes victims particularly vulnerable. Campaign active across WhatsApp and SMS channels.",
        "alert_fired": False,
        "operator_count": 5,
    },
]

ALERT_DEFINITIONS = [
    {
        "campaign_name": "Operation Ambani Returns",
        "risk_level": "critical",
        "banks_notified": ["SBI", "HDFC", "Paytm", "PhonePe"],
        "certin_notified": True,
        "status": "delivered",
        "estimated_amount_protected_cr": 12.4,
    },
    {
        "campaign_name": "Wave SBI Phishing 2026",
        "risk_level": "high",
        "banks_notified": ["SBI", "HDFC", "Paytm"],
        "certin_notified": True,
        "status": "delivered",
        "estimated_amount_protected_cr": 6.8,
    },
]


async def seed():
    print("🔧 Connecting to database...")
    db.authenticate()

    print("🌱 Seeding threats...")
    for i, text in enumerate(DEMO_THREATS):
        result = await process(
            raw_text=text,
            source="telegram",
            channel_name=random.choice([
                "india_invest_group", "sbi_alerts_fake",
                "kbc_lottery_official", "wfh_earn_jobs", "emergency_help"
            ]),
        )
        print(f"  [{i+1}/{len(DEMO_THREATS)}] {result.get('category', 'unknown')} — conf: {result.get('confidence', 0):.2f}")
        await asyncio.sleep(0.1)

    print("\n📦 Creating campaigns...")
    campaign_ids = []
    for camp in CAMPAIGN_DEFINITIONS:
        saved = await db.write_campaign({
            **camp,
            "first_detected": (datetime.utcnow() - timedelta(hours=random.randint(2, 36))).isoformat(),
        })
        if saved:
            campaign_ids.append(saved.get("id"))
            print(f"  ✓ Campaign: {camp['name']} [{camp['severity']}]")

    print("\n🚨 Creating alerts...")
    for i, alert_def in enumerate(ALERT_DEFINITIONS):
        campaign_id = campaign_ids[i] if i < len(campaign_ids) else ""
        await db.write_alert({
            **alert_def,
            "campaign_id": campaign_id,
            "payload": {
                "report_id": f"SURAKSH-DEMO-{i+1:04d}",
                "generated_at": datetime.utcnow().isoformat(),
                "note": "Demo alert — seeded for hackathon demonstration",
            },
        })
        print(f"  ✓ Alert: {alert_def['campaign_name']} → {', '.join(alert_def['banks_notified'])}")

    print("\n🕸️  Persisting graph...")
    await persist_graph()

    print("\n✅ Demo data seeded successfully!")
    print("   → Open your dashboard and it will look like a system running for 2 days.")
    print("   → Trigger a live demo threat with: POST /ingest/manual")


if __name__ == "__main__":
    asyncio.run(seed())
