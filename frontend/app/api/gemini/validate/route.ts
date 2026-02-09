// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req: Request) {
//     const { prompt } = await req.json();
    
//     const model = genAI.getGenerativeModel({ 
//       model: 'gemini-3-flash-preview',
//       generationConfig: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: SchemaType.OBJECT,
//           properties: {
//             isComplete: { type: SchemaType.BOOLEAN },
//             redFlags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
//             recommendation: { 
//               type: SchemaType.STRING,
//               enum: ["APPROVE", "REVIEW", "REJECT"],
//               format: "enum"
//             },
//             notes: { type: SchemaType.STRING }
//           },
//           required: ["isComplete", "recommendation", "notes"]
//         }
//       }
//     });
    
//     const result = await model.generateContent(prompt);
//     return NextResponse.json(JSON.parse(result.response.text()));
//   }


import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
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
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            isComplete: { type: SchemaType.BOOLEAN },
            redFlags: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING } 
            },
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
    const responseText = result.response.text();
    const validation = JSON.parse(responseText);
    
    return NextResponse.json(validation);
    
  } catch (error: any) {
    console.error('Validate API Error:', error);
    
    // Fallback validation response
    return NextResponse.json({
      isComplete: false,
      redFlags: ['AI validation unavailable'],
      recommendation: 'REVIEW',
      notes: 'Unable to perform AI validation. Please review manually. Error: ' + error.message
    });
  }
}