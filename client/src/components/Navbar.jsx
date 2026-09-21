import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import navbarLogo from "../assets/logo-navbar.png";
import MobileMenu from "./MobileMenu";

function getStoredUser() {
  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(() => getStoredUser());

  const accountRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setUser(getStoredUser());
    setAccountOpen(false);
  }, [location]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    setUser(null);
    setAccountOpen(false);
    setMenuOpen(false);

    navigate("/");
  };

  return (
    <>
      <header className="relative z-30 w-full border-b border-red-900/10 bg-[#fffdf8]">
        <div className="mx-auto flex min-h-[110px] max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img
              src={navbarLogo}
              alt="Garibaldo's Nursery"
              className="h-auto w-[330px] max-w-[65vw] md:w-[430px]"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/shop"
              className="flex h-14 items-center font-medium text-stone-700 transition hover:text-red-800"
            >
              Shop
            </Link>

            <Link
              to="/plants"
              className="flex h-14 items-center font-medium text-stone-700 transition hover:text-red-800"
            >
              Plants
            </Link>

            <Link
              to="/about"
              className="flex h-14 items-center font-medium text-stone-700 transition hover:text-red-800"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="flex h-14 items-center font-medium text-stone-700 transition hover:text-red-800"
            >
              Contact
            </Link>

            {user ? (
              <div
                ref={accountRef}
                className="relative flex h-14 items-center"
              >
                <button
                  type="button"
                  onClick={() =>
                    setAccountOpen((current) => !current)
                  }
                  className="relative flex h-14 min-w-[150px] items-center rounded-full border border-stone-200 bg-white px-5 pr-11 shadow-sm transition hover:border-red-800/30 hover:shadow-md"
                  aria-expanded={accountOpen}
                  aria-label="Open account menu"
                >
                  {/* Name stays perfectly aligned with nav items */}
                  <span className="whitespace-nowrap text-sm font-semibold text-stone-900">
                    Hi, {user.first_name}
                  </span>

                  {/* Admin badge sits lower without affecting name alignment */}
                  {isAdmin && (
                    <span className="absolute bottom-[4px] left-5 flex items-center gap-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.15em] text-red-800">
                      <ShieldIcon />
                      Admin
                    </span>
                  )}

                  {/* Chevron */}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`absolute right-4 h-4 w-4 text-stone-500 transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Desktop account dropdown */}
                <div
                  className={`absolute right-0 top-[calc(100%+12px)] z-50 w-64 origin-top-right rounded-2xl border border-stone-200 bg-[#fffdf8] p-2 shadow-xl transition-all duration-200 ${
                    accountOpen
                      ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                  }`}
                >
                  <div className="border-b border-stone-200 px-4 py-3">
                    <p className="font-semibold text-stone-900">
                      {user.full_name ||
                        `${user.first_name} ${
                          user.last_name || ""
                        }`}
                    </p>

                    <p className="mt-1 text-sm text-stone-500">
                      @{user.username}
                    </p>

                    {isAdmin && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                        <ShieldIcon />
                        Administrator
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-medium text-red-800 transition hover:bg-red-50"
                  >
                    Sign Out

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 7V5.5C10 4.67 10.67 4 11.5 4H18.5C19.33 4 20 4.67 20 5.5V18.5C20 19.33 19.33 20 18.5 20H11.5C10.67 20 10 19.33 10 18.5V17"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <path
                        d="M14 12H4M4 12L7 9M4 12L7 15"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex h-14 items-center rounded-full bg-red-800 px-5 font-semibold text-white transition hover:bg-red-900"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-3xl text-stone-800 md:hidden"
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        </div>
      </header>

      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        user={user}
        onSignOut={handleSignOut}
      />
    </>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11C19 15.55 16.09 19.74 12 21C7.91 19.74 5 15.55 5 11V6L12 3Z"
        fill="currentColor"
      />

      <path
        d="M9 12L11 14L15 10"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Navbar;