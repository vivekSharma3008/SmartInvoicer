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
import { isFormValid } from "../helpers/helper";
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

function InvoiceGrid({ invoices, setInvoices, fields }) {
  const columns = [
    { name: "Index", accessor: (_, index) => index + 1 },
    ...fields,
  ];

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
    newGridData[index] = { ...newGridData[index], [field]: value };

    const amount =
      parseFloat(newGridData[index].price) * parseFloat(newGridData[index].qty);

    const newDiscount = (
      (amount * parseFloat(newGridData[index].discountPercentage)) /
      100
    ).toFixed(2);

    const newTax = (
      (amount * parseFloat(newGridData[index].taxPercentage)) /
      100
    ).toFixed(2);

    const newTotalPrice = (
      amount -
      parseFloat(newDiscount) +
      parseFloat(newTax)
    ).toFixed(2);

    newGridData[index] = {
      ...newGridData[index],
      discount: newDiscount,
      tax: newTax,
      totalPrice: newTotalPrice,
    };

    setState((prevState) => ({ ...prevState, gridData: newGridData }));
  };

  const renderTableHead = () => (
    <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.name}>{column.name}</TableCell>
        ))}
        <TableCell key={"Manage"}>{"Manage"}</TableCell>
      </TableRow>
    </TableHead>
  );

  const renderTableRows = () => (
    <TableBody>
      {state.gridData.map((invoice, index) => (
        <TableRow key={invoice.id}>
          {columns.map((column, colIndex) => {
            let value;
            if (typeof column.accessor === "function") {
              value = column.accessor(invoice, index);
            } else {
              value = invoice[column.accessor];
            }

            const isEditing = state.editingIndex === index && column.editable;
            return (
              <TableCell key={colIndex}>
                {isEditing ? (
                  <TextField
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleChange(
                        index,
                        column.accessor,
                        Number(e.target.value)
                      )
                    }
                    sx={styles.textField}
                  />
                ) : (
                  value
                )}
              </TableCell>
            );
          })}
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
            {
              <IconButton
                onClick={() => handleDelete(index)}
                sx={{ color: "red" }}
              >
                <DeleteIcon />
              </IconButton>
            }
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table sx={{ minWidth: 650, "& th, & td": { fontSize: "16px" } }}>
          {renderTableHead()}
          {renderTableRows()}
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
