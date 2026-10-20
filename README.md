# AnnStream API

This is a production-ready RESTful API for a modern job application platform. Built with Node.js, Express, MongoDB, and Cloudinary, **AnnStream API** provides secure authentication, role-based authorization, dynamic job management, stream-based media uploads, and application tracking.

---

## Tech Stack

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database & ORM:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
* **File Processing & Cloud Storage:** Multer (`memoryStorage`) & Cloudinary SDK
* **Validation & Security:** Joi 

---

## Features alreaady Implemented

### 1. Authentication & Role-Based Security
* **JWT Authentication:** Stateful token validation via `authRequired` middleware.
* **Granular Role Authorization (`authorize`):** Role-based access control for `applicant`, `employer`, and `admin`.
* **Global Admin Bypass:** Centralized authorization logic allowing `admin` accounts seamless access across restricted endpoints without route bloating.

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

---
## 📡 API Endpoints Overview

### Authentication & User Routes (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/signup` | Public | Register a new user (`applicant` or `employer`), returns a token (they get logged in upon registration) |
| `POST` | `/api/users/login` | Public | Authenticate user & return JWT token (returning user) |
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


## Roadmap & Future Enhancements

The following features and optimization pipelines are scheduled for upcoming releases:

### 1. Rate Limiting & Security Hardening
* **IP-based Rate Limiting:** Integrate `express-rate-limit` to protect public endpoints (`/api/users/login`, `/api/applications`) against brute-force and DDoS attacks.
* **HTTP Security Headers:** Add `helmet` to manage security headers and sanitize inputs against NoSQL injection (`express-mongo-sanitize`).

### 2. Automated Email Notifications
* **Transactional Mail System:** Implement Nodemailer with SendGrid for automated email triggers:
  * Welcome email upon user registration.
  * Application submission confirmation to applicants.
  * Real-time notification to employers when a new application is submitted.
  * Application status change alerts (e.g., shortlisted, interviewed, hired).

### 3. Analytics & Reporting Engine
* **Employer Dashboard Metrics:** Aggregate statistics on job view counts, total applications per posting, and applicant conversion rates.
* **Platform Health Analytics:** Admin-level reporting tracking active users, monthly applications, and system storage metrics.

### 4. SEO, OpenGraph & Metadata Optimization
* **Structured Data Endpoints:** Expose JSON-LD schema formatted endpoints for job listings to allow auto-indexing on Google Jobs.
* **Dynamic OpenGraph Meta Generation:** Pre-render meta tags for individual job URLs to display rich previews (Job Title, Company Name, Location) when shared on LinkedIn or Twitter/X.

### 5. Interactive API Documentation
* **Swagger Integration:** Auto-generate interactive API documentation (`/api/docs`) for client-side developers and external integrations.


---

###  Postman Collection

## API Testing with Postman

A pre-configured Postman collection is available for testing endpoints:

1. Clone this repository into your local machine
2. Import the collection into Postman from `/docs/AnnStream-API.postman_collection.json` (or set up a new request group).
3. Set up an environment variable (e.g., `http://localhost:4200/api`).
4. For protected endpoints:
   * Execute the `POST /api/users/signup` or `POST /api/users/login`request.
   * Copy the returned JWT token.
   * In protected requests, navigate to **Authorization** -> **Bearer Token** and paste the token.
All routes (GET, POST, PUT, DELETE) will be automatically loaded and ready to test with authorization
```

