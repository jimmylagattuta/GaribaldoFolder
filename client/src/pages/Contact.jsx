
import { useEffect } from "react";

import ContactUs from "../components/ContactUs";

export default function Contact() {
  useEffect(() => {
    const previousTitle = document.title;

    document.title =
      "Contact Us | Garibaldo's Nursery";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      <ContactUs />
    </main>
  );
}
