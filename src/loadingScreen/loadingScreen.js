import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './loadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-overlay">
      {/* <dotlottie-player
        src="https://lottie.host/1a54bcf6-19b7-4407-a582-50e08ba37eba/MGwLRbAair.lottie"
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px" }}  // ✅ Fixed style
        loop
        autoplay
      ></dotlottie-player> */}
      <DotLottieReact
        src="https://lottie.host/1a54bcf6-19b7-4407-a582-50e08ba37eba/MGwLRbAair.lottie"
        background="transparent"
        speed="1"
        style={{ width: "600px", height: "300px" }}
        loop
        autoplay
      />
    </div>
  );
}


export default LoadingScreen;
