'use client'
import React, { useState, useEffect } from 'react';
import WheelComponent from "./components/wheelcomponent";
import HamburgerMenu from "./components/hamburgermenu";

const Home: React.FC = () => {
  const [segments, setSegments] = useState([
    { name: "PB", color: "#003087" }, { name: "MM", color: "#4DA4F2" },
    { name: "L", color: "#003087" }, { name: "K", color: "#4DA4F2" },
    { name: "AoN", color: "#003087" }, { name: "P3", color: "#4DA4F2" },
    { name: "P4", color: "#003087" }, { name: "EJ", color: "#4DA4F2" },
    { name: "EM", color: "#003087" }, { name: "EK", color: "#4DA4F2" }
  ]);
  const [centerImage, setCenterImage] = useState<string | null>(null);
  const [borderColor, setBorderColor] = useState("white");
  const [primaryColor, setPrimaryColor] = useState("white");
  const [contrastColor, setContrastColor] = useState("white");
  const [winner, setWinner] = useState<string | null>(null);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [wheelSize, setWheelSize] = useState(300);

  const handleAddSegment = (segment: { name: string, color: string }) => {
    setSegments([...segments, segment]);
  };

  const handleRemoveSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
  };

  const handleImageUpload = (image: string | ArrayBuffer | null) => {
    if (typeof image === 'string') {
      setCenterImage(image);
    }
  };

  const handleWheelColors = (primary: string, contrast: string, border: string) => {
    setPrimaryColor(primary);
    setContrastColor(contrast);
    setBorderColor(border);
  };

  const onFinished = (winner: string) => {
    console.log(winner)
  };

  useEffect(() => {
    const updateWheelSize = () => {
      if (window.innerWidth <= 768) { // Mobile screen size
        setWheelSize(150);
      } else {
        setWheelSize(300);
      }
    };

    updateWheelSize();
    window.addEventListener('resize', updateWheelSize);

    return () => {
      window.removeEventListener('resize', updateWheelSize);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-15">
      <button onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)} className="hamburger-button">
        ☰
      </button>
      {isHamburgerMenuOpen && (
        <HamburgerMenu
          onAddSegment={handleAddSegment}
          onRemoveSegment={handleRemoveSegment}
          onImageUpload={handleImageUpload}
          onWheelColors={handleWheelColors}
          segments={segments}
        />
      )}
      <WheelComponent
        segments={segments.map(s => s.name)}
        segColors={segments.map(s => s.color)}
        centerImage={centerImage}
        onFinished={onFinished}
        primaryColor={primaryColor}
        contrastColor={contrastColor}
        borderColor={borderColor}
        size={wheelSize} // Use the responsive wheel size
        upDuration={500}
        downDuration={600}
        fontFamily="Helvetica"
        isOnlyOnce={false}
      />
    </main>
  );
};

export default Home;
