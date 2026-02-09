// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     const model = genAI.getGenerativeModel({
//       model: "gemini-3-flash-preview",
//       generationConfig: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: SchemaType.OBJECT,
//           properties: {
//             insights: { 
//               type: SchemaType.STRING,
//               description: "The generated insights based on the prompt"
//             },
//           },
//           required: ["insights"]
//         },
//       },
//     });

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     const data = JSON.parse(responseText);

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate insights" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

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
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            critical_issue: {
              type: SchemaType.OBJECT,
              properties: {
                description: { type: SchemaType.STRING },
                impact: { type: SchemaType.STRING }
              }
            },
            resource_gap: {
              type: SchemaType.OBJECT,
              properties: {
                status: {
                  type: SchemaType.OBJECT,
                  properties: {
                    shelter: { type: SchemaType.STRING },
                    food: { type: SchemaType.STRING },
                    medical: { type: SchemaType.STRING },
                    water: { type: SchemaType.STRING }
                  }
                },
                severity: { type: SchemaType.STRING }
              }
            },
            recommendations: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            }
          },
          required: ["critical_issue", "resource_gap", "recommendations"]
        },
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Gemini Insights API Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate insights",
        details: error.message 
      },
      { status: 500 }
    );
  }
}