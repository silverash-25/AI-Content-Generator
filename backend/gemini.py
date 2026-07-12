import os

from dotenv import load_dotenv
from google import genai

from prompts import build_prompt

# Load environment variables
load_dotenv()

# Create Gemini client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ================================
# NORMAL GENERATION
# ================================

def generate_content(topic, content_type, tone, word_count):

    prompt = build_prompt(
        topic,
        content_type,
        tone,
        word_count
    )

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    return response.text


# ================================
# STREAMING GENERATION
# ================================

def stream_content(topic, content_type, tone, word_count):

    prompt = build_prompt(
        topic,
        content_type,
        tone,
        word_count
    )

    response = client.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents=prompt
    )

    for chunk in response:

        if chunk.text:
            yield chunk.text