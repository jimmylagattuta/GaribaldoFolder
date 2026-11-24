import ContactUs from "../components/ContactUs";
import SEO from "../components/seo/SEO";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#fffdf8]">
      <SEO
        title="Contact Us | Garibaldo's Nursery in Bellflower"
        description="Contact Garibaldo's Nursery at 8834 Rose Street in Bellflower, California. Ask us about plants, pricing, availability, and gardening essentials."
        path="/contact"
      />

      <ContactUs />
    </main>
  );
}