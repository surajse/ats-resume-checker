import { ACTION_VERBS, SECTION_HEADERS, SKILL_KEYWORDS, STOP_WORDS, WEAK_VERBS } from './constants';

export interface AnalysisResult {
  score: number;
  wordCount: {
    count: number;
    pass: boolean;
  };
  keywords: {
    matched: string[];
    missing: string[];
    density: number;
    jdKeywords: string[];
  };
  sections: {
    found: string[];
    missing: string[];
    pass: boolean;
  };
  formatting: {
    longParagraphs: number;
    allCaps: number;
    weakVerbs: string[];
    pass: boolean;
  };
  actionVerbs: {
    count: number;
    found: string[];
    pass: boolean;
  };
}

const MIN_WORDS = 450;
const MAX_WORDS = 800;

const tokenize = (text: string): string[] => {
  if (!text) return [];
  return text.toLowerCase().replace(/[^\w\s-]/g, '').split(/\s+/).filter(Boolean);
};

const getWordCount = (tokens: string[]): number => tokens.length;

const extractKeywords = (text: string, limit: number = 50): string[] => {
  const tokens = tokenize(text);
  const frequencies: Record<string, number> = {};
  
  tokens.forEach(token => {
    if (!STOP_WORDS.has(token) && token.length > 2) {
      frequencies[token] = (frequencies[token] || 0) + 1;
    }
  });

  return Object.entries(frequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
};

const analyzeKeywords = (resumeTokens: string[], jdText: string, role: string): AnalysisResult['keywords'] => {
  const roleSpecificKeywords = SKILL_KEYWORDS[role] || [];
  const jdKeywords = [...new Set([...extractKeywords(jdText, 30), ...roleSpecificKeywords])];
  const resumeKeywords = new Set(resumeTokens);
  
  const matched = jdKeywords.filter(keyword => resumeKeywords.has(keyword));
  const missing = jdKeywords.filter(keyword => !resumeKeywords.has(keyword));
  
  const keywordTokens = resumeTokens.filter(token => jdKeywords.includes(token));
  const density = resumeTokens.length > 0 ? (keywordTokens.length / resumeTokens.length) * 100 : 0;
  
  return {
    matched,
    missing,
    density,
    jdKeywords,
  };
};

const detectSections = (resumeText: string): AnalysisResult['sections'] => {
  const text = resumeText.toLowerCase();
  const found: string[] = [];
  SECTION_HEADERS.forEach(header => {
    const regex = new RegExp(`^\\s*${header}\\s*[:\\n]`, 'im');
    if (regex.test(text)) {
      found.push(header);
    }
  });

  const uniqueFound = [...new Set(found.map(f => {
    if (f.includes('experience')) return 'experience';
    if (f.includes('education')) return 'education';
    if (f.includes('skills')) return 'skills';
    if (f.includes('project')) return 'projects';
    return f;
  }))];

  const required = ['experience', 'education', 'skills'];
  const missing = required.filter(section => !uniqueFound.includes(section));

  return {
    found: uniqueFound,
    missing,
    pass: missing.length === 0,
  };
};

const checkFormatting = (resumeText: string, resumeTokens: string[]): AnalysisResult['formatting'] => {
  const paragraphs = resumeText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 100).length;

  const allCaps = resumeTokens.filter(token => token.length > 3 && token === token.toUpperCase()).length;

  const weakVerbsFound = WEAK_VERBS.filter(verb => resumeText.toLowerCase().includes(verb));
  
  const pass = longParagraphs === 0 && allCaps < 5 && weakVerbsFound.length < 3;

  return {
    longParagraphs,
    allCaps,
    weakVerbs: weakVerbsFound,
    pass,
  };
};


const checkActionVerbs = (resumeText: string): AnalysisResult['actionVerbs'] => {
    const text = resumeText.toLowerCase();
    const found = ACTION_VERBS.filter(verb => text.includes(verb));
    const pass = found.length >= 10;
    return {
        count: found.length,
        found,
        pass,
    };
}


const calculateScore = (analysis: Omit<AnalysisResult, 'score'>): number => {
    // Keyword Score (40%)
    const { keywords, wordCount, sections, formatting, actionVerbs } = analysis;
    const maxKeywordScore = keywords.jdKeywords.length;
    const keywordScore = maxKeywordScore > 0 ? (keywords.matched.length / maxKeywordScore) * 100 : 100;

    // Formatting Score (25%)
    let formattingScore = 100;
    if (formatting.longParagraphs > 0) formattingScore -= 40;
    if (formatting.allCaps > 5) formattingScore -= 30;
    if (formatting.weakVerbs.length > 2) formattingScore -= 30;
    formattingScore = Math.max(0, formattingScore);

    // Structure Score (20%)
    const structureScore = sections.pass ? 100 : (sections.found.length / (sections.found.length + sections.missing.length)) * 100;
    
    // Action Verbs & Word Count Score (15%)
    let miscScore = 0;
    miscScore += actionVerbs.count > 15 ? 50 : (actionVerbs.count / 15) * 50;
    miscScore += wordCount.pass ? 50 : 0;


    const weightedScore = (keywordScore * 0.40) + (formattingScore * 0.25) + (structureScore * 0.20) + (miscScore * 0.15);
    
    return Math.round(Math.min(100, weightedScore));
};


export const analyzeResume = (resumeText: string, jobDescription: string, role: string): AnalysisResult => {
  const resumeTokens = tokenize(resumeText);
  const count = getWordCount(resumeTokens);
  
  const wordCount = {
    count,
    pass: count >= MIN_WORDS && count <= MAX_WORDS,
  };
  
  const keywords = analyzeKeywords(resumeTokens, jobDescription, role);
  const sections = detectSections(resumeText);
  const formatting = checkFormatting(resumeText, resumeTokens);
  const actionVerbs = checkActionVerbs(resumeText);
  
  const analysis: Omit<AnalysisResult, 'score'> = {
    wordCount,
    keywords,
    sections,
    formatting,
    actionVerbs,
  };

  const score = calculateScore(analysis);

  return { score, ...analysis };
};
