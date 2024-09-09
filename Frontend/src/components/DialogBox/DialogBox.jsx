import React from 'react';
import './DialogBox.css';

const DialogBox = ({ 
  show, 
  onClose, 
  onConfirm, 
  dialogText, 
  confirmText = "Yes, I'm sure", 
  cancelText = "No, cancel", 
  icon = null 
}) => {
  // If `show` is false, don't render the modal
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          <svg className="modal-close-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          
        </button>

        <div className="modal-content">
          {icon && <div className="modal-icon">{icon}</div>}
          <h3 className="modal-text">{dialogText}</h3>
          <div className="modal-actions">
            <button className="btn-confirm" onClick={onConfirm}>
              {confirmText}
            </button>
            <button className="btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
