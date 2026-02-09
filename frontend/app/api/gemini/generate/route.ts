// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req: Request) {
//   const { prompt } = await req.json();
  
//   const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
//   const result = await model.generateContent(prompt);
  
//   return NextResponse.json({ text: result.response.text() });
// }

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return NextResponse.json({ text });
    
  } catch (error: any) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate content',
        details: 'Please check your GEMINI_API_KEY and try again'
      },
      { status: 500 }
    );
  }
}