# Node.js TypeScript MySQL Boilerplate API

A fully functional authentication API built with **Node.js**, **TypeScript**, **Express**, **Sequelize (MySQL)**, and **JWTs**.

## Features

- **User Registration & Email Verification** – Users sign up and must verify their email before logging in.
- **JWT Authentication** – Short-lived JWT access tokens (15 min) + long-lived Refresh Tokens (7 days) stored in HTTP-only cookies.
- **Refresh Token Rotation** – Each use of a refresh token replaces it with a new one for enhanced security.
- **Role-Based Access Control (RBAC)** – `Admin` and `User` roles. First registered account is automatically Admin.
- **Account Management** – Forgot password, reset password, CRUD operations.
- **Swagger UI** – Interactive API docs at `/api-docs`.

---

## Project Structure

```
node-mysql-api/
├── _helpers/
│   ├── db.ts               # Sequelize/MySQL connection & model init
│   ├── role.ts             # Role enum (Admin/User)
│   ├── send-email.ts       # Email sender (Resend HTTPS or SMTP)
│   └── swagger.ts          # Swagger UI route handler
├── _middleware/
│   ├── authorize.ts        # JWT auth + role-based authorization
│   ├── error-handler.ts    # Global error handler
│   └── validate-request.ts # Joi schema validation middleware
├── accounts/
│   ├── account.model.ts         # Sequelize Account model
│   ├── refresh-token.model.ts   # Sequelize RefreshToken model
│   ├── account.service.ts       # Business logic
│   └── accounts.controller.ts  # Express routes
├── config.json             # Local dev config (gitignored)
├── swagger.yaml            # OpenAPI 3.0 spec
├── server.ts               # Express app entry point
├── tsconfig.json
└── package.json
```

---

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure `config.json`

Edit `config.json` with your local MySQL credentials and SMTP settings:

```json
{
    "database": {
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "your_mysql_password",
        "database": "node_mysql_api"
    },
    "secret": "SUPER_SECRET_KEY_REPLACE_ME",
    "emailFrom": "info@my-node-api.com",
    "smtpOptions": {
        "host": "smtp.ethereal.email",
        "port": 587,
        "auth": {
            "user": "your_ethereal_user",
            "pass": "your_ethereal_pass"
        }
    }
}
```

> **Tip:** Get free test SMTP credentials at [https://ethereal.email/](https://ethereal.email/)

### 3. Run the Server

```bash
npm run start:dev
```

Server starts on **http://localhost:4000**

### 4. Open Swagger UI

```
http://localhost:4000/api-docs
```

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/accounts/register` | Public | Register new account |
| POST | `/accounts/verify-email` | Public | Verify email with token |
| POST | `/accounts/authenticate` | Public | Login → JWT + refresh token cookie |
| POST | `/accounts/refresh-token` | Cookie | Get new JWT + rotate refresh token |
| POST | `/accounts/revoke-token` | JWT | Revoke a refresh token |
| POST | `/accounts/forgot-password` | Public | Request password reset email |
| POST | `/accounts/validate-reset-token` | Public | Check reset token validity |
| POST | `/accounts/reset-password` | Public | Reset password |
| GET | `/accounts` | Admin | Get all accounts |
| GET | `/accounts/:id` | JWT | Get account by ID |
| POST | `/accounts` | Admin | Create account (no email verification) |
| PUT | `/accounts/:id` | JWT | Update account |
| DELETE | `/accounts/:id` | JWT | Delete account |

---

## Testing with Postman

### Register

`POST http://localhost:4000/accounts/register`

```json
{
    "title": "Mr",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "pass1234",
    "confirmPassword": "pass1234",
    "acceptTerms": true
}
```

### Verify Email

Check your email (or Ethereal inbox) for the token, then:

`POST http://localhost:4000/accounts/verify-email`

```json
{ "token": "YOUR_VERIFICATION_TOKEN" }
```

### Authenticate

`POST http://localhost:4000/accounts/authenticate`

```json
{
    "email": "admin@example.com",
    "password": "pass1234"
}
```

Copy the `jwtToken` from the response to use as a Bearer Token for protected routes.

### Access Protected Route

`GET http://localhost:4000/accounts`

Set **Authorization** → **Bearer Token** → paste your JWT.

---

## Production Deployment (Render)

### Build & Start Commands

```
Build:  npm ci && npm run build
Start:  NODE_ENV=production node dist/server.js
```

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Strong random secret for JWT signing |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default 3306) |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `DB_SSL` | `true` or `false` |
| `CORS_ORIGIN` | Comma-separated allowed frontend origins |
| `COOKIE_SECURE` | `true` |
| `COOKIE_SAMESITE` | `lax` |
| `EMAIL_FROM` | Sender email address |
| `RESEND_API_KEY` | Resend API key (recommended) |
| `SMTP_HOST` | SMTP host (fallback for local dev) |

---

## Security Notes

- `config.json` and `.env` are **gitignored** — never commit secrets.
- JWT access tokens expire in **15 minutes**.
- Refresh tokens expire in **7 days** and rotate on every use.
- HTTP-only cookies prevent XSS from accessing refresh tokens.
- Refresh tokens can only be used at `/accounts/refresh-token`, mitigating CSRF.
