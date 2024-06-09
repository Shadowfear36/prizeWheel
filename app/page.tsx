'use client'
import React, { useState, useEffect } from 'react';
import WheelComponent from "./components/wheelcomponent";
import HamburgerMenu from "./components/hamburgermenu";

const Home: React.FC = () => {
  const [segments, setSegments] = useState([
    { name: "PB", color: "#cd4548" }, { name: "MM", color: "#1691d4" },
    { name: "L", color: "#62b48c" }, { name: "K", color: "#ffa20f" },
    { name: "AoN", color: "#7b6bb7" }, { name: "P3", color: "#909a8c" },
    { name: "P4", color: "#7a1f1f" }, { name: "EJ", color: "#d1a365" },
    { name: "EM", color: "#114a96" }
  ]);
  const [centerImage, setCenterImage] = useState<string | null>(null);
  const [borderColor, setBorderColor] = useState("white");
  const [primaryColor, setPrimaryColor] = useState("black");
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
    // setWinner(winner);
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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
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
