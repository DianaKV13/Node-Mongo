# Node-Mongo (Business Cards API)

A REST API built with **Node.js, Express, and MongoDB** for managing users and business cards.  
Includes authentication (JWT), validation (Joi), logging (Morgan), and seeding initial data.

---

## Features
- User registration & login with hashed passwords (bcrypt)
- JWT authentication & role-based access (Admin, Business, Regular user)
- Business card CRUD operations
- Like/unlike cards
- Logging with Morgan + file logger (bonus)
- Data validation with Joi
- MongoDB models with Mongoose
- Initial seed data (3 users + 3 cards)

---

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/Node-Mongo.git
   cd Node-Mongo
