from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from models import ContentRequest
from gemini import generate_content, stream_content

app = FastAPI(
    title="AI Content Generator API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "AI Content Generator API Running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }


@app.post("/generate")
def generate(request: ContentRequest):

    try:

        result = generate_content(
            topic=request.topic,
            content_type=request.content_type,
            tone=request.tone,
            word_count=request.word_count
        )

        return {
            "content": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/generate-stream")
def generate_stream(request: ContentRequest):

    try:

        return StreamingResponse(
            stream_content(
                topic=request.topic,
                content_type=request.content_type,
                tone=request.tone,
                word_count=request.word_count
            ),
            media_type="text/plain"
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
