import React, { createContext, useState, useContext } from "react";

interface ModalContextType {
  isModalOpen: boolean;
  openPopover: boolean;
  openModal: () => void;
  closeModal: () => void;
  popover: () => void;
}

const defaultContextValue: ModalContextType = {
  isModalOpen: false,
  openPopover: false,
  openModal: () => {},
  closeModal: () => {},
  popover: () => {},
};

export const ModalContext =
  createContext<ModalContextType>(defaultContextValue);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setOpenPopover(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const popover = () => setOpenPopover(!openPopover);
  return (
    <ModalContext.Provider
      value={{ isModalOpen, openModal, closeModal, openPopover, popover }}
    >
      {children}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modal Content</h2>
            <button onClick={closeModal}>Đóng Modal</button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
