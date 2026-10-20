import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Animal from './models/Animal';
import MilkRecord from './models/MilkRecord';
import Expense from './models/Expense';
import Customer from './models/Customer';
import Sale from './models/Sale';
import Payment from './models/Payment';
import Order from './models/Order';

dotenv.config();

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Connected to MongoDB');

    // 1. Seed Admin User
    const existingAdmin = await User.findOne({ email: 'admin@dairy.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Chaudhry Umar Farooq',
        email: 'admin@dairy.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Default Admin created: admin@dairy.com / admin123');
    } else {
      console.log('ℹ️ Default Admin already exists');
    }

    // 2. Seed Sample Animals
    const animalCount = await Animal.countDocuments();
    if (animalCount === 0) {
      const sampleAnimals = [
        { tagNumber: 'COW-101', name: 'Raani (Sahiwal)', type: 'cow', breed: 'Pure Sahiwal', age: 4.5, status: 'active' },
        { tagNumber: 'COW-102', name: 'Gori (Friesian)', type: 'cow', breed: 'Holstein Friesian', age: 3.8, status: 'active' },
        { tagNumber: 'COW-103', name: 'Soni (Jersey Cross)', type: 'cow', breed: 'Jersey Cross', age: 5.0, status: 'active' },
        { tagNumber: 'BUF-201', name: 'Kalu (Nili Ravi)', type: 'buffalo', breed: 'Nili Ravi', age: 4.2, status: 'active' },
        { tagNumber: 'BUF-202', name: 'Malti (Kundi)', type: 'buffalo', breed: 'Kundi Sindh', age: 5.5, status: 'active' },
        { tagNumber: 'BUF-203', name: 'Laila (Nili Ravi)', type: 'buffalo', breed: 'Nili Ravi', age: 3.5, status: 'active' },
      ];
      const createdAnimals = await Animal.insertMany(sampleAnimals);
      console.log(`✅ Seeded ${createdAnimals.length} sample cattles`);

      // 3. Seed Milk Records for these animals
      const today = new Date();
      const sampleMilk = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        sampleMilk.push({
          animal: createdAnimals[i % createdAnimals.length]._id,
          date: d,
          morningQty: 18 + (i % 5),
          eveningQty: 16 + (i % 4),
          ratePerLiter: 230,
        });
      }
      await MilkRecord.insertMany(sampleMilk);
      console.log('✅ Seeded 7 days sample milk records');
    }

    // 4. Seed Sample Customers & Ledger Transactions
    const customerCount = await Customer.countDocuments();
    if (customerCount === 0) {
      const sampleCustomers = [
        { name: 'Dr. Faheem Akhtar', phone: '0300-9876543', address: 'House 14, Sector C, WAPDA Town', balance: 3500 },
        { name: 'Haji Tariq Mehmood', phone: '0321-4567890', address: 'Street 4, Model Town', balance: 0 },
        { name: 'Begum Sajida Anwar', phone: '0333-1122334', address: 'Bungalow 9, Gulberg III', balance: 5400 },
        { name: 'Chaudhry Nadeem', phone: '0302-5566778', address: 'Chak 45, Main Road', balance: 1200 },
      ];
      const createdCusts = await Customer.insertMany(sampleCustomers);
      console.log(`✅ Seeded ${createdCusts.length} sample customers`);

      // Seed a sample sale and payment
      await Sale.create({
        customer: createdCusts[0]._id,
        milkQty: 5,
        rate: 240,
        amount: 1200,
        date: new Date(),
        note: 'Rozana subah ka doodh 5 Litre',
      });

      await Payment.create({
        customer: createdCusts[0]._id,
        amount: 2000,
        paymentMethod: 'jazzcash',
        date: new Date(),
        note: 'Monthly partial payment received via JazzCash',
      });
    }

    // 5. Seed Sample Expenses
    const expenseCount = await Expense.countDocuments();
    if (expenseCount === 0) {
      const sampleExpenses = [
        { category: 'chara', amount: 35000, date: new Date(), note: '100 Mann Sabz Barseem & Makai Chara' },
        { category: 'dawa', amount: 8500, date: new Date(), note: 'Monthly deworming & vitamins for cattles' },
        { category: 'tankha', amount: 45000, date: new Date(), note: 'Farm workers monthly wages' },
        { category: 'bijli', amount: 14500, date: new Date(), note: 'Milking parlor chiller tube-well bill' },
      ];
      await Expense.insertMany(sampleExpenses);
      console.log('✅ Seeded sample farm expenses');
    }

    // 6. Seed Sample Website Orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create({
        customerName: 'Muhammad Kamran',
        phone: '0300-1122334',
        address: 'House 88, Block D, Faisal Town',
        product: 'Khalis Gaay Ka Doodh (Pure Cow Milk)',
        quantity: 3,
        unit: 'Liter',
        totalAmount: 660,
        status: 'pending',
        notes: 'Shift: Morning (06:00 AM - 08:30 AM). Please ring bell on arrival',
      });
      console.log('✅ Seeded sample website order');
    }

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
