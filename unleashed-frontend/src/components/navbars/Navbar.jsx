import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { useCart } from "react-use-cart"; // Import useCart
import logo from "../../assets/images/logo.webp";
import logonavbar from "../../assets/images/logonavbar.webp";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import LoggedMenu from "../menus/LoggedMenu";
import GuessMenu from "../menus/GuessMenu";
import CartDrawer from "../Cart/CartDrawer";
import { Badge, IconButton, Tooltip } from "@mui/material";
import NotificationIcon from "../menus/NotificationMenu";
import SearchBar from "../Search/SearchBar";
import useSearchBar from "../hooks/SearchHook";

export function Navbar() {
  const dropdownRef = useRef(null);
  const isAuth = useIsAuthenticated();

  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isSearchOpen, toggleSearchBar } = useSearchBar();

  const { totalItems } = useCart();

  const toggleCartDrawer = (open) => () => {
    setIsCartOpen(open); // Open or close the CartDrawer
  };

  return (
    <nav className="fixed top-0 left-0 right-0 p-2 md:p-4 z-50 bg-transparent">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-25 backdrop-blur-md"></div>

      <div className="navitem grid grid-cols-1 md:grid-cols-3 items-center relative z-10">
        {" "}
        {/* Added `relative z-10` here */}
        <div className="nav-left flex items-center justify-start pl-4 md:pl-10 relative">
          <NavLink to="/" >
            <img src={logonavbar} alt="Unleashed Logo" className="logo w-32 md:w-48 absolute" />
          </NavLink>
        </div>

        <div className="nav-center justify-center hidden md:flex">
          <ul className="flex space-x-6 md:space-x-20 items-center">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-poppins text-sm md:text-base hover:text-base-300 transition duration-300 relative ${
                    isActive ? "text-base-300" : ""
                  }`
                }
              >
                Home
                <span
                  className={({ isActive }) =>
                    `absolute left-0 bottom-[-2px] w-full h-[2px] bg-base-300 transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`
                  }
                ></span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `font-poppins text-sm md:text-base hover:text-base-300 transition duration-300 relative ${
                    isActive ? "text-base-300" : ""
                  }`
                }
              >
                Shop
                <span
                  className={({ isActive }) =>
                    `absolute left-0 bottom-[-2px] w-full h-[2px] bg-base-300 transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`
                  }
                ></span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `font-poppins text-sm md:text-base hover:text-base-300 transition duration-300 relative ${
                    isActive ? "text-base-300" : ""
                  }`
                }
              >
                About
                <span
                  className={({ isActive }) =>
                    `absolute left-0 bottom-[-2px] w-full h-[2px] bg-base-300 transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`
                  }
                ></span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `font-poppins text-sm md:text-base hover:text-base-300 transition duration-300 relative ${
                    isActive ? "text-base-300" : ""
                  }`
                }
              >
                Contact
                <span
                  className={({ isActive }) =>
                    `absolute left-0 bottom-[-2px] w-full h-[2px] bg-base-300 transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`
                  }
                ></span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="nav-right items-center justify-end flex space-x-4 md:space-x-10 pr-4 md:pr-10">
          {isAuth && <NotificationIcon />}
          {isAuth ? (
            <div className="dropdown dropdown-bottom" ref={dropdownRef}>
              <LoggedMenu />
            </div>
          ) : (
            <GuessMenu />
          )}

          <div className="searchBtn hover:text-base-300 transition duration-300">
            <Tooltip title="Ctrl + F">
              <IconButton onClick={toggleSearchBar}>
                <IoSearchOutline className="text-2xl md:text-3xl text-black" />
              </IconButton>
            </Tooltip>
          </div>

          {/* Cart Button */}
          <div className="cartBtn hover:text-base-300 transition duration-300">
            <IconButton onClick={toggleCartDrawer(true)}>
              <Badge color="secondary" badgeContent={totalItems}>
                <IoCartOutline className="text-2xl md:text-3xl text-black" />
              </Badge>
            </IconButton>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isCartOpen={isCartOpen} toggleCartDrawer={toggleCartDrawer} />
      
      {isSearchOpen && (
        <SearchBar
          isSearchOpen={isSearchOpen}
          toggleSearchBar={toggleSearchBar}
        />
      )}
    </nav>
  );
}
