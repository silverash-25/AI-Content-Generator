def build_prompt(topic, content_type, tone, word_count):
    return f"""
You are an expert content writer.

Generate a high-quality {content_type}.

Topic:
{topic}

Tone:
{tone}

Target Length:
Approximately {word_count} words.

Instructions:
- Make it engaging.
- Keep it original.
- Use headings where appropriate.
- Avoid repeating ideas.
- Use natural language.
- Finish with a strong conclusion if applicable.
"""
