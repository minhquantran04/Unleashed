import React from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  FaTags, FaList, FaBell, FaPercent, FaGift, FaWarehouse, FaFileInvoice, FaStar, FaPerson,
  FaBorderAll, FaCircleUser, FaRegStar
} from "react-icons/fa6";
import { FaGifts } from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const authUser = useAuthUser();
  const userRole = authUser?.role;

  const getNavLinkClass = (path) =>
    clsx(
      "flex items-center p-3 rounded-lg transition-all duration-300 text-gray-700 relative",
      {
        "text-blue-500 cursor-default bg-gradient-to-r from-blue-100 to-transparent":
          location.pathname.startsWith(path),
        "hover:text-blue-500 hover:translate-x-2": !location.pathname.startsWith(path),
      }
    );


  const menuItems = [
    { to: "/Dashboard/Products", icon: FaBorderAll, label: "Products" },
    userRole === "ADMIN" && { to: "/Dashboard/Accounts", icon: FaCircleUser, label: "Accounts" },
    { to: "/Dashboard/Providers", icon: FaPerson, label: "Providers" },
    { to: "/Dashboard/Categories", icon: FaTags, label: "Categories" },
    { to: "/Dashboard/Brands", icon: FaStar, label: "Brands" },
    { to: "/Dashboard/Notifications", icon: FaBell, label: "Notifications" },
    { to: "/Dashboard/Discounts", icon: FaPercent, label: "Discounts" },
    { to: "/Dashboard/Sales", icon: FaGift, label: "Sales" },
    { to: "/Dashboard/Orders", icon: FaList, label: "Order Lists" },
    { to: "/Dashboard/Warehouse", icon: FaWarehouse, label: "Warehouse" },
    { to: "/Dashboard/StockTransactions", icon: FaFileInvoice, label: "Stock Transactions" },
    { to: "/Dashboard/Memberships", icon: FaGifts, label: "Account Memeberships" },
    { to: "/Dashboard/Product-Reviews", icon: FaRegStar, label: "Product Reviews" }
  ].filter(Boolean);

  return (
    <div
      className={clsx(
        "bg-white shadow-lg h-screen transition-all duration-500 ease-in-out flex overflow-y-auto border-r border-gray-200",
        isOpen ? "max-w-[300px] w-full opacity-100" : "max-w-0 w-0 opacity-0 overflow-hidden"
      )}
    >

      {isOpen && (
        <ul className="space-y-4 p-6 w-full">
          <li>
            <Link to="/Dashboard" className="flex items-center justify-center p-4 rounded-lg font-bold text-4xl">
              <span className="text-[#4880ff]">Un</span>
              <span className="text-gray-900">leashed</span>
            </Link>
          </li>
          {menuItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <Link to={to} className={getNavLinkClass(to)}>
                {location.pathname.startsWith(to) && (
                  <span className="absolute left-0 h-full w-1 bg-blue-400 rounded-r-md"></span>
                )}
                <Icon className={clsx("mr-3 text-lg", { "text-blue-500": location.pathname.startsWith(to) })} />
                <span className={clsx({ "text-blue-500 font-semibold": location.pathname.startsWith(to) })}>
                  {label}
                </span>
              </Link>
            </li>
          ))}

        </ul>
      )}
    </div>
  );
};

export default Sidebar;
