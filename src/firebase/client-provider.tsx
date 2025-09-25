'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // A inicialização do Firebase agora acontece aqui, garantindo que seja apenas no cliente.
  const firebaseServices = useMemo(() => {
    // Esta função agora só é chamada no lado do cliente, onde as variáveis de ambiente estão disponíveis.
    return initializeFirebase();
  }, []); // O array de dependência vazio garante que isso rode apenas uma vez.

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
