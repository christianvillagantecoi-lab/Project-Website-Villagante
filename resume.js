function downloadResumePdf() {
  const inputField = document.getElementById('pdfFilenameInput');
  let filename = inputField ? inputField.value.trim() : 'Resume-Villagante';
  
  if (!filename) {
    filename = 'Resume-Villagante';
  }
  
  // Ensure extension
  if (!filename.toLowerCase().endsWith('.pdf')) {
    filename += '.pdf';
  }

  const downloadLink = document.createElement('a');
  downloadLink.href = 'Resume-Villagante.pdf';
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

console.log("Resume module loaded successfully.");