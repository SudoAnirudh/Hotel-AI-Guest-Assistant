export type MessageRole = 'user' | 'assistant' | 'system';

export interface RoomResult {
  id: string;
  name: string;
  capacity: number;
  price_per_night: number;
  total_price?: number;
  bed_type: string;
  size_sqft: number;
  breakfast_included: boolean;
  ocean_view: boolean;
  description: string;
  amenities: string[];
}

export interface AvailabilityResponse {
  available: boolean;
  total_nights: number;
  check_in: string;
  check_out: string;
  adults: number;
  rooms: RoomResult[];
  message: string;
}

export interface AvailabilityParams {
  check_in: string;
  check_out: string;
  adults: number;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  type?: 'message' | 'availability' | 'fallback' | 'error' | 'availability_form';
  rooms?: RoomResult[];
  availability_data?: AvailabilityResponse;
  suggested_actions?: string[];
}

export interface ChatRequest {
  message: string;
  conversation: { role: MessageRole; content: string }[];
  availability?: AvailabilityParams;
}

export interface ChatResponse {
  type: 'message' | 'availability' | 'fallback' | 'error';
  message: string;
  conversation_id?: string;
  rooms?: RoomResult[];
  availability_data?: AvailabilityResponse;
  suggested_actions?: string[];
}
