import { Link } from "react-router-dom";

import topLeaves from "../assets/leaves-top.png";
import bottomLeaves from "../assets/leaves-bottom.png";

function MobileMenu({
  menuOpen,
  setMenuOpen,
  user,
  onSignOut,
}) {
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isAdmin = user?.role === "admin";

  const handleSignOut = () => {
    closeMenu();
    onSignOut();
  };

  return (
    <>
      {/* Background overlay */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-hidden bg-[#fffdf8] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative flex h-full flex-col">
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-800">
                Garibaldo&apos;s
              </p>

              <span className="text-xl font-bold text-stone-900">
                Nursery
              </span>
            </div>

            <button
              type="button"
              onClick={closeMenu}
              className="text-3xl leading-none text-stone-700 transition hover:rotate-90 hover:text-red-800"
              aria-label="Close navigation menu"
            >
              ×
            </button>
          </div>

          {/* Top botanical artwork */}
          <img
            src={topLeaves}
            alt=""
            aria-hidden="true"
            className="pointer-events-none w-full select-none object-contain"
          />

          {/* Logged-in mobile identity */}
          {user && (
            <div className="relative z-10 mx-6 mb-2 rounded-2xl border border-stone-200 bg-white/80 px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-stone-900">
                    Hi, {user.first_name}
                  </p>

                  <p className="mt-0.5 text-sm text-stone-500">
                    @{user.username}
                  </p>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1.5 rounded-full bg-red-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    <ShieldIcon />
                    Admin
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="relative z-10 flex flex-col px-6 py-4">
            <Link
              to="/shop"
              onClick={closeMenu}
              className="border-b border-stone-200 py-4 text-lg font-medium text-stone-800 transition duration-200 hover:pl-2 hover:text-red-800"
            >
              Shop
            </Link>

            <Link
              to="/plants"
              onClick={closeMenu}
              className="border-b border-stone-200 py-4 text-lg font-medium text-stone-800 transition duration-200 hover:pl-2 hover:text-red-800"
            >
              Plants
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
              className="border-b border-stone-200 py-4 text-lg font-medium text-stone-800 transition duration-200 hover:pl-2 hover:text-red-800"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
              className="border-b border-stone-200 py-4 text-lg font-medium text-stone-800 transition duration-200 hover:pl-2 hover:text-red-800"
            >
              Contact
            </Link>

            {/* Admin-only dashboard */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="mt-6 flex items-center justify-between rounded-2xl border border-red-800/20 bg-red-50 px-5 py-4 text-red-800 shadow-sm transition hover:bg-red-100"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                    <DashboardIcon />
                  </span>

                  <span className="font-semibold">
                    Admin Dashboard
                  </span>
                </span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}

            {/* Logged in */}
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-7 w-full rounded-full border-2 border-red-800 bg-transparent px-5 py-3 text-center font-semibold text-red-800 transition hover:bg-red-800 hover:text-white"
              >
                Sign Out
              </button>
            ) : (
              /* Logged out */
              <Link
                to="/signin"
                onClick={closeMenu}
                className="mt-7 rounded-full bg-red-800 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-red-900"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Bottom artwork */}
          <div className="mt-auto">
            <img
              src={bottomLeaves}
              alt=""
              aria-hidden="true"
              className="pointer-events-none w-full select-none object-contain"
            />

            <div className="px-6 pb-6 text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500">
                Growing a brighter tomorrow
              </p>

              <div className="mx-auto mt-3 h-px w-10 bg-stone-400" />
            </div>
          </div>
        </div>
      </aside>
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

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default MobileMenu;