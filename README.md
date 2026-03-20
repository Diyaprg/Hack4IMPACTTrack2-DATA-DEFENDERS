# SurakshAI — Autonomous Cyber Threat Intelligence Platform

> **HACK4IMPACT 2026 · Track 2 — Smart Technology for a Sustainable World**
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

Cybersecurity & Ethical AI Systems

---

## 📌 Problem Statement

**SurakshAI — Autonomous Cyber Threat Intelligence Platform for India's UPI Ecosystem**

India loses over ₹20,000 crore annually to AI-powered financial scams targeting UPI users through deepfake celebrity videos, voice-cloned family emergencies, and coordinated WhatsApp fraud campaigns. Over 47% of Indian adults have personally been affected by or know someone who has fallen victim to these attacks.

Existing cybersecurity infrastructure — CERT-In, RBI, and bank fraud teams — operates entirely reactively, detecting fraud only after money has already been transferred. No proactive system exists that monitors scam coordination channels in real time, maps the criminal operator networks behind campaigns, and alerts financial institutions before the attack reaches victims at scale.

Parliament's Standing Committee on Communications and IT identified this exact gap in August 2025 — and it remains unsolved.

---

## 💡 Proposed Solution

SurakshAI is a real-time cyber threat intelligence platform that detects fraud campaigns before they reach victims. The system operates across three layers:

- **Ingestion Layer** — Continuously monitors Telegram channels and OSINT sources for India-specific scam content using the Telegram API.
- **AI Layer** — Classifies threats using a multilingual NLP model, maps criminal operator networks using Graph Neural Networks (GraphSAGE), and clusters related messages into named campaigns using DBSCAN.
- **Alert Layer** — Automatically notifies CERT-In and RBI-regulated banks with structured threat intelligence when a campaign crosses a severity threshold.

Citizens can verify any suspicious phone number, UPI ID, or video link through a public portal that returns a fraud probability score in under 2 seconds.

---

## 🏗️ Complete Backend Architecture

### Overview

The backend is a Python FastAPI application structured across 8 modules. Every component has a single responsibility. Data flows in one direction: Ingest → Classify → Graph → Detect → Alert.

```
suraksh-ai-backend/
│
├── main.py                         ← FastAPI app entry point, lifespan, all routes mounted
│
├── core/
│   ├── config.py                   ← All env vars, constants, settings (single source of truth)
│   ├── database.py                 ← PocketBase wrapper — all DB reads/writes
│   └── scheduler.py                ← APScheduler — campaign detection every 10min
│
├── ingestion/
│   ├── telegram_scraper.py         ← Telethon async listener — monitors fraud channels live
│   ├── osint_scraper.py            ← Scheduled OSINT scraper + demo threat injector
│   └── pipeline.py                 ← Normaliser — every message flows through here
│
├── ai/
│   ├── entity_extractor.py         ← Regex + keyword — extracts phones, UPI IDs, handles
│   ├── classifier.py               ← Multilingual BERT threat classifier (keyword fallback)
│   ├── groq_client.py              ← Groq API wrapper — LLaMA 3.1 70B for edge cases
│   ├── graph_builder.py            ← NetworkX operator network graph (in-memory + persisted)
│   ├── campaign_detector.py        ← DBSCAN clustering — groups threats into campaigns
│   └── deepfake_detector.py        ← EfficientNet-B4 video frame analyser
│
├── alerts/
│   ├── engine.py                   ← Severity threshold checker — fires alert at 0.82+
│   ├── bank_webhooks.py            ← Async httpx — concurrent POST to bank endpoints
│   └── certin_reporter.py          ← Generates CERT-In formatted incident reports
│
├── api/
│   └── routes/
│       ├── threats.py              ← GET /threats, GET /threats/:id
│       ├── campaigns.py            ← GET /campaigns, GET /campaigns/:id, GET /campaigns/:id/network
│       ├── alerts.py               ← GET /alerts, GET /alerts/:id
│       ├── verify.py               ← POST /verify (phone / UPI / video)
│       ├── network.py              ← GET /network/graph, GET /network/stats
│       └── stats.py                ← GET /stats (live dashboard counters)
│
├── models/
│   ├── threat.py                   ← Pydantic schemas for threat objects
│   ├── campaign.py                 ← Pydantic schemas for campaign objects
│   ├── alert.py                    ← Pydantic schemas for alert objects
│   └── verify.py                   ← Pydantic schemas for verify request/response
│
├── scripts/
│   └── seed_demo_data.py           ← Seeds 3 campaigns, 25 threats, 2 alerts for demo
│
├── .env.example                    ← Environment variable template (safe to share)
├── requirements.txt                ← All Python dependencies
└── Procfile                        ← Railway deployment config
```

---

### Data Flow — End to End

```
Telegram Channel / OSINT Source
        │
        ▼
ingestion/telegram_scraper.py  (Telethon async listener)
        │
        ▼
ingestion/pipeline.py  (normalise raw text → structured object)
        │
        ├──► ai/entity_extractor.py  (extract phones, UPI IDs, Telegram handles)
        │
        ├──► ai/classifier.py  (BERT → category + confidence score)
        │         └── fallback: ai/groq_client.py  (LLaMA 3.1 70B)
        │
        ├──► ai/graph_builder.py  (add entities as nodes, co-occurrence as edges)
        │
        └──► core/database.py  (write threat to PocketBase)
                    │
                    ▼ (every 10 minutes via APScheduler)
        ai/campaign_detector.py  (TF-IDF → DBSCAN → campaign objects)
                    │
                    ▼
        alerts/engine.py  (score >= 0.82 → fire alert)
                    │
                    ├──► alerts/bank_webhooks.py  (async POST to SBI/HDFC/Paytm/PhonePe)
                    └──► alerts/certin_reporter.py  (CERT-In formatted JSON report)
```

---

### API Endpoints — Full Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check — confirms server is operational |
| GET | `/stats` | Live dashboard counters — threats, campaigns, alerts, threat level |
| GET | `/threats` | Paginated threat list with filters (category, state, min_confidence) |
| GET | `/threats/:id` | Single threat full detail |
| GET | `/campaigns` | All campaigns with filters (status, severity) |
| GET | `/campaigns/:id` | Single campaign full detail |
| GET | `/campaigns/:id/threats` | All threats belonging to a campaign |
| GET | `/campaigns/:id/network` | Operator network subgraph for a campaign |
| GET | `/alerts` | Full alert history |
| GET | `/alerts/:id` | Single alert with full CERT-In payload |
| GET | `/network/graph` | Full node-edge JSON for D3 force graph |
| GET | `/network/stats` | Graph statistics (node counts by type) |
| POST | `/verify` | Citizen verification — phone / UPI / video URL |
| POST | `/ingest/manual` | Manually inject a threat message |
| POST | `/trigger/test` | Fire a demo threat + run campaign detection (judge demo) |
| POST | `/mock/bank/:name` | Mock bank webhook receiver |
| POST | `/mock/certin` | Mock CERT-In webhook receiver |

---

### AI Components — Technical Detail

#### 1. NLP Threat Classifier (`ai/classifier.py`)
- Model: `bert-base-multilingual-cased` via HuggingFace Transformers
- Supports: Hindi, English, Hinglish
- Categories: `investment_scam`, `voice_clone`, `fake_upi_refund`, `phishing`, `mule_recruitment`, `deepfake_celebrity`, `lottery_scam`, `unknown`
- Fallback: keyword-based classifier when BERT confidence < 0.75
- Edge cases: Groq API (LLaMA 3.1 70B) for ambiguous messages
- Inference time: ~180ms per message (model kept in memory at startup)

#### 2. Entity Extractor (`ai/entity_extractor.py`)
- Extracts: Indian phone numbers (all formats), UPI IDs, Telegram handles, URLs
- Location detection: 20 Indian states via keyword mapping
- Scam keyword mapping: 7 categories × 10+ keywords each (Hindi + English)
- Output: structured dict of all entities found in raw message text

#### 3. Operator Network Graph (`ai/graph_builder.py`)
- Library: NetworkX DiGraph (in-memory, persisted to PocketBase every 5 mins)
- Nodes: phone numbers, UPI IDs, Telegram accounts, campaign references
- Edges: co-occurrence in same message (weight +1), same campaign linkage
- Centrality: degree centrality computed on every check_entity call
- Fraud score: `0.3 + (campaigns × 0.25) + (centrality × 0.5)` capped at 0.99

#### 4. Campaign Detector (`ai/campaign_detector.py`)
- Algorithm: DBSCAN on TF-IDF vectors (eps=0.3, min_samples=2, cosine metric)
- Schedule: runs every 10 minutes via APScheduler
- Window: last 200 threats above 0.5 confidence
- Output: named campaign objects with severity, target states, operator count
- Severity scoring: weighted formula using threat count, avg confidence, states affected

#### 5. Deepfake Detector (`ai/deepfake_detector.py`)
- Model: EfficientNet-B4 fine-tuned on FaceForensics++ dataset
- Video ingestion: yt-dlp (first 10 seconds), 30 frames via OpenCV
- Fallback: heuristic analyser (blur variance + colour saturation) when PyTorch unavailable
- Output: fraud probability, suspicious frame timestamps, human-readable reason

#### 6. Groq LLM Integration (`ai/groq_client.py`)
- Model: `llama-3.1-70b-versatile`
- Uses: edge-case threat classification, campaign summary generation, alert payload summaries
- Rate limit: 30 req/min on free tier — used only for fallback + summaries, never per-message

---

### Database Schema — PocketBase Collections

#### `threats`
| Field | Type | Description |
|-------|------|-------------|
| raw_text | text | Original message content (max 2000 chars) |
| source | text | telegram / osint / manual |
| channel_id | text | Telegram channel ID |
| channel_name | text | Human-readable channel name |
| category | text | Classified threat type |
| confidence | number | Classification confidence 0.0–1.0 |
| target_states | json | List of Indian states mentioned |
| entities | json | Extracted phones, UPI IDs, handles |
| campaign_id | text | Linked campaign ID (if clustered) |
| ingested_at | text | ISO timestamp of ingestion |

#### `campaigns`
| Field | Type | Description |
|-------|------|-------------|
| name | text | Auto-generated campaign name |
| category | text | Dominant threat category |
| severity | text | critical / high / medium / low |
| status | text | active / monitoring / neutralised |
| target_states | json | All states targeted by campaign |
| threat_count | number | Number of threats in cluster |
| score | number | Severity score 0.0–1.0 |
| summary | text | LLM-generated campaign summary |
| alert_fired | bool | Whether bank alert has been sent |
| operator_count | number | Number of operator entities identified |
| first_detected | text | ISO timestamp of first detection |

#### `alerts`
| Field | Type | Description |
|-------|------|-------------|
| campaign_id | text | Linked campaign ID |
| campaign_name | text | Human-readable campaign name |
| risk_level | text | critical / high / medium / low |
| banks_notified | json | List of banks that received alert |
| certin_notified | bool | Whether CERT-In was notified |
| payload | json | Full CERT-In formatted report |
| status | text | delivered / partial / failed |
| estimated_amount_protected_cr | number | Estimated ₹ Crore protected |

#### `graph_snapshots`
| Field | Type | Description |
|-------|------|-------------|
| data | text | Serialized JSON of full NetworkX graph |

#### `operator_network`
| Field | Type | Description |
|-------|------|-------------|
| node_id | text | Unique node identifier |
| type | text | phone / upi / telegram / campaign |
| value | text | Actual entity value |
| degree | number | Number of connections |

---

### Startup Sequence

When `python main.py` runs, the following happens in order:

```
1. PocketBase authenticates
2. BERT multilingual classifier loads into memory
3. EfficientNet deepfake model loads into memory
4. Operator network graph loads from PocketBase (or starts fresh)
5. APScheduler starts (campaign detection every 10min, graph persist every 5min)
6. Telegram client connects (asks for OTP on first run, session saved after)
7. FastAPI server starts on port 8000
8. All 17 API endpoints are live
```

---

### Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```env
APP_NAME=SurakshAI
APP_ENV=development
APP_PORT=8000
FRONTEND_URL=http://localhost:5173

POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@suraksh.ai
POCKETBASE_ADMIN_PASSWORD=suraksh_admin_2026

GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile

TELEGRAM_API_ID=your_telegram_api_id
TELEGRAM_API_HASH=your_telegram_api_hash
TELEGRAM_SESSION_NAME=suraksh_session

SEVERITY_THRESHOLD=0.82
ALERT_RETRY_ATTEMPTS=3
ALERT_RETRY_DELAY=2

BANK_SBI_WEBHOOK=http://localhost:8000/mock/bank/sbi
BANK_HDFC_WEBHOOK=http://localhost:8000/mock/bank/hdfc
BANK_PAYTM_WEBHOOK=http://localhost:8000/mock/bank/paytm
BANK_PHONEPE_WEBHOOK=http://localhost:8000/mock/bank/phonepe
CERTIN_WEBHOOK=http://localhost:8000/mock/certin

BERT_MODEL=bert-base-multilingual-cased
DEEPFAKE_MODEL_PATH=models/deepfake_efficientnet.pth
GNN_MODEL_PATH=models/graphsage.pth
```

---

## 🛠️ Prerequisites — Install These First

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.12+ | python.org/downloads — tick "Add to PATH" |
| Node.js | LTS | nodejs.org/en/download |
| Git | Latest | git-scm.com/downloads |
| PocketBase | Latest | pocketbase.io/docs |

---

## ⚙️ Setup Guide

### Step 1 — PocketBase Setup

```bash
# Windows
cd pocketbase
pocketbase.exe serve

# Mac/Linux
cd pocketbase
./pocketbase serve
```

Open `http://127.0.0.1:8090` → Create admin account:
- Email: `admin@suraksh.ai`
- Password: `suraksh_admin_2026`

Create these 5 collections in the admin UI (Collections → New collection):

| Collection | Fields |
|---|---|
| `threats` | raw_text, source, channel_id, channel_name, category (text) · confidence (number) · target_states, entities (json) · campaign_id, ingested_at (text) |
| `campaigns` | name, category, severity, status (text) · target_states, (json) · threat_count, score, operator_count (number) · summary, first_detected (text) · alert_fired (bool) |
| `alerts` | campaign_id, campaign_name, risk_level, status (text) · banks_notified, payload (json) · estimated_amount_protected_cr (number) · certin_notified (bool) |
| `graph_snapshots` | data (text) |
| `operator_network` | node_id, type, value (text) · degree (number) |

**Important:** Set all API rules to empty string on every collection (API Rules tab → clear all fields → Save).

---

### Step 2 — Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install all dependencies
pip install fastapi uvicorn python-dotenv httpx pydantic apscheduler
pip install transformers torch scikit-learn pandas numpy
pip install networkx groq pocketbase loguru slowapi
pip install telethon yt-dlp opencv-python-headless Pillow
pip install spacy pydantic-settings
```

---

### Step 3 — Get Your API Keys

**Groq API Key (free):**
1. Go to `console.groq.com`
2. Sign up → API Keys → Create API Key
3. Copy key starting with `gsk_...`

**Telegram API Credentials (free):**
1. Go to `my.telegram.org`
2. Login with your phone number
3. Click "API development tools"
4. Fill form → App title: SurakshAI, Platform: Other
5. Copy `api_id` (number) and `api_hash` (long string)

---

### Step 4 — Configure Environment

```bash
# Copy the template
cp .env.example .env

# Open .env and fill in:
# GROQ_API_KEY=gsk_your_key_here
# TELEGRAM_API_ID=12345678
# TELEGRAM_API_HASH=abcdef1234567890
```

---

### Step 5 — Run Backend

```bash
python main.py
```

First run only — Telegram will prompt:
```
Please enter your phone (+91XXXXXXXXXX):
Please enter the code you received: 12345
```

Enter your phone number and the OTP from your Telegram app. A `suraksh_session.session` file is created — never needs to be done again.

Confirm backend is running:
```
http://localhost:8000       → {"status": "operational"}
http://localhost:8000/docs  → Interactive API documentation
```

---

### Step 6 — Seed Demo Data

Open a second terminal (with venv activated):

```bash
python scripts/seed_demo_data.py
```

Seeds 3 campaigns, 25 threats, 2 alerts, and a populated operator network graph. Your dashboard will look like a system running in production for 2 days.

---


## 🧪 API Testing (Postman)

Key endpoints to verify everything works:

```
GET  http://localhost:8000/                          → health check
GET  http://localhost:8000/stats                     → live counters
POST http://localhost:8000/ingest/manual             → inject test threat
POST http://localhost:8000/trigger/test              → fire full demo pipeline
GET  http://localhost:8000/threats                   → list all threats
GET  http://localhost:8000/campaigns                 → list all campaigns
GET  http://localhost:8000/alerts                    → list all alerts
POST http://localhost:8000/verify                    → citizen verification
GET  http://localhost:8000/network/graph             → operator network JSON
```



Frontend notes incoming
