// Centralized mock logic so real AI integration can replace this file later.
// This version auto-detects themes from mixed uploads (no user mode needed).

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getExtension(fileName = "") {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "txt";
}

function detectCategory(fileName = "", text = "", fileType = "") {
  const full = `${fileName} ${text} ${fileType}`.toLowerCase();
  const ext = getExtension(fileName);
  const isImageType = /image\//.test(String(fileType).toLowerCase()) || /(png|jpg|jpeg|webp|gif)/.test(ext);

  if (/(resume|cv|curriculum vitae|cover letter|interview)/.test(full)) {
    return "Job Search";
  }
  if (/(notes|lecture|class|assignment|course|study|syllabus)/.test(full)) {
    return "Academics";
  }
  if (/(recipe|pasta|cake|cooking|ingredients|oven|kitchen)/.test(full)) {
    return "Recipes";
  }
  if (/(receipt|invoice|bill|payment|transaction|amount paid|tax)/.test(full)) {
    return "Finance / Receipts";
  }
  if (/(flight|hotel|itinerary|boarding|trip|booking|travel)/.test(full)) {
    return "Travel";
  }
  if (/(screenshot|screen shot|screen capture|photo|image|img_)/.test(full) || isImageType) {
    return "Screenshots / Images";
  }
  if (/(passport|license| id |driver|statement|identity|bank statement)/.test(` ${full} `)) {
    return "Personal Documents";
  }

  return "General";
}

function buildCategoryOutput(category, baseName, extension, textPreview) {
  if (category === "Job Search") {
    return {
      new_name: `job-search-${baseName}.${extension}`,
      category,
      summary: "Career document with hiring-related information and candidate details.",
      confidence: 0.95,
      reasoning: "Detected resume/CV/interview keywords indicating job application content.",
    };
  }

  if (category === "Academics") {
    return {
      new_name: `academics-notes-${baseName}.${extension}`,
      category,
      summary: "Study-oriented file containing lecture notes, assignments, or course material.",
      confidence: 0.93,
      reasoning: "Matched academic terms such as notes, lecture, assignment, or course.",
    };
  }

  if (category === "Recipes") {
    return {
      new_name: `recipe-${baseName}.${extension}`,
      category,
      summary: "Cooking reference with ingredients, preparation steps, or meal instructions.",
      confidence: 0.92,
      reasoning: "Matched food/cooking keywords like recipe, pasta, cake, or ingredients.",
    };
  }

  if (category === "Finance / Receipts") {
    return {
      new_name: `finance-receipt-${baseName}.${extension}`,
      category,
      summary: "Financial record covering payment, billing, or transaction details.",
      confidence: 0.94,
      reasoning: "Detected transaction and billing terms such as receipt, invoice, bill, or payment.",
    };
  }

  if (category === "Travel") {
    return {
      new_name: `travel-itinerary-${baseName}.${extension}`,
      category,
      summary: "Travel-related document including booking details, flight info, or itinerary plans.",
      confidence: 0.91,
      reasoning: "Matched travel terms like flight, hotel, itinerary, boarding, or booking.",
    };
  }

  if (category === "Screenshots / Images") {
    return {
      new_name: `image-capture-${baseName}.${extension}`,
      category,
      summary: "Visual file likely used as a screenshot, photo, or reference image.",
      confidence: 0.89,
      reasoning: "Detected screenshot/image cues from filename, content hints, or file type.",
    };
  }

  if (category === "Personal Documents") {
    return {
      new_name: `personal-doc-${baseName}.${extension}`,
      category,
      summary: "Personal identification or statement document with sensitive personal details.",
      confidence: 0.9,
      reasoning: "Matched personal-document signals such as passport, license, ID, or statement.",
    };
  }

  return {
    new_name: `general-doc-${baseName}.${extension}`,
    category: "General",
    summary: `General document for review. Preview: ${textPreview || "No text provided."}`,
    confidence: 0.78,
    reasoning: "No strong category signals found, so fallback general grouping was used.",
  };
}

function analyzeFiles(files = []) {
  return files.map((file, index) => {
    const category = detectCategory(file.name, file.text, file.type);
    const extension = getExtension(file.name);
    const baseName = toSlug(file.name.replace(/\.[^.]+$/, "")) || `file-${index + 1}`;
    const textPreview = String(file.text || "").trim().slice(0, 80);
    const output = buildCategoryOutput(category, baseName, extension, textPreview);

    return {
      original_name: file.name || `file-${index + 1}.${extension}`,
      new_name: output.new_name,
      category: output.category,
      summary: output.summary,
      confidence: output.confidence,
      reasoning: output.reasoning,
    };
  });
}

function buildFolderPreview(analyzedFiles = []) {
  const folders = {};

  analyzedFiles.forEach((file) => {
    const folder = file.category || "General";
    if (!folders[folder]) {
      folders[folder] = [];
    }
    folders[folder].push(file.new_name || file.original_name || "untitled-file");
  });

  return {
    root: "Clario Workspace",
    folders: Object.entries(folders).map(([name, files]) => ({
      name,
      files,
    })),
  };
}

module.exports = {
  analyzeFiles,
  buildFolderPreview,
};
