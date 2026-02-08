import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    const { prompt } = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            isComplete: { type: SchemaType.BOOLEAN },
            redFlags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            recommendation: { 
              type: SchemaType.STRING,
              enum: ["APPROVE", "REVIEW", "REJECT"],
              format: "enum"
            },
            notes: { type: SchemaType.STRING }
          },
          required: ["isComplete", "recommendation", "notes"]
        }
      }
    });
    
    const result = await model.generateContent(prompt);
    return NextResponse.json(JSON.parse(result.response.text()));
  }