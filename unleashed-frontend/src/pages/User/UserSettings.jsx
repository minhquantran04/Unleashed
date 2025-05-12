import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  IconButton,
  Grid,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { GetUserInfo, UpdateUserInfo } from "../../service/UserService";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import UserChangePassword from "./UserChangePassword";
import userDefault from "../../assets/images/userdefault.webp";
import UserSideMenu from "../../components/menus/UserMenu";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteAccountButton from "../../components/modals/DeleteAccount";

export const UserProfile = () => {
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const signIn = useSignIn();

  const [profileImage, setProfileImage] = useState(userDefault);
  const [userData, setUserData] = useState({
    userId: "",
    email: "",
    username: "",
    fullName: "",
    userAddress: "",
    userPhone: "",
    userImage: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await GetUserInfo(authHeader);
        const userInfo = response.data;

        const userInfoData = {
          userId: userInfo.userId,
          email: userInfo.userEmail || "Email not provided",
          username: userInfo.username || "Name not set",
          fullName: userInfo.fullName || "",
          userAddress: userInfo.userAddress || "",
          userPhone: userInfo.userPhone || "",
          userImage: userInfo.userImage || userDefault,
        };

        setUserData(userInfoData);
        setProfileImage(userInfoData.userImage);
        setInitialData(userInfoData);
      } catch (error) {
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [authHeader]);

  // Validation schema – cho phép 10 hoặc 12 chữ số
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("Full name is required")
      .matches(
        /^[\p{L} .'-]+$/u,
        "Full name can only contain letters, spaces, dots, apostrophes, and hyphens."
      ),
    userPhone: Yup.string()
      .required("Phone number is required")
      .matches(
        /^0\d{9,11}$/,
        "Phone number must start with '0' and be 10 or 12 digits"
      ),
    userAddress: Yup.string()
      .required("Address is required")
      .matches(
        /^[\p{L}\p{N}\s,.-]+$/u,
        "Address must not contain special characters"
      ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: userData?.fullName || "",
      userPhone: userData?.userPhone || "",
      userAddress: userData?.userAddress || "",
      userImage: userData?.userImage || ""
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(" Data chuẩn bị gửi đi từ formik:", values);

      try {
        let imageUrl = userData?.userImage;
        if (selectedFile) {
          const formData = new FormData();
          formData.append("image", selectedFile);
          const uploadResponse = await toast.promise(
            fetch('https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912', {
              method: 'POST',
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  return data.data.display_url
                } else {
                  throw new Error('Image upload failed')
                }
              }),
            {
              pending: 'Uploading image...',
              success: 'Image uploaded successfully!',
              error: 'Image upload failed',
            },
            {
              position: 'bottom-right',
            }
          );
          imageUrl = uploadResponse;
        }

        const updatedData = {
          userId: userData.userId,
          fullName: values.fullName || userData.fullName,
          userPhone:
            values.userPhone && values.userPhone.trim() !== ""
              ? values.userPhone.trim()
              : userData.userPhone,
          userAddress: values.userAddress || userData.userAddress,
          userImage: imageUrl,
          username: userData.username,
        };

        console.log(" Final updatedData (sent to API):", updatedData);

        await UpdateUserInfo(updatedData, authHeader, signIn);
        toast.success("Profile updated successfully!", {
          position: "top-center",
          transition: Zoom,
        });
        setUserData(updatedData);
        setSelectedFile(null);
      } catch (error) {
        console.error(" Error updating profile:", error);
        toast.error("An error occurred: " + error.message, {
          position: "top-center",
          transition: Zoom,
        });
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();

      reader.onload = () => {
        formik.setFieldValue('userImage', file); // Update formik value
        formik.setTouched({ userImage: true }); // Mark userImage as touched
        setProfileImage(reader.result);
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading file.');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSuccess = () => {
    signOut();
    navigate("/");
  };

  return (
    <Grid container>
      <Grid item xs={4}>
        <UserSideMenu />
      </Grid>
      <Grid item xs={8}>
        {loading ? (
          <Backdrop
            sx={{
              color: "#858585",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Container maxWidth="sm" sx={{ marginLeft: 0 }}>
            <Box display="flex" flexDirection="row" alignItems="center" mt={5}>
              <Avatar
                alt="Profile Picture"
                src={profileImage}
                sx={{ width: 100, height: 100 }}
              />
              <label htmlFor="profile-image-upload">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>
            <Box component="form" mt={3} onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                value={userData.email}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Username"
                value={userData.username}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="fullName"
                {...formik.getFieldProps("fullName")}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone Number"
                name="userPhone"
                {...formik.getFieldProps("userPhone")}
                error={
                  formik.touched.userPhone && Boolean(formik.errors.userPhone)
                }
                helperText={formik.touched.userPhone && formik.errors.userPhone}
                inputProps={{ maxLength: 12 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="userAddress"
                {...formik.getFieldProps("userAddress")}
                error={
                  formik.touched.userAddress &&
                  Boolean(formik.errors.userAddress)
                }
                helperText={
                  formik.touched.userAddress && formik.errors.userAddress
                }
                InputLabelProps={{ shrink: true }}
              />

              <Box display="flex" justifyContent="center" gap={3} mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ width: "150px", backgroundColor: "green" }}
                  disabled={!formik.isValid || !formik.dirty}
                >
                  Save
                </Button>
                <UserChangePassword />
                <DeleteAccountButton
                  authHeader={authHeader}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </Box>
            </Box>
          </Container>
        )}
      </Grid>
    </Grid>
  );
};

export default UserProfile;
