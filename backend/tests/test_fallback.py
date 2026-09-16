from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_unsupported_out_of_scope_question():
    """Scenario 8: Unsupported question outside hotel knowledge base (e.g., distant restaurants)."""
    payload = {
        "message": "What restaurants are 20 km from the hotel in Tokyo?",
        "conversation": []
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "fallback"
    assert "don't have that information" in data["message"].lower() or "reception" in data["message"].lower()

def test_missing_information_prompt():
    """Scenario 9: Incomplete availability request (missing dates)."""
    payload = {
        "message": "Do you have rooms available?",
        "conversation": []
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "check-in date" in data["message"].lower() or "select" in data["message"].lower()

def test_empty_message_validation():
    """Scenario 10: Input validation for empty message."""
    payload = {
        "message": "",
        "conversation": []
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 422  # Pydantic validation error
