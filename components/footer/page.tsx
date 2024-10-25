import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-6 text-sm">
      <h2 className="text-lg font-semibold mb-4">Your Path to Better Health Starts Here</h2>
      
      <button className="border border-white px-4 py-2 mb-4 hover:bg-white hover:text-black transition-colors">
        English
      </button>
      
      <nav className="mb-4">
        <ul className="space-y-2">
          <li><Link href="/about">About Us</Link></li>
          <li><Link href="/privacy">Privacy Policy</Link></li>
          <li><Link href="/terms">Terms of Service</Link></li>
          <li><Link href="/health-privacy">Consumer Health Data Privacy Policy</Link></li>
          <li><button className="hover:underline">Cookie settings</button></li>
          <li><Link href="/terms-conditions">Terms & Conditions</Link></li>
        </ul>
      </nav>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Contact Us</h3>
        <p>Email: support@HelloDoctor.com</p>
        <p>Phone: 3498134803134809</p>
      </div>
      
      <div className="text-xs text-gray-400">
        © 2024 HelloDoctor. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;