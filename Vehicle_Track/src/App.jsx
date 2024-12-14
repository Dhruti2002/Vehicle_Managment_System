// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Component imports
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import CarList from "./components/CarList/CarList";
import AppStoreBanner from "./components/AppStoreBanner/AppStoreBanner";
import Contact from "./components/Contact/Contact";
import Testimonial from "./components/Testimonial/Testimonial";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Register from "./components/Register/register";
import VehicleManagement from "./components/VehicleManagement/VehicleManagement";
import VehicleList from "./components/CarList/VehicleList";
import MaintenanceModule from "./components/Maintenance/MaintenanceModule";
import UserModule from "./components/user/UserModule";

// Protected Route Component
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser({ name: userData.name });
  };

  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <Router>
      <div className="bg-white dark:bg-black dark:text-white text-black overflow-x-hidden">
        <Navbar theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero theme={theme} />
                <About />
                <Services />
                <CarList />
                <Testimonial />
                <AppStoreBanner />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={handleLogin} />} />
          <Route path="/user-module" element={<UserModule/>} />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute user={user}>
                <VehicleManagement user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehiclelist"
            element={
              <ProtectedRoute user={user}>
                <VehicleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute user={user}>
                <MaintenanceModule />
              </ProtectedRoute>
            }
          />
          {/* Future routes can be added here */}
        
        </Routes>
      </div>
    </Router>
  );
};

export default App;
