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

function detectSignals(fileName = "", extractedText = "", fileType = "") {
  const full = `${normalize(fileName)} ${normalize(extractedText)} ${normalize(fileType)}`;
  const ext = getExtension(fileName, fileType);

  // Decision logic combines filename keywords, text hints, and MIME/extension signals.
  const isResume = /(resume|cv|curriculum vitae|cover letter|interview)/.test(full);
  const isNotes = /(lecture|class notes|notes|chapter|assignment|course|professor|homework|study)/.test(full);
  const isRecipe = /(recipe|pasta|cake|cooking|ingredients|kitchen|oven)/.test(full);
  const isReceipt = /(receipt|transaction|amount paid|merchant|tax|invoice|billing|bill|payment)/.test(full);
  const isTravel = /(flight|hotel|itinerary|boarding|travel|trip|booking)/.test(full);
  const isImageType = /image\//.test(normalize(fileType)) || /(png|jpg|jpeg|webp|gif)/.test(ext);
  const isScreenshot = /(screenshot|screen shot|screen capture|snip|img_|photo|image)/.test(full);
  const isPersonal = /(passport|license| id |driver|statement|identity|bank statement)/.test(` ${full} `);

  return {
    ext,
    isResume,
    isNotes,
    isRecipe,
    isReceipt,
    isTravel,
    isImageType,
    isScreenshot,
    isPersonal,
  };
}

function buildMockResult(fileName, extractedText, fileType) {
  const { ext, isResume, isNotes, isRecipe, isReceipt, isTravel, isImageType, isScreenshot, isPersonal } = detectSignals(
    fileName,
    extractedText,
    fileType
  );
  const baseName = cleanBaseName(fileName);
  const textPreview = (extractedText || "").trim().slice(0, 90);

  if (isResume) {
    return {
      new_name: `job-search-${baseName}.${ext}`,
      category: "Job Search",
      summary: "Resume highlighting professional experience, technical skills, and project impact.",
      confidence: 0.96,
      reasoning: "Matched resume/CV keywords in filename or text indicating career-related content.",
    };
  }

  if (isNotes) {
    return {
      new_name: `academics-notes-${baseName}.${ext}`,
      category: "Academics",
      summary: "Academic document with lecture notes, assignment context, or study material.",
      confidence: 0.93,
      reasoning: "Detected note, lecture, assignment, or study-related keywords.",
    };
  }

  if (isRecipe) {
    return {
      new_name: `recipe-${baseName}.${ext}`,
      category: "Recipes",
      summary: "Cooking document containing ingredients, instructions, and preparation steps.",
      confidence: 0.92,
      reasoning: "Detected food and cooking terms such as recipe, pasta, cake, or ingredients.",
    };
  }

  if (isReceipt) {
    return {
      new_name: `finance-receipt-${baseName}.${ext}`,
      category: "Finance / Receipts",
      summary: "Financial document with transaction, billing, and payment details.",
      confidence: 0.94,
      reasoning: "Detected receipt, invoice, bill, payment, tax, or transaction references.",
    };
  }

  if (isTravel) {
    return {
      new_name: `travel-itinerary-${baseName}.${ext}`,
      category: "Travel",
      summary: "Travel booking document with itinerary, flight, or hotel information.",
      confidence: 0.91,
      reasoning: "Detected travel planning terms including flight, hotel, itinerary, or boarding.",
    };
  }

  if (isScreenshot || isImageType) {
    return {
      new_name: `image-capture-${baseName}.${ext}`,
      category: "Screenshots / Images",
      summary: "Image file likely used as a visual reference or captured screen context.",
      confidence: isScreenshot ? 0.9 : 0.86,
      reasoning: "Detected screenshot/image cues from filename and file type.",
    };
  }

  if (isPersonal) {
    return {
      new_name: `personal-doc-${baseName}.${ext}`,
      category: "Personal Documents",
      summary: "Personal document containing identification or account statement information.",
      confidence: 0.9,
      reasoning: "Detected personal document terms such as passport, license, ID, or statement.",
    };
  }

  return {
    new_name: `general-doc-${baseName}.${ext}`,
    category: "General",
    summary: `General document for review. Preview: ${textPreview || "No text extracted yet."}`,
    confidence: 0.79,
    reasoning: "No strong pattern match found, so a generic category was applied as fallback.",
  };
}

/**
 * Analyze one file and return structured mock metadata.
 * @param {string} fileName
 * @param {string} extractedText
 * @param {string} fileType
 */
function analyzeFile(fileName, extractedText, fileType) {
  return buildMockResult(fileName, extractedText, fileType);
}

module.exports = {
  analyzeFile,
};
