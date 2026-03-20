from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from core.config import settings, THREAT_CATEGORIES
from ai.entity_extractor import extract_entities, get_dominant_category_from_keywords
from loguru import logger
import torch
from typing import Optional

_classifier = None
_tokenizer = None


def load_classifier():
    global _classifier, _tokenizer
    try:
        logger.info(f"Loading BERT classifier: {settings.BERT_MODEL}")
        _tokenizer = AutoTokenizer.from_pretrained(settings.BERT_MODEL)
        _classifier = pipeline(
            "text-classification",
            model=settings.BERT_MODEL,
            tokenizer=_tokenizer,
            device=0 if torch.cuda.is_available() else -1,
            top_k=1,
        )
        logger.info("BERT classifier loaded successfully")
    except Exception as e:
        logger.warning(f"BERT load failed ({e}) — falling back to keyword classifier")
        _classifier = None


def classify_threat(text: str) -> dict:
    entities = extract_entities(text)
    keyword_category, keyword_confidence = get_dominant_category_from_keywords(entities)

    if _classifier is not None:
        try:
            truncated = text[:512]
            result = _classifier(truncated)[0]
            label = result["label"].lower().replace("-", "_").replace(" ", "_")

            if label in THREAT_CATEGORIES:
                bert_category = label
                bert_confidence = float(result["score"])
            else:
                bert_category = keyword_category
                bert_confidence = keyword_confidence

            final_category = bert_category if bert_confidence >= 0.75 else keyword_category
            final_confidence = bert_confidence if bert_confidence >= 0.75 else keyword_confidence

            return {
                "category": final_category,
                "confidence": round(final_confidence, 4),
                "method": "bert",
                "entities": entities,
            }
        except Exception as e:
            logger.warning(f"BERT inference failed: {e} — using keyword fallback")

    return {
        "category": keyword_category,
        "confidence": round(keyword_confidence, 4),
        "method": "keyword",
        "entities": entities,
    }
