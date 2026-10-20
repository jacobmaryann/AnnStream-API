# AnnStream API

This is a RESTful API for a modern job application platform, built with **Node.js, Express, MongoDB, and Cloudinary**.

**AnnStream API** provides the backend functionality for a job platform where applicants can discover opportunities, submit applications, and manage their profiles, while employers can publish job listings and manage incoming applications.

The API includes JWT-based authentication, role-based authorization, request validation, resume uploads, job search, pagination, and application status management.

The project is actively evolving, with additional security enhancements, interactive API documentation, and platform improvements planned for future iterations.

## Live Demo

- **Live API:** https://annstream-api.onrender.com
- **Source Code:** (https://github.com/jacobmaryann/AnnStream-API)
- **Postman Collection:** `AnnStream API.postman_collection.json` 

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture and Access Control](#architecture-and-access-control)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Testing with Postman](#testing-with-postman)
- [Roadmap](#roadmap)


## Overview

AnnStream API is designed around the core workflows of a job application platform. It separates responsibilities between applicants, employers, and administrators through role-based access control while maintaining relationships between users, job listings, and applications.

The API supports the following workflows:

- Applicants can create accounts, manage their profiles, browse available jobs, upload resumes, and submit applications.
- Employers can publish and manage job listings, review applications associated with their jobs, and update application statuses.
- Administrators can access supported restricted operations through centralized authorization.

The API is designed to serve as a backend for web or mobile clients and can be tested independently using HTTP requests and the provided Postman collection.


## Tech Stack

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database & ORM:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
* **File Processing & Cloud Storage:** Multer (`memoryStorage`) & Cloudinary SDK
* **Validation & Security:** Joi 
* **HTTP request logging** Morgan

## Features alreaady Implemented

### 1. Authentication & Role-Based Security
**JWT Authentication:** Secure token-based authentication using JWT verification and MongoDB user lookups to validate authenticated users on protected routes
* **Granular Role Authorization (`authorize`):** Role-based access control for `applicant`, `employer`, and `admin`.
* **Centralized Role-Based Authorization:** Centralized authorization logic allowing `admin` accounts seamless access across restricted endpoints without route bloating.

### 2. Media & Document Management (Cloudinary + Multer)
* **Memory Buffer Streaming:** Zero local disk retention; uploads are handled entirely in memory (`Multer.memoryStorage()`) and streamed directly to Cloudinary.
* **Resume Submissions:** Supports PDF resume uploads up to 2MB with custom limits and folder organization (`/resumes`).
* **Profile Picture Updates:** Dual-mode Cloudinary stream supporting direct image uploads with auto-resource detection (`/profile-pictures`).
* **Duplicate Prevention & Error Guardrails:** Graceful exception handling for file boundaries, stream closures, and validation failures.

### 3. Job Management
* **MongoDB Text Indexing:** Full-text search capabilities across job titles, descriptions, and required skills for fast keyword querying.
* **Paginated Results:** Dynamic API response pagination using `page` and `limit` parameters.
* **Flexible Work Models:** Native support for `remote`, `on-site`, and `hybrid` job classifications.
* **Employer Management:** Creation, update, and retrieval of job postings linked to employer profiles.
* **Strict Schema Validation:** Automated body validation ensuring all job payloads strictly conform to expectations before reaching controller logic.

### 4. Application Processing
* **Application Lifecycle:** Applicants can browse jobs, attach resumes, provide cover letters, and submit applications.
* **Single-Application Guard:** Automated query check preventing applicants from submitting multiple applications for the same job.
* **Status Updates:** Employers and Admins can view job applicants and update application statuses (`submitted`, `in-review`, `accepted`, `rejected`).

## Architecture and Access Control

AnnStream API follows a modular Express application structure, separating server configuration, routes, middleware, data models, and request-handling logic.

The main responsibilities are:

- **Routes:** Define API endpoints and connect requests to their handlers.
- **Middleware:** Handle authentication, authorization, and request processing.
- **Models:** Represent application entities and database relationships using Mongoose.
- **Controllers:** Implement business logic for users, jobs, and applications.
- **Cloudinary integration:** Handle cloud-based storage for uploaded resumes and profile pictures.
- **Validators:** Handles user inputs

### User Roles

| Role | Primary Responsibilities |
|---|---|
| Applicant | Manage profile, browse jobs, submit applications, and view personal applications |
| Employer | Manage job listings and review or update applications associated with their jobs |
| Admin | Access supported restricted operations through centralized authorization |

Authorization is enforced on protected routes. Resource ownership restrictions depend on the corresponding authorization and controller checks.

## API Endpoints Overview

The API is organized around three main resource groups.

### Authentication & User Routes (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/auth/signup` | Public | Register a new user (`applicant` or `employer`), returns a token (they get logged in upon registration) |
| `POST` | `/api/users/auth/login` | Public | Authenticate user & return JWT token (returning user) |
| `GET` | `/api/users/profile` | Private | Get user profile   |
| `PATCH` | `/api/users/profile/picture` | Private | Upload/Update user profile image (`profilePicture`) |


### Job Routes (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Retrieve all active job postings |
| `GET` | `/api/jobs/:id` | Public | Retrieve specific job details |
| `POST` | `/api/jobs` | Employer / Admin | Create a new job listing |
| `PATCH` | `/api/jobs/:id` | Employer / Admin | Update an existing job listing |
| `DELETE` | `/api/jobs/:id` | Employer / Admin | Delete a job listing |

### Application Routes (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications` | Applicant / Admin | Apply for a job (Requires `jobId`, `coverLetter`, `resume` file) |
| `GET` | `/api/applications` | Applicant | Retrieve current user's job applications |
| `GET` | `/api/applications/job/:jobId` | Employer / Admin | Retrieve all applications for a specific job |
| `PATCH` | `/api/applications/:id/status` | Employer / Admin | Update application status (`submitted`, `accepted`, etc.) |


Application submission uses `multipart/form-data` containing the required job ID, cover letter, and resume file.

> Endpoint access labels and request formats should match the actual route and middleware implementation.

## Getting Started

You can run AnnStream API locally to explore its endpoints and test its workflows.

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm
- A MongoDB database, local or hosted
- A Cloudinary account for media uploads
- [Postman](https://www.postman.com/) for API testing

### 1. Clone the Repository

```bash
git clone https://github.com/jacobmaryann/AnnStream-API.git
cd AnnStream-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root, using `.env.example` as a reference if available.

```env
PORT=your PORT number
MongoDB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

Use the exact variable names expected by the application and configure any additional settings required by your Cloudinary integration.

**Important:** Never commit real credentials, database connection strings, JWT secrets, or other sensitive environment values to version control.

### 4. Start the Server

For development:

```bash
npm run dev
```

For a standard start:

```bash
npm start
```

The server will listen on the configured port. If you use port `4200`, the local base URL will typically be:

```text
http://localhost:4200
```

The API routes are mounted under `/api`, subject to the server configuration.

## Testing with Postman

A Postman collection is included in the repository to help you explore the available endpoints.

### Import the Collection

1. Clone the repository or download the collection file.
2. Open Postman.
3. Select **Import** and choose `AnnStream API.postman_collection.json`.
4. Set the base URL to the deployed API URL at the top of this README
For local development, the base URL will generally be:

```text
http://localhost:4200/api
```

For deployment, use the actual API URL followed by `/api`, as appropriate for the server configuration.

### Test Authenticated Endpoints

1. Register an applicant or employer using `POST /users/auth/signup`, or sign in using `POST /users/auth/login`.
2. Copy the JWT returned in the response.
3. Open a protected request in Postman.
4. Select **Authorization → Bearer Token**.
5. Paste the token and send the request.

Use accounts with the appropriate roles to test protected functionality (`applicant`, `employer`). 
For application submissions, select `multipart/form-data` and provide the required job ID, cover letter, and resume file.

## Roadmap & future enhancement

AnnStream API is being developed incrementally. The following enhancements are planned to expand its security controls, developer experience, and platform capabilities.

### 1. Security Hardening

- Introduce configurable rate limiting for sensitive and public-facing endpoints.
- Integrate Helmet to strengthen HTTP security headers.
- Evaluate and integrate appropriate NoSQL injection protection.
- Continue reviewing authentication, authorization, and input-handling behavior.

### 2. Interactive API Documentation

- Integrate Swagger UI for interactive API exploration.
- Define and maintain an OpenAPI specification.
- Document endpoint parameters, request bodies, response formats, authentication requirements, and common error responses.
- Make it easier for frontend developers and external consumers to integrate with the API.

### 3. Automated Email Notifications

- Send welcome emails after registration.
- Notify applicants when applications are submitted.
- Notify employers when new applications arrive.
- Send notifications when application statuses change.
- Integrate a transactional email provider.

### 4. Analytics and Reporting

- Provide employer-facing job and application statistics.
- Track application volumes and status distributions.
- Introduce administrative platform metrics.
- Explore reporting endpoints for operational insights.

### 5. Search and Discoverability

- Evaluate structured job data for improved search-engine discoverability.
- Explore metadata and Open Graph support for job-sharing experiences.
- Improve how job listings can be surfaced and shared by client applications.

Roadmap items represent planned enhancements, not existing functionality. The documentation will evolve alongside the implementation.


## Acknowledgements

AnnStream API brings together established tools from the Node.js ecosystem to implement the core backend workflows of a job application platform.

The project will continue to evolve through iterative development, testing, and planned enhancements.

---

