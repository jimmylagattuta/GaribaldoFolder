import VideoHero from "../components/VideoHero";
import LocationsPreview from "../components/LocationsPreview";
import ContactUs from "../components/ContactUs";

import HomeSchema from "../components/seo/HomeSchema";
import SEO from "../components/seo/SEO";

function Home() {
  return (
    <>
      <SEO
        title="Garibaldo's Nursery | Plants & Garden Supplies"
        description="Explore quality plants and gardening essentials at Garibaldo's Nursery in Bellflower and Lakewood, California. Find locations, hours, and directions."
        path="/"
      />

      {/* Homepage structured data */}
      <HomeSchema />

      {/* Homepage video hero */}
      <section className="relative isolate min-h-[75svh] overflow-hidden bg-stone-900 md:min-h-[85svh]">
        {/* Responsive video background */}
        <div className="absolute inset-0 z-0">
          <VideoHero />
        </div>

        {/* Consistent dark overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-black/15 md:bg-black/25"
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-20 mx-auto flex min-h-[75svh] max-w-[1400px] items-center px-6 py-20 sm:px-10 md:min-h-[85svh] md:px-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to Garibaldo&apos;s Nursery
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
              Quality plants, nursery products, and
              gardening essentials.
            </p>
          </div>
        </div>
      </section>

      {/* Locations, maps, hours, and directions */}
      <LocationsPreview />

      {/* Customer contact form */}
      <ContactUs />
    </>
  );
}

export default Home;