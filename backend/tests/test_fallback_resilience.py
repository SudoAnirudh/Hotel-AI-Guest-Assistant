from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app
from app.services.llm_service import llm_service

client = TestClient(app)

def test_no_api_keys_fallback_mode():
    """
    Validates that when external API keys are missing/empty,
    the application smoothly routes through the Grounded Local QA Engine with 0 errors.
    """
    with patch.object(llm_service, 'gemini_key', ''), patch.object(llm_service, 'openai_key', ''):
        response = client.post("/api/chat", json={
            "message": "What time is check-in?",
            "conversation": []
        })
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "message"
        assert "3:00 PM" in data["message"]

def test_api_exception_fallback_resilience():
    """
    Validates that if an external LLM provider raises an Exception,
    the backend catches it and returns a valid grounded response via fallback engine.
    """
    def mock_broken_gemini(*args, **kwargs):
        raise RuntimeError("External API timeout or quota exceeded")

    with patch.object(llm_service, 'gemini_key', 'mock_key'):
        with patch('google.genai.Client', side_effect=mock_broken_gemini):
            response = client.post("/api/chat", json={
                "message": "Does the hotel have a swimming pool?",
                "conversation": []
            })
            assert response.status_code == 200
            data = response.json()
            assert "pool" in data["message"].lower() or "infinity" in data["message"].lower()
