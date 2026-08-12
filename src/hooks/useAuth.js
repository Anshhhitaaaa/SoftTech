import { useState } from 'react';

/**
 * Custom Hook to handle user authentication state & login modal lifecycle
 */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return {
    currentUser,
    setCurrentUser,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal
  };
}
