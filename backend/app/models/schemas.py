from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class ErrorDetails(BaseModel):
    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error description")

class ErrorResponse(BaseModel):
    error: ErrorDetails

class ConversationMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class AvailabilityParams(BaseModel):
    check_in: str = Field(..., description="Check-in date YYYY-MM-DD")
    check_out: str = Field(..., description="Check-out date YYYY-MM-DD")
    adults: int = Field(..., ge=1, description="Number of adult guests")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's query")
    conversation: List[ConversationMessage] = Field(default=[], description="Previous conversation history")
    availability: Optional[AvailabilityParams] = None

class RoomResult(BaseModel):
    id: str
    name: str
    capacity: int
    available_inventory: int = Field(default=3, description="Mock available room count")
    price_per_night: float
    total_price: Optional[float] = None
    bed_type: str
    size_sqft: int
    breakfast_included: boolean if 'boolean' in locals() else bool
    ocean_view: bool
    description: str
    amenities: List[str]

class AvailabilityResponse(BaseModel):
    available: bool
    total_nights: int
    check_in: str
    check_out: str
    adults: int
    rooms: List[RoomResult]
    message: str

class ChatResponse(BaseModel):
    type: Literal["message", "availability", "fallback", "error"]
    message: str
    conversation_id: Optional[str] = None
    rooms: Optional[List[RoomResult]] = None
    availability_data: Optional[AvailabilityResponse] = None
    suggested_actions: Optional[List[str]] = None
    error: Optional[ErrorDetails] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
