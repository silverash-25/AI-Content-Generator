# 🚀 AI Content Generator

An AI-powered web application that generates high-quality content using Google's Gemini AI model. The application features a modern and responsive frontend built with HTML, CSS, and JavaScript, while the backend is developed using Python FastAPI. Users can generate blogs, articles, social media posts, emails, and other content with customizable tone and word count.

---

## 📌 Project Overview

AI Content Generator is designed to simplify content creation by leveraging the power of Generative AI. Users can enter a topic, choose the type of content, select the writing tone, and specify the desired word count. The application then generates well-structured content in real-time using Google's Gemini AI model.

---

## ✨ Features

- 🤖 AI-powered content generation using **Google Gemini 3.5**
- 📝 Multiple content types
  - Blog Posts
  - Articles
  - Emails
  - Social Media Posts
  - Product Descriptions
  - And more
- 🎭 Multiple writing tones
  - Professional
  - Casual
  - Friendly
  - Persuasive
  - Creative
- 📏 Custom word count
- ⚡ Fast API responses
- 📋 Copy generated content
- 📥 Download generated content as a text file
- 🎨 Modern responsive UI
- 🔄 Live communication between frontend and backend
- ☁️ Ready for AWS deployment

---

# 🛠️ Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

## Backend

- Python
- FastAPI
- Uvicorn

## AI Model

- Google Gemini 3.5 Flash
- Google Gen AI SDK

## Other Tools

- Python Dotenv
- REST API
- VS Code
- Git & GitHub

---

# 📂 Project Structure

```
AI-Content-Generator/
│
├── backend/
│   ├── main.py
│   ├── gemini.py
│   ├── models.py
│   ├── prompts.py
│   ├── requirements.txt
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│
├── README.md
├── .gitignore
└── LICENSE (Optional)
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Content-Generator.git
```

---

## 2. Navigate to the project

```bash
cd AI-Content-Generator
```

---

## 3. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

## 5. Start the FastAPI server

```bash
python -m uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

---

## 6. Launch the Frontend

Open the `frontend` folder in VS Code.

Use the **Live Server** extension to run:

```
index.html
```

The application will be available at:

```
http://127.0.0.1:5500
```

---

# 📡 API Endpoints

## Health Check

```
GET /
```

Returns the API status.

---

## Health Endpoint

```
GET /health
```

Returns server health information.

---

## Generate Content

```
POST /generate
```

### Request Body

```json
{
  "topic": "Artificial Intelligence",
  "content_type": "Blog Post",
  "tone": "Professional",
  "word_count": 300
}
```

### Response

```json
{
  "content": "Generated content..."
}
```

---

## Generate Streaming Content

```
POST /generate-stream
```

Returns streamed AI-generated content.

---

# 🎯 Workflow

```
User
   │
   ▼
Frontend (HTML/CSS/JavaScript)
   │
   ▼
FastAPI Backend
   │
   ▼
Google Gemini API
   │
   ▼
Generated Content
   │
   ▼
Frontend Display
```

---

# 🔒 Security

- API keys stored using environment variables
- `.env` excluded from Git
- Backend API secured through FastAPI
- CORS configured for frontend communication

---

# 🌟 Future Enhancements

- User authentication
- AI conversation history
- Export as PDF
- Export as DOCX
- Prompt templates
- Multi-language support
- AI image generation
- User dashboard
- Content history
- Dark/Light mode
- Voice input support

---

# ☁️ Deployment

The application is deployment-ready and can be hosted on:

- AWS EC2
- AWS Elastic Beanstalk
- Docker
- Render
- Railway

---

# 👩‍💻 Author

**Maria Khan**

Bachelor of Computer Applications (Cyber Security)

Kristu Jayanti College, Bengaluru

---

# 📄 License

This project is developed for educational and academic purposes.

---

# ⭐ Acknowledgements

- Google Gemini API
- FastAPI
- Python
- HTML, CSS & JavaScript
- Open Source Community