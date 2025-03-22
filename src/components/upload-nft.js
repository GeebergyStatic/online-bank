import React, { useState } from 'react';
import { Form, Button, Spinner } from "react-bootstrap";
import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';
import { useUserContext } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import "react-toastify/dist/ReactToastify.css";

const Upload = () => {
    const { userData } = useUserContext();
        const [formData, setFormData] = useState({
          creatorName: "",
          collectionName: "",
          file: null,
          category: "",
          bidPrice: "",
          comment: "",
        });
      
        const [uploading, setUploading] = useState(false);
        const [fileUrl, setFileUrl] = useState(null);
      
        // Handle Input Change
        const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
        };
      
        // Handle File Upload
        const handleFileUpload = async (e) => {
          const file = e.target.files[0];
          setFormData((prev) => ({ ...prev, file }));
      
          if (file) {
            setUploading(true);
            const storageRef = ref(storage, `nfts/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
      
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Optional: Track upload progress
              },
              (error) => {
                console.error("Upload error:", error);
                setUploading(false);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setFileUrl(downloadURL);
                setUploading(false);
              }
            );
          }
        };
      
        // Handle Form Submission
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!fileUrl) {
              alert("Please wait for file to finish uploading.");
              return;
            }
          
            const submissionData = {
              userId: userData.userID,
              ...formData,
              fileUrl, // Store uploaded file URL
              status: "pending", // Default status when submitting
            };
          
            try {
              const response = await fetch("http://localhost:5000/api/submit-nfts", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
              });
          
              const data = await response.json();
          
              if (response.ok) {
                toast.success("NFT submitted successfully!");
                console.log("NFT Submission Response:", data);
              } else {
                toast.error(data.message || "Failed to submit NFT.");
                console.error("Error:", data);
              }
            } catch (error) {
              toast.error("An error occurred while submitting NFT.");
              console.error("Submission Error:", error);
            }
          };
          

    return (
        <div className="container-large">
            <div className='container'>
            <div
      className="main-container p-4"
      style={{
        maxWidth: "900px",
        background: "#d6dee8", // Light grayish-blue
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        color: "#334155", // Dark blue-gray text
      }}
    >
      <h5 className="fw-bold">SUBMIT YOUR NFT FOR EVALUATION</h5>
      <span className="mt-3 text-secondary">NFT INFORMATION</span>

      <p className="text-center mt-3 mb-4 fw-bold text-primary" style={{ color: "#334155" }}>
        NOTE: GAS FEES OF ETH 0.10 WILL BE DEDUCTED FROM YOUR BALANCE FOR YOUR UPLOAD
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Creator's Name</Form.Label>
          <Form.Control
            type="text"
            name="creatorName"
            value={formData.creatorName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #b0b7c3" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Collection Name</Form.Label>
          <Form.Control
            type="text"
            name="collectionName"
            value={formData.collectionName}
            onChange={handleChange}
            placeholder="Enter collection name"
            required
            style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #b0b7c3" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload NFT File</Form.Label>
          <Form.Control type="file" onChange={handleFileUpload} required style={{ background: "#dfe3e8", color: "#334155" }} />
          {uploading && <Spinner animation="border" size="sm" className="ms-2 text-dark" />}
          {fileUrl && <p className="text-success mt-2">✅ File Uploaded Successfully!</p>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>The Category Your NFT Belongs In</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #b0b7c3" }}
          >
            <option value="">Select Category</option>
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="domain names">Domain Names</option>
            <option value="sports">Sports</option>
            <option value="collectible">Collectible</option>
            <option value="photography">Photography</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bid Price (ETH)</Form.Label>
          <Form.Control
            type="number"
            name="bidPrice"
            value={formData.bidPrice}
            onChange={handleChange}
            placeholder="Enter price in ETH"
            required
            style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #b0b7c3" }}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Describe Your NFT</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Describe your NFT..."
            style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #b0b7c3" }}
          />
        </Form.Group>

        <Button
          type="submit"
          variant="dark"
          style={{
            width: "100%",
            fontWeight: "bold",
            padding: "10px",
            borderRadius: "10px",
            background: "linear-gradient(90deg, #6aa9ff, #3b82f6)",
            color: "#fff",
            boxShadow: "0 4px 8px rgba(59, 130, 246, 0.5)",
          }}
        >
          🚀 Submit NFT
        </Button>
      </Form>
    </div>
            </div>
        </div>
    );
};

export default Upload;
