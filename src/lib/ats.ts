import { ACTION_VERBS, SECTION_HEADERS, COMMON_MISSPELLINGS } from './constants';

// --- INTERFACES ---
interface AnalysisCheck {
  pass: boolean;
  premium: boolean;
  name: string;
  details: string;
}

interface AnalysisCategory {
  score: number;
  checks: AnalysisCheck[];
}

export interface AnalysisResult {
  score: number;
  issueCount: number;
  content: AnalysisCategory;
  sections: AnalysisCategory;
  atsEssentials: AnalysisCategory;
}

// --- TOKENIZATION & NORMALIZATION ---
const tokenize = (text: string): string[] => {
  if (!text) return [];
  return text.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);
};

// --- CHECK IMPLEMENTATIONS ---

// CONTENT CHECKS
const checkQuantifiedImpact = (tokens: string[]): boolean => {
  const impactRegex = /[%$0-9]/;
  return tokens.some(token => impactRegex.test(token));
};

const checkActionVerbs = (tokens: string[]): boolean => {
  const actionVerbCount = tokens.filter(token => ACTION_VERBS.has(token)).length;
  return actionVerbCount > 5; // Passes if more than 5 action verbs are found
};

const checkRepetition = (tokens: string[]): boolean => {
    if (tokens.length < 50) return true;
    const freq: Record<string, number> = {};
    tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
    const mostFrequent = Object.values(freq).sort((a, b) => b - a)[0];
    // Fails if the most frequent word makes up more than 3% of the text
    return (mostFrequent / tokens.length) <= 0.03;
};

const checkSpelling = (tokens: string[]): boolean => {
    const misspellings = tokens.filter(token => COMMON_MISSPELLINGS[token]);
    return misspellings.length < 3; // Fails if 3 or more common misspellings are found
};

// SECTIONS CHECKS
const checkSections = (text: string): { found: string[], pass: boolean } => {
  const required = ['contact', 'summary', 'experience', 'skills', 'education'];
  const textLower = text.toLowerCase();
  const foundSections: string[] = [];

  for (const sectionName in SECTION_HEADERS) {
    const alternatives = SECTION_HEADERS[sectionName];
    if (alternatives.some(alt => textLower.includes(alt))) {
      foundSections.push(sectionName);
    }
  }
  const uniqueFound = [...new Set(foundSections)];
  const pass = required.every(req => uniqueFound.includes(req));
  return { found: uniqueFound, pass };
};

const checkContactInfo = (text: string): boolean => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\d{3}[-.\s]?){2}\d{4}/;
  return emailRegex.test(text) && phoneRegex.test(text);
};


// ATS ESSENTIALS CHECKS
const checkFileCompatibility = (fileType: string): boolean => {
    return fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}

const checkSimpleLayout = (text: string): boolean => {
    const complexKeywords = ['table', 'column', 'graphic', 'chart'];
    const textLower = text.toLowerCase();
    return !complexKeywords.some(keyword => textLower.includes(keyword));
};

const checkEmailPresent = (text: string): boolean => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    return emailRegex.test(text);
}

const checkPhoneNumberPresent = (text: string): boolean => {
    const phoneRegex = /(\d{3}[-.\s]?){2}\d{4}/;
    return phoneRegex.test(text);
}

const checkHyperlinks = (text: string): boolean => {
    const httpRegex = /https?:\/\//;
    return httpRegex.test(text.toLowerCase());
}


// --- MAIN ANALYSIS FUNCTION ---
export const analyzeResume = (resumeText: string, file: File): AnalysisResult => {
  const tokens = tokenize(resumeText);

  // Perform all checks
  const contentChecks: AnalysisCheck[] = [
    { name: 'ATS Parse Rate', pass: resumeText.length > 100, premium: false, details: resumeText.length > 100 ? "Resume text was successfully parsed." : "Could not read enough text from the resume." },
    { name: 'Quantifying Impact', pass: checkQuantifiedImpact(tokens), premium: true, details: checkQuantifiedImpact(tokens) ? "Achievements are quantified with numbers." : "Add numbers, percentages, or dollar amounts to show impact." },
    { name: 'Action Verbs', pass: checkActionVerbs(tokens), premium: false, details: checkActionVerbs(tokens) ? "Strong action verbs are used." : "Replace weak phrases with stronger action verbs." },
    { name: 'Word Repetition', pass: checkRepetition(tokens), premium: false, details: checkRepetition(tokens) ? "Word usage is varied and effective." : "Some words are overused. Try to diversify your language." },
    { name: 'Spelling & Grammar', pass: checkSpelling(tokens), premium: true, details: checkSpelling(tokens) ? "No major spelling errors found." : "Potential spelling or grammar issues detected." },
  ];

  const sectionsResult = checkSections(resumeText);
  const sectionsChecks: AnalysisCheck[] = [
    { name: 'Essential Sections', pass: sectionsResult.pass, premium: true, details: sectionsResult.pass ? "All key sections like Experience and Skills are present." : `Missing sections: ${['contact', 'summary', 'experience', 'skills', 'education'].filter(s => !sectionsResult.found.includes(s)).join(', ')}` },
    { name: 'Contact Information', pass: checkContactInfo(resumeText), premium: false, details: checkContactInfo(resumeText) ? "Contact info (email & phone) is present." : "Missing a valid email or phone number." },
  ];

  const atsEssentialsChecks: AnalysisCheck[] = [
    { name: 'File Format & Size', pass: checkFileCompatibility(file.type) && file.size < 2 * 1024 * 1024, premium: false, details: "File is a compatible format (PDF/DOCX) and size (<2MB)." },
    { name: 'Simple Design', pass: checkSimpleLayout(resumeText), premium: false, details: checkSimpleLayout(resumeText) ? "Resume has a clean, single-column layout." : "Complex layouts with tables or columns can confuse ATS." },
    { name: 'Email Address', pass: checkEmailPresent(resumeText), premium: false, details: checkEmailPresent(resumeText) ? "A professional email address was found." : "An email address could not be found." },
    { name: 'Phone Number', pass: checkPhoneNumberPresent(resumeText), premium: false, details: checkPhoneNumberPresent(resumeText) ? "A phone number was found." : "A phone number could not be found." },
    { name: 'Hyperlinks', pass: checkHyperlinks(resumeText), premium: true, details: checkHyperlinks(resumeText) ? "Includes links to portfolios or LinkedIn." : "Consider adding a link to your LinkedIn or portfolio." },
  ];
  
  // Calculate scores
  const calculateCategoryScore = (checks: AnalysisCheck[]) => {
    if (checks.length === 0) return 100;
    const passed = checks.filter(c => c.pass).length;
    return Math.round((passed / checks.length) * 100);
  };

  const contentScore = calculateCategoryScore(contentChecks);
  const sectionsScore = calculateCategoryScore(sectionsChecks);
  const atsEssentialsScore = calculateCategoryScore(atsEssentialsChecks);

  // Calculate final weighted score
  const finalScore = Math.round(
    contentScore * 0.30 +
    sectionsScore * 0.30 +
    atsEssentialsScore * 0.40
  );
  
  const allChecks = [...contentChecks, ...sectionsChecks, ...atsEssentialsChecks];
  const issueCount = allChecks.filter(c => !c.pass).length;

  return {
    score: finalScore,
    issueCount,
    content: { score: contentScore, checks: contentChecks },
    sections: { score: sectionsScore, checks: sectionsChecks },
    atsEssentials: { score: atsEssentialsScore, checks: atsEssentialsChecks },
  };
};
