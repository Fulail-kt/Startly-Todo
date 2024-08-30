import React from "react";

interface ModalProps {
  title: string;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2">{content}</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
