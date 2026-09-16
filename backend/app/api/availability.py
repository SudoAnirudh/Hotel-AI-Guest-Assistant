from fastapi import APIRouter, HTTPException, status
from app.models.schemas import AvailabilityParams, AvailabilityResponse, ErrorResponse
from app.services.availability_service import availability_service

router = APIRouter(prefix="/availability", tags=["Availability"])

@router.post("", response_model=AvailabilityResponse, responses={400: {"model": ErrorResponse}})
async def check_room_availability(params: AvailabilityParams):
    """
    Deterministic room availability endpoint.
    Filters available rooms at Harbor View Hotel for specified dates, guest count, and mock room inventory.
    """
    success, result, err = availability_service.check_availability(
        check_in_str=params.check_in,
        check_out_str=params.check_out,
        adults=params.adults
    )

    if not success and err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": err.code, "message": err.message}}
        )

    return result
