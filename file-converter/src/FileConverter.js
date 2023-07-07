import React, { useState } from 'react';

const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Data, setBase64Data] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const convertToBase64 = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setBase64Data(reader.result);
      };
    }
  };

  return (
    <div>
      <h2>File Converter</h2>
      <input type="file" accept=".pdf,.png" onChange={handleFileChange} />
      <button onClick={convertToBase64}>Convert to Base64</button>
      {base64Data && (
        <div>
          <h3>Base64 Data:</h3>
          <textarea value={base64Data} readOnly />
        </div>
      )}
    </div>
  );
};

export default FileConverter;
