// Centralized mock logic so real AI integration can replace this file later.

const categoryRules = [
  { category: "Career", keywords: ["resume", "cv", "job", "interview"] },
  { category: "Education", keywords: ["lecture", "notes", "course", "assignment"] },
  { category: "Finance", keywords: ["invoice", "payment", "receipt", "tax"] },
  { category: "Legal", keywords: ["contract", "agreement", "policy"] },
];

function pickCategory(text = "", fileName = "") {
  const combined = `${text} ${fileName}`.toLowerCase();

  for (const rule of categoryRules) {
    if (rule.keywords.some((keyword) => combined.includes(keyword))) {
      return rule.category;
    }
  }

  return "General";
}

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

function summarizeText(text = "") {
  if (!text.trim()) {
    return "No text provided; summary unavailable.";
  }

  return `${text.trim().slice(0, 80)}${text.length > 80 ? "..." : ""}`;
}

function analyzeFiles(files = [], mode = "general") {
  return files.map((file, index) => {
    const category = pickCategory(file.text, file.name);
    const extension = getExtension(file.name);
    const baseName = toSlug(file.name.replace(/\.[^.]+$/, "")) || `file-${index + 1}`;
    const newName = `${category.toLowerCase()}-${baseName}.${extension}`;

    return {
      original_name: file.name || `file-${index + 1}.${extension}`,
      new_name: newName,
      category,
      summary: summarizeText(file.text),
      confidence: 0.88,
      reasoning: `Mock (${mode}) classification based on filename/text keyword matching.`,
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
