"use client";
import React, { useEffect, useRef } from "react";

const RemoveWhiteBackground = ({ imageUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();

    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      // Set canvas dimensions to match the image while maintaining aspect ratio
      const maxWidth = 320;
      const maxHeight = 320;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Remove white background
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Adjust this threshold if needed (240 is quite sensitive)
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0; // Set alpha to transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    return () => {
      // Cleanup
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block"
      }}
    />
  );
};

export default RemoveWhiteBackground;