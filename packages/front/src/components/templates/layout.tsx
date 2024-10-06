import React from 'react';
import Navbar from '../molecules/Navbar';
import { AppBar, Box, Container, Toolbar } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';

interface LayoutProps {
  children: React.ReactNode;
}

const libraries = ['places', 'geometry'];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  
  return (
    <Box
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh'
      }}
    >
      <Container 
        sx={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: 0,
          paddingBottom: '56px'
        }}
      >
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
          libraries={libraries}>
          {children}
        </LoadScript>
      </Container>
      <AppBar 
        position="fixed" 
        sx={{ 
          top: 'auto', 
          bottom: 0 
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Navbar />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Layout;
