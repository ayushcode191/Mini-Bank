const Account = require("../models/Account");

const ACCOUNT_NO_REGEX = /^\d{10}$/;
const MAX_AMOUNT = 1000000000;
const MAX_DECIMAL_PRECISION = 2;

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const normalizeAccountNo = (accountNo, fieldName = "accountNo") => {
  const normalized = String(accountNo ?? "").trim();
  if (!normalized) {
    throw createValidationError(`${fieldName} is required`);
  }
  if (!ACCOUNT_NO_REGEX.test(normalized)) {
    throw createValidationError(
      `${fieldName} must be exactly 10 digits`
    );
  }
  return normalized;
};

const normalizeHolderName = (holderName) => {
  const value = String(holderName ?? "").trim().replaceAll(/\s+/g, " ");
  if (!value) {
    throw createValidationError("holderName is required");
  }
  if (value.length < 3 || value.length > 60) {
    throw createValidationError("holderName must be between 3 and 60 characters");
  }
  return value;
};

const toCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const hasMoreThanTwoDecimals = (value) =>
  Math.round(value * 10 ** MAX_DECIMAL_PRECISION) !== value * 10 ** MAX_DECIMAL_PRECISION;

const parseNonNegativeMoney = (amount, fieldLabel) => {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) {
    throw createValidationError(`${fieldLabel} must be a valid non-negative number`);
  }
  if (hasMoreThanTwoDecimals(value)) {
    throw createValidationError(`${fieldLabel} can have at most 2 decimal places`);
  }
  if (value > MAX_AMOUNT) {
    throw createValidationError(`${fieldLabel} cannot be more than ${MAX_AMOUNT}`);
  }
  return toCurrency(value);
};

const parseAmount = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw createValidationError("Amount must be a valid number greater than 0");
  }
  if (value > MAX_AMOUNT) {
    throw createValidationError(`Amount cannot be more than ${MAX_AMOUNT}`);
  }
  if (hasMoreThanTwoDecimals(value)) {
    throw createValidationError("Amount can have at most 2 decimal places");
  }
  return toCurrency(value);
};

const getAccountByNo = async (accountNo, fieldName = "accountNo") => {
  const normalizedAccountNo = normalizeAccountNo(accountNo, fieldName);
  const account = await Account.findOne({ accountNo: normalizedAccountNo });
  if (!account) {
    const error = new Error(`Account not found: ${accountNo}`);
    error.statusCode = 404;
    throw error;
  }
  return account;
};

const createAccount = async (req, res, next) => {
  try {
    const { accountNo, holderName, balance = 0, isKYCVerified = false } = req.body;
    const initialBalance = parseNonNegativeMoney(balance, "Initial balance");

    const account = await Account.create({
      accountNo: normalizeAccountNo(accountNo),
      holderName: normalizeHolderName(holderName),
      balance: initialBalance,
      isKYCVerified: Boolean(isKYCVerified),
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: account,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.statusCode = 409;
      err.message = "Account number already exists";
    }
    next(err);
  }
};

const listAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json({ success: true, data: accounts });
  } catch (err) {
    next(err);
  }
};

const depositMoney = async (req, res, next) => {
  try {
    const { accountNo, amount } = req.body;
    const parsedAmount = parseAmount(amount);
    const account = await getAccountByNo(accountNo);

    account.balance = toCurrency(account.balance + parsedAmount);
    await account.save();

    res.json({
      success: true,
      message: "Deposit successful",
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

const withdrawMoney = async (req, res, next) => {
  try {
    const { accountNo, amount } = req.body;
    const parsedAmount = parseAmount(amount);
    const account = await getAccountByNo(accountNo);

    if (account.balance < parsedAmount) {
      const error = new Error("Insufficient balance");
      error.statusCode = 400;
      throw error;
    }

    account.balance = toCurrency(account.balance - parsedAmount);
    await account.save();

    res.json({
      success: true,
      message: "Withdrawal successful",
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

const transferMoney = async (req, res, next) => {
  try {
    const { senderAccount, receiverAccount, amount } = req.body;
    const parsedAmount = parseAmount(amount);
    const senderNo = normalizeAccountNo(senderAccount, "senderAccount");
    const receiverNo = normalizeAccountNo(receiverAccount, "receiverAccount");

    if (senderNo === receiverNo) {
      throw createValidationError("Sender and receiver accounts must be different");
    }

    const sender = await getAccountByNo(senderNo, "senderAccount");
    const receiver = await getAccountByNo(receiverNo, "receiverAccount");

    if (!sender.isKYCVerified) {
      throw createValidationError("Transfer failed: sender KYC is not verified");
    }

    if (sender.balance < parsedAmount) {
      throw createValidationError("Transfer failed: insufficient sender balance");
    }

    sender.balance = toCurrency(sender.balance - parsedAmount);
    receiver.balance = toCurrency(receiver.balance + parsedAmount);

    await Promise.all([sender.save(), receiver.save()]);

    res.json({
      success: true,
      message: "Transfer successful",
      data: {
        sender,
        receiver,
        transferredAmount: parsedAmount,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAccount,
  listAccounts,
  depositMoney,
  withdrawMoney,
  transferMoney,
};
