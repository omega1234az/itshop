export default function Footer() {
  return (
<footer className="bg-gray-900 text-gray-300 py-10 px-5">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
    
    {/* Logo & Description */}
    <div>
      <img src="../logo.jpg" alt="Logo" className="h-12 mb-3" />
      <p className="text-sm">YourCompany - Providing the best solutions for your needs.</p>
    </div>

    {/* Navigation Links */}
    <div className="flex flex-col space-y-2">
      <h2 className="text-lg font-semibold text-white">Quick Links</h2>
      <a href="/about" className="hover:text-blue-400">About Us</a>
      <a href="/services" className="hover:text-blue-400">Services</a>
      <a href="/contact" className="hover:text-blue-400">Contact</a>
      <a href="/privacy-policy" className="hover:text-blue-400">Privacy Policy</a>
    </div>

    {/* Contact & Social Media */}
    <div>
      <h2 className="text-lg font-semibold text-white">Connect With Us</h2>
      <p>Email: support@yourcompany.com</p>
      <p>Phone: +123 456 7890</p>
      <div className="flex space-x-3 mt-3">
        <a href="#"><img src="../facebook.jpg" alt="Facebook" className="h-6" /></a>
        <a href="#"><img src="../ig.jpg" alt="Instagram" className="h-6" /></a>
      </div>
    </div>

  </div>

  {/* Copyright */}
  <div className="text-center text-sm border-t border-gray-700 mt-5 pt-3">
    © 2025 YourCompany. All rights reserved.
  </div>
</footer>

  );
}