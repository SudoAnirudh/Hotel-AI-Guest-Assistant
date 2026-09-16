import { ChatRequest, ChatResponse, AvailabilityParams, AvailabilityResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const code = errorData.error?.code || 'SERVER_ERROR';
      const msg = errorData.error?.message || errorData.detail || `Server error (${res.status})`;
      throw new Error(`[${code}] ${msg}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('Failed to send chat message:', error);
    return {
      type: 'error',
      message: error.message || 'Unable to connect to hotel assistant. Please check backend status.',
    };
  }
}

export async function checkRoomAvailability(params: AvailabilityParams): Promise<AvailabilityResponse> {
  const res = await fetch(`${API_BASE_URL}/availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const msg = errorData.detail?.error?.message || errorData.detail || 'Failed to check room availability';
    throw new Error(msg);
  }

  return await res.json();
}
