// Navbar.jsx
import React, { useState } from "react";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ResponsiveMenu from "./ResponsiveMenu";

export const Navlinks = [
  { id: 1, name: "Home", link: "/#" },
  { id: 2, name: "VehicleManagement", link: "/vehicles" },
  { id: 3, name: "MyVehicles", link: "/vehiclelist" },
  { id: 4, name: "Maintenance", link: "/maintenance" },
];

const Navbar = ({ theme, setTheme, user, setUser }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // Use navigate hook

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLogout = () => {
    setUser(null); // Clear user state
    localStorage.removeItem('user'); // Remove user data from local storage
  };

  const handleUserIconClick = () => {
    navigate('/user-module'); // Navigate to UserModule
  };

  return (
    <div className="relative z-10 shadow-md w-full dark:bg-black dark:text-white duration-300">
      <div className="container py-2 md:py-0">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-3xl font-bold font-serif">Vehicle Track</span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {Navlinks.map(({ id, name, link }) => (
                <li key={id} className="py-4">
                  <a
                    href={link}
                    className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                  >
                    {name}
                  </a>
                </li>
              ))}

              {/* Conditional rendering based on user login state */}
              {user ? (
                <>
                  <li className="py-4 flex items-center">
                  <FontAwesomeIcon icon={faUser} className="w-8 h-5 mr-2 cursor-pointer" onClick={handleUserIconClick} />
                    <span className="text-lg font-medium">Welcome, {user.name}</span>
                  </li>
                  <li className="py-4">
                    <button
                      onClick={handleLogout}
                      className="text-lg font-medium hover:text-primary py-2 transition-colors duration-500"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="py-4">
                  <a
                    href="/login"
                    className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                  >
                    Login/Register
                  </a>
                </li>
              )}

              {theme === "dark" ? (
                <BiSolidSun onClick={() => setTheme("light")} className="text-2xl cursor-pointer" />
              ) : (
                <BiSolidMoon onClick={() => setTheme("dark")} className="text-2xl cursor-pointer" />
              )}
            </ul>
          </nav>
          <div className="flex items-center gap-4 md:hidden">
            {theme === "dark" ? (
              <BiSolidSun onClick={() => setTheme("light")} className="text-2xl cursor-pointer" />
            ) : (
              <BiSolidMoon onClick={() => setTheme("dark")} className="text-2xl cursor-pointer" />
            )}
            {showMenu ? (
              <HiMenuAlt1 onClick={toggleMenu} className="cursor-pointer transition-all" size={30} />
            ) : (
              <HiMenuAlt3 onClick={toggleMenu} className="cursor-pointer transition-all" size={30} />
            )}
          </div>
        </div>
      </div>
      <ResponsiveMenu showMenu={showMenu} />
    </div>
  );
};

export default Navbar;
