'use client'
import React, { useState, useEffect, useRef } from 'react';
import WheelComponent from "./components/wheelcomponent";
import HamburgerMenu from "./components/hamburgermenu";
import Confetti from 'react-confetti';
import Logo from './components/images/logo.png';

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
  const [confettiPieces, setConfettiPieces] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Add mute state
  const pumpUpAudioRef = useRef<HTMLAudioElement>(null); // Add audio ref for pump-up music

  const handleAddSegment = (segment: { name: string, color: string }) => {
    setSegments([...segments, segment]);
  };

  const handleRemoveSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
  };

  const handleUpdateSegment = (index: number, updatedSegment: { name: string, color: string }) => {
    const updatedSegments = [...segments];
    updatedSegments[index] = updatedSegment;
    setSegments(updatedSegments);
  };

  const handleSetSegments = (newSegments: { name: string, color: string }[]) => {
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (pumpUpAudioRef.current) {
      pumpUpAudioRef.current.muted = !isMuted;
    }
  };

  const onFinished = (winner: string) => {
    console.log(winner);
    setWinner(winner);
    setConfettiPieces(200); // Start with 200 pieces of confetti

    setTimeout(() => {
      setConfettiPieces(0); // Stop generating new confetti pieces after a certain time
    }, 7600); // Adjust the time as needed
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
    setCenterImage(Logo.src);
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
          onUpdateSegment={handleUpdateSegment}
          onSetSegments={handleSetSegments}
          segments={segments}
          pumpUpAudioRef={pumpUpAudioRef}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}
      {confettiPieces > 0 && (
        <Confetti
          numberOfPieces={confettiPieces}
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
        isMuted={isMuted} // Pass isMuted to WheelComponent
      />
      <audio ref={pumpUpAudioRef} src="/audio/Score.mp3" />
    </main>
  );
};

export default Home;
