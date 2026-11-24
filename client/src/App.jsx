
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Keep homepage eager-loaded for fast initial rendering.
import Home from "./pages/Home";

// Lazy-load other pages.
const Shop = lazy(() => import("./pages/Shop"));
const Plants = lazy(() => import("./pages/Plants"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Locations = lazy(() => import("./pages/Locations"));

const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(
  () => import("./pages/ForgotPassword")
);
const Register = lazy(() => import("./pages/Register"));

const AdminDashboard = lazy(
  () => import("./pages/AdminDashboard")
);
const AddProduct = lazy(
  () => import("./pages/AddProduct")
);
const EditProduct = lazy(
  () => import("./pages/EditProduct")
);

function PageFallback() {
  return (
    <div
      className="flex min-h-[calc(100vh-110px)] items-center justify-center bg-[#f7f2e8] px-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-stone-600">
        <span
          className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-red-800"
          aria-hidden="true"
        />

        <span className="text-sm font-medium">
          Loading page...
        </span>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#f7f2e8]">
      <Navbar />

      <main>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/shop" element={<Shop />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Nursery locations */}
            <Route
              path="/locations"
              element={<Locations />}
            />

            <Route
              path="/signin"
              element={<SignIn />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/products/new"
              element={<AddProduct />}
            />

            <Route
              path="/admin/products/:id/edit"
              element={<EditProduct />}
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
