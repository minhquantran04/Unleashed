import React, { useState, useEffect, useRef } from "react";
import useSearchBar from "../hooks/SearchHook";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../Providers/Product";

const SearchBar = ({ toggleSearchBar }) => {
  const [query, setQuery] = useState("");
  const { isSearchOpen } = useSearchBar();
  const { products } = useProduct();
  const searchBarRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const searchResultsRef = useRef(null);
  const [left, setLeft] = useState("50%");
  const navigate = useNavigate();

  const filteredProducts = products
    .filter((product) => {
      const searchQuery = query.toLowerCase();
      const productName = product.productName.toLowerCase();
      const productDescription = product.productDescription ? product.productDescription.toLowerCase() : '';
      const productCode = product.productCode ? product.productCode.toLowerCase() : '';

      return (
        productName.includes(searchQuery) ||
        productDescription.includes(searchQuery) ||
        productCode.includes(searchQuery)
      );
    })
    .sort((a, b) => {
      const queryLower = query.toLowerCase();
      const nameA = a.productName.toLowerCase();
      const descA = a.productDescription ? a.productDescription.toLowerCase() : '';
      const codeA = a.productCode ? a.productCode.toLowerCase() : '';
      const nameB = b.productName.toLowerCase();
      const descB = b.productDescription ? b.productDescription.toLowerCase() : '';
      const codeB = b.productCode ? b.productCode.toLowerCase() : '';

      const nameStartsWithA = nameA.startsWith(queryLower);
      const nameStartsWithB = nameB.startsWith(queryLower);
      const nameIndexA = nameA.indexOf(queryLower);
      const nameIndexB = nameB.indexOf(queryLower);
      const descMatchA = descA.includes(queryLower);
      const descMatchB = descB.includes(queryLower);
      const codeMatchA = codeA.includes(queryLower);
      const codeMatchB = codeB.includes(queryLower);

      if (nameStartsWithA && !nameStartsWithB) return -1; // Ưu tiên sản phẩm A nếu tên A bắt đầu bằng query
      if (!nameStartsWithA && nameStartsWithB) return 1; // Ưu tiên sản phẩm B nếu tên B bắt đầu bằng query

      if (nameStartsWithA && nameStartsWithB) { // Nếu cả 2 sản phẩm tên đều bắt đầu bằng query, giữ nguyên thứ tự
        return 0;
      }

      // Ưu tiên sản phẩm có vị trí xuất hiện của query trong tên gần đầu hơn
      if (nameIndexA !== -1 && nameIndexB !== -1) {
        return nameIndexA - nameIndexB;
      }
      if (nameIndexA !== -1 && nameIndexB === -1) return -1;
      if (nameIndexA === -1 && nameIndexB !== -1) return 1;


      if (descMatchA && !descMatchB) return -1;
      if (!descMatchA && descMatchB) return 1;
      if (descMatchA && descMatchB) return 0;

      if (codeMatchA && !codeMatchB) return -1;
      if (!codeMatchA && codeMatchB) return 1;
      return 0;
    });
  const truncateProductName = (name, maxLength) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...";
    }
    return name;
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log("Tìm kiếm với:", query);
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      toggleSearchBar();
      setQuery("");
    }
  };

  const handleClickOutside = (e) => {
    if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      toggleSearchBar();
    }
  };

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      const inputWidth = inputRef.current.offsetWidth;
      const buttonWidth = buttonRef.current.offsetWidth;
      const gap = 24;
      const totalWidth = inputWidth + buttonWidth + gap;

      setLeft(`calc(50% - ${totalWidth / 2}px)`);

      if (searchResultsRef.current) {
        searchResultsRef.current.style.left = `calc(50% - ${totalWidth / 2}px)`;
        searchResultsRef.current.style.width = `${totalWidth}px`;
      }
    };

    window.addEventListener("resize", updatePosition);
    updatePosition();

    return () => window.removeEventListener("resize", updatePosition);
  }, [query]);

  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter') { // Kiểm tra nếu phím Enter được nhấn
      e.preventDefault(); // Ngăn chặn hành vi mặc định của form (nếu có)
      handleSearch();     // Gọi hàm handleSearch để thực hiện tìm kiếm
    }
  };

  return (
    <>
      <div
        ref={searchBarRef}
        className={`fixed top-28 transform -translate-x-1/2 z-50 bg-white p-2 max-w-[40rem] rounded-full shadow-lg flex items-center gap-3 ${
          isSearchOpen ? "animate-slide-out" : "animate-slide-in"
        }`}
        style={{ left }}
      >
        <input
  ref={inputRef}
  type="text"
  value={query}
  onChange={handleChange}
  placeholder="Find..."
  className="border border-gray-300 rounded-full px-4 py-2 w-[25rem]"
  onKeyDown={handleKeyDownInput} // THÊM onKeyDown PROP VÀO ĐÂY
/>
        <button
          ref={buttonRef}
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
        >
          Find
        </button>
      </div>

      {query && filteredProducts.length > 0 && (
        <div
          ref={searchResultsRef}
          className="fixed top-[11.5rem] z-50 bg-white shadow-lg rounded-lg border-t border-gray-200 mt-2 ml-2"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ul className="max-h-64 overflow-y-auto">
            {filteredProducts.map((product, index) => (
              <Link
                tabIndex={index}
                to={`/shop/product/${product.productId}`}
                key={product.productId}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSearchBar();
                }}
              >
                <li className="flex items-center py-3 px-4 hover:bg-blue-100 cursor-pointer">
                  <img
                    src={product.productVariationImage}
                    alt={product.productName}
                    className="w-12 h-12 mr-4 rounded-full object-cover"
                  />
                  <span title={product.productName}> {/* Thêm title để hiển thị full name khi hover */}
                    {truncateProductName(product.productName, 40)} {/* Hiển thị tên đã rút gọn */}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SearchBar;