import { useState, useCallback } from "react";

const useModal = () => {
  const [visible, setVisible] = useState(false);

  const showModal = useCallback(() => {
    setVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    showModal,
    hideModal,
  };
};

export default useModal;
