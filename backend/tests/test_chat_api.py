from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_checkin_question():
    """Scenario 1: Normal property question (Check-in time)."""
    payload = {
        "message": "What time is check-in?",
        "conversation": []
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["type"] in ["message", "fallback"]
    assert "3:00 PM" in data["message"] or "check-in" in data["message"].lower()

def test_swimming_pool_question():
    """Scenario 2: Amenity question (Swimming pool)."""
    payload = {
        "message": "Does the hotel have a swimming pool?",
        "conversation": []
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "pool" in data["message"].lower() or "infinity" in data["message"].lower()

def test_cancellation_policy_question():
    """Scenario 3: Policy question (Cancellation)."""
    payload = {
        "message": "What is the cancellation policy?",
        "conversation": []
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "48 hours" in data["message"] or "cancel" in data["message"].lower()

def test_multiturn_followup_question():
    """Scenario 4: Multi-turn conversation with follow-up pronoun resolution."""
    # Turn 1
    turn1_payload = {
        "message": "Which room is suitable for 3 guests?",
        "conversation": []
    }
    r1 = client.post("/api/chat", json=turn1_payload)
    assert r1.status_code == 200
    m1 = r1.json()["message"]
    assert "Deluxe Family" in m1 or "3" in m1 or "Family" in m1

    # Turn 2 with conversation history
    turn2_payload = {
        "message": "Does it include breakfast?",
        "conversation": [
            {"role": "user", "content": "Which room is suitable for 3 guests?"},
            {"role": "assistant", "content": m1}
        ]
    }
    r2 = client.post("/api/chat", json=turn2_payload)
    assert r2.status_code == 200
    m2 = r2.json()["message"]
    assert "breakfast" in m2.lower()
    assert "included" in m2.lower() or "yes" in m2.lower()
