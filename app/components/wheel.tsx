import React, { useRef, useState, useEffect, useCallback } from 'react';
import Logo from './images/logo.png'; // Replace with your image path

interface WheelSpinnerProps {
  items: string[];
  onComplete: (result: string) => void;
}

const WheelSpinner: React.FC<WheelSpinnerProps> = ({ items, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [lightPhase, setLightPhase] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  useEffect(() => {
    const img = new Image();
    img.src = Logo.src;
    img.onload = () => setImage(img);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLightPhase((prev) => (prev + 1) % 100); // Slowed down the animation by increasing the modulus value
    }, 200); // Update every 200 milliseconds (0.2 seconds)
    return () => clearInterval(interval);
  }, []);

  const handleResize = useCallback(() => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    setCanvasSize({ width: size, height: size });
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    const baseAngle = Math.floor(Math.random() * 360); // Random base angle
    const spinAngle = 360 * 3 + baseAngle; // Spin at least 3 full rotations plus the base angle
    const duration = 7000; // Duration of the spin animation in milliseconds

    let start: number | undefined;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;

      // Ease out function
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
      const easedProgress = easeOut(progress / duration);

      const currentAngle = easedProgress * spinAngle;
      setAngle((prevAngle) => (prevAngle + currentAngle) % 360);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        const finalAngle = (angle + spinAngle) % 360;
        const selectedIndex = Math.floor((360 - finalAngle + 90) % 360 / (360 / items.length));
        setAngle(finalAngle);
        onComplete(items[selectedIndex]);
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20; // Adjusted to ensure no clipping
    const sliceAngle = 360 / items.length;

    // Rotate the wheel itself for the spinning effect
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180); // Convert angle to radians

    items.forEach((item, index) => {
      const startAngle = (index * sliceAngle * Math.PI) / 180;
      const endAngle = ((index + 1) * sliceAngle * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(index * 360) / items.length}, 100%, 50%)`;
      ctx.fill();

      // Add a white border to each section
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 20;
      ctx.stroke();

      // Draw the text in the center of each section
      const textAngle = (startAngle + endAngle) / 2;
      ctx.save();
      ctx.rotate(textAngle);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(item, radius / 2, 0); // Position the text in the center of the section
      ctx.restore();
    });

    ctx.restore();

    // Define an array of light blue colors
    const lightBlues = [
      'rgba(173, 216, 230, 0.8)', // light blue
      'rgba(135, 206, 235, 0.8)', // sky blue
      'rgba(0, 191, 255, 0.8)',   // deep sky blue
      'rgba(176, 224, 230, 0.8)', // powder blue
      'rgba(0, 255, 255, 0.8)',   // cyan
    ];

    // Draw the lights along the white border
    const lightCount = 10;
    items.forEach((_, index) => {
      const angleOffset = (index * sliceAngle * Math.PI) / 180;
      for (let i = 0; i < lightCount; i++) {
        const phase = (lightPhase + i) % lightCount;
        const distance = radius * (i + 1) / (lightCount + 1);
        const lightX = centerX + distance * Math.cos(angleOffset + angle * (Math.PI / 180));
        const lightY = centerY + distance * Math.sin(angleOffset + angle * (Math.PI / 180));

        const color = lightBlues[phase % lightBlues.length];

        ctx.save();
        ctx.translate(lightX, lightY);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }
    });

    if (image) {
      const imageRadius = radius / 4;
      const centerRadius = imageRadius + 20;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.beginPath();
      ctx.arc(0, 0, centerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.rotate((angle * Math.PI) / 180); // Rotate the image with the wheel
      ctx.drawImage(image, -imageRadius, -imageRadius, imageRadius * 2, imageRadius * 2);
      ctx.restore();
    }

    // Draw the fixed pointer at the bottom
    ctx.save();
    ctx.translate(centerX, centerY + radius + 30); // Adjust the position as needed
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.lineTo(0, -50);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel();
  }, [items, angle, image, lightPhase, canvasSize]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
      />
      <button onClick={spin} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>
    </div>
  );
};

export default WheelSpinner;
