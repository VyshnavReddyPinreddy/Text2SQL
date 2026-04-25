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

| Category           | Technology       |
| ------------------ | ---------------- |
| **Backend**        | FastAPI (Python) |
| **Frontend**       | React (Vite)     |
| **Database**       | PostgreSQL       |
| **LLM API**        | Groq API         |
| **Authentication** | JWT Tokens       |

---

## ✅ Current Features Available

### Authentication & User Management

- ✔️ **User Registration** - Sign up with username and password
- ✔️ **Secure Login** - JWT token-based authentication with secure cookies
- ✔️ **Password Hashing** - Passwords encrypted using secure hashing algorithms
- ✔️ **Session Management** - Automatic session handling with token expiration
- ✔️ **Logout Functionality** - Clear session and revoke access tokens
- ✔️ **User Information** - View currently logged-in user details

### Natural Language to SQL Conversion

- ✔️ **NL Query to SQL** - Convert natural language questions to SQL using Groq AI
- ✔️ **SQL Error Handling** - Automatic error detection and recovery with retry mechanism
- ✔️ **SQL Validation** - Ensure only SELECT queries are executed for safety
- ✔️ **Query Explanation** - Get explanations of generated SQL queries

### Database Operations

- ✔️ **Raw SQL Execution** - Execute raw SQL queries directly on your database
- ✔️ **Database Schema Exploration** - View all tables in your database
- ✔️ **Table Information** - Inspect detailed schema of specific tables (columns, types, constraints)
- ✔️ **Complete Schema Retrieval** - Get full database schema in one call
- ✔️ **Multiple Query Support** - Support for complex queries with JOINs, WHERE clauses, aggregations
- ✔️ **Pre-configured Database Access** - Query the database created by the application creator

### Frontend Features

- ✔️ **Responsive Dashboard** - User-friendly dashboard after login
- ✔️ **Query Interface** - Simple interface to input natural language questions
- ✔️ **Real-time Results** - Instant query execution and result display
- ✔️ **Protected Routes** - Secure navigation with authentication checks
- ✔️ **Error Messages** - Clear, user-friendly error notifications
- ✔️ **Modern UI/UX** - Built with React and Vite for fast, smooth experience

### Data Management

- ✔️ **Multiple Database Support** - Separate databases for user authentication and data queries
- ✔️ **Pre-configured Tables** - Access to pre-configured tables set up by the application creator
- ✔️ **CSV Data Import** - Populate tables with CSV file data (setup by admin)
- ✔️ **Data Integrity** - Foreign key constraints and validation support

### Security Features

- ✔️ **JWT Authentication** - Secure token-based authentication
- ✔️ **Protected Endpoints** - All query endpoints require valid authentication
- ✔️ **SQL Injection Prevention** - Parameterized queries prevent SQL injection
- ✔️ **Secure Cookie Handling** - HttpOnly, secure cookie flags enabled
- ✔️ **Environment Variables** - Sensitive data stored in `.env` (never committed)
- ✔️ **Password Security** - Hashed password storage with no plaintext storage

### ⚠️ Current Limitation

**Database Ownership:** Currently, all users access a **shared database created by the application creator**. Users can:

- Query the pre-configured tables
- View database schema
- Execute SQL commands on the existing tables
- But **cannot create their own databases or tables**

This is a **significant limitation** that will be addressed in upcoming versions.

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

#### 4. Setup Databases

You need to create **two separate databases**:

1. **User Database** (`user_db`) - Stores user authentication information (username, hashed password)
2. **Data Database** (`nl_to_sql_db`) - Your personal database where you'll create tables and insert data to query

```bash
# Create User Database (for storing user credentials)
createdb user_db

# Create your Data Database (for your custom tables and data)
createdb nl_to_sql_db

```

**Important:** After creating these databases, you can populate `nl_to_sql_db` with:

- Your own custom tables with your own schema
- CSV files to populate these tables
- Any data structure you need to query against

The `user_db` will be auto-managed by the application for user authentication.

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

The **user database** (`user_db`) stores authentication information with the following table structure:

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL  -- Must be hashed using bcrypt or similar
);
```

**Important:** Password must be stored as a hashed value, never in plaintext. The application automatically hashes passwords during signup using secure hashing algorithms.

### Data Database Schema

The **data database** (`nl_to_sql_db`) is a **shared database** created by the application creator where all users access the same tables:

**Note:** Currently, all users query the same pre-configured database. This means:

- ✅ All users can query the same tables
- ✅ All users see the same data
- ❌ Users **cannot create their own tables**
- ❌ Users **cannot upload their own data**
- ❌ Users **cannot manage their own database schema**

**Example - Current Setup (Shared Database):**

```sql
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    cgpa NUMERIC(4,2),
    branch VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    min_cgpa NUMERIC(3,2),
    salary NUMERIC(10,2)
);

CREATE TABLE placements (
    placement_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(student_id),
    company_id INTEGER REFERENCES companies(company_id),
    placement_date DATE,
    salary NUMERIC(10,2)
);
```

**Data Population (Admin Only):**

- CSV files containing data
- SQL INSERT statements
- Data migration tools

### Future: User-Specific Databases

🔮 **Coming Soon:** In future versions, this limitation will be addressed with:

- Each user will have their own **isolated database**
- Users can **create custom tables** with their own schema
- Users can **upload CSV files** and populate their tables
- Users can manage **multiple databases** within their account
- Full **schema builder** UI for table creation

For more details, see the **Future Improvements** section below.

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

![Home Page Placeholder](screenshots/home.png)

### Login Interface

![Login Interface Placeholder](screenshots/login.png)

### SignUp Interface

![Login Interface Placeholder](screenshots/signup.png)

### Results Display

![Results Display Placeholder](screenshots/result.png)

### Dashboard

![Dashboard Placeholder](screenshots/dashboard.png)

---

## 🔮 Future Improvements

### ⭐ User-Specific Database Management (Addressing Current Limitation)

**Major Enhancement:** Each user will have their own isolated database with full control over table creation and management.

- [ ] **User Database Isolation** - Each user gets their own dedicated PostgreSQL database
- [ ] **Table Creation API** - Create custom tables with user-defined schemas directly through the application
- [ ] **Database Schema Management** - Full control over database structure, columns, data types, and constraints
- [ ] **CSV Upload & Import** - Upload CSV files and automatically create tables with appropriate schema
- [ ] **Bulk Data Insertion** - Import multiple CSV files with their corresponding table structures in a single operation
- [ ] **Table Management UI** - Visual interface to create, modify, and delete tables
- [ ] **Schema Builder** - Drag-and-drop schema designer for creating custom database structures
- [ ] **Data Validation** - Validate data before insertion with custom rules and constraints
- [ ] **Multi-Database Support** - Users can create and manage multiple databases within their account

### Data Management

- [ ] **Table Metadata** - Store and display table metadata (creation date, size, row count)
- [ ] **Data Preview** - Preview table data with pagination
- [ ] **Bulk Operations** - Bulk insert, update, or delete operations

### Query History & Results

- [ ] **Query History Storage** - Store all user's past queries for reference and reuse
- [ ] **Query Analytics** - View statistics about frequently asked questions and query patterns
- [ ] **Query Bookmarking** - Bookmark favorite queries for quick access
- [ ] **Export Results** - Export query results in multiple formats:
  - CSV (Comma-Separated Values)
  - Excel (.xlsx)
  - PDF (Formatted reports)
  - JSON
  - SQL INSERT statements
- [ ] **Scheduled Queries** - Schedule queries to run at specific times
- [ ] **Results Caching** - Cache frequently requested query results

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [React](https://react.dev/) - UI library
- [Groq](https://groq.com/) - LLM inference platform
- [PostgreSQL](https://www.postgresql.org/) - Relational database

---

**Built with ❤️ by Vyshnav Reddy Pinreddy**
