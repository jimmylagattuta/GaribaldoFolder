import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16">
      <h1 className="text-4xl font-bold text-stone-900">
        Welcome to Garibaldo&apos;s Nursery
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-stone-600">
        Quality plants, nursery products, and gardening essentials.
      </p>

      <div className="mt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 rounded-full bg-red-800 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md"
        >
          Shop Plants

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
        </Link>
      </div>
    </section>
  );
}

export default Home;