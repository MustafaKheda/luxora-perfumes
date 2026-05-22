// export default function Navbar() {
//   return (
//     <header className="w-full">
//       <div className="max-w-[1300px] mx-auto flex items-center justify-between py-4 px-4 lg:px-6 text-sm font-body font-medium text-textPrimary">
//         {/* Left nav links */}
//         <nav className="flex items-center gap-6 text-[13px]">
//           <a href="#" className="hover:opacity-80">Home</a>
//           <a href="#" className="hover:opacity-80">Shop</a>
//           <a href="#" className="hover:opacity-80">Collection</a>
//           <a href="#" className="hover:opacity-80">Guide</a>
//         </nav>

//         {/* Brand */}
//         <div className="text-xl font-heading font-semibold tracking-wide uppercase">
//           SCENTORA
//         </div>

//         {/* Right */}
//         <div className="flex items-center gap-5 text-[13px]">
//           <a href="#" className="hover:opacity-80">About Us</a>

//           <button
//             aria-label="Account"
//             className="h-9 w-9 flex items-center justify-center rounded-full border border-black/60 text-textPrimary hover:bg-black/5"
//           >
//             {/* profile icon placeholder */}
//             <span className="text-[13px] font-semibold">👤</span>
//           </button>

//           <button
//             aria-label="Cart"
//             className="h-9 w-9 flex items-center justify-center rounded-full border border-black/60 text-textPrimary hover:bg-black/5 relative"
//           >
//             <span className="text-[13px] font-semibold">👜</span>
//             <span className="absolute -top-1 -right-1 bg-accent text-[10px] text-black font-semibold rounded-full px-1.5 leading-none">
//               2
//             </span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full">
      <div className="max-w-[1300px] mx-auto flex items-center justify-between p-4 text-[#1A1A1A] font-body">
        {/* ===== LEFT (Nav links on desktop, hamburger on mobile) ===== */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-md  text-lg md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium">
            <Link href="/" className="hover:opacity-70" prefetch={true}>Home</Link>
            <Link href="/shop/all" className="hover:opacity-70" prefetch={true}>Shop</Link>
            <Link href="/collections/all" className="hover:opacity-70" prefetch={true}>Collection</Link>
            <Link href="/guide" prefetch={true} className="hover:opacity-70">Guide</Link>
          </nav>
        </div>

        {/* ===== CENTER (Brand Logo) ===== */}
        <div className="font-heading text-xl font-semibold tracking-widest uppercase">
          SCENTORA
        </div>

        {/* ===== RIGHT (About + Icons) ===== */}
        <div className="flex items-center gap-4">
          <a href="#" className="hidden md:inline text-[14px] hover:opacity-70">
            About Us
          </a>

          <button
            aria-label="Cart"
            className="h-9 w-9 flex items-center justify-center rounded-full border border-black/50 hover:bg-black/5 relative"
          >
            👜
            <span className="absolute -top-1 -right-1 bg-[#F9A826] text-[10px] text-black font-semibold rounded-full px-1.5 leading-none">
              2
            </span>
          </button>

          <button
            aria-label="Account"
            className="h-9 w-9 flex items-center justify-center rounded-full border border-black/50 hover:bg-black/5"
          >
            👤
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-black/10 overflow-hidden"
          >
            <nav className="flex flex-col items-center gap-4 py-4 text-[14px] font-medium text-[#1A1A1A]">
              <a href="#" className="hover:opacity-70" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="#" className="hover:opacity-70" onClick={() => setMenuOpen(false)}>Shop</a>
              <a href="#" className="hover:opacity-70" onClick={() => setMenuOpen(false)}>Collection</a>
              <a href="#" className="hover:opacity-70" onClick={() => setMenuOpen(false)}>Guide</a>
              <a href="#" className="hover:opacity-70" onClick={() => setMenuOpen(false)}>About Us</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
