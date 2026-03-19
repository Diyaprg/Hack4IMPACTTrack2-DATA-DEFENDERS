# SurakshAI — Autonomous Cyber Threat Intelligence Platform for India's UPI Ecosystem

> **HACK4IMPACT Track 2 — Smart Technology for a Sustainable World**
> Organized at KIIT Bhubaneswar | Domain: Cybersecurity & Ethical AI Systems

---

## 👥 Team: Data Defenders

| Role | Name | Email | Institution |
|------|------|-------|-------------|
| Team Lead | Diya Pandey | 24051548@kiit.ac.in | KIIT Bhubaneswar |
| Member 2 | Ankit Singh | 2430012@kiit.ac.in | KIIT Bhubaneswar |
| Member 3 | Ayush Mishra | 23053036@kiit.ac.in | KIIT Bhubaneswar |
| Member 4 | Shourya Bhardowaj | 2430121@kiit.ac.in | KIIT Bhubaneswar |

---

## 🏷️ Domain
**Cybersecurity & Ethical AI Systems**

---

## 📌 Problem Statement
**SurakshAI — Autonomous Cyber Threat Intelligence Platform for India's UPI Ecosystem**

India loses over ₹20,000 crore annually to AI-powered financial scams targeting UPI users through deepfake celebrity videos, voice-cloned family emergencies, and coordinated WhatsApp fraud campaigns. Over 47% of Indian adults have personally been affected by or know someone who has fallen victim to these attacks.

Existing cybersecurity infrastructure — CERT-In, RBI, and bank fraud teams — operates entirely reactively, detecting fraud only after money has already been transferred. No proactive system exists that monitors scam coordination channels in real time, maps the criminal operator networks behind campaigns, and alerts financial institutions before the attack reaches victims at scale.

Parliament's Standing Committee on Communications and IT identified this exact gap in August 2025 — and it remains unsolved.

---

## 💡 Proposed Solution

SurakshAI is a real-time cyber threat intelligence platform that detects fraud campaigns **before** they reach victims. The system operates across three layers:

- **Ingestion Layer** — Continuously monitors Telegram channels and OSINT sources for India-specific scam content using the Telegram API.
- **AI Layer** — Classifies threats using a multilingual NLP model, maps criminal operator networks using Graph Neural Networks (GraphSAGE), and clusters related messages into named campaigns using DBSCAN.
- **Alert Layer** — Automatically notifies CERT-In and RBI-regulated banks with structured threat intelligence when a campaign crosses a severity threshold.

Citizens can verify any suspicious phone number, UPI ID, or video link through a **public portal** that returns a fraud probability score in under 2 seconds.
