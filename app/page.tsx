'use client'
import React, { useState } from 'react';
import WheelSpinner from "./components/wheel";

export default function Home() {
  const initialWordList = ["Hello", "Now", "World"];
  const [wordList, setWordList] = useState(initialWordList);
  const [currentWord, setCurrentWord] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const addWord = () => {
    if (currentWord && !wordList.includes(currentWord)) {
      setWordList([...wordList, currentWord]);
      setCurrentWord("");
    }
  };

  const removeWord = (word: string) => {
    setWordList(wordList.filter(item => item !== word));
  };

  const handleFormToggle = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleSpinComplete = (result: string) => {
    setResult(result);
  };

  const closePopup = () => {
    setResult(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <div className="fixed top-14 right-14 text-black">
        <button onClick={handleFormToggle} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isFormOpen ? "Close" : "Open"} Form
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed top-24 right-14 bg-white p-4 rounded shadow-lg text-black">
          <h3 className="text-xl mb-2">Manage Words</h3>
          <input
            type="text"
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value)}
            className="border p-2 mb-2 w-full"
            placeholder="Enter a word"
          />
          <button onClick={addWord} className="bg-green-500 text-white px-4 py-2 rounded mb-2">
            Add Word
          </button>
          <ul>
            {wordList.map((word, index) => (
              <li key={index} className="flex justify-between items-center mb-1">
                {word}
                <button
                  onClick={() => removeWord(word)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-xl mb-2">Result</h3>
            <p className="text-2xl">{result}</p>
            <button onClick={closePopup} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              Close
            </button>
          </div>
        </div>
      )}

      <WheelSpinner items={wordList} onComplete={handleSpinComplete} />
    </main>
  );
}
