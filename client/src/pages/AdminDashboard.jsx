import { Link } from "react-router-dom";

import topLeaves from "../assets/leaves-top.png";
import bottomLeaves from "../assets/leaves-bottom.png";

function AdminDashboard() {
  return (
    <section className="min-h-[calc(100vh-110px)] bg-[#f7f2e8] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[32px] border border-red-900/10 bg-[#fffdf8] px-6 py-8 shadow-sm md:px-10 md:py-10">
          <img
            src={topLeaves}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[-60px] top-[-70px] w-[360px] select-none opacity-35"
          />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              <ShieldIcon />
              Administrator
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 md:text-5xl">
              Garibaldo&apos;s Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
              Manage products, inventory, and orders from one place.
            </p>
          </div>
        </div>

        {/* Product CTA */}
        <div className="mt-8">
          <div className="relative overflow-hidden rounded-[32px] border border-red-900/10 bg-white p-7 shadow-sm md:p-10">
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-800 text-white shadow-sm">
                <PlantIcon />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-red-800">
                Products
              </p>

              <h2 className="mt-2 text-3xl font-semibold text-stone-900 md:text-4xl">
                Add your first products
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-stone-600">
                Start building Garibaldo&apos;s online nursery catalog with
                plant names, pricing, photos, categories, descriptions, and
                inventory.
              </p>

              <Link
                to="/admin/products/new"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-red-800 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md"
              >
                Add Product
                <ArrowIcon />
              </Link>
            </div>

            <img
              src={bottomLeaves}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-120px] right-[-50px] w-[480px] select-none opacity-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
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

function PlantIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M12 21V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M12 13C8 13 5 10.5 5 7C9 7 12 9 12 13Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 10C12 6.5 15 4 19 4C19 7.5 16 10 12 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M14 7L19 12L14 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AdminDashboard;