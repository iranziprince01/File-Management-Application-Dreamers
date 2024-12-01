# Multilingual File Manager Application

A robust file management system with multilingual support, enabling users to upload, retrieve, update, and delete files seamlessly. The application leverages modern frameworks and libraries to deliver a dynamic and user-friendly experience.

---

## Features

- **Multilingual Support**: Easily switch between supported languages using query parameters or headers.
- **File Management**: Upload, view, update, and delete files.
- **Secure Access**: Protected routes with JWT-based authentication.
- **Swagger Integration**: Comprehensive API documentation with Swagger UI.
- **Optimized Middleware**: Efficient request handling using custom middleware.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (or replace with preferred database)
- **Authentication**: JWT
- **File Upload**: Multer
- **Localization**: i18n
- **API Documentation**: Swagger

---

## 📚 Installation

### Prerequisites
- Node.js (v16 or later)
- npm (v8 or later)
- MongoDB

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/iranziprince01/multilingual-file-manager-dreamers.git
   cd multilingual-file-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for environment variables:
   ```plaintext
   PORT=3000
   JWT_SECRET=your_secret_key
   DB_URI=mongodb://localhost:27017/file-manager
   ```
   Adjust these values as per your environment.

4. Start the server:
   ```bash
   npm start
   ```

5. Access the application:
   - API: `http://localhost:3000/api`
   - Swagger UI: `http://localhost:3000/api-docs`

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/signup` - Register a new user

### File Management
- `POST /api/files/upload` - Upload a file
- `GET /api/files` - Retrieve all files
- `PUT /api/files/:id` - Update a file by ID
- `DELETE /api/files/:id` - Delete a file by ID

### Multilingual Support
Add the `lang` query parameter or `Accept-Language` header to specify the language. 

---

## Development

### Run in Development Mode
```bash
npm run dev
```

### Run Tests
Add your test scripts to the `test` folder and configure them in `package.json`.  
Run tests using:
```bash
npm test
```

---

## Documentation

API documentation is automatically generated and accessible via Swagger UI at `/api-docs`.  
To modify or extend the documentation, update the `swagger.js` and route comments.

---

## 👨‍💻 Author

Developed by **Prince & Manzi**.
