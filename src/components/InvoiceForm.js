import { Button } from "@mui/material";
import { Box, OutlinedInput, InputLabel } from "@mui/material";
import { useState } from "react";
import { isFormValid } from "../helpers/helper";

function InvoiceForm({ handleAddInvoice, fields }) {
  const [formData, setFormData] = useState({
    qty: 0,
    price: 0,
    discountPercentage: 0,
    discount: 0,
    taxPercentage: 0,
    tax: 0,
    totalPrice: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid(formData)) return;

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

  const handleChange = (event) => {
    const { id, value } = event.target;

    const newFormData = { ...formData, [id]: value };

    const amount = parseFloat(newFormData.price) * parseFloat(newFormData.qty);

    const newDiscount = (
      (amount * parseFloat(newFormData.discountPercentage)) /
      100
    ).toFixed(2);

    const newTax = (
      (amount * parseFloat(newFormData.taxPercentage)) /
      100
    ).toFixed(2);

    const newTotalPrice = (
      amount -
      parseFloat(newDiscount) +
      parseFloat(newTax)
    ).toFixed(2);

    setFormData({
      ...newFormData,
      discount: newDiscount,
      tax: newTax,
      totalPrice: newTotalPrice,
    });
  };

  const backgroundColor = isFormValid(formData) ? "green" : "lightgray";
  const hoverBackgroundColor = isFormValid(formData)
    ? "darkgreen"
    : "lightgray";

  const style = {
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
        {fields.map((field) => (
          <Box width="100%">
            <InputLabel>{field.name}</InputLabel>
            <OutlinedInput
              id={field.accessor}
              fullWidth
              disabled={
                field.accessor === "totalPrice" ||
                field.accessor === "discount" ||
                field.accessor === "tax"
              }
              type="number"
              value={formData[field.accessor]}
              onChange={handleChange}
              sx={style}
            />
          </Box>
        ))}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            backgroundColor: backgroundColor,
            color: "white",
            borderRadius: "12px",
            padding: "10px 20px",
            "&:hover": {
              backgroundColor: hoverBackgroundColor,
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
