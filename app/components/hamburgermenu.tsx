import React, { useState, useCallback } from 'react';
import Dropzone from 'react-dropzone';

interface Segment {
  name: string;
  color: string;
}

interface HamburgerMenuProps {
  onAddSegment: (segment: Segment) => void;
  onRemoveSegment: (index: number) => void;
  onImageUpload: (image: string | ArrayBuffer | null) => void;
  onWheelColors: (primary: string, contrast: string, border: string) => void;
  segments: Segment[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onAddSegment, onRemoveSegment, onImageUpload, onWheelColors, segments }) => {
  const [newSegment, setNewSegment] = useState<Segment>({ name: '', color: '#000000' });
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [contrastColor, setContrastColor] = useState('#FFFFFF');
  const [borderColor, setBorderColor] = useState('#000000');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleAddSegment = () => {
    onAddSegment(newSegment);
    setNewSegment({ name: '', color: '#000000' });
  };

  const onDrop = useCallback((acceptedFiles : any) => {
    acceptedFiles.forEach((file : any) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }, [onImageUpload]);

  const handleDeleteImage = () => {
    setUploadedImage(null);
    onImageUpload(null);
  };

  return (
    <div className="hamburger-menu w-full max-w-xs mx-auto p-2 bg-white rounded-lg shadow-lg">
      <div className="menu flex flex-col">
        <h2 className="font-bold text-lg mb-2">Wheel Settings</h2>
        <div className="flex flex-col justify-center items-center mb-2">
          <input
            type="text"
            placeholder="Segment Name"
            value={newSegment.name}
            className="border-solid border-2 border-gray-300 rounded-md mb-1 mr-1"
            onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
          />
          <input
            type="color"
            value={newSegment.color}
            className="border-solid border-2 border-gray-300 rounded-md mb-1 mr-1"
            onChange={(e) => setNewSegment({ ...newSegment, color: e.target.value })}
          />
          <button className="p-1 bg-green-500 rounded-md text-white text-xs w-full" onClick={handleAddSegment}>Add</button>
        </div>
        <ul className="flex flex-col w-full mb-2">
          {segments.map((segment, index) => (
            <li key={index} className="border-b border-gray-300 flex items-center justify-between py-1">
              <div className="flex items-center">
                <button className="text-red-700 font-bold hover:cursor-pointer text-xs mr-3" onClick={() => onRemoveSegment(index)}>X</button>
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: segment.color }}
                ></div>
                {segment.name}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center justify-center mb-2">
          <h3 className="font-bold text-md mb-1">Upload Center Image</h3>
          {uploadedImage && (
            <div className="relative mb-2">
              <img src={uploadedImage} alt="Uploaded" className="w-24 h-24 object-cover" />
              <button className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center" onClick={handleDeleteImage}>X</button>
            </div>
          )}
          {!uploadedImage && (
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps }) => (
                <section className="w-full hover:cursor-pointer">
                  <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-2 rounded-md text-center">
                    <input {...getInputProps()} />
                    <p className="text-xs">Drag 'n' drop files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>
          )}
        </div>
        <h3 className="font-bold text-md mb-1">Wheel Colors</h3>
        <div className="bg-blue-50 rounded-md p-2 flex flex-col">
          <div className="flex flex-row justify-center items-center mb-1">
            <label className=" mb-0 mr-1 text-xs">Primary</label>
            <input type="color" value={primaryColor} className="border-solid border-2 border-gray-300 rounded-md mb-0 mr-1" onChange={(e) => setPrimaryColor(e.target.value)} />
            <label className=" mb-0 mr-1 text-xs">Center</label>
            <input type="color" value={contrastColor} className="border-solid border-2 border-gray-300 rounded-md mb-0 mr-1" onChange={(e) => setContrastColor(e.target.value)} />
            <label className=" mb-0 mr-1 text-xs">Border</label>
            <input type="color" value={borderColor} className="border-solid border-2 border-gray-300 rounded-md" onChange={(e) => setBorderColor(e.target.value)} />
          </div>
          <button className="mt-1 p-1 bg-blue-500 text-white rounded-md text-sm" onClick={() => onWheelColors(primaryColor, contrastColor, borderColor)}>Set Colors</button>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
