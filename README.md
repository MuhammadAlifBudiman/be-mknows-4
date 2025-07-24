# BOOTCAMP Backend API Development

This project is part of the **BOOTCAMP Backend API Development: Node.js Ecosystem** by M-Knows Consulting.

## Overview
This repository contains a backend API server built using modern Node.js technologies and best practices. The project follows the **MVC (Model-View-Controller)** architecture and is designed for scalability, maintainability, and ease of development.

## Tech Stack
- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **MVC Architecture**: Separation of concerns for maintainable code.
- **Sequelize**: Promise-based ORM for Node.js supporting PostgreSQL and other databases.
- **PostgreSQL**: Relational database for structured data.

## Features
- RESTful API endpoints for blog website
- Authentication & authorization
- Data validation and error handling
- Logging and monitoring
- API documentation via Postman

## Project Structure
```
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── api/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── dtos/
│   ├── exceptions/
│   ├── http/
│   ├── interfaces/
│   ├── logs/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── test/
│   └── utils/
├── public/
├── uploads/
├── logs/
├── docker-compose.yml
├── Dockerfile.dev
├── Dockerfile.prod
├── swagger.yaml
├── package.json
└── README.md
```

## Getting Started
### Prerequisites
- Node.js & npm
- PostgreSQL 

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MuhammadAlifBudiman/be-mknows-4
   cd be-mknows-4
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.development.local` (Copy `.env.example` and fill in the required values).

### Email Feature Setup
To enable email sending (e.g., for notifications, password resets), you need to configure Gmail credentials:
1. Go to your Google Account > Security > 'App passwords'.
2. Generate a new app password for 'Mail'.
3. Copy your Gmail address and the generated app password.
4. In your `.env.development.local` (copied from `.env.example`), set:
   ```env
   GOOGLE_EMAIL=your_gmail_address@gmail.com
   GOOGLE_APP_PASSWORD=your_app_password
   ```

This allows the backend to send emails using Gmail SMTP. If you skip this, email features will not work.

### Secret Key Setup
The `SECRET_KEY` environment variable is required for authentication and security features (such as JWT token signing). You must set this to a long, random string.

To generate a secure secret key, run:
```bash
openssl rand -hex 32
```
Copy the output and set it in your `.env.development.local`:
```env
SECRET_KEY=your_generated_secret_key
```

If you do not set this, authentication and token features will not work securely.

### Running the App
- Development:
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm run start
  ```

## API Documentation
- [Postman Collection & Docs](https://documenter.getpostman.com/view/24748798/2sB34mgxFL)

## Bootcamp Program
Learn more about the bootcamp: [M-Knows Consulting Bootcamp](https://www.m-knowsconsulting.com/bootcamp-program/back-end-development-advance)

## License
This project is for educational purposes as part of the M-Knows Consulting Bootcamp.
