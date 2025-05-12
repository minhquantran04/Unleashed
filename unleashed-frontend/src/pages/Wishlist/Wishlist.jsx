import {
  Breadcrumbs,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Grid
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import UserSideMenu from "../../components/menus/UserMenu";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"; 
import { jwtDecode } from "jwt-decode"; 
import { getWishlist, removeFromWishlist } from "../../service/WishlistService";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [username, setUsername] = useState(null);
  const authHeader = useAuthHeader();

  useEffect(() => {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, [authHeader]);

  // Gọi API lấy wishlist khi có username
  useEffect(() => {
    const fetchWishlist = async () => {
      if (username) {
        const data = await getWishlist(username);
        setWishlist(data || []);
      }
    };
    fetchWishlist();
  }, [username]);

  // Xóa sản phẩm khỏi wishlist
  const handleRemoveFromWishlist = async (productId) => {
    if (username) {
      const success = await removeFromWishlist(username, productId);
      if (success) {
        setWishlist(wishlist.filter(item => item.productId !== productId));
      }
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Sidebar */}
      <Grid item xs={4}>
        <UserSideMenu />
      </Grid>

      {/* Wishlist */}
      <Grid item xs={8}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          Wishlist
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {wishlist.length === 0 ? (
          <Typography variant="h6">Your wishlist is empty.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wishlist.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Link to={`/shop/product/${item.productId}`}>
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          width={160}
                          className="wishlist-product-image"
                          style={{ cursor: 'pointer' }}
                        />
                      </Link>
                    </TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>

      <style jsx>{`
        .wishlist-product-image {
          transition: transform 0.1s ease-in-out;
        }

        .wishlist-product-image:hover {
          transform: scale(1.2);
        }
      `}</style>
    </Grid>
  );
};

export default WishlistPage;
