import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
const styles = {
  textField: {
    width: "auto",
    padding: "1px",
    borderRadius: "2px",
    outline: "none",
    transition: "border-color 0.3s ease-in-out",
    "&:focus": {
      borderColor: "#00FF00",
    },
  },
};

function InvoiceGrid({ invoices, setInvoices }) {
  const isFormValid = (data) => {
    const { qty, price, discount, tax, discountPercentage, taxPercentage } =
      data;
    if (qty <= 0 || price <= 0 || discount < 0 || tax < 0) return false;
    if (discount > qty * price) return false;
    if (discountPercentage > 100 || taxPercentage > 100) return false;
    return true;
  };

  const [state, setState] = useState({
    editingIndex: -1,
    gridData: invoices,
    SnackbarFlag: false,
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState((prevState) => ({ ...prevState, SnackbarFlag: false }));
  };

  useEffect(() => {
    setState((prevState) => ({ ...prevState, gridData: invoices }));
  }, [invoices]);

  const handleEdit = (index) => {
    setState((prevState) => ({ ...prevState, editingIndex: index }));
  };

  const handleSave = (index) => {
    if (!isFormValid(state.gridData[index])) {
      setState((prevState) => ({ ...prevState, SnackbarFlag: true }));
      return;
    }

    const updatedInvoices = invoices.map((inv) =>
      inv.id === state.gridData[index].id ? state.gridData[index] : inv
    );
    setInvoices(updatedInvoices);
    setState((prevState) => ({
      ...prevState,
      editingIndex: -1,
      SnackbarFlag: false,
    }));
  };
  const handleDelete = (index) => {
    const updatedInvoices = state.gridData.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    setState((prevState) => ({
      ...prevState,
      gridData: updatedInvoices,
      SnackbarFlag: false,
    }));
  };

  const handleChange = (index, field, value) => {
    let newGridData = [...state.gridData];

    if (field === "discountPercentage" || field === "taxPercentage") {
      value = Math.min(100, value);
    }
    newGridData[index] = { ...state.gridData[index], [field]: value };

    if (field === "qty" || field === "price") {
      const discount = parseFloat(
        (
          (newGridData[index].discountPercentage / 100) *
          newGridData[index].qty *
          newGridData[index].price
        ).toFixed(2)
      );
      const tax = parseFloat(
        (
          (newGridData[index].taxPercentage / 100) *
          (newGridData[index].qty * newGridData[index].price - discount)
        ).toFixed(2)
      );
      newGridData[index] = {
        ...newGridData[index],
        discount,
        tax,
        totalPrice:
          newGridData[index].price * newGridData[index].qty - discount + tax,
      };
    } else if (field === "discount") {
      const discountPercentage = parseFloat(
        (
          (value / (newGridData[index].qty * newGridData[index].price)) *
          100
        ).toFixed(2)
      );
      newGridData[index] = {
        ...newGridData[index],
        discount: value,
        discountPercentage,
        totalPrice:
          newGridData[index].price * newGridData[index].qty -
          value +
          newGridData[index].tax,
      };
    } else if (field === "discountPercentage") {
      const discount = parseFloat(
        (
          (value / 100) *
          newGridData[index].qty *
          newGridData[index].price
        ).toFixed(2)
      );
      newGridData[index] = {
        ...newGridData[index],
        discount,
        discountPercentage: value,
        totalPrice:
          newGridData[index].price * newGridData[index].qty -
          discount +
          newGridData[index].tax,
      };
    } else if (field === "tax") {
      const taxPercentage = parseFloat(
        (
          (value /
            (newGridData[index].qty * newGridData[index].price -
              newGridData[index].discount)) *
          100
        ).toFixed(2)
      );
      newGridData[index] = {
        ...newGridData[index],
        tax: value,
        taxPercentage,
        totalPrice:
          newGridData[index].price * newGridData[index].qty -
          newGridData[index].discount +
          value,
      };
    } else if (field === "taxPercentage") {
      const tax = parseFloat(
        (
          (value / 100) *
          (newGridData[index].qty * newGridData[index].price -
            newGridData[index].discount)
        ).toFixed(2)
      );
      newGridData[index] = {
        ...newGridData[index],
        tax,
        taxPercentage: value,
        totalPrice:
          newGridData[index].price * newGridData[index].qty -
          newGridData[index].discount +
          tax,
      };
    }

    setState((prevState) => ({ ...prevState, gridData: newGridData }));
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table sx={{ minWidth: 650, "& th, & td": { fontSize: "16px" } }}>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount %</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Tax %</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.gridData.map((invoice, index) => (
              <TableRow key={invoice.id}>
                {state.editingIndex === index ? (
                  <>
                    <TableCell>
                      <TextField
                        type="number"
                        value={invoice.qty}
                        onChange={(e) =>
                          handleChange(index, "qty", Number(e.target.value))
                        }
                        sx={styles.textField}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={invoice.price}
                        onChange={(e) =>
                          handleChange(index, "price", Number(e.target.value))
                        }
                        sx={styles.textField}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={invoice.discountPercentage}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "discountPercentage",
                            Number(e.target.value)
                          )
                        }
                        sx={styles.textField}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={invoice.discount}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "discount",
                            Number(e.target.value)
                          )
                        }
                        sx={styles.textField}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={invoice.taxPercentage}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "taxPercentage",
                            Number(e.target.value)
                          )
                        }
                        sx={styles.textField}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={invoice.tax}
                        onChange={(e) =>
                          handleChange(index, "tax", Number(e.target.value))
                        }
                        sx={styles.textField}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={invoice.totalPrice}
                        disabled
                        sx={styles.textField}
                      />
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{invoice.qty}</TableCell>
                    <TableCell>{invoice.price}</TableCell>
                    <TableCell>{invoice.discountPercentage}</TableCell>
                    <TableCell>{invoice.discount}</TableCell>
                    <TableCell>{invoice.taxPercentage}</TableCell>
                    <TableCell>{invoice.tax}</TableCell>
                    <TableCell>{invoice.totalPrice}</TableCell>
                  </>
                )}
                <TableCell>
                  {state.editingIndex === index ? (
                    <IconButton onClick={() => handleSave(index)}>
                      <Save />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEdit(index)}>
                      <Edit />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  {
                    <IconButton onClick={() => handleDelete(index)}>
                      <DeleteIcon />{" "}
                      {/* Replace with your Material-UI delete icon */}
                    </IconButton>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={state.SnackbarFlag}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Invalid input.
        </Alert>
      </Snackbar>
    </>
  );
}

export default InvoiceGrid;
