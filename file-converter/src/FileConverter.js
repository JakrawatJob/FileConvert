import React, { useState } from 'react';
import './App.css'; // เรียกใช้ไฟล์ CSS

const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Data, setBase64Data] = useState('');
  const [exampleDocumentUrl, setExampleDocumentUrl] = useState('');
  const [typeFile, setTypeFile] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = reader.result;
      const blob = new Blob([fileData], { type: file.type });
      const url = URL.createObjectURL(blob);
      setExampleDocumentUrl(url);
    };
    reader.readAsArrayBuffer(file);
  };

  const convertToBase64 = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64WithoutPrefix = reader.result.split(',')[1];
        getFileType(base64WithoutPrefix);
        setBase64Data(base64WithoutPrefix);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const getFileType = (base64Data) => {
    const basestring = base64Data.substring(0, 100);
    console.log(basestring);
    if (basestring.includes('JVBERi')) {
      setTypeFile('PDF');
    } else if (basestring.includes('iVBOR')) {
      setTypeFile('PNG');
    } else if (basestring.includes('/9j/')) {
      setTypeFile('JPG');
    }
  };

  const convertBase64ToPdf = () => {
    if (base64Data) {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      getFileType(base64Data);
      let blob;

      const basestring = base64Data.substring(0, 100);
      if (basestring.includes('JVBERi')) {
        blob = new Blob([byteArray], { type: 'application/pdf' });
      } else if (basestring.includes('iVBOR')) {
        blob = new Blob([byteArray], { type: 'image/png' });
      } else if (basestring.includes('/9j/')) {
        blob = new Blob([byteArray], { type: 'image/jpeg' });
      }
      const url = URL.createObjectURL(blob);

      setExampleDocumentUrl(url);
    }
  };

  const handleTextareaChange = (event) => {
    const newValue = event.target.value;
    setBase64Data(newValue);
    getFileType(newValue);
  };

  const handleCopyClick = () => {
    const textarea = document.getElementById('base64Textarea');
    textarea.select();
    document.execCommand('copy');
  };

  const handlePasteClick = () => {
    navigator.clipboard.readText().then((text) => {
      setBase64Data(text);
    });
  };

  const downloadFile = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  function handleDownloadPDF() {
    const pageNumber = document.getElementById('pageNumber').value;

    if (pageNumber < 1) {
      alert('Invalid page number. Please enter a number greater than or equal to 1.');
      return;
    }
    const urlWithPageNumber = `${exampleDocumentUrl}?page=${pageNumber}`;
    console.log(urlWithPageNumber);
    downloadFile(urlWithPageNumber);
  }

  return (
    <div className="container">
      <h2>File Converter</h2>
      <input type="file" accept=".pdf,.png,.jpg,.tiff,.tif" onChange={handleFileChange} />
      <button className="button" onClick={convertToBase64}>Convert to Base64</button>
      <div>
        <h3>Base64 Data:</h3>
        <textarea id="base64Textarea" value={base64Data} onChange={handleTextareaChange} />
        <button className="button" onClick={handleCopyClick}>Copy</button>
        <button className="button" onClick={handlePasteClick}>Paste</button>
        <button className="button" onClick={convertBase64ToPdf}>Convert Base64 to PDF, PNG, JPG</button>
      </div>
      {exampleDocumentUrl && (
        <div>
          <h3>Example Document:</h3>
          <div className="embed-container">
            <embed src={exampleDocumentUrl} type="application/pdf" width="100%" height="400px" />
          </div>
          <p>File Type: {typeFile}</p>
          {typeFile === 'PDF' && (
            <div className="input-container">
              <input type="number" id="pageNumber" min="1" />
              <input type="text" value={exampleDocumentUrl} onChange={(e) => setExampleDocumentUrl(e.target.value)} />
              <button className="button" onClick={handleDownloadPDF}>Download Split PDF</button>
            </div>
          )}
          <button className="button" onClick={() => downloadFile(exampleDocumentUrl)}>Download File</button>
        </div>
      )}
    </div>
  );
};

export default FileConverter;
