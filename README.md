

# URL Shortener

This is a full-featured URL shortener service built with Node.js, Express, Drizzle ORM, and Docker. It allows users to register, log in, and create short links for long URLs. The service supports authentication, analytics, and robust validation.

---

## Features

- Shorten long URLs to compact, shareable links
- User registration and login with JWT authentication
- Analytics: track number of visits per short URL
- RESTful API with input validation
- Modular code structure (routes, services, middleware, utils)
- Docker support for easy deployment

---

## Project Structure

```
Routes/           # API route handlers (user, url)
db/               # Database config and schema
middleware/       # Express middlewares (auth, login checks)
services/         # Business logic for URLs and users
utils/            # Utility functions (hashing, tokens, short URL gen)
validations/      # Request and token validation logic
index.js          # App entry point
docker-compose.yml# Docker setup
```

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- Docker (optional, for containerized setup)

### 1. Clone the repository
```bash
git clone https://github.com/AmanAnand958/Url_Shortner.git
cd Url_Shortner
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the root directory. Example:
```
PORT=3000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_db_url
```

### 4. Run locally
```bash
npm start
```
Or, for development with auto-reload:
```bash
npm run dev
```

### 5. Using Docker
```bash
docker-compose up --build
```

---

## Usage

### Shorten a URL
Send a POST request to `/api/url/shorten` with JSON body:
```json
{
	"longUrl": "https://example.com/very/long/url"
}
```
Response:
```json
{
	"shortUrl": "http://localhost:3000/abc123"
}
```

### Redirect
Visiting `http://localhost:3000/abc123` will redirect to the original long URL.

### User Registration
POST `/api/user/register` with JSON:
```json
{
	"username": "yourname",
	"password": "yourpassword"
}
```

### User Login
POST `/api/user/login` with JSON:
```json
{
	"username": "yourname",
	"password": "yourpassword"
}
```
Response includes a JWT token for authenticated requests.

### Authenticated Shorten (with JWT)
Add `Authorization: Bearer <token>` header to protected endpoints.

---

## API Endpoints (Summary)

| Method | Endpoint                | Description                |
|--------|-------------------------|----------------------------|
| POST   | /api/url/shorten        | Shorten a long URL         |
| GET    | /:shortId               | Redirect to long URL       |
| POST   | /api/user/register      | Register a new user        |
| POST   | /api/user/login         | Login and get JWT token    |
| GET    | /api/url/:shortId/stats | Get analytics for a short URL |

See `Routes/url.routes.js` and `Routes/user.routes.js` for full details.

---

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests if possible.
3. Open a pull request describing your changes.

---

## License

MIT
