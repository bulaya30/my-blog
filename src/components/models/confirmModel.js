import React from 'react';
// import './ConfirmModal.css'; // optional, for styling

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}       
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()} 
        
      >
        <p>{message}</p>
        <div className='modal-btn-container'>
          <button
            onClick={onCancel}
            className="btn btn-sm cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-sm confirm-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
