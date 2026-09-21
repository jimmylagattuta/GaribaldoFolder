import { Link } from "react-router-dom";

import topLeaves from "../assets/leaves-top.png";

function MobileMenu({
  isOpen,
  onClose,
  user,
  onSignOut,
}) {
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  if (!isOpen) {
    return null;
  }

  const firstName =
    user?.first_name ||
    user?.firstName ||
    user?.username ||
    "there";

  const fullName = [
    user?.first_name,
    user?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside
        className="
          absolute
          right-0
          top-0
          h-[100dvh]
          w-[84%]
          max-w-[390px]
          overflow-y-auto
          overscroll-contain
          bg-[#fffdf8]
          shadow-2xl
          [-webkit-overflow-scrolling:touch]
        "
      >
        <div className="relative min-h-full overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-30 border-b border-stone-200 bg-[#fffdf8]/95 px-6 pb-6 pt-[calc(env(safe-area-inset-top)+24px)] backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-800">
                  Garibaldo&apos;s
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
                  Nursery
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 hover:text-red-800"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Leaf artwork */}
          <div className="pointer-events-none relative h-[330px] overflow-hidden">
            <img
              src={topLeaves}
              alt=""
              aria-hidden="true"
              className="absolute left-[-10px] top-6 w-[520px] max-w-none select-none opacity-80"
            />
          </div>

          {/* Scrollable menu content */}
          <div
            className="
              relative
              z-10
              px-6
              pb-[calc(env(safe-area-inset-bottom)+64px)]
            "
          >
            {/* Account card */}
            {isLoggedIn && (
              <div className="mb-7 rounded-[26px] border border-stone-200 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-2xl font-semibold text-stone-900">
                      Hi, {firstName}
                    </p>

                    {user?.username && (
                      <p className="mt-2 truncate text-lg text-stone-500">
                        @{user.username}
                      </p>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="shrink-0 rounded-full bg-red-800 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
                      <span className="inline-flex items-center gap-2">
                        <ShieldIcon />
                        Admin
                      </span>
                    </div>
                  )}
                </div>

                {fullName &&
                  fullName !== firstName && (
                    <p className="mt-3 text-sm text-stone-500">
                      {fullName}
                    </p>
                  )}
              </div>
            )}

            {/* Main navigation */}
            <nav className="divide-y divide-stone-200">
              <MobileNavLink
                to="/shop"
                onClick={onClose}
              >
                Shop
              </MobileNavLink>

              <MobileNavLink
                to="/plants"
                onClick={onClose}
              >
                Plants
              </MobileNavLink>

              <MobileNavLink
                to="/about"
                onClick={onClose}
              >
                About
              </MobileNavLink>

              <MobileNavLink
                to="/contact"
                onClick={onClose}
              >
                Contact
              </MobileNavLink>
            </nav>

            {/* Admin dashboard */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={onClose}
                className="mt-7 flex items-center justify-between rounded-[24px] border border-red-200 bg-red-50 px-5 py-5 text-red-900 transition hover:border-red-300 hover:bg-red-100"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                    Admin
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    Dashboard
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-800 text-white">
                  <DashboardIcon />
                </div>
              </Link>
            )}

            {/* Logged-out action */}
            {!isLoggedIn && (
              <Link
                to="/signin"
                onClick={onClose}
                className="mt-7 flex w-full items-center justify-center rounded-full bg-red-800 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md"
              >
                Sign In
              </Link>
            )}

            {/* Logged-in actions */}
            {isLoggedIn && (
              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => {
                    onSignOut?.();
                    onClose();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-4 font-semibold text-red-800 transition hover:bg-red-100"
                >
                  <SignOutIcon />
                  Sign Out
                </button>
              </div>
            )}

            {/* Extra breathing room for iPhone Safari */}
            <div className="h-8" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function MobileNavLink({
  to,
  onClick,
  children,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between py-6 text-[1.7rem] font-medium tracking-tight text-stone-900 transition hover:text-red-800"
    >
      <span>{children}</span>

      <ArrowIcon />
    </Link>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 text-stone-400"
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
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 2.5L19 5.3V10.5C19 15.1 16.1 19.2 12 21.5C7.9 19.2 5 15.1 5 10.5V5.3L12 2.5Z" />
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
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M10 5H6C4.9 5 4 5.9 4 7V17C4 18.1 4.9 19 6 19H10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 8L18 12L14 16M18 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default MobileMenu;