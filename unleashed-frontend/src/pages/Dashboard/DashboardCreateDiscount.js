import React from "react";
import { toast, Zoom } from "react-toastify";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Box, MenuItem } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../core/api";
import { useNavigate } from "react-router-dom";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardCreateDiscount = () => {
  const validationSchema = Yup.object({
    discountCode: Yup.string()
        .required("Discount code is required")
        .min(3, "Discount code must be at least 3 characters")
        .max(20, "Discount code cannot exceed 20 characters")
        .matches(/^[a-zA-Z0-9]*$/, "Discount code no special characters allowed")
        .test(
            'discountCodeExists',
            'Discount code already exists. Please choose a different code.',
            async (value) => {
                if (!value) return true; // Nếu không có giá trị, các validation required sẽ xử lý
                const exists = await checkDiscountCode(value);
                return !exists; // Trả về true nếu discount code KHÔNG tồn tại (validation pass), false nếu tồn tại (validation fail)
            }
        ),
      discountType: Yup.number() // Changed to number validation
          .required("Discount type is required")
          .oneOf([1, 2], "Invalid discount type"), // Validating against integer IDs (1 and 2)
      discountValue: Yup.number()
          .required("Discount value is required")
          .min(1, "Discount value cannot be negative")
          .max(99999999, "Maximum value cannot exceed 99999999")
          .when("discountType", {
              is: 1, // Check against integer ID for PERCENTAGE
              then: (schema) =>
                  schema
                      .min(1, "Discount value cannot be negative")
                      .max(100, "Discount value cannot be greater than 100")
                      .required("Discount value is required"),
          })
          .max(99999999, "Maximum value cannot exceed 99999999"),
    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
      discountStatus: Yup.number() // Changed to number validation
          .required("Discount status is required")
          .oneOf(
              [1, 2], // Validating against integer IDs (1 and 2 for INACTIVE, ACTIVE)
              "Invalid discount status (You cannot create an expired discount or make a discount expired)"
          ),
    discountDescription: Yup.string(),
    minimumOrderValue: Yup.number()
      .min(0, "Minimum order value cannot be negative")
        .max(99999999, "Maximum value cannot exceed 99999999")
      .nullable(),
    maximumDiscountValue: Yup.number()
      .min(0, "Maximum discount value cannot be negative")
        .max(99999999, "Maximum value cannot exceed 99999999")
      .nullable()
        .when("discountType", {
            is: 2, // Check against integer ID for FIXED_AMOUNT
            then: (schema) =>
                schema.test(
                    "is-null",
                    "For fixed amount, Maximum discount value should be null",
                    (value) => value === null || value === undefined
                ),
        }),

    usageLimit: Yup.number()
      .min(1, "Usage limit must be positive")
        .max(99999999, "Maximum discount value cannot exceed 99999999")
      .required("Usage limit cannot be null"),

      // Thêm validation cho discountRank - Optional number, có thể null
      discountRank: Yup.number()
          .required("Discount rank is required")
          .oneOf([1, 2, 3, 4, 5], "Invalid discount rank"),
  });



  const varToken = useAuthHeader();
  const navigate = useNavigate();

    // Hàm kiểm tra discount code đã tồn tại (gọi API backend)
    const checkDiscountCode = async (discountCode) => {
        try {
            const response = await apiClient.get(`/api/discounts/check-code?code=${discountCode}`);
            return response.data; // Backend trả về true nếu code tồn tại, false nếu không
        } catch (error) {
            return false; // Mặc định trả về false để tránh lỗi validation sai khi có lỗi mạng
        }
    };

    const handleSubmit = async (values) => {
        try {
            const requestBody = {
                discountCode: values.discountCode,
                discountType: { id: values.discountType }, // Chuyển đổi thành object
                discountValue: values.discountValue,
                startDate: new Date(values.startDate).toISOString(), // Chuyển đổi thành ISO string (UTC)
                endDate: new Date(values.endDate).toISOString(),
                discountStatus: { id: values.discountStatus }, // Chuyển đổi thành object
                discountDescription: values.discountDescription,
                minimumOrderValue: values.minimumOrderValue,
                maximumDiscountValue: values.maximumDiscountValue,
                usageLimit: values.usageLimit,
                discountRank: { id: values.discountRank } // Chuyển đổi thành object (nếu có giá trị)
            };
            await apiClient.post("/api/discounts", requestBody, { // Gửi requestBody đã chuyển đổi
                headers: {
                    "Content-Type": "application/json",
                    Authorization: varToken,
                },
            });

      toast.success("Discount created successfully!", {
        position: "bottom-right",
        transition: Zoom,
      });
      navigate("/Dashboard/Discounts");
    } catch (error) {
      toast.error("Create discount failed", {
        position: "bottom-right",
        transition: Zoom,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        Create Discount
      </Typography>
      <Formik
        initialValues={{
          discountCode: "",
          discountType: 1,
          discountValue: "",
          startDate: "",
          endDate: "",
          discountStatus: 2,
          discountDescription: "",
          minimumOrderValue: "",
          maximumDiscountValue: "",
          usageLimit: "",
            discountRank: 1,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors, values  }) => (
          <Form>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountCode"
                as={TextField}
                label="Discount Code"
                variant="outlined"
                fullWidth
                required
                error={touched.discountCode && Boolean(errors.discountCode)}
                helperText={touched.discountCode && errors.discountCode}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountType"
                as={TextField}
                label="Discount Type"
                variant="outlined"
                select
                fullWidth
                required
                error={touched.discountType && Boolean(errors.discountType)}
                helperText={touched.discountType && errors.discountType}
              >
                  <MenuItem value={1}>Percentage</MenuItem> {/* Value as integer ID */}
                  <MenuItem value={2}>Fixed Amount</MenuItem> {/* Value as integer ID */}
              </Field>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountValue"
                as={TextField}
                label="Discount Value"
                variant="outlined"
                fullWidth
                required
                type="number"
                error={touched.discountValue && Boolean(errors.discountValue)}
                helperText={touched.discountValue && errors.discountValue}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="startDate"
                as={TextField}
                label="Start Date"
                type="datetime-local"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                error={touched.startDate && Boolean(errors.startDate)}
                helperText={touched.startDate && errors.startDate}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="endDate"
                as={TextField}
                label="End Date"
                type="datetime-local"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                error={touched.endDate && Boolean(errors.endDate)}
                helperText={touched.endDate && errors.endDate}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountStatus"
                as={TextField}
                label="Discount Status"
                variant="outlined"
                select
                fullWidth
                required
                error={touched.discountStatus && Boolean(errors.discountStatus)}
                helperText={touched.discountStatus && errors.discountStatus}
              >
                  <MenuItem value={2}>Active</MenuItem> {/* Value as integer ID */}
                  <MenuItem value={1}>Inactive</MenuItem> {/* Value as integer ID */}
                {/* <MenuItem value="EXPIRED">Expired</MenuItem> */}
              </Field>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountDescription"
                as={TextField}
                label="Discount Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                error={
                  touched.discountDescription &&
                  Boolean(errors.discountDescription)
                }
                helperText={
                  touched.discountDescription && errors.discountDescription
                }
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="minimumOrderValue"
                as={TextField}
                label="Minimum Order Value"
                variant="outlined"
                fullWidth
                type="number"
                error={
                  touched.minimumOrderValue && Boolean(errors.minimumOrderValue)
                }
                helperText={
                  touched.minimumOrderValue && errors.minimumOrderValue
                }
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="maximumDiscountValue"
                as={TextField}
                label="Maximum Discount Value"
                variant="outlined"
                fullWidth
                type="number"
                disabled={values.discountType === 2}
                error={
                  touched.maximumDiscountValue &&
                  Boolean(errors.maximumDiscountValue)
                }
                helperText={
                  touched.maximumDiscountValue && errors.maximumDiscountValue
                }
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="usageLimit"
                as={TextField}
                label="Usage Limit"
                variant="outlined"
                fullWidth
                type="number"
                error={touched.usageLimit && Boolean(errors.usageLimit)}
                helperText={touched.usageLimit && errors.usageLimit}
              />
            </Box>

              {/* Thêm Field cho discountRank */}
              <Box sx={{ mb: 2 }}>
                  <Field
                      name="discountRank"
                      as={TextField}
                      label="Discount Rank"
                      variant="outlined"
                      select
                      fullWidth
                      required
                      error={touched.discountRank && Boolean(errors.discountRank)}
                      helperText={touched.discountRank && errors.discountRank}
                  >
                      <MenuItem value={1}>Unrank</MenuItem> {/* Value as integer ID */}
                      <MenuItem value={2}>Bronze</MenuItem> {/* Value as integer ID */}
                      <MenuItem value={3}>Silver</MenuItem>
                      <MenuItem value={4}>Gold</MenuItem>
                      <MenuItem value={5}>Diamond</MenuItem>
                      {/* <MenuItem value="EXPIRED">Expired</MenuItem> */}
                  </Field>

              </Box>

            <div className="flex items-center justify-center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Create Discount
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardCreateDiscount;
