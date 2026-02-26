# Online Bank Mini System (React + MongoDB)

Assignment-ready full-stack project with all mandatory features:

- Create Account
- Deposit Money
- Withdraw Money
- Transfer Money with validations:
  - Sender KYC must be verified
  - Sender must have sufficient balance
  - Error message on validation failure
- UI includes:
  - Account creation screen
  - Transaction screens
  - Account listing screen
  - Output display panel

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)

## Project Structure

```txt
backend/
frontend/
README.md
```

## 1) Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Put your MongoDB URL in `backend/.env`:

```env
PORT=5000
MONGO_URI=your_real_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

Backend API base: `http://localhost:5000/api`

## 2) Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Set API URL in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints

- `POST /api/accounts` -> Create account
- `GET /api/accounts` -> List all accounts
- `POST /api/transactions/deposit` -> Deposit
- `POST /api/transactions/withdraw` -> Withdraw
- `POST /api/transactions/transfer` -> Transfer

### Sample payloads

Create account:

```json
{
  "accountNo": "8876543210",
  "holderName": "Ayush Bansal",
  "balance": 1000,
  "isKYCVerified": true
}
```

Deposit:

```json
{
  "accountNo": "8876543210",
  "amount": 500
}
```

Withdraw:

```json
{
  "accountNo": "8876543210",
  "amount": 200
}
```

Transfer:

```json
{
  "senderAccount": "8876543210",
  "receiverAccount": "8765432109",
  "amount": 300
}
```

## Validation Summary

- `accountNo`: exactly 10 digits.
- `holderName`: required, 3 to 60 characters.
- `balance`/`amount`: numeric values with max 2 decimal places.
- transfer checks:
  - sender must be KYC verified
  - sender and receiver must be different
  - sender must have sufficient balance





