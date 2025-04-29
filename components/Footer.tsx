// components/Footer.tsx
"use client";

import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = ({ id }: { id?: string }) => {
  return (
    <footer className="w-full bg-white dark:bg-black text-gray-800 dark:text-white px-6 md:px-20 py-12 border-t border-black/10 dark:border-white/10" id={id}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand / About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-2">ShipTrack</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A modern way to manage inventory, orders, and logistics — built for speed and simplicity.
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="#pricing" className="hover:underline">Pricing</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
            <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl text-gray-600 dark:text-gray-300">
            <a href="https://github.com/Chandradeep-Pra" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white"><FaGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white"><FaLinkedin /></a>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="mt-12 border-t border-black/10 dark:border-white/10 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Tic Tech Toe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
