import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useUserContext } from './UserRoleContext';
import "react-toastify/dist/ReactToastify.css";

const MyProjects = () => {
  const { userData } = useUserContext();
  const userId = userData.userID;
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/fetch-nft-user/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setNfts(data);
        } else {
          toast.error("Error fetching NFTs: " + data.message);
        }
      } catch (error) {
        toast.error("Fetch error: " + error.message);
      }
    };

    fetchUserNFTs();
  }, [userId]);

  return (
    <div className="container-large">
        <Container className="mt-4">
      <ToastContainer />

      <div className="main-container">
      {nfts.length === 0 ? (
        <div className="text-center text-secondary fw-bold">
          You currently don't have any projects.
        </div>
      ) : (
        <Row className="justify-content-center">
          {nfts.map((nft, index) => (
            <Col key={nft._id} md={4} className="mb-4">
              <Card className="shadow-lg nft-slide" style={{ width: "100%" }}>
                <Card.Img
                  variant="top"
                  src={nft.fileUrl}
                  alt={nft.collectionName}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold">{nft.collectionName}</h5>
                    <Badge
                      bg={
                        nft.status === "successful"
                          ? "success"
                          : nft.status === "failed"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {nft.status}
                    </Badge>
                  </div>
                  <p className="text-muted">Created by: {nft.creatorName}</p>
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold text-primary">
                      {nft.bidPrice} ETH
                    </span>
                    <Button variant="dark" size="sm">
                      Bid Now
                    </Button>
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
    
  );
};

export default MyProjects;
