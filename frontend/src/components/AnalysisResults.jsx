// Shows the renamed output and metadata returned by analysis.
function AnalysisResults({ results }) {
  if (results.length === 0) {
    return <p className="result-summary">No analysis yet. Click Analyze Files.</p>
  }

  return (
    <div className="results-list">
      {results.map((item) => (
        <article key={item.original_name || item.new_name} className="result-card">
          <p className="result-meta">
            <strong>Original:</strong> {item.original_name}
          </p>
          <p className="result-name">{item.new_name}</p>
          <p className="result-category">
            <strong>Category:</strong> {item.category}
          </p>
          <p className="result-summary">{item.summary}</p>
          <p className="result-meta">
            <strong>Confidence:</strong> {item.confidence}
          </p>
          <p className="result-meta">
            <strong>Reasoning:</strong> {item.reasoning}
          </p>
        </article>
      ))}
    </div>
  )
}

export default AnalysisResults
