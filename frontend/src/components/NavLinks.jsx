import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useTranslation } from 'react-i18next';

const NavLinks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
const { t } = useTranslation();
  const handleServicesClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <MenuIcon
        className="md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(true)}
      />

      <div
        className={`fixed top-0 left-0 z-50 flex flex-col items-center text-lg justify-center gap-8 w-full h-screen 
          bg-white/70 backdrop-blur transition-transform duration-300 
          md:static md:flex md:flex-row md:bg-transparent md:h-auto md:w-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />

        <Link to="/pricing" onClick={() => setIsOpen(false)} className="px-4 py-2">
          {t ('Pricing')}
        </Link>
        <button onClick={handleServicesClick} className="px-4 py-2">
          {t('services')}
        </button>
        <Link to="/Contact" onClick={() => setIsOpen(false)}  className="px-4 py-2">
          {t('Contact')}
        </Link>
        {/* Navbar Auth Buttons */}
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2  text-black cursor-pointer">{t('Login')}</button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default NavLinks;
