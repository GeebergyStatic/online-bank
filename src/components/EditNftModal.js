// components/EditNftModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Spinner} from "react-bootstrap";

const EditNftModal = ({ show, onHide, editForm, setEditForm, handleUpdateNft, isEditLoading }) => {
  return (
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit NFT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          {/* <div className="mb-3">
            <label className="form-label">Creator Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.creatorName}
              onChange={(e) => setEditForm({ ...editForm, creatorName: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Collection Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.collectionName}
              onChange={(e) => setEditForm({ ...editForm, collectionName: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            />
          </div> */}

          <div className="mb-3">
            <label className="form-label">Bid Price (ETH)</label>
            <input
              type="number"
              className="form-control"
              value={editForm.bidPrice}
              onChange={(e) => setEditForm({ ...editForm, bidPrice: e.target.value })}
            />
          </div>

          {/* <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              rows="3"
              value={editForm.comment}
              onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
            ></textarea>
          </div> */}
        </form>
      </Modal.Body>
      <Modal.Footer>
      {isEditLoading ? (
            <Spinner animation="border" size="sm" variant='primary' />
          ):
          (
            <>
             <Button variant="secondary" onClick={onHide}>
               Cancel
             </Button>
             <Button variant="primary" onClick={handleUpdateNft}>
               Save Changes
             </Button>
            </>
          )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditNftModal;
