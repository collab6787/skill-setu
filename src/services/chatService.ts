import { LanguageCode, StudentProfile, CollegeStats, JobOpening } from '../types';
import { GoogleGenAI } from '@google/genai';

export interface ChatContext {
  student?: StudentProfile;
  college?: CollegeStats;
  job?: JobOpening;
  role: 'student' | 'college' | 'company' | 'admin';
}

export class ChatbotService {
  private static geminiClient: GoogleGenAI | null = null;

  private static getGemini(): GoogleGenAI | null {
    if (!this.geminiClient && process.env.GEMINI_API_KEY) {
      this.geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return this.geminiClient;
  }

  /**
   * Generates a contextual multi-lingual response using Gemini or deterministic local fallback
   */
  public static async generateResponse(
    userMessage: string,
    language: LanguageCode,
    context: ChatContext
  ): Promise<string> {
    const ai = this.getGemini();

    if (ai) {
      try {
        const studentInfo = context.student
          ? `Student Name: ${context.student.name}, Target Role: ${context.student.targetRole}, Readiness Score: ${context.student.careerReadinessScore.overall}/100. Current Skills: ${context.student.skills.map(s => `${s.skillName} (${s.proficiencyScore}/100)`).join(', ')}. Gaps: FastAPI (missing/beginner), Docker (missing/beginner).`
          : 'No specific student loaded.';

        const langPrompt = language === 'ta'
          ? 'Respond fluently in natural conversational Tamil (தமிழ் script).'
          : language === 'hi'
          ? 'Respond fluently in natural conversational Hindi (हिन्दी script).'
          : 'Respond in clear, encouraging, professional English.';

        const prompt = `You are SkillSetu Assistant ("Bridging Academia and Industry"), an intelligent AI career and skill advisor.
${langPrompt}
Current User Role: ${context.role}
Context Data: ${studentInfo}
User Inquiry: "${userMessage}"

Provide a concise, practical, and highly empathetic response (under 120 words). If the user asks what to learn next, recommend FastAPI and Docker with specific reasons. If in Tamil or Hindi, use proper Unicode script.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        if (response.text) {
          return response.text.trim();
        }
      } catch (err) {
        console.warn('Gemini API call fell back to local engine:', err);
      }
    }

    // Deterministic regional fallback engine
    return this.getLocalFallbackResponse(userMessage, language, context);
  }

  private static getLocalFallbackResponse(
    msg: string,
    lang: LanguageCode,
    ctx: ChatContext
  ): string {
    const lower = msg.toLowerCase();
    const stName = ctx.student?.name || 'Student';

    // Tamil Responses
    if (lang === 'ta') {
      if (lower.includes('skill') || lower.includes('கற்று') || lower.includes('அடுத்த') || lower.includes('படிக்க')) {
        return `வணக்கம் ${stName}! உங்கள் சுயவிவரத்தை ஆய்வு செய்ததில், நீங்கள் **FastAPI** மற்றும் **Docker** ஆகியவற்றை அடுத்ததாக கற்க பரிந்துரைக்கிறேன். நீங்கள் ஏற்கனவே Python-இல் 86% தேர்ச்சி பெற்றுள்ளீர்கள், எனவே FastAPI மூலம் AI மாதிரிகளை தயாரிப்பு API-ஆக மாற்ற எளிதாக இருக்கும். இது உங்கள் வேலை வாய்ப்பை 64%-லிருந்து 88% வரை உயர்த்தும்!`;
      }
      if (lower.includes('score') || lower.includes('மதிப்பெண்') || lower.includes('குறைவு')) {
        return `உங்கள் தற்போதைய Career Readiness Score **78/100** ஆகும். இது உங்கள் Python மற்றும் ML திறன்களால் சிறப்பாக உள்ளது. உங்கள் மதிப்பெண்ணை **90+** ஆக உயர்த்த, FastAPI மற்றும் Docker குறித்த ஒரு சரிபார்க்கப்பட்ட திட்டத்தை (Verified Project) சமர்ப்பிக்கவும்.`;
      }
      if (lower.includes('job') || lower.includes('வேலை') || lower.includes('வாய்ப்பு')) {
        return `TechNova AI Labs மற்றும் Razorpay நிறுவனங்களில் Junior AI / ML Engineer மற்றும் Full Stack பணிகளுக்கு நீங்கள் தகுதியுடையவர். FastAPI கற்றுக் கொண்டால் TechNova-வின் 8.0-12.0 LPA வேலைக்கு 91% பொருத்தம் பெறுவீர்கள்!`;
      }
      return `வணக்கம்! நான் SkillSetu AI உதவியாளர். உங்கள் திறன் இடைவெளி (Skill Gap), சான்றிதழ் சரிபார்ப்பு மற்றும் பொருத்தமான வேலை வாய்ப்புகள் பற்றி என்னிடம் கேட்கலாம். உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?`;
    }

    // Hindi Responses
    if (lang === 'hi') {
      if (lower.includes('skill') || lower.includes('सीख') || lower.includes('आगे') || lower.includes('अगला')) {
        return `नमस्ते ${stName}! आपके प्रोफाइल विश्लेषण के अनुसार, आपको अगला कौशल **FastAPI** और **Docker** सीखना चाहिए। आपका Python स्कोर 86/100 बहुत मजबूत है, इसलिए FastAPI सीखना आपके लिए आसान होगा और TechNova जैसी कंपनियों में आपका जॉब मैच 64% से बढ़कर 88% हो जाएगा!`;
      }
      if (lower.includes('score') || lower.includes('स्कोर') || lower.includes('कम')) {
        return `आपका वर्तमान करियर रेडीनेस स्कोर **78/100** है। इसे 90+ तक ले जाने के लिए, बैकएंड API पर एक वेरीफाइड प्रोजेक्ट और डॉकर कंटेनराइजेशन का सर्टिफिकेट जोड़ें।`;
      }
      return `नमस्ते! मैं SkillSetu AI सहायक हूँ। आप मुझसे अपने स्किल गैप, करियर तैयारी, और कंपनियों में मैचिंग नौकरियों के बारे में पूछ सकते हैं। मैं आपकी क्या मदद करूँ?`;
    }

    // English Responses
    if (lower.includes('learn') || lower.includes('next') || lower.includes('skill') || lower.includes('gap')) {
      return `Hello ${stName}! Based on your profile and target role as an **AI/ML Engineer**, your next best skill to learn is **FastAPI**, followed by **Docker**.\n\n• **Why FastAPI?** You already have strong Python proficiency (86/100). FastAPI will allow you to deploy ML models as production microservices, lifting your job match with companies like TechNova from 64% to 88%+.`;
    }
    if (lower.includes('score') || lower.includes('readiness') || lower.includes('low') || lower.includes('why')) {
      return `Your Career Readiness Score is currently **78/100**.\n\n• **Strengths:** Python (86), Pandas (82), SQL (74).\n• **Area for Growth:** Production deployment & containerization (FastAPI 28/100, Docker 22/100).\n• Adding 1 verified project in FastAPI will elevate your score to 88+.`;
    }
    if (lower.includes('job') || lower.includes('role') || lower.includes('technova') || lower.includes('apply')) {
      return `You currently have 7 eligible roles, with top alignment for **TechNova AI Labs (Junior AI/ML Engineer - ₹8-12 LPA)**. Try the **Job Simulator** to see how mastering FastAPI increases your eligible roles to 16!`;
    }
    return `Hello ${stName}! I am your SkillSetu AI Career & Skill Advisor. You can ask me about your skill gaps, recommendations, Job Simulator projections, or institutional verification. How can I assist you today?`;
  }
}
