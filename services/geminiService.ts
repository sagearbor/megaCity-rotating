import { GoogleGenAI } from "@google/genai";
import { RingConfig, AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeStructure = async (rings: RingConfig[], query: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    return {
      title: "API Key Missing",
      content: "Please configure your Gemini API Key to access the AI Architect.",
      type: 'structural'
    };
  }

  const model = "gemini-3-flash-preview";
  
  const systemContext = `
    You are the Chief Architect of "The Rotunda", a unique ground-based megacity.
    
    KEY ARCHITECTURE SPECS:
    - 8 Concentric Toroids (Rings) + Central Hub.
    - Material: Reinforced brick/masonry (Neo-Babylonian industrial aesthetic).
    - MECHANICS: 
      - Adjacent rings rotate in OPPOSITE directions (CW/CCW).
      - Rings rotate at a constant edge speed of ~0.5 m/s (approx walking speed).
    - BRIDGE SYSTEM:
      - 112 Static Bridges total (16 per gap).
      - Bridges are FIXED to the ground/gap. They DO NOT rotate.
      - Bridges are STAGGERED vertically across floors 2-9.
    
    TRANSIT EXPERIENCE:
    - To cross rings, one walks to the edge of their rotating building.
    - When a static bridge appears (relative to them), they step off the moving ring onto the stationary bridge.
    - They cross the 150m gap.
    - They step ONTO the next ring, which is moving in the opposite direction.
    - It feels like stepping off a very slow carousel.
    
    User Query: "${query}"
    
    Answer as if you are maintaining this complex kinetic city. Discuss the "Step-off" maneuver, the dizzying visual of alternating horizons, and the convenience of vertical bridge staggering.
    Output in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: systemContext,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      }
    });

    return {
      title: "Architect's Note",
      content: response.text || "No analysis generated.",
      type: 'structural'
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      title: "Connection Error",
      content: "Failed to reach the architectural database. Please try again.",
      type: 'logistical'
    };
  }
};

export const generateLore = async (rings: RingConfig[]): Promise<string> => {
    if (!apiKey) return "API Key required for lore generation.";
    
    const model = "gemini-3-flash-preview";
    const prompt = `
      Write a short archive entry (max 100 words) about life in "The Rotunda". 
      Focus on the unique transit experience: The "Step-Off" where citizens step from a moving ring onto a static bridge, and the view of the next ring spinning the opposite way. 
      Mention the staggered bridges on different floors.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        return "Lore generation unavailable.";
    }
};