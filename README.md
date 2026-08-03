# 📖 The Poet's Corner

A full-stack web application that recommends poems based on your mood, emotion, or occasion — built with React, Node.js/Express, and a dataset of over 13,000 poems from the Poetry Foundation.

## ✨ Features

- 🔍 Search poems by mood, theme, or occasion (heartbreak, love, rain, hope, and more)
- 🎯 Custom relevance-ranking recommendation engine with synonym expansion
- ⭐ Save favorite poems
- 🕘 Recent search history
- 🌓 Dark / Light mode
- 📱 Fully responsive design (mobile, tablet, desktop)
- 📋 Copy poem to clipboard
- ⚡ Loading skeletons and robust error handling

## 🛠️ Tech Stack

**Frontend:** React (Vite), CSS
**Backend:** Node.js, Express
**Dataset:** [Poetry Foundation Poems](https://www.kaggle.com/datasets/tgdivy/poetry-foundation-poems) (Kaggle, ~13,700 poems)

## 🏗️ Project Structure

the-poets-corner/
├── frontend/ # React app (Vite)
├── backend/ # Express API server
├── dataset/ # Poetry dataset (CSV)
├── assets/ # Screenshots, images
└── README.md

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/poems/count` | Returns total number of poems loaded |
| GET | `/api/poems/recommend?mood=<query>` | Returns ranked poem recommendations for a given mood/theme |

## 📄 License

This project is for educational and portfolio purposes. Poem content is sourced from the Poetry Foundation dataset via Kaggle.