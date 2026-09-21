import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Plants from "./pages/Plants";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <div className="min-h-screen bg-[#f7f2e8]">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/admin/products/new"
            element={<AddProduct />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;