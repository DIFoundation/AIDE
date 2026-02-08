import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  const result = await model.generateContent(prompt);
  
  return NextResponse.json({ text: result.response.text() });
}