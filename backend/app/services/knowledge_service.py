import json
from pathlib import Path
from typing import Dict, Any, List

class KnowledgeService:
    def __init__(self, data_path: Path = None):
        if data_path is None:
            data_path = Path(__file__).parent.parent / "data" / "hotel_knowledge.json"
        self.data_path = data_path
        self._data: Dict[str, Any] = self._load_data()

    def _load_data(self) -> Dict[str, Any]:
        if not self.data_path.exists():
            raise FileNotFoundError(f"Knowledge base file not found at {self.data_path}")
        with open(self.data_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def get_full_context_str(self) -> str:
        """Serializes the knowledge base into structured text format for LLM prompting."""
        return json.dumps(self._data, indent=2)

    def get_hotel_info(self) -> Dict[str, Any]:
        return self._data.get("hotel_info", {})

    def get_rooms(self) -> List[Dict[str, Any]]:
        return self._data.get("rooms", [])

    def get_amenities(self) -> List[Dict[str, Any]]:
        return self._data.get("amenities", [])

    def get_dining_info(self) -> Dict[str, Any]:
        return self._data.get("dining", {})

    def get_policies(self) -> Dict[str, Any]:
        return self._data.get("policies", {})

    def get_faqs(self) -> List[Dict[str, Any]]:
        return self._data.get("faqs", [])

knowledge_service = KnowledgeService()
