from pydantic import BaseModel

class ContentRequest(BaseModel):
    topic: str
    content_type: str
    tone: str
    word_count: int
    