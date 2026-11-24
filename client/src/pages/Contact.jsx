
import ContactUs from "../components/ContactUs";
import SEO from "../components/seo/SEO";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#fffdf8]">
      <SEO
        title="Contact Us | Garibaldo's Nursery"
        description="Contact Garibaldo's Nursery with questions about plants, pricing, availability, or gardening supplies in Bellflower and Lakewood, California."
        path="/contact"
      />

      <ContactUs />
    </main>
  );
}
