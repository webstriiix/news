# API Project

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Endpoints](#endpoints)
9. [Technologies Used](#technologies-used)

## Introduction

This API provides a comprehensive solution for managing user authentication, categories, and news articles. It offers robust features including JWT-based authentication, role-based access controls, and CRUD operations for categories and news items.

## Features

- 🔒 JWT-based user authentication
- 📂 CRUD operations for categories and news items
- 🛡️ Role-based authorization for admin routes
- 📤 File upload support for news thumbnails
- 📖 Comprehensive API documentation with Swagger

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL database

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/webstriiix/news.git
cd news
```

### 2. Install Dependencies

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```bash
# Server Configuration
PORT=your_application_port

# Database Configuration
MONGODB_URI=your_database_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# File Upload
UPLOAD_DIR=uploads
```

## Running the Application

### Development Mode

```bash
# Using npm
npm run dev

# Alternatively
nodemon
```

### Production Mode

```bash
npm start
```

## API Documentation

1. Start the server
2. Open your web browser
3. Navigate to `http://localhost:{PORT}/api-docs`
   _Note: Replace {PORT} with your application's port number_

## Endpoints

### Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Log in an existing user

### Categories

- `GET /categories`: Retrieve all categories
- `POST /categories`: Create a new category (admin only)
- `PUT /categories/:id`: Update a category by ID (admin only)
- `DELETE /categories/:id`: Delete a category by ID (admin only)

### News

- `GET /news`: Retrieve all news items
- `GET /news/:id`: Retrieve a specific news item by ID
- `GET /search`: Search for news items
  - Query parameters: keyword, categoryId, authorId
- `POST /news`: Create a new news item (admin only)
- `PUT /news/:id`: Update a news item by ID (admin only)
- `DELETE /news/:id`: Delete a news item by ID (admin only)

## Technologies Used

- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer
- **Documentation:** Swagger
