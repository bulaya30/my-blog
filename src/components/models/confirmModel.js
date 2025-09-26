import React, { useState, useEffect } from "react";

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isVisible, setIsVisible] = useState(show);

  // Sync visibility with show prop
  useEffect(() => {
    if (show) setIsVisible(true);
  }, [show]);

  const handleDeleteClick = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsVisible(false); // hide modal
      onConfirm(); // call parent confirm
    }, 400); // shake duration
  };

  const handleCancelClick = () => {
    setIsVisible(false); // hide modal
    setTimeout(() => onCancel(), 300); // optional fade-out delay
  };

  if (!isVisible) return null;

  return (
    <div className="custom-modal-backdrop" onClick={handleCancelClick}>
      <div
        className={`custom-modal-dialog ${isShaking ? "shake" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-header">
          <h5 className="custom-modal-title">Confirm Deletion</h5>
          <button className="close-btn" onClick={handleCancelClick}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body">
          <p>{message}</p>
        </div>
        <div className="custom-modal-footer">
          <button className="btn btn-sm btn-secondary" onClick={handleCancelClick}>
            Cancel
          </button>
          <button className="btn btn-sm btn-danger" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
