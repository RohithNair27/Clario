// Mock analyzer foundation for Clario.
// Keeps logic deterministic so frontend/backend demos are stable.

function normalize(value = "") {
  return String(value).toLowerCase();
}

function cleanBaseName(fileName = "file") {
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, "");
  return nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "file";
}

function getExtension(fileName = "", fileType = "") {
  const fromName = fileName.split(".").pop();
  if (fromName && fromName !== fileName) {
    return fromName.toLowerCase();
  }
  return normalize(fileType) || "txt";
}

function modeLabel(mode = "general") {
  if (mode === "school") return "School";
  if (mode === "job-search") return "Job Search";
  return "General";
}

function withMode(result, mode) {
  return {
    ...result,
    reasoning: `${result.reasoning} Mode hint: ${modeLabel(mode)}.`,
  };
}

function detectPattern(fileName = "", extractedText = "") {
  const full = `${normalize(fileName)} ${normalize(extractedText)}`;

  if (/(resume|cv|curriculum vitae)/.test(full)) return "resume";
  if (/(lecture|chapter|assignment|course|professor|homework|notes)/.test(full)) {
    return "lecture-notes";
  }
  if (/(receipt|transaction|total|amount paid|tax|merchant|invoice)/.test(full)) {
    return "receipt";
  }
  if (/(screenshot|screen shot|screen capture|img_|snip)/.test(full)) {
    return "screenshot";
  }
  return "random-pdf";
}

function buildMockResult(pattern, fileName, extractedText, fileType, mode) {
  const ext = getExtension(fileName, fileType);
  const textPreview = (extractedText || "").trim();
  const safePreview = textPreview ? textPreview.slice(0, 80) : "No text extracted";

  if (pattern === "resume") {
    return withMode(
      {
        new_name: `resume-software-engineer-${cleanBaseName(fileName)}.${ext}`,
        category: "Career",
        summary: "Professional resume focused on engineering experience and skills.",
        confidence: 0.95,
        reasoning: "Detected resume language (experience, skills, and role-related keywords).",
      },
      mode
    );
  }

  if (pattern === "lecture-notes") {
    return withMode(
      {
        new_name: `lecture-notes-${cleanBaseName(fileName)}.${ext}`,
        category: mode === "school" ? "Study Materials" : "Education",
        summary: "Lecture notes covering key concepts and class topics.",
        confidence: 0.92,
        reasoning: "Detected classroom context terms like lecture, notes, or course content.",
      },
      mode
    );
  }

  if (pattern === "receipt") {
    return withMode(
      {
        new_name: `receipt-expense-${cleanBaseName(fileName)}.${ext}`,
        category: "Finance",
        summary: "Purchase receipt with transaction and payment details.",
        confidence: 0.93,
        reasoning: "Detected financial wording such as total, tax, amount paid, or merchant.",
      },
      mode
    );
  }

  if (pattern === "screenshot") {
    return withMode(
      {
        new_name: `screenshot-${cleanBaseName(fileName)}.${ext}`,
        category: "Images",
        summary: "Screenshot image captured from a device screen.",
        confidence: 0.9,
        reasoning: "Detected screenshot naming conventions and image-related cues.",
      },
      mode
    );
  }

  return withMode(
    {
      new_name: `document-${cleanBaseName(fileName)}.${ext}`,
      category: "General",
      summary: `General document. Preview: ${safePreview}.`,
      confidence: 0.78,
      reasoning: "No strong domain signals found, so fallback general classification was applied.",
    },
    mode
  );
}

/**
 * Analyze one file and return structured mock metadata.
 * @param {string} fileName
 * @param {string} extractedText
 * @param {string} fileType
 * @param {"general"|"school"|"job-search"} mode
 */
function analyzeFile(fileName, extractedText, fileType, mode = "general") {
  const supportedModes = new Set(["general", "school", "job-search"]);
  const safeMode = supportedModes.has(mode) ? mode : "general";

  const pattern = detectPattern(fileName, extractedText);
  return buildMockResult(pattern, fileName, extractedText, fileType, safeMode);
}

module.exports = {
  analyzeFile,
};
