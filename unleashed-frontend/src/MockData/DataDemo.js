const products = [
  {
    productId: 1,
    productName: "Product 1",
    productPrice: 19.99,
    categoryName: "Tops",
    brandName: "Cloudzy",
    rating: 4,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 0,
  },
  {
    productId: 2,
    productName: "Product 2",
    productPrice: 19.99,
    categoryName: "Shoes",
    brandName: "Gido",
    rating: 4,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 3,
    productName: "Product 3",
    productPrice: 19.99,
    categoryName: 1,
    brandName: 2,
    rating: 4,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 4,
    productName: "Product 4",
    productPrice: 19.99,
    categoryName: 1,
    brandName: 2,
    rating: 4,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 5,
    productName: "Product 5",
    productPrice: 19.99,
    categoryName: 1,
    brandName: 2,
    rating: 4,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 6,
    productName: "Product 6",
    productPrice: 19.99,
    categoryName: 1,
    brandName: 2,
    rating: 4,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 7,
    productName: "Product 7",
    productPrice: 19.99,
    categoryName: 1,
    brandName: 2,
    rating: 4,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 8,
    productName: "Product 8",
    productPrice: 19.99,
    categoryName: "Pants",
    brandName: "Dirty coins",
    rating: 4,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 9,
    productName: "Product 9",
    productPrice: 19.99,
    categoryName: "Tops",
    brandName: "Dirty coins",
    rating: 2,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 10,
    productName: "Product 10",
    productPrice: 19.99,
    categoryName: "Tops",
    brandName: "Dirty coins",
    rating: 1,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 11,
    productName: "Product 11",
    productPrice: 120.99,
    categoryName: "Tops",
    brandName: "Dirty coins",
    rating: 1,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 12,
    productName: "Product 12",
    productPrice: 19.9,
    categoryName: "Tops",
    brandName: "Dirty coins",
    rating: 1,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 13,
    productName: "Product 13",
    productPrice: 99.99,
    categoryName: "Tops",
    brandName: "Dirty coins",
    rating: 1,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 14,
    productName: "Product 14",
    productPrice: 1.99,
    categoryName: "Tops",
    brandName: "Dirty coins",
    rating: 1,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
  {
    productId: 15,
    productName: "Product 15",
    productPrice: 1.99,
    categoryName: "Tops",
    brandName: "Dirty coins",
    rating: 1,
    totalRating: 100,
    productImage:
      "https://product.hstatic.net/200000551971/product/39f5c92f89eb59b500fa_56a729e802ef4f46876153d68e3a8289_master.jpg",
    saleType: "percentage",
    saleValue: 15,
  },
];

export default products;