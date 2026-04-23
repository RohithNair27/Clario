// Displays the original filenames before AI analysis.
function FileList({ files }) {
  return (
    <ul className="file-list">
      {files.map((file) => (
        <li key={file} className="file-item">
          {file}
        </li>
      ))}
    </ul>
  )
}

export default FileList
