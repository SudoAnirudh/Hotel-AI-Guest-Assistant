from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ambiguous_question_context_resolution():
    """
    Validates ambiguous questions like 'What about breakfast?' or 'Does it have ocean view?'
    resolves context from previous conversation turns.
    """
    history = [
        {"role": "user", "content": "Which room is suitable for 4 guests?"},
        {"role": "assistant", "content": "The Deluxe Family Suite accommodates up to 4 guests."}
    ]

    response = client.post("/api/chat", json={
        "message": "What about breakfast?",
        "conversation": history
    })

    assert response.status_code == 200
    data = response.json()
    assert "breakfast" in data["message"].lower()
    assert "included" in data["message"].lower() or "yes" in data["message"].lower()
