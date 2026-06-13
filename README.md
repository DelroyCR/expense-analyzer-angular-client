# Expense Analyzer Angular Client

Angular frontend for **Expense Analyzer V1**, a full-stack personal finance project built with an ASP.NET Core Web API backend.

This client allows users to register, log in, access protected pages with JWT authentication, view and filter imported transactions, and upload CSV files.

## Features

* User registration
* User login with JWT authentication
* Protected routes with Angular route guards
* JWT interceptor for authenticated API requests
* Dashboard page
* Transaction list
* Transaction filtering by:
  * Date range
  * Minimum amount
  * Maximum amount
  * Description
  * Import job ID
* Transaction sorting by:
  * Date
  * Amount
* Pagination
* CSV file upload
* Frontend validations
* Session expiration handling
* Basic navigation between main pages

## Tech Stack

* Angular
* TypeScript
* Reactive Forms
* Angular Router
* Angular HTTP Client
* JWT authentication
* ASP.NET Core Web API backend

## Related Backend Repository

This frontend consumes the Expense Analyzer V1 API.

Backend repository:

```
https://github.com/DelroyCR/expense-analyzer-api
```

The backend provides:

* Authentication endpoints
* JWT generation and validation
* Protected transaction endpoints
* CSV import endpoint
* PostgreSQL persistence
* Filtering, sorting and pagination logic

## Local Development

### Requirements

* Node.js
* Angular CLI
* Expense Analyzer V1 backend running locally

### Backend URL

The Angular client expects the backend API to run at:

```
http://localhost:5268
```

This value is configured in:

```
src/app/core/api/api.config.ts
```

Example:

```
export const API_BASE_URL = 'http://localhost:5268';
```

### Install dependencies

```
npm install
```

### Run the Angular app

On Windows PowerShell, use:

```
ng.cmd serve -o
```

The frontend will run at:

```
http://localhost:4200
```

=======
## Main Routes

```
/login
/register
/dashboard
/transactions
/imports
```

## Authentication Flow

1. User creates an account using `/register`.
2. User logs in using `/login`.
3. Backend validates the credentials.
4. Backend returns a JWT.
5. Angular stores the token in localStorage.
6. The HTTP interceptor sends the token in protected requests:

```
Authorization: Bearer <token>
```
7. Protected backend endpoints validate the JWT.

## Transaction Features

The `/transactions` page allows users to view imported transactions and apply filters.

Supported filters:

```
From
To
MinAmount
MaxAmount
Description
ImportJobId
PageNumber
PageSize
SortBy
SortDirection
```

The frontend also validates common invalid inputs before calling the backend, such as:

* From date greater than To date
* Negative minimum amount
* Negative maximum amount
* Minimum amount greater than maximum amount

## CSV Import

The `/imports` page allows users to upload CSV files.

The frontend validates:

* A file was selected
* The file has `.csv` extension
* The file is not empty

After upload, the user receives feedback indicating how many rows were imported and skipped.

## Session Expiration

If the backend returns `401 Unauthorized`, the frontend removes the stored token and shows a clear message asking the user to log in again.

## Project Status

Completed:

* Authentication
* Register/Login
* Protected routes
* Dashboard
* Transactions page
* Filters and pagination
* CSV upload
* Basic navigation
* Frontend validations

Potential future improvements:

* Refresh tokens
* Global error interceptor
* Better UI components
* Charts and summaries
* Deployment
* End-to-end tests

## Portfolio Summary

Expense Analyzer Angular Client is the frontend for a full-stack financial transaction analysis project. It shows Angular fundamentals, API integration, JWT authentication, protected routes, reactive forms, frontend validation, and interaction with a real ASP.NET Core backend.