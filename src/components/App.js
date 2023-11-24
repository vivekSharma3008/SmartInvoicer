import React, { useState } from "react";
import { Container } from "@mui/material";
import InvoiceForm from "./InvoiceForm";
import InvoiceGrid from "./InvoiceGrid";

function App() {
  const [invoices, setInvoices] = useState([]);

  const handleAddInvoice = (invoice) => {
    const newInvoice = { id: Date.now(), ...invoice };
    setInvoices([...invoices, newInvoice]);
  };

  const headingStyle = {
    textAlign: "center",
    color: "#333",
    fontFamily: "Arial, sans-serif",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginTop: "20px",
  };

  const fields = [
    {
      name: "Qty",
      accessor: "qty",
      editable: true,
    },
    {
      name: "Price",
      accessor: "price",
      editable: true,
    },
    {
      name: "Discount %",
      accessor: "discountPercentage",
      editable: true,
    },
    {
      name: "Discount",
      accessor: "discount",
      editable: false,
    },
    {
      name: "Tax %",
      accessor: "taxPercentage",
      editable: true,
    },
    {
      name: "Tax",
      accessor: "tax",
      editable: false,
    },
    {
      name: "Total Price",
      accessor: "totalPrice",
      editable: false,
    },
  ];

  return (
    <Container maxWidth="md">
      <h1 style={headingStyle}>Smart Invoicer</h1>
      <br></br>
      <InvoiceForm handleAddInvoice={handleAddInvoice} fields={fields} />
      <br></br>
      <br></br>
      <br></br>
      <h1 style={headingStyle}>Invoices</h1>
      <br></br>
      <InvoiceGrid
        invoices={invoices}
        setInvoices={setInvoices}
        fields={fields}
      />
    </Container>
  );
}

export default App;
