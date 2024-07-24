import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './dashboard/dashboard';
import RemoveNukki from './dashboard/removeNukki';
import ImageTo3D from './dashboard/imageTo3D';
import { ComfyProvider } from './comfy/ComfyProvider';
import MainPage from './Pages/MainPage';
import ToggleColorMode from './dashboard/ToggleColorMode';
import ImageToImage from "./dashboard/imageToImage";

interface AppProps {
  colorMode: 'light' | 'dark';
  setColorMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

const App: React.FC<AppProps> = ({ colorMode, setColorMode }) => {
  return (
    <ComfyProvider>
      <Router>
      <ToggleColorMode colorMode={colorMode} setColorMode={setColorMode} />
        <Routes>
          <Route path="/root" element={<MainPage />} /> {/* 새로운 페이지 */}
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/removeNukki" element={<RemoveNukki/>} />
          <Route path="/imageToImage" element={<ImageToImage/>} />
          <Route path="/imageTo3D" element={<ImageTo3D/>} />
        </Routes>
      </Router>
    </ComfyProvider>
  );
};

export default App;
