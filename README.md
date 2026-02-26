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
  "accountNo": "9876543210",
  "holderName": "Rahul Sharma",
  "balance": 1000,
  "isKYCVerified": true
}
```

Deposit:

```json
{
  "accountNo": "9876543210",
  "amount": 500
}
```

Withdraw:

```json
{
  "accountNo": "9876543210",
  "amount": 200
}
```

Transfer:

```json
{
  "senderAccount": "9876543210",
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

## Interview Notes (Quick Explain)

- Controller has reusable validators (`normalizeAccountNo`, `normalizeHolderName`, amount parsers).
- All business-rule failures return structured API errors with proper status codes.
- Money values are rounded to 2 decimals to avoid floating-point drift in repeated operations.
- Frontend shows both toast notifications and an output panel for user feedback.

## Deployment (Mandatory)

You need **public live URLs**. Recommended simple combo:

### Backend on Render

1. Push repo to GitHub.
2. Create new Web Service on Render from `backend` folder.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env vars:
   - `MONGO_URI`
   - `CLIENT_URL` (your Vercel frontend URL)
6. Copy deployed backend URL, e.g. `https://your-backend.onrender.com`

### Frontend on Vercel

1. Import repo in Vercel.
2. Set root directory as `frontend`.
3. Add env var:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy and get live frontend URL.

## Submission Checklist

- GitHub Repository Link: Yes
- Live Deployment URL: Yes
- README.md: Yes
- 2-minute Demo Video: Record after deployment
- Minimum 3 commits: Do at least these commits:
  1. `feat: setup backend APIs and validation`
  2. `feat: add React UI screens and output panel`
  3. `docs: add README and deployment steps`

## Notes for Review Criteria

- Functionality: All mandatory features included
- Logic: Transfer validations implemented
- UI: All required screens included
- Code Quality: Modular backend/frontend structure
- Error Handling: Invalid input and validation errors handled
- Explanation: This README + API structure is interview-friendly
