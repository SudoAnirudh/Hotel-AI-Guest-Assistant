from datetime import datetime, date
from typing import Dict, Any, List, Tuple, Optional
from app.services.knowledge_service import knowledge_service
from app.models.schemas import RoomResult, AvailabilityResponse, ErrorDetails

class AvailabilityService:
    def check_availability(
        self, check_in_str: str, check_out_str: str, adults: int
    ) -> Tuple[bool, Optional[AvailabilityResponse], Optional[ErrorDetails]]:
        """
        Deterministic availability check for Harbor View Hotel.
        Validates dates, filters rooms by capacity and mock room inventory, calculates stay prices.
        """
        # Date parsing and validation
        try:
            check_in = datetime.strptime(check_in_str.strip(), "%Y-%m-%d").date()
        except ValueError:
            return False, None, ErrorDetails(
                code="INVALID_DATE_FORMAT",
                message="Invalid check-in date format. Please use YYYY-MM-DD."
            )

        try:
            check_out = datetime.strptime(check_out_str.strip(), "%Y-%m-%d").date()
        except ValueError:
            return False, None, ErrorDetails(
                code="INVALID_DATE_FORMAT",
                message="Invalid check-out date format. Please use YYYY-MM-DD."
            )

        if check_out <= check_in:
            return False, None, ErrorDetails(
                code="INVALID_DATE_RANGE",
                message="Check-out date must be at least 1 day after check-in date."
            )

        if adults < 1:
            return False, None, ErrorDetails(
                code="INVALID_GUEST_COUNT",
                message="Number of adult guests must be at least 1."
            )

        total_nights = (check_out - check_in).days
        all_rooms = knowledge_service.get_rooms()

        matching_rooms: List[RoomResult] = []
        for r in all_rooms:
            # Check capacity AND available inventory in mock engine
            if r["capacity"] >= adults and r.get("available_inventory", 1) > 0:
                total_price = round(r["price_per_night"] * total_nights, 2)
                room_obj = RoomResult(
                    id=r["id"],
                    name=r["name"],
                    capacity=r["capacity"],
                    available_inventory=r.get("available_inventory", 1),
                    price_per_night=r["price_per_night"],
                    total_price=total_price,
                    bed_type=r["bed_type"],
                    size_sqft=r["size_sqft"],
                    breakfast_included=r.get("breakfast_included", True),
                    ocean_view=r.get("ocean_view", False),
                    description=r["description"],
                    amenities=r.get("amenities", [])
                )
                matching_rooms.append(room_obj)

        available = len(matching_rooms) > 0
        if available:
            msg = f"We have {len(matching_rooms)} room options available for {adults} guest(s) from {check_in_str} to {check_out_str} ({total_nights} night{'s' if total_nights > 1 else ''})."
        else:
            msg = f"No single room accommodates {adults} guests with available inventory. Our largest room accommodates up to 6 guests. Please consider booking multiple rooms or reducing party size."

        response = AvailabilityResponse(
            available=available,
            total_nights=total_nights,
            check_in=check_in_str,
            check_out=check_out_str,
            adults=adults,
            rooms=matching_rooms,
            message=msg
        )

        return True, response, None

availability_service = AvailabilityService()
