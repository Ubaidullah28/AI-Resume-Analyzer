# 🤖 AI Resume Analyzer

> An AI-powered resume analysis platform that helps job seekers optimize their resumes against specific job descriptions, improve ATS compatibility, identify missing skills, and receive actionable AI-driven recommendations.

![AI Resume Analyzer](https://img.shields.io/badge/AI-Resume%20Analyzer-00AEEF?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-AI%20Inference-F55036?style=for-the-badge)

---

## 🌐 Live Application

**Frontend:**  
https://muhammad-ubaidullah-portfolio.vercel.app/

**Developer Portfolio:**  
https://muhammad-ubaidullah-portfolio.vercel.app/

**GitHub:**  
https://github.com/Ubaidullah28

---

## 📌 Overview

**AI Resume Analyzer** is a full-stack AI-powered SaaS application designed to help candidates understand how well their resume matches a particular job opportunity.

Users can upload their resume, provide a job description, and receive a detailed analysis including:

- 📊 ATS compatibility score
- 🎯 Job/resume match analysis
- 🔑 Matching keywords
- ❌ Missing keywords and skills
- 💡 AI-powered improvement suggestions
- 📝 Resume summary
- 💪 Identified strengths
- ⚠️ Identified weaknesses
- 📈 Actionable recommendations
- 🕘 Analysis history

The platform combines traditional resume/job-description analysis with Large Language Model (LLM) capabilities to provide meaningful, structured feedback instead of simply returning raw AI output.

---

# ✨ Features

## 🔐 Authentication

The application provides secure user authentication with:

- User registration
- Email/password login
- JWT-based authentication
- Protected routes
- Google authentication
- Persistent user sessions
- Secure authentication flow between frontend and backend

### Authentication Flow

```text
User
 │
 ├── Email / Password
 │        │
 │        ▼
 │   FastAPI Backend
 │        │
 │        ▼
 │   JWT Authentication
 │
 └── Google Sign-In
          │
          ▼
   Google Identity Services
          │
          ▼
    FastAPI Backend
          │
          ▼
      User Account
