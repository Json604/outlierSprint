# 🎬 BookMyShow Clone

An end-to-end movie and event booking platform clone built with **Next.js (React)** for the frontend and **FastAPI** for the backend. It supports movie listings, event management, user bookings, gift cards, offers, support center, and more.

---

## 🌐 Tech Stack

- **Frontend:** Next.js, TailwindCSS, TypeScript
- **Backend:** FastAPI, Python
- **Database (mocked):** Python dictionaries
- **Dockerized:** With `docker-compose`

---

## 🚀 Getting Started

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/your-username/bookmyshow-clone.git
cd bookmyshow-clone
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

📍 Runs at: `http://localhost:3000`

---

### 3️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

📍 Runs at: `http://localhost:8000`

---

## 📁 Project Structure

```
bookmyshow-clone/
├── frontend/
│   ├── app/ (Next.js pages)
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   ├── services/
│   └── ...
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/     (movies, events, plays, etc.)
│   │   └── db/
│   │       └── mock_data.py
│   └── ...
├── docker-compose.yml
```

---

## 📦 Features

- ✅ Movie & Event Listing
- ✅ User Booking & Profile
- ✅ Offers & Gift Cards
- ✅ Contact Support
- ✅ List Your Show
- ✅ Admin-ready routing structure

---

## ⚙️ API Routes (FastAPI)

- `GET /movies`
- `GET /events`
- `GET /bookings`
- `POST /bookings`
- `GET /offers`
- `GET /giftcards`
- `POST /support`
- `GET /users/{user_id}`

(Mock data provided in `app/db/mock_data.py`)

---

## 🐳 Docker (optional)

```bash
docker-compose up --build
```

---

## 📌 Notes

- Ensure backend runs on `http://localhost:8000`
- Update frontend `api.ts` base URLs accordingly
- No real DB yet — all data is mocked in Python files

---

## 🧑‍💻 Author

Built with 💻 by [Kartikey](https://github.com/Json604)

---

## 📄 License

MIT License
