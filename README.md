# Invoice Backend API

## Tech Stack
- Node.js + Express, TypeScript, PostgreSQL, TypeORM, JWT

## Setup

1. Clone repository:- https://github.com/MuhammadAnasRasheed/Invoice-Management-System-backend.git
2. Run `npm install`
3. Create `.env` file with:
   - `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
4. Run `npm run dev`

## API Endpoints

### Users
- POST /api/users/register - Register
- POST /api/users/login - Login
- GET /api/users/me - Get profile

### Customers
- GET /api/customers - Get all (supports ?search=name)
- POST /api/customers - Create
- PUT /api/customers/:id - Update
- DELETE /api/customers/:id - Delete

### Invoices
- GET /api/invoices - Get all (supports ?search=number)
- POST /api/invoices - Create
- GET /api/invoices/customer/:customerId - Get by customer
- PATCH /api/invoices/:id/status - Update status
- DELETE /api/invoices/:id - Delete

## Live API
[Link to deployed backend]