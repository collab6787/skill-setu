import { GoogleGenAI } from '@google/genai';
import {
  GeminiIntent,
  GeminiAIMode,
  LanguageCode,
  StudentProfile,
  CollegeStats,
  JobOpening,
  SkillTrend
} from '../types';

export interface MinimalStudentContext {
  firstName: string;
  targetRole: string;
  careerReadinessScore: number;
  verifiedSkills: { name: string; proficiency: number; level: string }[];
  skillGaps: { name: string; gapScore: number; importance: string }[];
  recentVerifiedProjects: string[];
}

export interface GeminiChatPayload {
  message: string;
  history?: { role: 'user' | 'assistant' | 'model'; text: string }[];
  language?: LanguageCode;
  student?: StudentProfile;
  college?: CollegeStats;
  job?: JobOpening;
  skillTrends?: SkillTrend[];
  role?: 'student' | 'college' | 'company' | 'admin';
  forcedMode?: GeminiAIMode;
}

export interface GeminiChatResult {
  reply: string;
  intent: GeminiIntent;
  mode: GeminiAIMode;
  isOutOfScope: boolean;
  isFallback: boolean;
  suggestedPrompts: string[];
  referencedData?: {
    skillName?: string;
    gapScore?: number;
    jobTitle?: string;
    targetRole?: string;
    relatedAction?: 'job_simulator' | 'skill_demand' | 'evidence_upload' | 'passport';
  };
}

export class GeminiService {
  private static client: GoogleGenAI | null = null;

  /**
   * Lazily initialize GoogleGenAI with server-side API Key & telemetry header
   */
  private static getClient(): GoogleGenAI | null {
    if (!this.client && process.env.GEMINI_API_KEY) {
      try {
        this.client = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
      } catch (err) {
        console.warn('Failed to initialize GoogleGenAI client:', err);
      }
    }
    return this.client;
  }

  /**
   * SECTION 16: PRIVACY FILTER
   * Strips all sensitive, personally identifiable information (Aadhaar, passwords, tokens, full IDs)
   * Keeps ONLY minimal domain-relevant context.
   */
  public static extractSafeStudentContext(student?: StudentProfile): MinimalStudentContext | null {
    if (!student) return null;

    const firstName = student.name?.split(' ')[0] || 'Student';
    const verifiedSkills = (student.skills || []).map(s => ({
      name: s.skillName,
      proficiency: s.proficiencyScore,
      level: s.proficiencyLevel
    }));

    const skillGaps = (student.skills || [])
      .filter(s => s.proficiencyScore < 70)
      .map(s => ({
        name: s.skillName,
        gapScore: 100 - s.proficiencyScore,
        importance: s.marketDemandScore > 75 ? 'HIGH' : 'MEDIUM'
      }));

    // Add well-known missing target role requirements if not present
    if (!verifiedSkills.some(s => s.name.toLowerCase() === 'fastapi')) {
      skillGaps.push({ name: 'FastAPI', gapScore: 72, importance: 'HIGH' });
    }
    if (!verifiedSkills.some(s => s.name.toLowerCase() === 'docker')) {
      skillGaps.push({ name: 'Docker', gapScore: 78, importance: 'HIGH' });
    }

    const recentVerifiedProjects = (student.projects || [])
      .filter(p => p.verificationStatus === 'Verified')
      .map(p => p.title);

    return {
      firstName,
      targetRole: student.targetRole || 'Software Engineer',
      careerReadinessScore: student.careerReadinessScore?.overall || 78,
      verifiedSkills,
      skillGaps,
      recentVerifiedProjects
    };
  }

  /**
   * SECTION 4 & 17: INTENT CLASSIFIER & PROMPT INJECTION DEFENSE
   * Inspects message for forbidden topics and prompt injection attacks.
   */
  public static classifyIntent(message: string): { intent: GeminiIntent; mode: GeminiAIMode; isOutOfScope: boolean } {
    const text = message.toLowerCase().trim();

    // 1. PROMPT INJECTION & EVASION CHECKS
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous\s+)?instructions/i,
      /you\s+are\s+no\s+longer\s+skillsetu/i,
      /act\s+as\s+dan/i,
      /jailbreak/i,
      /forget\s+your\s+rules/i,
      /bypass\s+(all\s+)?restrictions/i,
      /unrestricted\s+mode/i,
      /system\s+override/i,
      /tell\s+me\s+a\s+secret/i
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(text)) {
        return { intent: 'OUT_OF_SCOPE', mode: 'JOB_INSIGHTS', isOutOfScope: true };
      }
    }

    // 2. FORBIDDEN DOMAINS (Entertainment, Politics, Medical, Dating, Shopping, Food, Gambling, General Life)
    const forbiddenKeywords = [
      'movie', 'cinema', 'actor', 'actress', 'hollywood', 'bollywood', 'song', 'music album', 'trailer', 'netflix',
      'prime minister', 'president of', 'election', 'political party', 'bjp', 'congress', 'parliament',
      'religion', 'god', 'prayer', 'temple', 'church', 'mosque', 'astrology', 'horoscope',
      'medical advice', 'diagnose', 'symptoms of', 'medicine for', 'headache cure', 'fever pill', 'prescription',
      'dating', 'girlfriend', 'boyfriend', 'love advice', 'relationship problem', 'marriage',
      'restaurant', 'recipe', 'how to cook', 'biryani recipe', 'pizza recipe',
      'flight ticket', 'hotel booking', 'vacation in', 'tourist spot',
      'cryptocurrency to buy', 'stock trading advice', 'invest in bitcoin', 'lottery', 'gambling', 'casino',
      'tell me a joke', 'write a poem about flowers', 'who won the match', 'cricket score', 'football score'
    ];

    for (const kw of forbiddenKeywords) {
      if (text.includes(kw)) {
        // Exception: only if explicitly discussing tech/learning aspects (e.g. "building a movie recommendation ML model")
        if (text.includes('machine learning') || text.includes('ml model') || text.includes('dataset') || text.includes('project') || text.includes('algorithm')) {
          continue;
        }
        return { intent: 'OUT_OF_SCOPE', mode: 'JOB_INSIGHTS', isOutOfScope: true };
      }
    }

    // 3. DOMAIN A: JOB & CAREER INTENTS
    if (text.includes('job simulator') || text.includes('simulate') || text.includes('what if i learn')) {
      return { intent: 'JOB_SIMULATOR', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('demand') || text.includes('growing skill') || text.includes('trend') || text.includes('emerging skill') || text.includes('market trend')) {
      return { intent: 'SKILL_DEMAND', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('skill gap') || text.includes('gap') || text.includes('missing skill') || text.includes('why is my score')) {
      return { intent: 'SKILL_GAP', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('interview') || text.includes('screening question') || text.includes('interview prep') || text.includes('interview point')) {
      return { intent: 'INTERVIEW_PREPARATION', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('resume') || text.includes('cv') || text.includes('profile improvement')) {
      return { intent: 'RESUME', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('internship')) {
      return { intent: 'INTERNSHIP', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('placement') || text.includes('campus placement') || text.includes('placed')) {
      return { intent: 'PLACEMENT', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('match') || text.includes('eligible job') || text.includes('technova') || text.includes('company requirement')) {
      return { intent: 'JOB_MATCHING', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('career') || text.includes('roadmap') || text.includes('salary') || text.includes('package') || text.includes('role') || text.includes('become a')) {
      return { intent: 'CAREER_GUIDANCE', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }
    if (text.includes('job') || text.includes('hiring') || text.includes('vacancy') || text.includes('opening')) {
      return { intent: 'JOB_INSIGHT', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }

    // 4. DOMAIN B: STUDY & LEARNING INTENTS
    if (text.includes('explain') || text.includes('how does') || text.includes('what is') || text.includes('difference between') || text.includes('concept')) {
      return { intent: 'ACADEMIC_DOUBT', mode: 'STUDY_MODE', isOutOfScope: false };
    }
    if (text.includes('study plan') || text.includes('revision') || text.includes('schedule') || text.includes('exam')) {
      return { intent: 'STUDY', mode: 'STUDY_MODE', isOutOfScope: false };
    }
    if (text.includes('learn') || text.includes('practice') || text.includes('exercise') || text.includes('project') || text.includes('tutorial') || text.includes('dsa') || text.includes('code')) {
      return { intent: 'LEARNING', mode: 'STUDY_MODE', isOutOfScope: false };
    }
    if (text.includes('skill') || text.includes('improve') || text.includes('strengthen')) {
      return { intent: 'SKILL_DEVELOPMENT', mode: 'STUDY_MODE', isOutOfScope: false };
    }

    // Default domain checks: if query mentions educational/technical keywords
    const technicalKeywords = [
      'python', 'javascript', 'typescript', 'react', 'fastapi', 'docker', 'kubernetes', 'sql', 'nosql', 'mongodb',
      'machine learning', 'deep learning', 'neural network', 'nlp', 'llm', 'transformer', 'random forest',
      'decision tree', 'linear regression', 'data structure', 'array', 'tree', 'graph', 'database', 'cloud', 'aws', 'gcp',
      'system design', 'api', 'rest', 'microservice', 'git', 'ci/cd', 'frontend', 'backend', 'fullstack'
    ];

    if (technicalKeywords.some(tk => text.includes(tk))) {
      return { intent: 'LEARNING', mode: 'STUDY_MODE', isOutOfScope: false };
    }

    // If query is short or generic greeting / capability query, treat as supported guidance
    if (text.includes('hello') || text.includes('hi') || text.includes('help') || text.includes('skillsetu') || text.includes('வணக்கம்') || text.includes('नमस्ते')) {
      return { intent: 'CAREER_GUIDANCE', mode: 'JOB_INSIGHTS', isOutOfScope: false };
    }

    // Fallback classification: Out of scope if no career/study alignment found
    return { intent: 'OUT_OF_SCOPE', mode: 'JOB_INSIGHTS', isOutOfScope: true };
  }

  /**
   * SECTION 5: OUT-OF-SCOPE REFUSAL RESPONSE
   */
  public static getOutOfScopeResponse(language: LanguageCode = 'en'): string {
    if (language === 'ta') {
      return "நான் SkillSetu AI, கல்வி, திறன்கள், வேலைகள், இன்டர்ன்ஷிப் மற்றும் தொழில் முன்னேற்றத்தில் மட்டுமே கவனம் செலுத்துகிறேன். உங்கள் படிப்பு சந்தேகங்கள், திறன் இடைவெளி, வேலை தயாரிப்பு, திறன் தேவை மற்றும் கேரியர் வழிகாட்டுதலுக்கு என்னால் உதவ முடியும்.";
    }
    if (language === 'hi') {
      return "मैं SkillSetu AI हूँ, जो विशेष रूप से अध्ययन, कौशल, नौकरियों, इंटर्नशिप और करियर विकास पर केंद्रित है। मैं आपके स्टडी डाउट्स, स्किल डेवलपमेंट, जॉब तैयारी, स्किल डिमांड और प्लेसमेंट इनसाइट्स में मदद कर सकता हूँ।";
    }
    return "I’m SkillSetu AI, focused specifically on learning, skills, jobs, internships and career development. I can help you with study doubts, skill development, job preparation, skill demand, career paths and placement insights.";
  }

  /**
   * SECTION 3 & 15: MAIN GEMINI GENERATION WORKFLOW
   */
  public static async generateResponse(payload: GeminiChatPayload): Promise<GeminiChatResult> {
    const {
      message,
      history = [],
      language = 'en',
      student,
      college,
      job,
      skillTrends,
      role = 'student',
      forcedMode
    } = payload;

    // STEP 1: CLASSIFY INTENT & CHECK DOMAIN BOUNDARIES
    const { intent, mode: detectedMode, isOutOfScope } = this.classifyIntent(message);
    const activeMode = forcedMode || detectedMode;

    if (isOutOfScope) {
      return {
        reply: this.getOutOfScopeResponse(language),
        intent: 'OUT_OF_SCOPE',
        mode: activeMode,
        isOutOfScope: true,
        isFallback: false,
        suggestedPrompts: [
          'Analyze my skill gap',
          'What should I learn next?',
          'Prepare me for an AI Engineer interview',
          'Which skills are in high demand?'
        ]
      };
    }

    // STEP 2: BUILD PRIVACY-SAFE CONTEXT
    const safeStudent = this.extractSafeStudentContext(student);
    const trendsSnapshot = (skillTrends || []).slice(0, 6).map(t => `${t.skillName}: Demand Score ${t.historicalData[t.historicalData.length - 1]?.demandScore || 80}/100`).join(', ');

    let contextBlock = `\n--- SkillSetu Context ---`;
    if (safeStudent) {
      contextBlock += `\nStudent First Name: ${safeStudent.firstName}`;
      contextBlock += `\nTarget Role: ${safeStudent.targetRole}`;
      contextBlock += `\nCareer Readiness Score: ${safeStudent.careerReadinessScore}/100`;
      contextBlock += `\nCurrent Verified Skills: ${safeStudent.verifiedSkills.map(s => `${s.name} (${s.level}, ${s.proficiency}%)`).join(', ')}`;
      contextBlock += `\nIdentified Skill Gaps: ${safeStudent.skillGaps.map(g => `${g.name} (${g.importance} priority, deficit ${g.gapScore}%)`).join(', ')}`;
      if (safeStudent.recentVerifiedProjects.length > 0) {
        contextBlock += `\nVerified Projects: ${safeStudent.recentVerifiedProjects.join(', ')}`;
      }
    }

    if (job) {
      contextBlock += `\nActive Job Opening: ${job.title} at ${job.companyName}`;
      contextBlock += `\nRequired Skills: ${job.requiredSkills.map(r => `${r.skillName} (Min ${r.minProficiency}%)`).join(', ')}`;
      contextBlock += `\nPackage: ${job.packageRange} (Market indication)`;
    }

    if (college) {
      contextBlock += `\nCollege Context: ${college.name}, Placement Rate: ${college.placementRate}%, Booming Skills: ${college.boomingSkills?.join(', ')}`;
    }

    if (trendsSnapshot) {
      contextBlock += `\nOfficial SkillSetu Market Demand: ${trendsSnapshot}`;
    }

    // STEP 3: ASSEMBLE CENTRALIZED SYSTEM INSTRUCTION (SECTION 3)
    const langDirective = language === 'ta'
      ? 'Respond strictly in fluent, natural conversational Tamil (தமிழ் script).'
      : language === 'hi'
      ? 'Respond strictly in fluent, natural conversational Hindi (हिन्दी script).'
      : 'Respond in clear, structured, professional English.';

    const systemInstruction = `You are SkillSetu AI, a specialized educational and career intelligence assistant.

You have exactly two responsibilities:
1. Help students understand, develop and improve skills through education and learning (DOMAIN B: STUDY & LEARNING).
2. Provide job, internship, placement, career-path and industry-skill insights (DOMAIN A: JOB & CAREER INSIGHTS).

You are NOT a general-purpose assistant.

Only answer questions directly related to:
* learning
* education
* skills
* jobs
* internships
* placements
* careers
* employability
* job preparation
* industry skill demand

If a question is outside these domains, politely refuse and redirect the user toward SkillSetu's supported capabilities.
Never provide unrelated general-purpose answers.

When answering job-related questions (DOMAIN A):
- Follow this structure when answering role / learning priority questions:
  ### Target Role
  ### Your Current Strengths
  ### Important Skill Gaps
  ### Recommended Priority
  ### Why? (relate skill to role)
  ### Suggested Project (practical project)
  ### Job Readiness Impact (use words like 'estimated', 'projected', 'market-based indication')
- Prefer SkillSetu's available data: student skills, verified proficiency, skill demand, job requirements, job match scores, skill gaps.
- Never claim that salary, employment, selection or career outcomes are guaranteed.

When answering study-related questions (DOMAIN B):
- Follow this structure when explaining concepts:
  ### Simple Explanation
  ### How It Works
  ### Example
  ### Practical Use
  ### Interview Point
  ### Practice (2 to 5 practice questions or challenges)

IMPORTANT ACCURACY RULE:
- Do not invent SkillSetu statistics. If data is unavailable, clearly state that SkillSetu currently does not have sufficient data for this specific insight.
- Protect student privacy: never mention Aadhaar or sensitive IDs.

${langDirective}`;

    // STEP 4: CALL GEMINI SDK SERVER-SIDE
    const ai = this.getClient();
    if (ai) {
      try {
        // Format chat contents with history
        const formattedContents: any[] = [];
        
        // Append previous history turns (capped to last 8 turns)
        const recentHistory = history.slice(-8);
        for (const h of recentHistory) {
          formattedContents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        }

        // Append current message with safe context
        const userPrompt = `${contextBlock}\n\nUser Query [Intent: ${intent}, Mode: ${activeMode}, Role: ${role}]:\n"${message}"`;
        formattedContents.push({
          role: 'user',
          parts: [{ text: userPrompt }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.95
          }
        });

        const replyText = response.text?.trim();
        if (replyText) {
          // Identify referenced skill/action for UI rich-cards
          const referencedData = this.detectReferencedData(message, replyText, safeStudent);
          const suggestedPrompts = this.generateSuggestedPrompts(intent, activeMode, language);

          return {
            reply: replyText,
            intent,
            mode: activeMode,
            isOutOfScope: false,
            isFallback: false,
            suggestedPrompts,
            referencedData
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, activating graceful SkillSetu domain engine fallback:', err);
      }
    }

    // STEP 5: DOMAIN-CONSTRAINED DETERMINISTIC FALLBACK (SECTION 18)
    const fallbackReply = this.generateDeterministicFallback(message, intent, activeMode, language, safeStudent, job);
    const referencedData = this.detectReferencedData(message, fallbackReply, safeStudent);
    const suggestedPrompts = this.generateSuggestedPrompts(intent, activeMode, language);

    return {
      reply: fallbackReply,
      intent,
      mode: activeMode,
      isOutOfScope: false,
      isFallback: true,
      suggestedPrompts,
      referencedData
    };
  }

  /**
   * Helper to attach contextual rich actions (e.g. Job Simulator link or Skill Passport)
   */
  private static detectReferencedData(query: string, reply: string, student: MinimalStudentContext | null) {
    const text = (query + ' ' + reply).toLowerCase();
    if (text.includes('fastapi')) {
      return { skillName: 'FastAPI', gapScore: 72, relatedAction: 'job_simulator' as const };
    }
    if (text.includes('docker')) {
      return { skillName: 'Docker', gapScore: 78, relatedAction: 'job_simulator' as const };
    }
    if (text.includes('passport') || text.includes('qr')) {
      return { relatedAction: 'passport' as const };
    }
    if (text.includes('trend') || text.includes('demand')) {
      return { relatedAction: 'skill_demand' as const };
    }
    if (text.includes('project') || text.includes('evidence')) {
      return { relatedAction: 'evidence_upload' as const };
    }
    return undefined;
  }

  /**
   * Generates dynamic contextual follow-up prompts
   */
  private static generateSuggestedPrompts(intent: GeminiIntent, mode: GeminiAIMode, lang: LanguageCode): string[] {
    if (lang === 'ta') {
      return [
        'எனது skill gap-ஐ ஆய்வு செய்யவும்',
        'FastAPI பற்றி விளக்கவும்',
        'TechNova வேலைக்கான தயாரிப்பு',
        'Job Simulator-இல் முயற்சிக்கவும்'
      ];
    }
    if (lang === 'hi') {
      return [
        'मेरा स्किल गैप विश्लेषित करें',
        'FastAPI का उदाहरण समझाएं',
        'AI इंजीनियर इंटरव्यू की तैयारी',
        'जॉब सिम्युलेटर में टेस्ट करें'
      ];
    }
    if (mode === 'STUDY_MODE' || intent === 'STUDY' || intent === 'ACADEMIC_DOUBT' || intent === 'LEARNING') {
      return [
        'Give me 3 practice interview questions on this',
        'How does this connect to real-world projects?',
        'Create a 1-week study plan for this concept',
        'Explain with a code example'
      ];
    }
    return [
      'Analyze my skill gap for AI Engineer',
      'What should I learn next?',
      'Prepare me for a Technical Interview',
      'Which skills have booming industry demand?',
      'How will mastering FastAPI affect my match score?'
    ];
  }

  /**
   * Robust fallback generator adhering strictly to DOMAIN A & B standards
   */
  private static generateDeterministicFallback(
    message: string,
    intent: GeminiIntent,
    mode: GeminiAIMode,
    lang: LanguageCode,
    student: MinimalStudentContext | null,
    job?: JobOpening
  ): string {
    const lower = message.toLowerCase();
    const name = student?.firstName || 'Student';

    // Tamil Fallback
    if (lang === 'ta') {
      if (mode === 'STUDY_MODE' || lower.includes('விளக்') || lower.includes('என்ன')) {
        return `### எளிய விளக்கம் (Simple Explanation)
**FastAPI** என்பது Python-இல் நவீன, அதிவேக RESTful Web API-களை உருவாக்கப் பயன்படும் ஒரு சக்திவாய்ந்த Framework ஆகும்.

### இது எவ்வாறு செயல்படுகிறது? (How It Works)
1. Python Type Hints மூலம் தானியங்கி தரவு சரிபார்ப்பு (Data Validation) செய்கிறது.
2. Asynchronous (async/await) முறையில் அதிகப்படியான பயனர்களை ஒரே நேரத்தில் கையாள்கிறது.
3. Swagger UI மூலம் தானாகவே API Documentation உருவாக்குகிறது.

### நடைமுறைப் பயன்பாடு (Practical Use)
மெஷின் லேர்னிங் (ML) மாடல்களை நிஜ உலக Web Application-ஆக மாற்றுவதற்கு FastAPI முதன்மையாகப் பயன்படுத்தப்படுகிறது.

### நேர்காணல் குறிப்பு (Interview Point)
Flask-ஐ விட FastAPI ஏன் வேகமானது? (பதில்: Starlette மற்றும் Pydantic-ஐ பயன்படுத்துவதால் asyncio ஆதரவு முழுமையாக உள்ளது).

### பயிற்சி கேள்விகள் (Practice Questions)
1. \`@app.get("/")\` மற்றும் \`@app.post("/")\` இடையே உள்ள வேறுபாடு என்ன?
2. FastAPI-இல் Pydantic BaseModel எவ்வாறு Request Body-ஐ சரிபார்க்கிறது?`;
      }
      return `### இலக்கு பணி (Target Role): **${student?.targetRole || 'Junior AI/ML Engineer'}**

### உங்கள் தற்போதைய பலங்கள் (Strengths)
* Python — 86% தேர்ச்சி (Advanced)
* SQL & Data Modeling — 74% (Intermediate)

### முக்கியமான திறன் இடைவெளிகள் (Skill Gaps)
* **FastAPI** — 72% இடைவெளி (High Priority)
* **Docker & Containerization** — 78% இடைவெளி

### பரிந்துரைக்கப்பட்ட முன்னுரிமை
1. **FastAPI**: Python ML மாடல்களை உற்பத்தி API-ஆக வெளியிட.
2. **Docker**: உங்கள் சேவையை கிளவுடில் எளிதாக இயக்க.

### பரிந்துரைக்கப்பட்ட திட்டம் (Suggested Project)
"FastAPI-backed Asynchronous Sentiment Analysis Microservice" — ஒரு ML மாடலை API-ஆக மாற்றி GitHub-இல் பகிரவும்.

### வேலை வாய்ப்பு தாக்கம் (Job Readiness Impact)
TechNova AI Labs வேலை வாய்ப்பு பொருத்தம் 64%-லிருந்து **88%+ ஆக உயர வாய்ப்புள்ளது** (சந்தை அடிப்படையிலான மதிப்பீடு).`;
    }

    // Hindi Fallback
    if (lang === 'hi') {
      return `### लक्षित भूमिका (Target Role): **${student?.targetRole || 'AI/ML Engineer'}**

### आपकी वर्तमान ताकत (Strengths)
* Python — 86% (Advanced)
* Machine Learning Basics — 78% (Intermediate)

### महत्वपूर्ण स्किल गैप (Skill Gaps)
* **FastAPI** — हाई प्रायोरिटी (72% गैप)
* **Docker** — कंटेनराइजेशन (78% गैप)

### सीखने की प्राथमिकता
1. **FastAPI**: AI मॉडल्स को प्रोडक्शन API में बदलने के लिए।
2. **Docker**: कोड को पोर्टेबल और क्लाउड-रेडी बनाने के लिए।

### प्रोजेक्ट सुझाव (Suggested Project)
FastAPI आधारित रियल-टाइम ML इन्फेरेंस माइक्रोसर्विस बनाएं और SkillSetu पर वेरीफाई कराएं।

### करियर प्रभाव (Estimated Impact)
इससे TechNova AI Labs के साथ आपका जॉब मैच 64% से बढ़कर **लगभग 88%** होने का अनुमान है (बाजार डेटा आधारित)।`;
    }

    // English Fallback
    if (mode === 'STUDY_MODE' || lower.includes('explain') || lower.includes('what is') || lower.includes('tree') || lower.includes('forest')) {
      if (lower.includes('decision tree') || lower.includes('tree')) {
        return `### Simple Explanation
A **Decision Tree** is a supervised machine learning algorithm that makes predictions by splitting data into branch-like decisions based on feature questions (e.g., "Is age > 25?").

### How It Works
1. **Root Node**: Evaluates the most informative feature that minimizes entropy or Gini impurity.
2. **Splitting Criteria**: Calculates Information Gain at each node.
3. **Leaf Nodes**: Produce the final predicted class or continuous value.

### Practical Use
Used in credit scoring, medical diagnosis triage, and customer churn prediction where explainability is critical.

### Interview Point
*Overfitting Risk*: Deep decision trees easily overfit training data. Mitigate using pruning (ccp_alpha) or max_depth limits, or ensemble methods like Random Forests.

### Practice Questions
1. How does Gini Impurity differ from Information Entropy?
2. What hyperparameter prevents a tree from growing indefinitely?
3. In what scenario would you choose a Decision Tree over a Linear Model?`;
      }

      return `### Simple Explanation
**FastAPI** is a modern, high-performance web framework for building RESTful APIs with Python 3.8+ based on standard Python type hints.

### How It Works
1. Uses **Pydantic** for automated data parsing and schema validation.
2. Built on **Starlette** for native asynchronous (\`async\`/\`await\`) concurrency.
3. Automatically generates interactive OpenAPI and Swagger UI documentation at \`/docs\`.

### Practical Use
Industry standard for deploying AI/ML models (e.g. PyTorch, Scikit-learn, LangChain) as low-latency production microservices.

### Interview Point
*FastAPI vs Flask*: FastAPI natively supports asyncio and concurrent request handling, whereas Flask defaults to synchronous blocking execution without WSGI extensions.

### Practice
1. Write a minimal FastAPI endpoint that accepts a JSON body with \`text: str\` and returns word count.
2. How does dependency injection work with \`Depends()\` in FastAPI?`;
    }

    // Default Job Insights Mode Structure
    return `### Target Role
**${student?.targetRole || 'Junior AI / ML Engineer'}**

### Your Current Strengths
* **Python**: Advanced (86/100 proficiency, verified via repository analysis)
* **SQL & Data Querying**: Intermediate (74/100)
* **Machine Learning Fundamentals**: Intermediate (78/100)

### Important Skill Gaps
1. **FastAPI**: Missing production API framework proficiency (Deficit: 72%)
2. **Docker**: Missing containerization and reproducible deployment skills (Deficit: 78%)

### Recommended Priority
1. **FastAPI**: Essential for bridging Python ML models into production endpoints.
2. **Docker**: Required by enterprise hiring partners (e.g., TechNova, Razorpay) for cloud deployment.

### Why?
Leading tech employers require AI engineers who can both train models and deploy them as resilient microservices. Mastering FastAPI bridges your strong Python foundation directly to enterprise backends.

### Suggested Project
**"Asynchronous AI Model Inferencing Gateway"** — Build a FastAPI service wrapping a Scikit-Learn or Transformer model with input validation and rate limiting.

### Projected Career Impact
Mastering FastAPI is projected to elevate your **TechNova AI Labs** compatibility score from **64% to 88%+**, expanding your eligible job openings from 7 to 16. *(Market-based estimation; hiring decisions depend on overall candidate evaluation).*`;
  }
}
