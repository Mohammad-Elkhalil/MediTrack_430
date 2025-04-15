import React, { createContext, useContext } from 'react';

interface EncryptionContextType {
  encrypt: (data: string) => string;
  decrypt: (data: string) => string;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export function EncryptionProvider({ children }: { children: React.ReactNode }) {
  // Basic encryption/decryption for now
  const encrypt = (data: string) => {
    return btoa(data);
  };

  const decrypt = (data: string) => {
    return atob(data);
  };

  return (
    <EncryptionContext.Provider value={{ encrypt, decrypt }}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
} 