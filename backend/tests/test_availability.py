from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_availability_valid_search():
    """Scenario 5: Availability tool call with valid dates and guest count."""
    payload = {
        "message": "Check room availability",
        "conversation": [],
        "availability": {
            "check_in": "2026-10-10",
            "check_out": "2026-10-12",
            "adults": 3
        }
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "availability"
    assert data["rooms"] is not None
    assert len(data["rooms"]) >= 1
    family_room = next((r for r in data["rooms"] if r["capacity"] >= 3), None)
    assert family_room is not None
    assert family_room["total_price"] == family_room["price_per_night"] * 2

def test_availability_invalid_dates():
    """Scenario 6: Availability check with invalid date range (check-out before check-in)."""
    payload = {
        "check_in": "2026-10-15",
        "check_out": "2026-10-10",
        "adults": 2
    }
    response = client.post("/api/availability", json=payload)
    assert response.status_code == 400
    err_data = response.json()["detail"]["error"]
    assert err_data["code"] == "INVALID_DATE_RANGE"
    assert "Check-out date must be at least 1 day after check-in" in err_data["message"]

def test_availability_high_guest_count():
    """Scenario 7: Availability check when party size exceeds single room capacity."""
    payload = {
        "check_in": "2026-10-10",
        "check_out": "2026-10-12",
        "adults": 10
    }
    response = client.post("/api/availability", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is False
    assert len(data["rooms"]) == 0
    assert "largest room accommodates up to 6 guests" in data["message"]
