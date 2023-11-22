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

  return (
    <Container maxWidth="md">
      <h1 style={headingStyle}>SmartInvoicer</h1>
      <br></br>
      <InvoiceForm handleAddInvoice={handleAddInvoice} />
      <br></br>
      <br></br>
      <br></br>
      <h1 style={headingStyle}>Invoices</h1>
      <br></br>
      <InvoiceGrid invoices={invoices} setInvoices={setInvoices} />
    </Container>
  );
}

export default App;
