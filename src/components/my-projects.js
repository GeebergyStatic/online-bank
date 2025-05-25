import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useUserContext } from './UserRoleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const MyProjects = () => {
  const { userData } = useUserContext();
  const userId = userData?.userID;
  const agentID = userData?.role === "agent" ? userData?.agentID : null;
  const [isLoading, setIsLoading] = useState(false);

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(null);

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      const endpoint = userData?.role === "agent"
        ? `https://nft-broker.onrender.com/api/pending-nfts-onsale/${agentID}`
        : `https://nft-broker.onrender.com/api/fetch-nft-user/${userId}`;

      const response = await axios.get(endpoint);
      setNfts(response.data?.nfts || response.data); // support both data shapes
    } catch (error) {
      // toast.error("Error fetching NFTs.", { className: "custom-toast" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchNFTs();
  }, [userId]);

  const handleDelete = async (nftId) => {
    try {
      await axios.delete(`https://nft-broker.onrender.com/api/delete-nfts/${nftId}`);
      toast.success("NFT deleted successfully.");
      fetchNFTs();
    } catch (error) {
      console.error("Error deleting NFT:", error);
      toast.error("Failed to delete NFT.");
    }
  };

  const handlePublish = async (nftId) => {
    setIsLoading(true);
    try {
      await axios.put(`https://nft-broker.onrender.com/api/publish-nft/${nftId}`, {
        status: 'on sale'
      });
      toast.success("NFT published successfully!", { className: "custom-toast" });
      setIsLoading(false);
      fetchNFTs();
    } catch (error) {
      toast.error("Error publishing NFT.", { className: "custom-toast" });
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleAgentPurchase = async (nftId, collectionName, creatorName, bidPrice) => {
    setIsLoading(true);
    try {
      await axios.post('https://nft-broker.onrender.com/api/agent-nft-purchase', {
        nftId,
        collectionName,
        creatorName,
        bidPrice,
        agentID: userData.agentID
      });
      toast.success("NFT purchased and user return updated!");
      setIsLoading(false);
      fetchNFTs();
    } catch (error) {
      toast.error("Purchase failed.", { className: "custom-toast" });
      setIsLoading(false);
      console.error("Error purchasing NFT:", error);
    }
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      approved: "success",
      denied: "danger",
      sold: "secondary",
      "on sale": "warning",
      default: "warning"
    };
    return statusMap[status] || statusMap.default;
  };

  const renderNFTCard = (nft) => (
    <Col key={nft._id} md={4} className="mb-4">
      <Card className="shadow-lg nft-slide" style={{ width: "100%" }}>
        <Card.Img
          variant="top"
          src={nft.fileUrl}
          alt={nft.collectionName}
          style={{ height: "250px", objectFit: "cover" }}
        />

        {/* 3-dot menu */}
        <div
          className="position-absolute text-white"
          style={{ top: "10px", right: "10px", cursor: "pointer", zIndex: 10 }}
          onClick={() => setShowDropdown(showDropdown === nft._id ? null : nft._id)}
        >
          <FontAwesomeIcon icon={faEllipsisV} size="lg" />
        </div>

        {showDropdown === nft._id && (
          <div className="position-absolute bg-white shadow-lg p-2 rounded" style={{ top: "35px", right: "10px", zIndex: 20 }}>
            <div
              className="d-flex align-items-center text-danger p-2"
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(nft._id)}
            >
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Delete NFT
            </div>
          </div>
        )}

        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold">{nft.collectionName}</h5>
            <Badge bg={renderStatusBadge(nft.status)} style={{fontSize: '15px'}} className={userData?.role === 'agent' ? 'p-2' : ''}>
              {userData?.role === 'agent' ? "New Bid 🔥" : nft.status}
            </Badge>
          </div>
          <p className="text-muted">Created by: {nft.creatorName}</p>

          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold text-primary">{nft.bidPrice} ETH</span>

            {userData?.role === 'agent' ? (
              <Button
                variant="dark"
                size="sm"
                onClick={() => handleAgentPurchase(nft._id, nft.collectionName, nft.creatorName, nft.bidPrice)}
                disabled={nft.status !== 'on sale' || isLoading}
              >
                {isLoading ? (
            <Spinner animation="border" size="sm" className="text-white" />
          ):
          (
            <span>
             Buy
            </span>
          )}
              </Button>
            ) : (
              nft.status !== "on sale" && nft.status !== "denied" && nft.status !== "sold" && (
                <Button
                  variant={nft.status === "approved" ? "success" : "dark"}
                  size="sm"
                  onClick={() => handlePublish(nft._id)}
                  disabled={nft.status === 'pending' || !userData.isUserActive || isLoading}
                >
                  {isLoading ? (
            <Spinner animation="border" size="sm" className="text-white" />
          ):
          (
            <span>
             Publish
            </span>
          )}
                  
                </Button>
              )
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="container-large">
      <Container className="mt-4">
        <ToastContainer />
        <div className="main-container">
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              {userData?.role === 'agent' ? (
                <p className="mt-2 text-secondary">Loading your clients' projects...</p>
              ):(
                <p className="mt-2 text-secondary">Loading your projects...</p>
              )}
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center text-secondary fw-bold">
              
              {userData?.role === 'agent' ? (
                <p className="mt-2 text-secondary">Your clients don't currently have any published projects.</p>
              ):(
                <p className="mt-2 text-secondary">You currently don't have any projects.</p>
              )}
            </div>
          ) : (
            <Row className="justify-content-center">
              {userData?.role === 'agent' ? (
                <span className="text-warning mb-3">
                  <FontAwesomeIcon className="mx-2" icon={faInfoCircle} />
                  You can buy a client's NFT to credit their account with the value of the project.
                </span>
              ) : !userData?.isUserActive ? (
                <span className="text-warning mb-3">
                  <FontAwesomeIcon className="mx-2" icon={faInfoCircle} />
                  You need a publisher's license (i.e be verified) to publish projects.
                </span>
              ) : null}

              {nfts.map(renderNFTCard)}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
};

export default MyProjects;
