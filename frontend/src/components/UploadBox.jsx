// Reusable drag-and-drop style box for future file upload wiring.
function UploadBox() {
  return (
    <div className="upload-box" role="button" tabIndex={0}>
      <p className="upload-title">Drop files here</p>
      <p className="upload-subtitle">or click to browse</p>
    </div>
  )
}

export default UploadBox
