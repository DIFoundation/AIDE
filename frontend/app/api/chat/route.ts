// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiService } from '@/lib/services/api';

export const runtime = 'edge';

// Initialize Google's Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper function to extract location from message
function extractLocation(message: string): { lat?: number; lng?: number } {
  const locationMatch = message.match(/location[^\d]+(-?\d+\.\d+)[^\d]+(-?\d+\.\d+)/i);
  if (locationMatch) {
    return { lat: parseFloat(locationMatch[1]), lng: parseFloat(locationMatch[2]) };
  }
  return {};
}

// Helper function to detect query type
function detectQueryType(message: string): 'emergency' | 'shelter' | 'hospital' | 'general' {
  const lowerMsg = message.toLowerCase();
  
  if (/(flood|earthquake|fire|emergency)/i.test(lowerMsg)) return 'emergency';
  if (/(shelter|evacuation|safe place)/i.test(lowerMsg)) return 'shelter';
  if (/(hospital|medical|doctor|clinic)/i.test(lowerMsg)) return 'hospital';
  
  return 'general';
}

export async function POST(req: Request) {
  try {
    const { message, location } = await req.json();
    
    // Detect the type of query
    const queryType = detectQueryType(message);
    // let apiResponse = null;
    let context = '';

    // Handle different types of queries
    switch (queryType) {
      case 'emergency':
        const emergencyType = message.match(/(flood|earthquake|fire)/i)?.[0]?.toLowerCase() || 'general';
        const procedures = await apiService.getEmergencyProcedures(emergencyType);
        if (procedures.data) {
          context = `Emergency procedures for ${emergencyType}:\n${procedures.data.join('\n')}\n\n`;
        }
        break;
        
      case 'shelter':
        if (location?.lat && location?.lng) {
          const shelters = await apiService.getNearbyShelters(location.lat, location.lng);
          if (shelters.data) {
            context = `Nearby shelters:\n${JSON.stringify(shelters.data, null, 2)}\n\n`;
          }
        } else {
          // If no location provided, ask for it
          return NextResponse.json({
            response: "Please share your location to find nearby shelters.",
            requiresLocation: true
          });
        }
        break;
        
      case 'hospital':
        const loc = location || extractLocation(message);
        const hospitals = loc.lat && loc.lng 
          ? await apiService.getHospitals(loc.lat, loc.lng)
          : await apiService.getHospitals();
          
        if (hospitals.data) {
          context = `Medical facilities:\n${JSON.stringify(hospitals.data, null, 2)}\n\n`;
        }
        break;
    }

    // Initialize the AI model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Create a prompt with context
    const prompt = `You are AIDE (AI Disaster Emergency) Assistant. 
      ${context}
      User: ${message}
      
      Provide a helpful response based on the context above. If the user asks for information not in the context, 
      respond that you'll help them find the information.`;

    // Generate response
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      response: text,
      queryType,
      hasLocation: !!(location?.lat && location?.lng)
    });

  } catch (error: any) {
    console.error('Chat Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process your request',
        suggestion: 'Please try again in a moment.'
      },
      { status: error.status || 500 }
    );
  }
}