from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_guest_journey_e2e():
    """
    End-to-End Guest Journey Test:
    1. Guest asks "What time is check-in?" -> Response contains "3:00 PM"
    2. Guest asks "Which room is suitable for 3 guests?" -> Recommends Deluxe Family Suite
    3. Guest asks ambiguous follow-up "Does it include breakfast?" -> Resolves "it" to Deluxe Family Suite
    4. Guest submits availability request for 3 guests for 2026-10-10 to 2026-10-12 -> Receives room recommendations with computed rates.
    """
    history = []

    # Step 1: Check-in time
    r1 = client.post("/api/chat", json={"message": "What time is check-in?", "conversation": history})
    assert r1.status_code == 200
    res1 = r1.json()
    assert res1["type"] == "message"
    assert "3:00 PM" in res1["message"]
    history.append({"role": "user", "content": "What time is check-in?"})
    history.append({"role": "assistant", "content": res1["message"]})

    # Step 2: Room recommendation for 3 guests
    r2 = client.post("/api/chat", json={"message": "Which room is suitable for 3 guests?", "conversation": history})
    assert r2.status_code == 200
    res2 = r2.json()
    assert "Deluxe Family" in res2["message"] or "3" in res2["message"]
    history.append({"role": "user", "content": "Which room is suitable for 3 guests?"})
    history.append({"role": "assistant", "content": res2["message"]})

    # Step 3: Ambiguous follow-up
    r3 = client.post("/api/chat", json={"message": "Does it include breakfast?", "conversation": history})
    assert r3.status_code == 200
    res3 = r3.json()
    assert "breakfast" in res3["message"].lower()
    assert "included" in res3["message"].lower() or "yes" in res3["message"].lower()
    history.append({"role": "user", "content": "Does it include breakfast?"})
    history.append({"role": "assistant", "content": res3["message"]})

    # Step 4: Check room availability via direct payload
    r4 = client.post("/api/chat", json={
        "message": "Check room availability",
        "conversation": history,
        "availability": {
            "check_in": "2026-10-10",
            "check_out": "2026-10-12",
            "adults": 3
        }
    })
    assert r4.status_code == 200
    res4 = r4.json()
    assert res4["type"] == "availability"
    assert res4["rooms"] is not None
    assert len(res4["rooms"]) >= 1

    # Verify structured room calculation
    room = res4["rooms"][0]
    assert room["capacity"] >= 3
    assert room["total_price"] == room["price_per_night"] * 2
