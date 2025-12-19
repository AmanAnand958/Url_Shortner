# Url_Shortner
# URL Shortener

A simple Node.js-based URL shortener service.

## Features
- Shorten long URLs
- User authentication
- RESTful API
- Uses Drizzle ORM and Docker

## Project Structure
```
Routes/           # API route handlers
db/               # Database config and schema
middleware/       # Express middlewares
services/         # Business logic
utils/            # Utility functions
validations/      # Request and token validation
index.js          # App entry point
docker-compose.yml# Docker setup
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- Docker (optional, for containerized setup)

### Install dependencies
```bash
npm install
```

### Run locally
```bash
npm start
```
Or, for development with auto-reload:
```bash
npm run dev
```

### Using Docker
```bash
docker-compose up --build
```

## API Endpoints
- See `Routes/url.routes.js` and `Routes/user.routes.js` for details.

## License
MIT
