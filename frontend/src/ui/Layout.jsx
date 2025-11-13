import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-semibold text-lg">
            AIMS Hospital
          </Link>

          {/* Hamburger button (visible on mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center space-y-1.5"
          >
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-3">
            <Link to="/patient-login" className="btn">
              Patient Login
            </Link>
            <Link className="btn" to="/book-appointment">
              Book
            </Link>
            <Link className="btn" to="/doctor/login">
              Doctor
            </Link>
            <Link className="btn" to="/admin-login">
              Admin
            </Link>
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <nav className="flex flex-col items-center gap-3 py-3 bg-white border-t md:hidden">
            <Link
              to="/patient-login"
              className="btn w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Patient Login
            </Link>
            <Link
              to="/book-appointment"
              className="btn w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Book
            </Link>
            <Link
              to="/doctor/login"
              className="btn w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Doctor
            </Link>
            <Link
              to="/admin-login"
              className="btn w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
