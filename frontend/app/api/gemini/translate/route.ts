// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req: Request) {
//     const { text, targetLanguage } = await req.json();
    
//     const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
//     const prompt = `Translate this emergency alert to ${targetLanguage}. Maintain urgency and clarity:\n\n${text}`;
    
//     const result = await model.generateContent(prompt);
//     return NextResponse.json({ translated: result.response.text() });
//   }


import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();
    
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const languageNames: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'ar': 'Arabic',
      'zh': 'Chinese',
      'hi': 'Hindi',
      'pt': 'Portuguese',
      'de': 'German',
    };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      generationConfig: {
        temperature: 0.3,
      }
    });
    
    const prompt = `Translate this emergency alert to ${languageNames[targetLanguage] || targetLanguage}. 
Maintain urgency, clarity, and keep the same formatting:

${text}

Provide ONLY the translation, nothing else.`;

    const result = await model.generateContent(prompt);
    const translated = result.response.text();
    
    return NextResponse.json({ translated });
    
  } catch (error: any) {
    console.error('Translate API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Translation failed',
        details: 'Please check your API key and try again'
      },
      { status: 500 }
    );
  }
}