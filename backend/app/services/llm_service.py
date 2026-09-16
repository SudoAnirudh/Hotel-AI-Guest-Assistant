import os
import re
import logging
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.services.knowledge_service import knowledge_service
from app.models.schemas import ConversationMessage

logger = logging.getLogger("llm_service")

SYSTEM_PROMPT = """You are the official AI Guest Assistant for Harbor View Hotel.
Your primary role is to assist guests with clear, accurate, polite, and helpful information about Harbor View Hotel.

CRITICAL CONSTRAINTS & GROUNDING RULES:
1. Answer guest questions ONLY using the provided Hotel Knowledge Base context below.
2. DO NOT invent, assume, or hallucinate any hotel amenities, room prices, policies, services, or availability details.
3. If the user asks a question whose answer is NOT present in the provided Hotel Knowledge Base, respond exactly with:
   "I don't have that information available right now. Please contact hotel reception at concierge@harborviewhotel.com or call +1 (555) 839-2000 for assistance."
4. For room availability requests (e.g., specific dates or guest counts), inform the guest that you will check room availability for them.
5. Use previous conversation history to understand follow-up references (such as "it", "that room", "breakfast for them", "is it ocean view?").
6. Keep responses elegant, warm, and formatted cleanly.

HOTEL KNOWLEDGE BASE:
{knowledge_context}
"""

class LLMService:
    def __init__(self):
        self.nvidia_key = settings.NVIDIA_API_KEY or os.getenv("NVIDIA_API_KEY", "")
        self.nvidia_base_url = settings.NVIDIA_BASE_URL
        self.nvidia_model = settings.NVIDIA_MODEL
        self.gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")

    def generate_response(
        self, user_message: str, conversation_history: List[ConversationMessage]
    ) -> Tuple[str, str]:
        """
        Generates a response using NVIDIA API, Gemini, OpenAI, or the Grounded Local Knowledge Engine.
        Returns: (response_text, provider_used)
        """
        knowledge_context = knowledge_service.get_full_context_str()
        prompt_with_system = SYSTEM_PROMPT.format(knowledge_context=knowledge_context)

        # 1. Try NVIDIA API if key is available
        if self.nvidia_key:
            try:
                import httpx
                headers = {
                    "Authorization": f"Bearer {self.nvidia_key}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
                messages = [{"role": "system", "content": prompt_with_system}]
                for msg in conversation_history[-6:]:
                    messages.append({"role": msg.role, "content": msg.content})
                messages.append({"role": "user", "content": user_message})

                payload = {
                    "model": self.nvidia_model,
                    "messages": messages,
                    "temperature": 0.2,
                    "max_tokens": 1024
                }
                url = f"{self.nvidia_base_url.rstrip('/')}/chat/completions"
                response = httpx.post(url, json=payload, headers=headers, timeout=12.0)
                if response.status_code == 200:
                    data = response.json()
                    answer = data["choices"][0]["message"]["content"]
                    return answer.strip(), "nvidia"
                else:
                    logger.warning(f"NVIDIA API status code {response.status_code}: {response.text}")
            except Exception as e:
                logger.warning(f"NVIDIA API call failed or timed out: {e}")

        # 2. Try Google Gemini API if key is available
        if self.gemini_key:
            try:
                from google import genai
                client = genai.Client(api_key=self.gemini_key)

                contents = [prompt_with_system]
                for msg in conversation_history[-6:]:
                    contents.append(f"{msg.role.capitalize()}: {msg.content}")
                contents.append(f"User: {user_message}")

                full_prompt = "\n\n".join(contents)
                res = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=full_prompt,
                )
                if res and res.text:
                    return res.text.strip(), "gemini"
            except Exception as e:
                logger.warning(f"Gemini API call failed: {e}")

        # 3. Try OpenAI API if key is available
        if self.openai_key:
            try:
                import httpx
                headers = {
                    "Authorization": f"Bearer {self.openai_key}",
                    "Content-Type": "application/json"
                }
                messages = [{"role": "system", "content": prompt_with_system}]
                for msg in conversation_history[-6:]:
                    messages.append({"role": msg.role, "content": msg.content})
                messages.append({"role": "user", "content": user_message})

                payload = {
                    "model": "gpt-4o-mini",
                    "messages": messages,
                    "temperature": 0.2
                }
                response = httpx.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    answer = data["choices"][0]["message"]["content"]
                    return answer.strip(), "openai"
            except Exception as e:
                logger.warning(f"OpenAI API call failed: {e}")

        # 4. Deterministic Grounded Local Fallback Engine (Zero External Dependency)
        return self._local_grounded_fallback(user_message, conversation_history), "local_grounded"

    def _local_grounded_fallback(
        self, user_message: str, conversation_history: List[ConversationMessage]
    ) -> str:
        """
        Local grounded rule-based QA engine. Performs entity recognition & intent matching
        against hotel_knowledge.json with follow-up context resolution.
        """
        msg_lower = user_message.lower()

        # Check conversation history for follow-up context
        last_discussed_room = None
        for msg in reversed(conversation_history):
            content = msg.content.lower()
            if "deluxe family" in content or "family suite" in content:
                last_discussed_room = "deluxe_family"
                break
            elif "deluxe king" in content:
                last_discussed_room = "deluxe_king"
                break
            elif "deluxe twin" in content:
                last_discussed_room = "deluxe_twin"
                break
            elif "oceanfront" in content or "villa" in content:
                last_discussed_room = "ocean_villa"
                break

        # Check-in / Check-out time queries
        if "check-in" in msg_lower or "check in" in msg_lower or "arrival" in msg_lower:
            if "policy" in msg_lower or "early" in msg_lower:
                return knowledge_service.get_policies().get("check_in", "Check-in is at 3:00 PM.")
            return f"Check-in time at Harbor View Hotel starts at {knowledge_service.get_hotel_info()['check_in_time']}."

        if "check-out" in msg_lower or "check out" in msg_lower or "departure" in msg_lower:
            if "late" in msg_lower or "fee" in msg_lower:
                return knowledge_service.get_policies().get("check_out", "Check-out is by 11:00 AM.")
            return f"Check-out time at Harbor View Hotel is by {knowledge_service.get_hotel_info()['check_out_time']}."

        # Cancellation policy
        if "cancellation" in msg_lower or "cancel" in msg_lower or "refund" in msg_lower:
            return knowledge_service.get_policies().get("cancellation", "Free cancellation is permitted up to 48 hours prior to check-in.")

        # Breakfast queries
        if "breakfast" in msg_lower or "morning meal" in msg_lower:
            breakfast_info = knowledge_service.get_dining_info().get("breakfast", {})
            if last_discussed_room:
                rooms = knowledge_service.get_rooms()
                target_room = next((r for r in rooms if r["id"] == last_discussed_room), None)
                if target_room:
                    inc = "is included" if target_room.get("breakfast_included") else "is not included"
                    return f"Yes, complimentary breakfast {inc} for guests staying in the {target_room['name']}. Breakfast is served daily from {breakfast_info.get('hours', '7:00 AM - 10:30 AM')} at {breakfast_info.get('location', 'The Wave Restaurant')}."
            return f"Complimentary gourmet breakfast is included for room guests, served daily from {breakfast_info.get('hours', '7:00 AM - 10:30 AM')} at {breakfast_info.get('location', 'The Wave Restaurant & Terrace')}."

        # Pool queries
        if "pool" in msg_lower or "swimming" in msg_lower:
            amenities = knowledge_service.get_amenities()
            pool = next((a for a in amenities if "pool" in a["name"].lower()), None)
            if pool:
                return f"Yes! Harbor View Hotel features a heated outdoor {pool['name']}. Hours: {pool['hours']}. {pool['details']}"

        # Gym / Fitness / Spa
        if "gym" in msg_lower or "fitness" in msg_lower or "workout" in msg_lower:
            return "Yes, we have a 24/7 Fitness & Wellness Center equipped with Technogym cardio machines, free weights, yoga studio, and steam saunas."
        if "spa" in msg_lower or "massage" in msg_lower:
            return "Our luxury Azure Spa is open from 9:00 AM - 8:00 PM offering aromatherapy, deep tissue massages, facials, and hydrotherapy."

        # Pets
        if "pet" in msg_lower or "dog" in msg_lower or "cat" in msg_lower:
            return knowledge_service.get_policies().get("pets", "Pets under 35 lbs are welcome in designated pet-friendly rooms.")

        # Parking
        if "park" in msg_lower or "car" in msg_lower or "ev charging" in msg_lower:
            return "Valet parking is available at $25/night with complimentary EV charging. Self-parking is available for $15/night."

        # Wi-Fi / Internet
        if "wifi" in msg_lower or "wi-fi" in msg_lower or "internet" in msg_lower:
            return "Complimentary ultra-fast Wi-Fi is available throughout all guest rooms, public areas, and beach loungers."

        # Room capacity & recommendation queries
        capacity_match = re.search(r'(\d+)\s*(people|guest|person|adult)', msg_lower)
        word_num_map = {"two": 2, "three": 3, "four": 4, "five": 5, "six": 6}
        guest_count = None
        if capacity_match:
            guest_count = int(capacity_match.group(1))
        else:
            for w, n in word_num_map.items():
                if w in msg_lower:
                    guest_count = n
                    break

        if guest_count or "family" in msg_lower or "suite" in msg_lower or "room" in msg_lower:
            count = guest_count or 3
            suitable_rooms = [r for r in knowledge_service.get_rooms() if r["capacity"] >= count]
            if suitable_rooms:
                room_list = ", ".join([f"{r['name']} (up to {r['capacity']} guests, ${r['price_per_night']}/night)" for r in suitable_rooms])
                return f"For {count} guest(s), we recommend the {suitable_rooms[0]['name']}. Options that accommodate your group: {room_list}."

        # FAQs
        for faq in knowledge_service.get_faqs():
            q_keywords = [w for w in faq["question"].lower().split() if len(w) > 3]
            if sum(1 for kw in q_keywords if kw in msg_lower) >= 2:
                return faq["answer"]

        # Default Grounded Fallback
        return "I don't have that information available right now in my hotel knowledge base. Please contact our front desk concierge at concierge@harborviewhotel.com or +1 (555) 839-2000 for assistance."

llm_service = LLMService()
