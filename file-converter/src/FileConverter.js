import React, { useState } from 'react';

const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Data, setBase64Data] = useState('');
  const [exampleDocumentUrl, setExampleDocumentUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setExampleDocumentUrl(reader.result);
    };
    reader.readAsDataURL(file);
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
      <input type="file" accept=".pdf,.png,.jpg,.tiff,.tif" onChange={handleFileChange} />
      <button onClick={convertToBase64}>Convert to Base64</button>
      {base64Data && (
        <div>
          <h3>Base64 Data:</h3>
          <textarea value={base64Data} readOnly />
        </div>
      )}
      {exampleDocumentUrl && (
        <div>
          <h3>Example Document:</h3>
          <embed src={exampleDocumentUrl} type="application/pdf" width="100%" height="600px" />
        </div>
      )}
    </div>
  );
};

export default FileConverter;
