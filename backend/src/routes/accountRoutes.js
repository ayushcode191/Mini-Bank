const express = require("express");
const {
  createAccount,
  listAccounts,
  depositMoney,
  withdrawMoney,
  transferMoney,
} = require("../controllers/accountController");

const router = express.Router();

router.post("/accounts", createAccount);
router.get("/accounts", listAccounts);
router.post("/transactions/deposit", depositMoney);
router.post("/transactions/withdraw", withdrawMoney);
router.post("/transactions/transfer", transferMoney);

module.exports = router;