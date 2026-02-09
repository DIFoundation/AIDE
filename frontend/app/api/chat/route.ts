// // src/app/api/chat/route.ts
// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { apiService } from '@/lib/services/api';

// // Initialize Google's Generative AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// // Helper function to extract location from message
// function extractLocation(message: string): { lat?: number; lng?: number } {
//   const locationMatch = message.match(/location[^\d]+(-?\d+\.\d+)[^\d]+(-?\d+\.\d+)/i);
//   if (locationMatch) {
//     return { lat: parseFloat(locationMatch[1]), lng: parseFloat(locationMatch[2]) };
//   }
//   return {};
// }

// // Helper function to detect query type
// function detectQueryType(message: string): 'emergency' | 'shelter' | 'hospital' | 'general' {
//   const lowerMsg = message.toLowerCase();
  
//   if (/(flood|earthquake|fire|emergency)/i.test(lowerMsg)) return 'emergency';
//   if (/(shelter|evacuation|safe place)/i.test(lowerMsg)) return 'shelter';
//   if (/(hospital|medical|doctor|clinic)/i.test(lowerMsg)) return 'hospital';
  
//   return 'general';
// }

// export async function POST(req: Request) {
//   try {
//     const { message, location } = await req.json();
    
//     // Detect the type of query
//     const queryType = detectQueryType(message);
//     // let apiResponse = null;
//     let context = '';

//     // Handle different types of queries
//     switch (queryType) {
//       case 'emergency':
//         const emergencyType = message.match(/(flood|earthquake|fire)/i)?.[0]?.toLowerCase() || 'general';
//         const procedures = await apiService.getEmergencyProcedures(emergencyType);
//         if (procedures.data) {
//           context = `Emergency procedures for ${emergencyType}:\n${procedures.data.join('\n')}\n\n`;
//         }
//         break;
        
//       case 'shelter':
//         if (location?.lat && location?.lng) {
//           const shelters = await apiService.getNearbyShelters(location.lat, location.lng);
//           if (shelters.data) {
//             context = `Nearby shelters:\n${JSON.stringify(shelters.data, null, 2)}\n\n`;
//           }
//         } else {
//           // If no location provided, ask for it
//           return NextResponse.json({
//             response: "Please share your location to find nearby shelters.",
//             requiresLocation: true
//           });
//         }
//         break;
        
//       case 'hospital':
//         const loc = location || extractLocation(message);
//         const hospitals = loc.lat && loc.lng 
//           ? await apiService.getHospitals(loc.lat, loc.lng)
//           : await apiService.getHospitals();
          
//         if (hospitals.data) {
//           context = `Medical facilities:\n${JSON.stringify(hospitals.data, null, 2)}\n\n`;
//         }
//         break;
//     }

//     // Initialize the AI model
//     const model = genAI.getGenerativeModel({ 
//       model: 'gemini-3-flash-preview',
//       generationConfig: {
//         maxOutputTokens: 1000,
//         temperature: 0.7,
//       },
//     });

//     // Create a prompt with context
//     const prompt = `You are AIDE (AI Disaster Emergency) Assistant. 
//       ${context}
//       User: ${message}
      
//       Provide a helpful response based on the context above. If the user asks for information not in the context, 
//       respond that you'll help them find the information.`;

//     // Generate response
//     const result = await model.generateContent({
//       contents: [{
//         role: "user",
//         parts: [{ text: prompt }]
//       }],
//       generationConfig: {
//         maxOutputTokens: 1000,
//         temperature: 0.7,
//       },
//     });

//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ 
//       response: text,
//       queryType,
//       hasLocation: !!(location?.lat && location?.lng)
//     });

//   } catch (error: any) {
//     console.error('Chat Error:', error);
//     return NextResponse.json(
//       { 
//         error: error.message || 'Failed to process your request',
//         suggestion: 'Please try again in a moment.'
//       },
//       { status: error.status || 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// REMOVE edge runtime - use Node.js runtime instead
// export const runtime = 'edge'; // ❌ DELETE THIS LINE

export async function POST(req: Request) {
  try {
    // Validate API key first
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'GEMINI_API_KEY is not configured',
          suggestion: 'Please add GEMINI_API_KEY to your environment variables'
        },
        { status: 500 }
      );
    }

    const { message, location, nearbyResources } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Initialize Gemini with CORRECT model name
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Build context-aware prompt
    let contextInfo = '';
    
    if (location?.lat && location?.lng) {
      contextInfo += `\nUser location: ${location.lat}, ${location.lng}`;
    }
    
    if (nearbyResources && nearbyResources.length > 0) {
      contextInfo += `\n\nNearby emergency resources:`;
      nearbyResources.forEach((r: any, i: number) => {
        contextInfo += `\n${i + 1}. ${r.name} (${r.type}) - ${r.address || 'Address not available'}`;
        if (r.phone) contextInfo += ` | Phone: ${r.phone}`;
      });
    }

    const prompt = `You are AIDE (AI Disaster Emergency) Assistant, helping people during emergencies.
${contextInfo}

User question: ${message}

Provide a helpful, clear, and concise response. If the user needs emergency services, tell them to call local emergency numbers. If you mention nearby resources, reference them by name and provide actionable advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Detect query type
    const lowerMsg = message.toLowerCase();
    let queryType = 'general';
    if (/(flood|earthquake|fire|emergency)/i.test(lowerMsg)) queryType = 'emergency';
    else if (/(shelter|evacuation|safe place)/i.test(lowerMsg)) queryType = 'shelter';
    else if (/(hospital|medical|doctor|clinic)/i.test(lowerMsg)) queryType = 'hospital';

    return NextResponse.json({ 
      response: text,
      queryType,
      hasLocation: !!(location?.lat && location?.lng),
      resourcesIncluded: nearbyResources?.length || 0
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error.message,
        suggestion: error.message.includes('API_KEY') 
          ? 'Please configure GEMINI_API_KEY environment variable'
          : 'Please try again in a moment.'
      },
      { status: 500 }
    );
  }
}