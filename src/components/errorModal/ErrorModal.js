import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

function ErrorModal({ isOpen, onClose, errorMessage }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Error Modal"
      className="modal bg-white p-4 rounded-md shadow-md w-96"
      overlayClassName="overlay fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-900"
    >
      <div className="modal-content">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{errorMessage}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default ErrorModal;
