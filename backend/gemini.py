import os

from dotenv import load_dotenv
from google import genai

from prompts import build_prompt

# ============================================
# Load Environment Variables
# ============================================

load_dotenv()

# ============================================
# Gemini Client
# ============================================

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Model to use everywhere
MODEL_NAME = "gemini-3.5-flash"

# ============================================
# NORMAL GENERATION
# ============================================

def generate_content(topic, content_type, tone, word_count):

    prompt = build_prompt(
        topic,
        content_type,
        tone,
        word_count
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    return response.text


# ============================================
# STREAMING GENERATION
# ============================================

def stream_content(topic, content_type, tone, word_count):

    prompt = build_prompt(
        topic,
        content_type,
        tone,
        word_count
    )

    stream = client.models.generate_content_stream(
        model=MODEL_NAME,
        contents=prompt
    )

    for chunk in stream:

        # Some chunks don't contain text
        if hasattr(chunk, "text") and chunk.text:
            yield chunk.text
            