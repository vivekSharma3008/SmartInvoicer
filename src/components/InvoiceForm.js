import { Button } from "@mui/material";
import { Box, OutlinedInput, InputLabel } from "@mui/material";
import { useState } from "react";

function InvoiceForm({ handleAddInvoice }) {
  const [formData, setFormData] = useState({
    qty: 0,
    price: 0,
    discountPercentage: 0,
    discount: 0,
    taxPercentage: 0,
    tax: 0,
    totalPrice: 0,
  });

  const calculateTotalPrice = (data) => {
    const { qty, price, discount, tax } = data;
    const totalPrice = qty * price - discount + tax;
    return totalPrice;
  };

  const handleChange = (field, value) => {
    setFormData((prevFormData) => {
      let newFormData = { ...prevFormData, [field]: value };

      if (field === "discountPercentage" || field === "taxPercentage") {
        value = Math.min(100, value);
      }

      if (field === "qty" || field === "price") {
        const discount = parseFloat(
          (
            (newFormData.discountPercentage / 100) *
            newFormData.qty *
            newFormData.price
          ).toFixed(2)
        );
        const tax = parseFloat(
          (
            (newFormData.taxPercentage / 100) *
            (newFormData.qty * newFormData.price - discount)
          ).toFixed(2)
        );
        newFormData = {
          ...newFormData,
          discount,
          tax,
          totalPrice: calculateTotalPrice({ ...newFormData, discount, tax }),
        };
      } else if (field === "discountPercentage") {
        const discount = parseFloat(
          (
            (newFormData.discountPercentage / 100) *
            newFormData.qty *
            newFormData.price
          ).toFixed(2)
        );
        newFormData = {
          ...newFormData,
          discount,
          totalPrice: calculateTotalPrice({ ...newFormData, discount }),
        };
      } else if (field === "discount") {
        const discountPercentage = parseFloat(
          ((value / (newFormData.qty * newFormData.price)) * 100).toFixed(2)
        );
        newFormData = {
          ...newFormData,
          discount: value,
          discountPercentage,
          totalPrice: calculateTotalPrice({ ...newFormData, discount: value }),
        };
      } else if (field === "taxPercentage") {
        const tax = parseFloat(
          (
            (newFormData.taxPercentage / 100) *
            (newFormData.qty * newFormData.price - newFormData.discount)
          ).toFixed(2)
        );
        newFormData = {
          ...newFormData,
          tax,
          totalPrice: calculateTotalPrice({ ...newFormData, tax }),
        };
      } else if (field === "tax") {
        const taxPercentage = parseFloat(
          (
            (value /
              (newFormData.qty * newFormData.price - newFormData.discount)) *
            100
          ).toFixed(2)
        );
        newFormData = {
          ...newFormData,
          tax: value,
          taxPercentage,
          totalPrice: calculateTotalPrice({ ...newFormData, tax: value }),
        };
      }

      return newFormData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      Object.keys(formData).some(
        (field) => formData[field] < (fieldValidation[field]?.min || 0)
      )
    ) {
      return;
    }

    const { qty, price, discount, discountPercentage, taxPercentage } =
      formData;
    if (
      discount > qty * price ||
      taxPercentage > 100 ||
      discountPercentage > 100
    ) {
      return;
    }

    handleAddInvoice(formData);
    setFormData({
      qty: 0,
      price: 0,
      discountPercentage: 0,
      discount: 0,
      taxPercentage: 0,
      tax: 0,
      totalPrice: 0,
    });
  };

  const fieldValidation = {
    qty: { required: true, min: 1 },
    price: { required: true, min: 0.01, step: 0.01 },
    discountPercentage: { required: true, min: 0, max: 100, step: 0.01 },
    discount: { required: true, min: 0, step: 0.01 },
    taxPercentage: { required: true, min: 0, max: 100, step: 0.01 },
    tax: { required: true, min: 0, step: 0.01 },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
        p={3}
        bgcolor="#f0f0f0"
        borderRadius="8px"
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
      >
        {[
          "qty",
          "price",
          "discountPercentage",
          "discount",
          "taxPercentage",
          "tax",
        ].map((field) => (
          <Box key={field} width="100%">
            <InputLabel>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </InputLabel>
            <OutlinedInput
              fullWidth
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              type="number"
              value={formData[field]}
              onChange={(e) => handleChange(field, Number(e.target.value))}
              sx={{
                marginTop: "8px",
                "& input": {
                  backgroundColor: "#fff",
                  color: "#333",
                  fontSize: "16px",
                  border: "2px solid #ccc",
                  borderRadius: "6px",
                  padding: "8px",
                  transition: "border-color 0.3s ease",
                  "&:focus": {
                    outline: "none",
                    borderColor: "orange",
                  },
                },
              }}
            />
          </Box>
        ))}
        <Box width="100%">
          <InputLabel>Total Price</InputLabel>
          <OutlinedInput
            fullWidth
            type="number"
            value={formData.totalPrice}
            disabled
            sx={{
              marginTop: "8px",
              "& input": {
                backgroundColor: "#f0f0f0",
                color: "#333",
                fontSize: "16px",
                border: "2px solid #ccc",
                borderRadius: "6px",
                padding: "8px",
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            backgroundColor: Object.keys(formData).some(
              (field) => formData[field] < (fieldValidation[field]?.min || 0)
            )
              ? "lightgray" // Change color for invalid form
              : "green", // Default color for valid form
            color: "white",
            borderRadius: "12px",
            padding: "10px 20px",
            "&:hover": {
              backgroundColor: Object.keys(formData).some(
                (field) => formData[field] < (fieldValidation[field]?.min || 0)
              )
                ? "lightgray" // Change hover color for invalid form
                : "darkgreen", // Default hover color for valid form
            },
          }}
        >
          Add Invoice
        </Button>
      </Box>
    </form>
  );
}

export default InvoiceForm;
