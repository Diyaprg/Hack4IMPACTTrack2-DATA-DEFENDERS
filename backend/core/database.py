from pocketbase import PocketBase
from pocketbase.utils import ClientResponseError
from core.config import settings
from loguru import logger
from typing import Optional
import json


class Database:
    def __init__(self):
        self.client = PocketBase(settings.POCKETBASE_URL)
        self._authenticated = False

    def authenticate(self):
        try:
            self.client.admins.auth_with_password(
                settings.POCKETBASE_ADMIN_EMAIL,
                settings.POCKETBASE_ADMIN_PASSWORD,
            )
            self._authenticated = True
            logger.info("PocketBase authenticated successfully")
        except Exception as e:
            logger.error(f"PocketBase auth failed: {e}")

    def _ensure_auth(self):
        if not self._authenticated:
            self.authenticate()

    # ── Threats ──────────────────────────────────────────────
    async def write_threat(self, data: dict) -> Optional[dict]:
        self._ensure_auth()
        try:
            record = self.client.collection("threats").create(data)
            return record.__dict__
        except ClientResponseError as e:
            logger.error(f"write_threat error: {e}")
            return None

    async def get_threats(
        self,
        page: int = 1,
        per_page: int = 50,
        category: Optional[str] = None,
        state: Optional[str] = None,
        min_confidence: float = 0.0,
    ) -> dict:
        self._ensure_auth()
        try:
            filters = []
            if category:
                filters.append(f'category = "{category}"')
            if state:
                filters.append(f'target_states ~ "{state}"')
            if min_confidence > 0:
                filters.append(f"confidence >= {min_confidence}")

            filter_str = " && ".join(filters) if filters else ""
            result = self.client.collection("threats").get_list(
                page, per_page,
                query_params={"filter": filter_str, "sort": "-created"}
            )
            return {
                "items": [r.__dict__ for r in result.items],
                "total": result.total_items,
                "page": result.page,
                "per_page": result.per_page,
            }
        except ClientResponseError as e:
            logger.error(f"get_threats error: {e}")
            return {"items": [], "total": 0, "page": page, "per_page": per_page}

    async def get_threat_by_id(self, threat_id: str) -> Optional[dict]:
        self._ensure_auth()
        try:
            record = self.client.collection("threats").get_one(threat_id)
            return record.__dict__
        except ClientResponseError:
            return None

    # ── Campaigns ────────────────────────────────────────────
    async def write_campaign(self, data: dict) -> Optional[dict]:
        self._ensure_auth()
        try:
            record = self.client.collection("campaigns").create(data)
            return record.__dict__
        except ClientResponseError as e:
            logger.error(f"write_campaign error: {e}")
            return None

    async def update_campaign(self, campaign_id: str, data: dict) -> Optional[dict]:
        self._ensure_auth()
        try:
            record = self.client.collection("campaigns").update(campaign_id, data)
            return record.__dict__
        except ClientResponseError as e:
            logger.error(f"update_campaign error: {e}")
            return None

    async def get_campaigns(
        self,
        page: int = 1,
        per_page: int = 20,
        status: Optional[str] = None,
        severity: Optional[str] = None,
    ) -> dict:
        self._ensure_auth()
        try:
            filters = []
            if status:
                filters.append(f'status = "{status}"')
            if severity:
                filters.append(f'severity = "{severity}"')

            filter_str = " && ".join(filters) if filters else ""
            result = self.client.collection("campaigns").get_list(
                page, per_page,
                query_params={"filter": filter_str, "sort": "-created"}
            )
            return {
                "items": [r.__dict__ for r in result.items],
                "total": result.total_items,
            }
        except ClientResponseError as e:
            logger.error(f"get_campaigns error: {e}")
            return {"items": [], "total": 0}

    async def get_campaign_by_id(self, campaign_id: str) -> Optional[dict]:
        self._ensure_auth()
        try:
            record = self.client.collection("campaigns").get_one(campaign_id)
            return record.__dict__
        except ClientResponseError:
            return None

    # ── Alerts ───────────────────────────────────────────────
    async def write_alert(self, data: dict) -> Optional[dict]:
        self._ensure_auth()
        try:
            record = self.client.collection("alerts").create(data)
            return record.__dict__
        except ClientResponseError as e:
            logger.error(f"write_alert error: {e}")
            return None

    async def get_alerts(self, page: int = 1, per_page: int = 20) -> dict:
        self._ensure_auth()
        try:
            result = self.client.collection("alerts").get_list(
                page, per_page,
                query_params={"sort": "-created"}
            )
            return {
                "items": [r.__dict__ for r in result.items],
                "total": result.total_items,
            }
        except ClientResponseError as e:
            logger.error(f"get_alerts error: {e}")
            return {"items": [], "total": 0}

    async def get_alert_by_id(self, alert_id: str) -> Optional[dict]:
        self._ensure_auth()
        try:
            record = self.client.collection("alerts").get_one(alert_id)
            return record.__dict__
        except ClientResponseError:
            return None

    # ── Stats ────────────────────────────────────────────────
    async def get_stats(self) -> dict:
        self._ensure_auth()
        try:
            threats = self.client.collection("threats").get_list(
                1, 1, query_params={"sort": "-created"}
            )
            campaigns = self.client.collection("campaigns").get_list(
                1, 1,
                query_params={"filter": 'status = "active"'}
            )
            alerts = self.client.collection("alerts").get_list(
                1, 1, query_params={"sort": "-created"}
            )
            return {
                "total_threats": threats.total_items,
                "active_campaigns": campaigns.total_items,
                "total_alerts": alerts.total_items,
                "estimated_amount_protected_cr": alerts.total_items * 4.2,
            }
        except Exception as e:
            logger.error(f"get_stats error: {e}")
            return {
                "total_threats": 0,
                "active_campaigns": 0,
                "total_alerts": 0,
                "estimated_amount_protected_cr": 0,
            }

    # ── Network Graph ────────────────────────────────────────
    async def save_graph(self, graph_data: dict) -> bool:
        self._ensure_auth()
        try:
            existing = self.client.collection("graph_snapshots").get_list(1, 1)
            serialized = json.dumps(graph_data)
            if existing.total_items > 0:
                record_id = existing.items[0].id
                self.client.collection("graph_snapshots").update(
                    record_id, {"data": serialized}
                )
            else:
                self.client.collection("graph_snapshots").create(
                    {"data": serialized}
                )
            return True
        except Exception as e:
            logger.error(f"save_graph error: {e}")
            return False

    async def load_graph(self) -> Optional[dict]:
        self._ensure_auth()
        try:
            result = self.client.collection("graph_snapshots").get_list(1, 1)
            if result.total_items > 0:
                return json.loads(result.items[0].data)
            return None
        except Exception as e:
            logger.error(f"load_graph error: {e}")
            return None


db = Database()
