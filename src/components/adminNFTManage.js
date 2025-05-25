import React, { useState, useEffect } from 'react';
import { useUserContext } from './UserRoleContext';
import { Container, Row, Col, Card, Badge, Form, Button, Spinner, Modal } from "react-bootstrap";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEllipsisV, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import EditNftModal from './EditNftModal';
import axios from "axios";

const NftManagement = () => { // Rename the function to start with an uppercase letter
  const { userData, currentUser } = useUserContext();
  const [tasks, setTasks] = useState([]);
  const [btcTx, setBtcTx] = useState([]);
  const userId = userData.userID;
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editingNft, setEditingNft] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
  creatorName: "",
  collectionName: "",
  category: "",
  bidPrice: "",
  comment: "",
});

useEffect(() => {
  if (editingNft) {
    setEditForm({
      creatorName: editingNft.creatorName,
      collectionName: editingNft.collectionName,
      category: editingNft.category,
      bidPrice: editingNft.bidPrice,
      comment: editingNft.comment,
    });
  }
}, [editingNft]);


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
  const [showDropdown, setShowDropdown] = useState(null);

  const handleDelete = async (nftId) => {
    try {
      await axios.delete(`https://nft-broker.onrender.com/api/delete-nfts/${nftId}`);
      setNfts(nfts.filter(nft => nft._id !== nftId)); // Remove from UI after update
    } catch (error) {
      console.error("Error deleting NFT:", error);
    }
  };


  const fetchUserNFTs = async () => {
    try {
      const response = await fetch(
        `https://nft-broker.onrender.com/api/fetch-nft-user/${userId}`
      );
      const data = await response.json();
      if (response.ok) {
        setNfts(data);
      } else {
        toast.error("Error fetching NFTs: " + data.message);
      }
    } catch (error) {
      console.log("Fetch error: " + error.message);
    }
  };
  
  useEffect(() => {
    fetchUserNFTs();
  }, [userId]);
  



  const handleUpdateNft = async () => {
    setIsEditLoading(true);
    try {
      const response = await fetch(`https://nft-broker.onrender.com/api/edit-nft/${editingNft.creatorName}/${editingNft.collectionName}/${editingNft.agentID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setShowEditModal(false);
        toast.success("NFT edited successfully: ");
        setIsEditLoading(false);
        fetchUserNFTs(); // Refresh list
      } else {
        console.error("Update failed:", result.message);
        setIsEditLoading(false);
        toast.error("NFT edit failed: " + result.message);
      }
    } catch (error) {
      console.error("Error updating NFT:", error.message);
      setIsEditLoading(false);
    }
  };
  

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

      setIsLoading(true);
    
      const submissionData = {
        userId: userData.userID,
        ...formData,
        fileUrl, // Store uploaded file URL
        agentID: userData.agentID ? userData.agentID : 'none',
        fromAgent: true,
        status: "pending", // Default status when submitting
      };
    
      try {
        const response = await fetch("https://nft-broker.onrender.com/api/submit-nfts", {
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
          setIsLoading(false);
        } else {
          // Handle specific backend errors
          if (data.message === "Insufficient balance.") {
            toast.error("Insufficient balance for gas fees.");
          } else if (data.message === "User not found.") {
            toast.error("User not found. Please log in again.");
          } else {
            toast.error(data.message || "Failed to submit NFT.");
          }
          console.error("Error:", data);
          setIsLoading(false);
        }
    
      } catch (error) {
        toast.error("An error occurred while submitting NFT.");
        console.error("Submission Error:", error);
        setIsLoading(false);
      }
    };
    


    const containerStyle = {
      // position: 'absolute',
      minHeight: '100vh',
      maxHeight: '700px', 
      background: "linear-gradient(90deg, rgba(200, 220, 240, 0.9) 0%, rgba(220, 230, 250, 0.85) 100%)",
      overflow: 'scroll',
      color: '#000',
      padding: '30px',
      // borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      // marginTop: '20px',
    };


  return (
    <>
    <EditNftModal
  show={showEditModal}
  onHide={() => setShowEditModal(false)}
  editForm={editForm}
  setEditForm={setEditForm}
  handleUpdateNft={handleUpdateNft}
  isEditLoading={isEditLoading}
/>
    <div className="container-large">
            <div className='container'>
            <div
      className="main-container p-4"
      style={{
        ...containerStyle,
        maxWidth: "900px",
        background: "#d6dee8", // Light grayish-blue
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        color: "#334155", // Dark blue-gray text
      }}
    >
      <h5 className="fw-bold">SUBMIT NFT FOR CLIENT TO BUY</h5>
      <div className="mt-3 text-secondary">NFT INFORMATION</div>
      <span className='text-warning mb-1'><FontAwesomeIcon className='mx-2' icon={faInfoCircle} />This page is different from your clients' page. Whatever you upload here will be shown as an NFT for your clients to buy on their "Buy NFT" page. The details in this form will be used in uploading the NFT and will be seen by the clients!</span>


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

        
        <span className='text-warning mb-1'><FontAwesomeIcon className='mx-2' icon={faInfoCircle} />This is the price of the NFT in ETH that the clients will see (This is how much they will pay for it)!</span>
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
        disabled={isLoading} // ✅ Correct way to disable button when loading
  type="submit"
  variant="dark"
  style={{
    width: "50%", // Adjust width to make it shorter
    fontWeight: "bold",
    padding: "10px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6a11cb)",
    color: "#fff",
    boxShadow: "0 4px 8px rgba(59, 130, 246, 0.5)",
    display: "block", // Ensure centering works
    margin: "0 auto", // Center horizontally
    textAlign: "center", // Align text properly
  }}
>
   {isLoading ? (
            <Spinner animation="border" size="sm" className="text-white" />
          ):
          (
            <span>
             Submit NFT
            </span>
          )}
</Button>

      </Form>
    </div>
            </div>

            {/* nft list */}
            <Container className="mt-4 text-dark">
      <ToastContainer />

      <div className="main-container">
      <h5 className='text-dark'>Published NFTs</h5>
      {nfts.length === 0 ? (
        <div className="text-center text-secondary fw-bold">
          You currently don't have any projects.
        </div>
      ) : (
        <Row className="justify-content-center">
      <span className="text-warning mb-1">
        <FontAwesomeIcon className="mx-2" icon={faInfoCircle} />
        These are your current uploaded NFTs. These are the NFTs your clients will see available to purchase/buy!
      </span>
      {nfts.map((nft, index) => (
        <Col key={nft._id} md={4} className="mb-4 position-relative">
          <Card className="shadow-lg nft-slide" style={{ width: "100%" }}>
            {/* NFT Image */}
            <Card.Img variant="top" src={nft.fileUrl} alt={nft.collectionName} style={{ height: "250px", objectFit: "cover" }} />

            {/* Options Menu (3 Dots) */}
            <div
              className="position-absolute text-white"
              style={{ top: "10px", right: "10px", cursor: "pointer", zIndex: 10 }}
              onClick={() => setShowDropdown(showDropdown === nft._id ? null : nft._id)}
            >
              <FontAwesomeIcon icon={faEllipsisV} size="lg" />
            </div>

            {/* Dropdown Menu */}
            {showDropdown === nft._id && (
              <div
                className="position-absolute bg-white shadow-lg p-2 rounded"
                style={{ top: "35px", right: "10px", zIndex: 20 }}
              >
                <div
                  className="d-flex align-items-center text-danger p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(nft._id)}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Delete NFT
                </div>
                <div
                  className="d-flex align-items-center text-primary p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setEditingNft(nft);
                    setShowEditModal(true);
                    setShowDropdown(null); // close dropdown
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit NFT
                </div>
              </div>
            )}


            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold">{nft.collectionName}</h5>
                <Badge bg={nft.status === "successful" ? "success" : nft.status === "failed" ? "danger" : "warning"} className="p-2">
                  New Bid 🔥
                </Badge>
              </div>
              <p className="text-muted">Created by: {nft.creatorName}</p>
              <div className="d-flex justify-content-between">
                <span className="fw-bold text-primary">{nft.bidPrice} ETH</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
      )}
      </div>
    </Container>

        </div>
        </>
  );
};

export default NftManagement;
