import React, { useEffect, useRef, useState } from 'react';
import Logo from './images/logo.png';

export interface WheelComponentProps {
  segments: string[];
  segColors: string[];
  centerImage?: string | null;
  onFinished: (segment: string) => void;
  primaryColor?: string;
  contrastColor?: string;
  borderColor?: string;
  size?: number;
  upDuration?: number;
  downDuration?: number;
  fontFamily?: string;
  fontSize?: string;
  outlineWidth?: number;
  isOnlyOnce?: boolean;
}

const WheelComponent: React.FC<WheelComponentProps> = ({
  segments,
  segColors,
  centerImage,
  onFinished,
  primaryColor,
  contrastColor,
  borderColor,
  size = 300,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'proxima-nova',
  fontSize = '1em',
  outlineWidth = 10,
  isOnlyOnce = true
}) => {
  const randomString = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    const length = 8;
    let str = '';
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  };

  const [canvasId, setCanvasId] = useState('');
  const [wheelId, setWheelId] = useState('');
  const dimension = (size + 20) * 2;
  const canvasHeight = dimension + 70; // Increase height to accommodate the text at the bottom
  const [currentSegment, setCurrentSegment] = useState<string>('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setFinished] = useState(false);

  const segmentsRef = useRef(segments);
  const segColorsRef = useRef(segColors);
  const primaryColorRef = useRef(primaryColor);
  const contrastColorRef = useRef(contrastColor);
  const borderColorRef = useRef(borderColor);
  const centerImageRef = useRef(centerImage);

  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext: CanvasRenderingContext2D | null = null;
  let maxSpeed = Math.PI / segments.length;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = size + 20;
  const centerY = size + 20;

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setCanvasId(`canvas-${randomString()}`);
    setWheelId(`wheel-${randomString()}`);
  }, []);

  useEffect(() => {
    if (canvasId && wheelId) {
      wheelInit();
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 0);
    }
  }, [canvasId, wheelId]);

  useEffect(() => {
    segmentsRef.current = segments;
    segColorsRef.current = segColors;
    primaryColorRef.current = primaryColor;
    contrastColorRef.current = contrastColor;
    borderColorRef.current = borderColor;
    centerImageRef.current = centerImage;
  }, [segments, segColors, primaryColor, contrastColor, borderColor, centerImage]);

  useEffect(() => {
    const image = new Image();
    if (centerImage) {
      image.src = centerImage || Logo.src;
      image.onload = () => {
        imageRef.current = image;
        drawCenterImage();
      };
    }
  }, [centerImage]);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas: HTMLCanvasElement | null = document.getElementById(canvasId) as HTMLCanvasElement;

    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', `${dimension}`);
      canvas.setAttribute('height', `${canvasHeight}`);
      canvas.setAttribute('id', canvasId);
      document.getElementById(wheelId)?.appendChild(canvas);
    }
    canvas?.addEventListener('click', spin, false);
    canvasContext = canvas?.getContext('2d');

    if (!canvasContext) {
      console.error("Canvas context is null");
    } else {
      console.log("Canvas context initialized");
    }
  };

  const spin = () => {
    setIsStarted(true);
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / segmentsRef.current.length;
      frames = 0;
      timerHandle = window.setInterval(onTimerTick, timerDelay);
    }
  };

  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (currentSegment) {
        if (frames > segmentsRef.current.length) {
          progress = duration / upTime;
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
    drawCurrentSegment();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
    drawCurrentSegment();
  };

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    const value = segmentsRef.current[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColorsRef.current[key % segColorsRef.current.length];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = primaryColorRef.current || "black";
    ctx.font = `bold ${fontSize} ${fontFamily}`;
    ctx.fillText(value.substring(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };

  const drawWheel = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segmentsRef.current.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 5;
    ctx.strokeStyle = borderColorRef.current || "black";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '1em ' + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColorRef.current || "black";
    ctx.fill();
    drawCenterImage();
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = borderColorRef.current || "white";
    ctx.stroke();
  };

  const drawCenterImage = () => {
    if (!canvasContext) return;

    const ctx = canvasContext;
    ctx.fillStyle = contrastColorRef.current || "black";
    ctx.font = 'bold 1em ' + fontFamily;
    ctx.textAlign = 'center';

    if (imageRef.current) {
      ctx.drawImage(imageRef.current, centerX - 50, centerY - 50, 100, 100);
    } else {
      ctx.fillText("Spin", centerX, centerY + 3);
    }
  };

  const drawNeedle = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColorRef.current || "black";
    ctx.fillStyle = contrastColorRef.current || "black";
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i = segmentsRef.current.length - Math.floor((change / (Math.PI * 2)) * segmentsRef.current.length) - 1;
    if (i < 0) i = i + segmentsRef.current.length;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = primaryColorRef.current || "white";
    ctx.font = 'bold 1.5em ' + fontFamily;
    setCurrentSegment(segmentsRef.current[i]);
  };

  const drawCurrentSegment = () => {
    if (!canvasContext) return;

    const ctx = canvasContext;
    const change = angleCurrent + Math.PI / 2;
    let i = segmentsRef.current.length - Math.floor((change / (Math.PI * 2)) * segmentsRef.current.length) - 1;
    if (i < 0) i = i + segmentsRef.current.length;
    ctx.clearRect(0, dimension, dimension, 50); // Clear previous segment text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 4.5em ' + fontFamily;
    ctx.fillText(segmentsRef.current[i], centerX, dimension + 30); // Draw current segment at the bottom of the canvas
  };

  const clear = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.clearRect(0, 0, dimension, canvasHeight);
  };

  return (
    <div id={wheelId} style={{ textAlign: 'center' }}>
      <canvas
        id={canvasId}
        width={dimension}
        height={canvasHeight}
        onClick={spin}
        style={{ pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto', cursor: 'pointer' }}
      />
    </div>
  );
};

export default WheelComponent;
