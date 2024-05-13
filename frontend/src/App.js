import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes';
import { SocketProvider } from './SocketContext';

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <RoutesApp />
      </SocketProvider>
    </BrowserRouter>
  );
}
