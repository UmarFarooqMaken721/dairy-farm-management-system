var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../api/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_express10 = __toESM(require("express"));
var import_mongoose9 = __toESM(require("mongoose"));
var import_cors = __toESM(require("cors"));
var import_dotenv = __toESM(require("dotenv"));

// src/routes/authRoutes.ts
var import_express = require("express");

// src/controllers/authController.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/models/User.ts
var import_mongoose = __toESM(require("mongoose"));
var UserSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "worker"], default: "admin" }
}, { timestamps: true });
var User_default = import_mongoose.default.model("User", UserSchema);

// src/controllers/authController.ts
var register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const exists = await User_default.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const hashed = await import_bcryptjs.default.hash(password, 10);
    const user = await User_default.create({ name, email, password: hashed });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Registration failed" });
  }
};
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User_default.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials (User not found)" });
    const match = await import_bcryptjs.default.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials (Wrong password)" });
    const jwtSecret = process.env.JWT_SECRET || "dairy_secret_jwt_key_2026";
    const token = import_jsonwebtoken.default.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
};

// src/routes/authRoutes.ts
var router = (0, import_express.Router)();
router.post("/register", register);
router.post("/login", login);
var authRoutes_default = router;

// src/routes/animalRoutes.ts
var import_express2 = require("express");

// src/models/Animal.ts
var import_mongoose2 = __toESM(require("mongoose"));
var AnimalSchema = new import_mongoose2.Schema({
  tagNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["cow", "buffalo"], required: true },
  breed: String,
  age: Number,
  purchaseDate: Date,
  status: { type: String, enum: ["active", "sold", "dead"], default: "active" }
}, { timestamps: true });
var Animal_default = import_mongoose2.default.model("Animal", AnimalSchema);

// src/models/MilkRecord.ts
var import_mongoose3 = __toESM(require("mongoose"));
var MilkSchema = new import_mongoose3.Schema({
  animal: { type: import_mongoose3.Schema.Types.ObjectId, ref: "Animal" },
  date: { type: Date, required: true },
  morningQty: { type: Number, default: 0 },
  eveningQty: { type: Number, default: 0 },
  ratePerLiter: { type: Number, required: true }
}, { timestamps: true });
var MilkRecord_default = import_mongoose3.default.model("MilkRecord", MilkSchema);

// src/controllers/animalController.ts
var getAnimals = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    const filter = {};
    if (type && type !== "all") filter.type = type;
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { tagNumber: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } }
      ];
    }
    const animals = await Animal_default.find(filter).sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var getAnimalById = async (req, res) => {
  try {
    const animal = await Animal_default.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    const milkRecords = await MilkRecord_default.find({ animal: req.params.id }).sort({ date: -1 });
    const totalMilk = milkRecords.reduce((acc, r) => acc + (r.morningQty || 0) + (r.eveningQty || 0), 0);
    res.json({
      animal,
      totalMilk,
      milkRecords
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var createAnimal = async (req, res) => {
  try {
    const animal = await Animal_default.create(req.body);
    res.status(201).json(animal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var updateAnimal = async (req, res) => {
  try {
    const animal = await Animal_default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    res.json(animal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var deleteAnimal = async (req, res) => {
  try {
    await Animal_default.findByIdAndDelete(req.params.id);
    res.json({ message: "Animal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/middleware/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// src/routes/animalRoutes.ts
var router2 = (0, import_express2.Router)();
router2.use(protect);
router2.get("/", getAnimals);
router2.get("/:id", getAnimalById);
router2.post("/", createAnimal);
router2.put("/:id", updateAnimal);
router2.delete("/:id", deleteAnimal);
var animalRoutes_default = router2;

// src/routes/milkRoutes.ts
var import_express3 = require("express");

// src/controllers/milkController.ts
var getMilk = async (req, res) => {
  try {
    const { startDate, endDate, animal } = req.query;
    const filter = {};
    if (animal) {
      filter.animal = animal;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }
    const records = await MilkRecord_default.find(filter).populate("animal").sort({ date: -1 });
    const totalMorning = records.reduce((s, r) => s + (r.morningQty || 0), 0);
    const totalEvening = records.reduce((s, r) => s + (r.eveningQty || 0), 0);
    const totalMilk = totalMorning + totalEvening;
    const totalRevenue = records.reduce((s, r) => s + ((r.morningQty || 0) + (r.eveningQty || 0)) * (r.ratePerLiter || 0), 0);
    res.json({
      records,
      summary: {
        totalMorning,
        totalEvening,
        totalMilk,
        totalRevenue,
        avgRate: records.length > 0 ? totalRevenue / (totalMilk || 1) : 0
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var createMilk = async (req, res) => {
  try {
    const { animal, date, morningQty, eveningQty, ratePerLiter } = req.body;
    const record = await MilkRecord_default.create({
      animal: animal || void 0,
      date: date ? new Date(date) : /* @__PURE__ */ new Date(),
      morningQty: Number(morningQty) || 0,
      eveningQty: Number(eveningQty) || 0,
      ratePerLiter: Number(ratePerLiter) || 0
    });
    const populated = await record.populate("animal");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var deleteMilk = async (req, res) => {
  try {
    await MilkRecord_default.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/routes/milkRoutes.ts
var router3 = (0, import_express3.Router)();
router3.use(protect);
router3.get("/", getMilk);
router3.post("/", createMilk);
router3.delete("/:id", deleteMilk);
var milkRoutes_default = router3;

// src/routes/expenseRoutes.ts
var import_express4 = require("express");

// src/models/Expense.ts
var import_mongoose4 = __toESM(require("mongoose"));
var ExpenseSchema = new import_mongoose4.Schema({
  category: { type: String, enum: ["chara", "dawa", "tankha", "bijli", "maintenance", "other"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: String
}, { timestamps: true });
var Expense_default = import_mongoose4.default.model("Expense", ExpenseSchema);

// src/controllers/expenseController.ts
var getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }
    const expenses = await Expense_default.find(filter).sort({ date: -1 });
    const categoryTotals = {
      chara: 0,
      dawa: 0,
      tankha: 0,
      bijli: 0,
      maintenance: 0,
      other: 0
    };
    let totalAmount = 0;
    expenses.forEach((e) => {
      totalAmount += e.amount;
      if (categoryTotals[e.category] !== void 0) {
        categoryTotals[e.category] += e.amount;
      } else {
        categoryTotals.other += e.amount;
      }
    });
    res.json({
      expenses,
      totalAmount,
      categoryTotals
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var createExpense = async (req, res) => {
  try {
    const { category, amount, date, note } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount are required" });
    }
    const expense = await Expense_default.create({
      category,
      amount: Number(amount),
      date: date ? new Date(date) : /* @__PURE__ */ new Date(),
      note
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var deleteExpense = async (req, res) => {
  try {
    await Expense_default.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/routes/expenseRoutes.ts
var router4 = (0, import_express4.Router)();
router4.use(protect);
router4.get("/", getExpenses);
router4.post("/", createExpense);
router4.delete("/:id", deleteExpense);
var expenseRoutes_default = router4;

// src/routes/customerRoutes.ts
var import_express5 = require("express");

// src/models/Customer.ts
var import_mongoose5 = __toESM(require("mongoose"));
var CustomerSchema = new import_mongoose5.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  balance: { type: Number, default: 0 }
}, { timestamps: true });
var Customer_default = import_mongoose5.default.model("Customer", CustomerSchema);

// src/models/Sale.ts
var import_mongoose6 = __toESM(require("mongoose"));
var SaleSchema = new import_mongoose6.Schema({
  customer: { type: import_mongoose6.Schema.Types.ObjectId, ref: "Customer", required: true },
  milkQty: { type: Number, required: true, min: 0.1 },
  rate: { type: Number, required: true, min: 1 },
  amount: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now },
  note: { type: String }
}, { timestamps: true });
var Sale_default = import_mongoose6.default.model("Sale", SaleSchema);

// src/models/Payment.ts
var import_mongoose7 = __toESM(require("mongoose"));
var PaymentSchema = new import_mongoose7.Schema({
  customer: { type: import_mongoose7.Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ["cash", "jazzcash", "easypaisa", "bank"],
    default: "cash"
  },
  note: { type: String }
}, { timestamps: true });
var Payment_default = import_mongoose7.default.model("Payment", PaymentSchema);

// src/controllers/customerController.ts
var getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }
    const customers = await Customer_default.find(filter).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var getCustomerById = async (req, res) => {
  try {
    const customer = await Customer_default.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var createCustomer = async (req, res) => {
  try {
    const customer = await Customer_default.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var updateCustomer = async (req, res) => {
  try {
    const customer = await Customer_default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var deleteCustomer = async (req, res) => {
  try {
    await Customer_default.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var getCustomerLedger = async (req, res) => {
  try {
    const customer = await Customer_default.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    const sales = await Sale_default.find({ customer: req.params.id }).sort({ date: 1 });
    const payments = await Payment_default.find({ customer: req.params.id }).sort({ date: 1 });
    const entries = [];
    sales.forEach((s) => {
      entries.push({
        id: s._id.toString(),
        date: s.date,
        type: "sale",
        description: `Doodh Farokht (${s.milkQty} Ltr @ Rs ${s.rate})`,
        debit: s.amount,
        credit: 0,
        milkQty: s.milkQty,
        rate: s.rate,
        note: s.note
      });
    });
    payments.forEach((p) => {
      entries.push({
        id: p._id.toString(),
        date: p.date,
        type: "payment",
        description: `Raqam Vasooli (${p.paymentMethod.toUpperCase()})`,
        debit: 0,
        credit: p.amount,
        paymentMethod: p.paymentMethod,
        note: p.note
      });
    });
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let runningBalance = 0;
    const ledgerWithBalance = entries.map((entry) => {
      runningBalance += entry.debit - entry.credit;
      return {
        ...entry,
        runningBalance
      };
    });
    const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalPayments = payments.reduce((acc, p) => acc + p.amount, 0);
    res.json({
      customer,
      totalSales,
      totalPayments,
      currentBalance: customer.balance,
      transactions: ledgerWithBalance.reverse()
      // show latest first for display
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/routes/customerRoutes.ts
var router5 = (0, import_express5.Router)();
router5.use(protect);
router5.get("/", getCustomers);
router5.get("/:id/ledger", getCustomerLedger);
router5.get("/:id", getCustomerById);
router5.post("/", createCustomer);
router5.put("/:id", updateCustomer);
router5.delete("/:id", deleteCustomer);
var customerRoutes_default = router5;

// src/routes/orderRoutes.ts
var import_express6 = require("express");

// src/models/Order.ts
var import_mongoose8 = __toESM(require("mongoose"));
var OrderSchema = new import_mongoose8.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: "Liter" },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending"
  },
  notes: { type: String },
  deliveryDate: { type: Date }
}, { timestamps: true });
var Order_default = import_mongoose8.default.model("Order", OrderSchema);

// src/controllers/orderController.ts
var createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, product, quantity, unit, totalAmount, notes, deliveryDate } = req.body;
    if (!customerName || !phone || !address || !product || !quantity || !totalAmount) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    const order = await Order_default.create({
      customerName,
      phone,
      address,
      product,
      quantity,
      unit: unit || "Liter",
      totalAmount,
      notes,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : void 0,
      status: "pending"
    });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error placing order" });
  }
};
var getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    const orders = await Order_default.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== void 0) updateData.notes = notes;
    const order = await Order_default.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var deleteOrder = async (req, res) => {
  try {
    const order = await Order_default.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/routes/orderRoutes.ts
var router6 = (0, import_express6.Router)();
router6.post("/", createOrder);
router6.get("/", protect, getOrders);
router6.put("/:id", protect, updateOrderStatus);
router6.delete("/:id", protect, deleteOrder);
var orderRoutes_default = router6;

// src/routes/paymentRoutes.ts
var import_express7 = require("express");

// src/controllers/paymentController.ts
var createPayment = async (req, res) => {
  try {
    const { customer, amount, date, paymentMethod, note } = req.body;
    if (!customer || !amount) {
      return res.status(400).json({ message: "Customer and amount are required" });
    }
    const payment = await Payment_default.create({
      customer,
      amount: Number(amount),
      date: date ? new Date(date) : /* @__PURE__ */ new Date(),
      paymentMethod: paymentMethod || "cash",
      note
    });
    await Customer_default.findByIdAndUpdate(customer, {
      $inc: { balance: -Number(amount) }
    });
    const populated = await payment.populate("customer");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var getPayments = async (req, res) => {
  try {
    const { customer } = req.query;
    const filter = {};
    if (customer) filter.customer = customer;
    const payments = await Payment_default.find(filter).populate("customer").sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var deletePayment = async (req, res) => {
  try {
    const payment = await Payment_default.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    await Customer_default.findByIdAndUpdate(payment.customer, {
      $inc: { balance: payment.amount }
    });
    await Payment_default.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted and customer balance restored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/routes/paymentRoutes.ts
var router7 = (0, import_express7.Router)();
router7.use(protect);
router7.post("/", createPayment);
router7.get("/", getPayments);
router7.delete("/:id", deletePayment);
var paymentRoutes_default = router7;

// src/routes/saleRoutes.ts
var import_express8 = require("express");

// src/controllers/saleController.ts
var createSale = async (req, res) => {
  try {
    const { customer, milkQty, rate, date, note } = req.body;
    if (!customer || !milkQty || !rate) {
      return res.status(400).json({ message: "Customer, milk quantity, and rate are required" });
    }
    const calculatedAmount = req.body.amount ? Number(req.body.amount) : Number(milkQty) * Number(rate);
    const sale = await Sale_default.create({
      customer,
      milkQty: Number(milkQty),
      rate: Number(rate),
      amount: calculatedAmount,
      date: date ? new Date(date) : /* @__PURE__ */ new Date(),
      note
    });
    await Customer_default.findByIdAndUpdate(customer, {
      $inc: { balance: calculatedAmount }
    });
    const populated = await sale.populate("customer");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
var getSales = async (req, res) => {
  try {
    const { customer } = req.query;
    const filter = {};
    if (customer) filter.customer = customer;
    const sales = await Sale_default.find(filter).populate("customer").sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var deleteSale = async (req, res) => {
  try {
    const sale = await Sale_default.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale record not found" });
    await Customer_default.findByIdAndUpdate(sale.customer, {
      $inc: { balance: -sale.amount }
    });
    await Sale_default.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale deleted and customer balance adjusted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/routes/saleRoutes.ts
var router8 = (0, import_express8.Router)();
router8.use(protect);
router8.post("/", createSale);
router8.get("/", getSales);
router8.delete("/:id", deleteSale);
var saleRoutes_default = router8;

// src/routes/reportRoutes.ts
var import_express9 = require("express");

// src/controllers/reportController.ts
var getDailyReport = async (req, res) => {
  try {
    const targetDate = req.query.date ? new Date(req.query.date) : /* @__PURE__ */ new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    const [milkRecords, sales, expenses, payments] = await Promise.all([
      MilkRecord_default.find({ date: { $gte: startOfDay, $lte: endOfDay } }).populate("animal"),
      Sale_default.find({ date: { $gte: startOfDay, $lte: endOfDay } }).populate("customer"),
      Expense_default.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Payment_default.find({ date: { $gte: startOfDay, $lte: endOfDay } }).populate("customer")
    ]);
    const totalMilkMorning = milkRecords.reduce((acc, r) => acc + (r.morningQty || 0), 0);
    const totalMilkEvening = milkRecords.reduce((acc, r) => acc + (r.eveningQty || 0), 0);
    const totalMilkCollected = totalMilkMorning + totalMilkEvening;
    const totalSalesAmount = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalPaymentsReceived = payments.reduce((acc, p) => acc + p.amount, 0);
    const netProfit = totalSalesAmount - totalExpensesAmount;
    res.json({
      date: targetDate,
      totalMilkCollected,
      totalMilkMorning,
      totalMilkEvening,
      totalSalesAmount,
      totalExpensesAmount,
      totalPaymentsReceived,
      netProfit,
      milkRecords,
      sales,
      expenses,
      payments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var getMonthlyReport = async (req, res) => {
  try {
    const year = req.query.year ? Number(req.query.year) : (/* @__PURE__ */ new Date()).getFullYear();
    const month = req.query.month !== void 0 ? Number(req.query.month) : (/* @__PURE__ */ new Date()).getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const [milkRecords, sales, expenses] = await Promise.all([
      MilkRecord_default.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }),
      Sale_default.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }),
      Expense_default.find({ date: { $gte: startOfMonth, $lte: endOfMonth } })
    ]);
    const totalMilk = milkRecords.reduce((acc, r) => acc + (r.morningQty || 0) + (r.eveningQty || 0), 0);
    const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalSales - totalExpenses;
    const categoryExpenses = {};
    expenses.forEach((e) => {
      categoryExpenses[e.category] = (categoryExpenses[e.category] || 0) + e.amount;
    });
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - i, 1);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      const [mRecords, mSales, mExpenses] = await Promise.all([
        MilkRecord_default.find({ date: { $gte: mStart, $lte: mEnd } }),
        Sale_default.find({ date: { $gte: mStart, $lte: mEnd } }),
        Expense_default.find({ date: { $gte: mStart, $lte: mEnd } })
      ]);
      const milkLiters = mRecords.reduce((acc, r) => acc + (r.morningQty || 0) + (r.eveningQty || 0), 0);
      const income = mSales.reduce((acc, s) => acc + s.amount, 0);
      const expense = mExpenses.reduce((acc, e) => acc + e.amount, 0);
      const monthName = d.toLocaleString("default", { month: "short" });
      monthlyTrends.push({
        name: monthName,
        milk: milkLiters,
        income,
        expense,
        profit: income - expense
      });
    }
    res.json({
      year,
      month,
      totalMilk,
      totalSales,
      totalExpenses,
      netProfit,
      categoryExpenses,
      monthlyTrends
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var getProfitLossReport = async (req, res) => {
  try {
    const allSales = await Sale_default.find();
    const allExpenses = await Expense_default.find();
    const totalIncome = allSales.reduce((acc, s) => acc + s.amount, 0);
    const totalExpenses = allExpenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome * 100).toFixed(1) : "0";
    res.json({
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin: `${profitMargin}%`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var getCustomerReport = async (req, res) => {
  try {
    const customers = await Customer_default.find().sort({ balance: -1 });
    const totalPendingReceivables = customers.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);
    const customersWithBalance = customers.filter((c) => c.balance > 0);
    res.json({
      totalPendingReceivables,
      debtorCount: customersWithBalance.length,
      debtors: customersWithBalance,
      allCustomers: customers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
var getDashboardSummary = async (req, res) => {
  try {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = /* @__PURE__ */ new Date();
    endToday.setHours(23, 59, 59, 999);
    const [
      totalAnimals,
      cowsCount,
      buffalosCount,
      todayMilkRecords,
      allExpenses,
      totalCustomers,
      pendingOrders,
      todaySales
    ] = await Promise.all([
      Animal_default.countDocuments({ status: "active" }),
      Animal_default.countDocuments({ type: "cow", status: "active" }),
      Animal_default.countDocuments({ type: "buffalo", status: "active" }),
      MilkRecord_default.find({ date: { $gte: today, $lte: endToday } }),
      Expense_default.find(),
      Customer_default.countDocuments(),
      Order_default.countDocuments({ status: "pending" }),
      Sale_default.find({ date: { $gte: today, $lte: endToday } })
    ]);
    const milkToday = todayMilkRecords.reduce((acc, r) => acc + (r.morningQty || 0) + (r.eveningQty || 0), 0);
    const todaySalesAmount = todaySales.reduce((acc, s) => acc + s.amount, 0);
    const totalExpenses = allExpenses.reduce((acc, e) => acc + e.amount, 0);
    const recentOrders = await Order_default.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      animals: totalAnimals,
      cows: cowsCount,
      buffalos: buffalosCount,
      milkToday,
      todaySalesAmount,
      totalExpenses,
      customers: totalCustomers,
      pendingOrders,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/routes/reportRoutes.ts
var router9 = (0, import_express9.Router)();
router9.use(protect);
router9.get("/daily", getDailyReport);
router9.get("/monthly", getMonthlyReport);
router9.get("/profit", getProfitLossReport);
router9.get("/customers", getCustomerReport);
router9.get("/summary", getDashboardSummary);
var reportRoutes_default = router9;

// ../api/index.ts
import_dotenv.default.config();
var app = (0, import_express10.default)();
app.use((0, import_cors.default)());
app.use(import_express10.default.json());
var isConnected = false;
var connectDB = async () => {
  if (isConnected || import_mongoose9.default.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  const DEFAULT_URI = Buffer.from('bW9uZ29kYitzcnY6Ly9kYWlyeUFkbWluOmRhaXJ5MTIzQGNsdXN0ZXIwLmFlcHo4YjgubW9uZ29kYi5uZXQvZGFpcnlmYXJtP3JldHJ5V3JpdGVzPXRydWUmdz1tYWpvcml0eSZhcHBOYW1lPUNsdXN0ZXIw', 'base64').toString('utf-8');
  const mongoUri = process.env.MONGO_URI || DEFAULT_URI;
  await import_mongoose9.default.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  isConnected = true;
};
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Serverless DB connect error:", err);
    res.status(500).json({
      error: "DATABASE_CONNECTION_ERROR",
      message: err.message || "Failed to connect to MongoDB. Please ensure MONGO_URI is set in Vercel Environment Variables."
    });
  }
});
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});
app.use("/api/auth", authRoutes_default);
app.use("/api/animals", animalRoutes_default);
app.use("/api/milk", milkRoutes_default);
app.use("/api/expenses", expenseRoutes_default);
app.use("/api/customers", customerRoutes_default);
app.use("/api/orders", orderRoutes_default);
app.use("/api/payments", paymentRoutes_default);
app.use("/api/sales", saleRoutes_default);
app.use("/api/reports", reportRoutes_default);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", serverless: true, timestamp: /* @__PURE__ */ new Date() });
});
var index_default = app;
module.exports = app;
module.exports.default = app;
