# 🔍 NL_TO_SQL

Convert natural language queries into SQL and execute them seamlessly on a PostgreSQL database. Ask questions in plain English, get results instantly.

---

## ✨ Features

- 🗣️ **Natural Language Processing** - Convert everyday questions into precise SQL queries
- ⚡ **Fast Query Execution** - Execute SQL queries on PostgreSQL with optimized performance
- 🤖 **AI-Powered** - Leverages Groq API for intelligent query generation
- 🔐 **Secure Authentication** - JWT-based user authentication and authorization
- 🎨 **Modern UI** - React-based frontend with Vite for fast development
- 📊 **Result Display** - Clean presentation of query results in an intuitive interface
- 🛡️ **Error Handling** - Comprehensive error messages and validation
- 📱 **Responsive Design** - Works seamlessly across different devices

---

## 🛠️ Tech Stack

| Category             | Technology        |
| -------------------- | ----------------- |
| **Backend**          | FastAPI (Python)  |
| **Frontend**         | React (Vite)      |
| **Database**         | PostgreSQL        |
| **LLM API**          | Groq API          |
| **Authentication**   | JWT Tokens        |
| **Deployment Ready** | Docker compatible |

---

## 📁 Project Structure

```
nl_to_sql/
├── backend/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic schemas for validation
│   ├── hashing.py              # Password hashing utilities
│   ├── jwt_token.py            # JWT token generation and validation
│   ├── oauth2.py               # OAuth2 authentication
│   ├── talkdb.py               # Chat/Query database operations
│   ├── userdb.py               # User database operations
│   ├── requirements.txt         # Python dependencies
│   └── routers/
│       ├── __init__.py
│       ├── login.py            # Login endpoint
│       ├── signup.py           # User registration endpoint
│       ├── llm.py              # LLM query generation
│       └── talk.py             # Query execution endpoint
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main app component
│   │   ├── index.css           # Global styles
│   │   ├── ProtectedRoute.jsx  # Protected route wrapper
│   │   ├── components/
│   │   │   └── ToastProvider.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── SignUp.jsx      # Registration page
│   │   │   ├── Dashboard.jsx   # User dashboard
│   │   │   └── Query.jsx       # Query interface page
│   │   ├── services/
│   │   │   ├── api.js          # API client
│   │   │   └── errorMessage.js # Error handling utilities
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
├── package.json                # Root package configuration
└── README.md                   # This file
```

---

## 🚀 Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Git

### Clone Repository

```bash
git clone https://github.com/yourusername/nl_to_sql.git
cd nl_to_sql
```

### Backend Setup

#### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

**On Windows:**

```bash
venv\Scripts\activate
```

**On macOS/Linux:**

```bash
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Create `.env` File

Create a `.env` file in the `backend/` directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/nl_to_sql_db
USER_DATABASE_URL=postgresql://username:password@localhost:5432/user_db
SECRET_KEY=your_secret_key_here_min_32_characters
GROQ_API_KEY=your_groq_api_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### 4. Setup Database

```bash
# Create PostgreSQL database
createdb nl_to_sql_db

# Run migrations (if using Alembic)
alembic upgrade head
```

#### 5. Run FastAPI Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

API documentation available at `http://localhost:8000/docs`

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the URL shown in terminal)

#### 3. Build for Production

```bash
npm run build
```

### Running Frontend & Backend Concurrently

To run both the frontend and backend simultaneously from the root directory:

```bash
# From the root folder (nl_to_sql/)
npm run dev
```

This command will start:

- 🔵 **Backend**: FastAPI server on `http://localhost:8000`
- 🟢 **Frontend**: React development server on `http://localhost:5173`

Both will reload automatically on file changes.

---

## 🔑 Environment Variables

### Backend Environment Variables

| Variable                      | Description                                                       | Example                                                  |
| ----------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| `DATABASE_URL`                | PostgreSQL connection string for the data/query database          | `postgresql://user:password@localhost:5432/nl_to_sql_db` |
| `USER_DATABASE_URL`           | PostgreSQL connection string for the user authentication database | `postgresql://user:password@localhost:5432/user_db`      |
| `GROQ_API_KEY`                | API key for Groq LLM service                                      | `gsk_xxxxxxxxxxxxx`                                      |
| `SECRET_KEY`                  | Secret key for JWT token signing (min 32 chars)                   | `your_secret_key_here_min_32_characters`                 |
| `ALGORITHM`                   | JWT algorithm                                                     | `HS256`                                                  |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time in minutes                                  | `30`                                                     |

### Creating `.env` File

1. Navigate to the `backend/` directory
2. Create a file named `.env`
3. Add all required variables (see examples above)
4. Never commit `.env` to version control

**Sample `.env` format:**

```
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/nl_to_sql_db
USER_DATABASE_URL=postgresql://your_user:your_password@localhost:5432/user_db
GROQ_API_KEY=gsk_your_api_key_here
SECRET_KEY=your_super_secret_key_with_at_least_32_characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### User Database Schema

The user database should contain a `users` table with the following structure:

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL  -- Must be hashed using bcrypt or similar
);
```

**Important:** Password must be stored as a hashed value, never in plaintext. The application automatically hashes passwords during signup using secure hashing algorithms.

---

## 🔄 How It Works

1. **User Authentication**: Users sign up and log in via JWT authentication
2. **Query Input**: User enters a natural language question through the frontend
3. **LLM Processing**: Backend sends the query to Groq API for SQL generation
4. **SQL Execution**: Generated SQL is executed on PostgreSQL database
5. **Result Display**: Results are formatted and returned to the frontend
6. **Error Handling**: Any errors are caught and displayed to the user

```
User Input (NL) → Backend → Groq API → SQL Generation
                                          ↓
                                    PostgreSQL
                                          ↓
                                    Query Results → Frontend Display
```

---

## 📡 API Endpoints Overview

### Authentication Endpoints

| Method | Endpoint  | Description                       | Auth Required |
| ------ | --------- | --------------------------------- | ------------- |
| `POST` | `/signup` | Register a new user               | ❌ No         |
| `POST` | `/login`  | User login with username/password | ❌ No         |
| `POST` | `/logout` | User logout and clear session     | ✅ Yes        |
| `GET`  | `/me`     | Get current logged-in user info   | ✅ Yes        |

### Database Schema & Metadata Endpoints

| Method | Endpoint               | Description                                         | Auth Required |
| ------ | ---------------------- | --------------------------------------------------- | ------------- |
| `GET`  | `/tables`              | List all available tables in the database           | ✅ Yes        |
| `GET`  | `/tables/{table_name}` | Get detailed schema and columns of a specific table | ✅ Yes        |
| `GET`  | `/schema`              | Get complete database schema for all tables         | ✅ Yes        |

### Query Execution Endpoints

| Method | Endpoint        | Description                                          | Auth Required |
| ------ | --------------- | ---------------------------------------------------- | ------------- |
| `POST` | `/talk`         | Execute raw SQL command directly                     | ✅ Yes        |
| `POST` | `/talk/natural` | Convert natural language question to SQL and execute | ✅ Yes        |

### Request/Response Examples

**Signup:**

```json
POST /signup
{
  "username": "john_doe",
  "password": "securepassword123",
  "confirm_password": "securepassword123"
}
```

**Login:**

```json
POST /login
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Get Current User:**

```json
GET /me
Response:
{
  "username": "john_doe"
}
```

**Get All Tables:**

```json
GET /tables
Response:
["students", "companies", "placements"]
```

**Get Table Schema:**

```json
GET /tables/students
Response:
{
  "table": "students",
  "columns": [
    {
      "column": "student_id",
      "type": "integer",
      "nullable": false,
      "primary_key": true
    }
  ]
}
```

**Natural Language Query:**

```json
POST /talk/natural
{
  "question": "Show me all students with CGPA above 8.0"
}
Response:
{
  "user": "john_doe",
  "data": [
    {"student_id": 1, "username": "alice", "cgpa": 8.5},
    {"student_id": 2, "username": "bob", "cgpa": 8.2}
  ]
}
```

**Raw SQL Query:**

```json
POST /talk
{
  "sql_command": "SELECT * FROM students WHERE cgpa > 8.0;"
}
Response:
{
  "user": "john_doe",
  "data": [...]
}
```

**Interactive API Testing:**
For complete API documentation with interactive testing, visit `http://localhost:8000/docs` when the backend is running (Swagger UI).

---

## 📸 Screenshots

### Home Page

![Home Page Placeholder](https://via.placeholder.com/800x400?text=Home+Page)

### Query Interface

![Query Interface Placeholder](https://via.placeholder.com/800x400?text=Query+Interface)

### Results Display

![Results Display Placeholder](https://via.placeholder.com/800x400?text=Results+Display)

### Dashboard

![Dashboard Placeholder](https://via.placeholder.com/800x400?text=Dashboard)

---

## 🔮 Future Improvements

- [ ] Query optimization suggestions
- [ ] Support for multiple databases (MySQL, MongoDB)
- [ ] Advanced filtering and sorting options
- [ ] Query caching for frequently asked questions
- [ ] Export results to CSV/Excel/PDF
- [ ] Query analytics and insights
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Saved query templates library
- [ ] Advanced error recovery mechanisms
- [ ] Performance monitoring dashboard

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For support, email support@nl2sql.com or create an issue in the repository.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [React](https://react.dev/) - UI library
- [Groq](https://groq.com/) - LLM inference platform
- [PostgreSQL](https://www.postgresql.org/) - Relational database

---

**Built with ❤️ by [Your Name]**
