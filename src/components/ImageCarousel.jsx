import React, { useState, useEffect } from 'react';
import { Box, Fade } from '@mui/material';

function ImageCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of image paths from the carrousel folder
  const images = [
    
    '/carrousel/pic (2).jpeg',
    '/carrousel/pic (4).jpeg',
    '/carrousel/pic (5).jpeg',
    '/carrousel/pic (17).jpeg',
   
    '/carrousel/pic (22).jpeg',
  ];

  // Auto-cycling effect - change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '60vh', // Increased height to better fit images
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={true} key={currentImageIndex} timeout={1000}>
        <Box
          component="img"
          src={images[currentImageIndex]}
          alt={`Carousel image ${currentImageIndex + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'fill', // Stretches images to fill the entire area, may distort aspect ratio
            objectPosition: 'center',
            transition: 'opacity 0.5s ease-in-out',
          }}
          onError={(e) => {
            e.target.onerror = null; // Prevents error loop
            e.target.src = `https://placehold.co/800x600/FFEDC6/D6BC7C?text=Image+Loading...&font=roboto`;
          }}
        />
      </Fade>
      
      {/* Optional: Add image indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: index === currentImageIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default ImageCarousel;
