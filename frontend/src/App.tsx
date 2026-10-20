import type React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminAnimals from './pages/AdminAnimals';
import AdminMilk from './pages/AdminMilk';
import AdminExpenses from './pages/AdminExpenses';
import AdminCustomers from './pages/AdminCustomers';
import AdminOrders from './pages/AdminOrders';
import AdminReports from './pages/AdminReports';

function Private({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Website Routes (SRS 3.1) */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes (SRS 3.2) */}
        <Route path="/admin" element={<Private><AdminDashboard /></Private>} />
        <Route path="/admin/animals" element={<Private><AdminAnimals /></Private>} />
        <Route path="/admin/milk" element={<Private><AdminMilk /></Private>} />
        <Route path="/admin/expenses" element={<Private><AdminExpenses /></Private>} />
        <Route path="/admin/customers" element={<Private><AdminCustomers /></Private>} />
        <Route path="/admin/orders" element={<Private><AdminOrders /></Private>} />
        <Route path="/admin/reports" element={<Private><AdminReports /></Private>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}