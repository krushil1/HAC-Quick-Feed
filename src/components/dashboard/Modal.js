import React from "react";
import PropTypes from "prop-types";

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto">
      <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        {/* Modal content */}
        <div className="modal-content">
          <div className="modal-header flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <button className="modal-close" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="modal-body mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
