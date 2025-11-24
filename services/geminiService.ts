import { GoogleGenAI } from "@google/genai";
import { ProcessStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStepDetails = async (step: ProcessStep): Promise<string> => {
  const modelId = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are an expert Sourcing Agent for Material Handling Equipment (MHE).
    Product Scope: Pallet Trucks (Hand/Electric), Pallet Stackers, Oil Drum Trucks/Stackers, and Forklifts.

    Goal: Provide a SIMPLIFIED, CONCISE, and PROFESSIONAL sourcing checklist.
    Format: Clean Markdown. Short bullet points. No fluff. 
    Language: English.

    Focus on:
    1. Technical Specs (Pump types, Wheels, Motors).
    2. Quality Control (Welding, Painting).
    3. Logistics (Stacking density in containers).
  `;

  const prompt = `
    Provide a concise checklist for STEP ${step.id}: "${step.title}".
    
    Context: The user is sourcing Pallet Trucks, Stackers, and Drum Lifters from China.
    
    Cover these points specifically:
    ${getStepSpecificPrompts(step.id)}
    
    Keep it brief and actionable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5, // Lower temperature for more direct/factual output
      }
    });

    return response.text || "No details available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to retrieve expert advice. Please check your connection or API key.");
  }
};

// Helper to tailor the prompt for each specific step of the cycle
function getStepSpecificPrompts(id: number): string {
  switch (id) {
    case 1: // Products Request
      return `
        - Key Specs: Load Capacity (2.0T/2.5T/3.0T), Fork Width (550mm vs 685mm).
        - Wheels: Nylon (Hard/noisy) vs. PU (Quiet/smooth).
        - Pump Type: Integrated (Cast) vs. Welded pump for pallet trucks.
        - Stacker/Drum Lifter: Lifting height (1.6m - 3.0m), Straddle leg width.
        - Power: Manual vs. Semi-Electric vs. Full Electric (Li-ion).
      `;
    case 2: // Supplier Confirmation
      return `
        - Verify if they produce the Hydraulic Cylinder/Pump in-house (Key quality indicator).
        - Check painting line (Powder coating quality).
        - Ask for photos of the "Semi-finished area" to see steel thickness.
        - Distinguish between a real factory and an assembler.
      `;
    case 3: // Quotations Confirmed
      return `
        - Price breakdown: Unit price vs. Spare parts kit.
        - Battery inclusion: Lead-acid vs. Lithium (Cost difference).
        - Motor Brand: AC vs DC motor for electric stackers.
        - Controller Brand: Curtis (US) vs Zapi (IT) vs Chinese domestic.
      `;
    case 4: // Samples Arranging
      return `
        - Buying 1 unit sample is common for Pallet Trucks (Low cost).
        - What to check: Oil leaks after lifting max load.
        - Weld consistency on the chassis.
        - Handle return spring mechanism smoothness.
      `;
    case 5: // Order Processing
      return `
        - Confirm exact color code (RAL).
        - OEM Sticker/Logo placement.
        - Spare parts list confirmation (Seal kits, extra wheels).
        - Production time (Usually 20-30 days for mixed containers).
      `;
    case 6: // Delivery Arrange
      return `
        - **Critical**: Stacking plan. How many pallet trucks per pallet? (Usually 6 units/pallet).
        - Removing handles/batteries to save space in container.
        - Packing: Industrial wrap vs Wooden Pallet vs Paper board protection.
        - Mixing heavy goods (Forklifts) with light goods (Pallet trucks) to maximize weight limit.
      `;
    case 7: // After Sales Service
      return `
        - Free seal kits policy (usually 1-2% free parts).
        - Video instructions for changing wheels/seals.
        - Warranty period for the Hydraulic Pump (Core component).
      `;
    default:
      return "General checklist.";
  }
}