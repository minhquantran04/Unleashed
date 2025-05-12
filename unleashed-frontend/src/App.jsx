import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./components/navbars/Navbar";
import { NavLogin } from "./components/navbars/UserAccessBar";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer/CustomerFooter";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { jwtDecode } from "jwt-decode";
import AppRoutes from "./routes/AppRoutes.js";
import ScrollToTop from "./Scroll.js";
import { ProductProvider } from "./components/Providers/Product.js";

function App() {
  const location = useLocation();
  const authHeader = useAuthHeader();
  const signOut = useSignOut();

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const token = authHeader?.split(" ")[1];
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        toast.info("Your session has expired. Please log in again.", {
          position: "top-center",
          transition: Zoom,
        });
        signOut();
      }
    }
  }, [authHeader, signOut]);

  const HideNav =
    !location.pathname.startsWith("/LoginForStaffAndAdmin") &&
    !location.pathname.startsWith("/Dashboard");

  const showNavbar =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forgotPassword" &&
    location.pathname !== "/register/confirm-registration" &&
    location.pathname !== "/register/success" &&
    location.pathname !== "/forgotPassword/success" &&
    location.pathname !== "/reset-password/success" &&
    location.pathname !== "/reset-password" &&
    !location.pathname.startsWith("/LoginForStaffAndAdmin") &&
    location.pathname !== "/confirm-registration/success" &&
    !location.pathname.startsWith("/orders");

  const showFooter =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forgotPassword" &&
    location.pathname !== "/register/confirm-registration" &&
    location.pathname !== "/register/success" &&
    location.pathname !== "/forgotPassword/success" &&
    location.pathname !== "/reset-password/success" &&
    location.pathname !== "/reset-password" &&
    location.pathname !== "/LoginForStaffAndAdmin" &&
    location.pathname !== "/checkout" &&
    location.pathname !== "/payment-options" &&
    location.pathname !== "/return" &&
    location.pathname !== "/contact" &&
    location.pathname !== "/privacy-policies" &&
    !location.pathname.startsWith("/user") &&
    !location.pathname.startsWith("/Dashboard") &&
    !location.pathname.startsWith("/confirm-registration") &&
    !location.pathname.startsWith("/orders") &&
    location.pathname !== "/discounts";

  const applyPadding = () => {
    const path = location.pathname;
    if (
      path === "/" ||
      path === "/shop" ||
      path === "/about" ||
      path === "/contact" ||
      path.startsWith("/shop/product/") ||
      path === "/login" ||
      path === "/register" ||
      path === "/forgotPassword" ||
      path === "/forgotPassword/success" ||
      path === "/register/confirm-registration" ||
      path.startsWith("/user") ||
      path === "/cart" ||
      path === "/checkout" ||
      path.startsWith("/reset-password") ||
      path.startsWith("/orders") ||
      path === "/payment-options" ||
      path === "/privacy-policies" ||
      path === "/return" 
    ) {
      return "pt-[100px]";
    }
    return "";
  };

  return (
    <>
      <ProductProvider>
        {HideNav && (showNavbar ? <Navbar /> : <NavLogin />)}
        <div className={applyPadding()}>
          <ScrollToTop />
          <AppRoutes toggleSidebar={toggleSidebar} isOpen={isOpen} />
        </div>
      </ProductProvider>
      <ToastContainer
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
      {showFooter && <Footer />}
    </>
  );
}

const WrappedApp = () => <App />;

export default WrappedApp;
