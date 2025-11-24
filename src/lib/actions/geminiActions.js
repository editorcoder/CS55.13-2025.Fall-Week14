/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
geminiActions.js
2025-11-22
*/

// Extended lore Server action

// Mark this file as server-only code
"use server";

// Import Gemini model and plugin from Genkit
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
// Import Genkit orchestrator
import { genkit } from "genkit";

// Server action to generate extended lore for a card using Gemini AI
export async function generateExtendedLore(
  cardId,
  originalLore,
  mechanics,
  title
) {
  try {
    // Validate required fields
    if (!cardId || !originalLore) {
      throw new Error("Missing required fields: cardId and originalLore");
    }

    // Ensure required API key exists
    if (!process.env.GEMINI_API_KEY) {
      // Make sure GEMINI_API_KEY environment variable is set
      throw new Error(
        "GEMINI_API_KEY not set. Please set the GEMINI_API_KEY environment variable."
      );
    }

    // Configure a Genkit instance
    const ai = genkit({
      // Initialize Genkit with Google provider
      plugins: [googleAI()],
      // Set default model to Gemini 2.0 Flash
      model: gemini20Flash,
    });

    // Create prompt for generating extended lore
    // Build prompt with available card information
    const prompt = `
    Task: Write an expanded lore paragraph (≤ 80 words) for a cat-themed trading-card-game card.

    Inputs:
    - Title: ${title} - the card's name.
    - Mechanics: ${mechanics} - a brief description of the card's abilities/effects.
    - Original Lore: ${originalLore} - the existing flavor text.

    Guidelines:

    - Tone & Style: Preserve the voice of the original lore (e.g., whimsical, epic, noir). Do not introduce a new narrative tone.
    - Integration: Seamlessly weave the title and mechanics into the story. Show how the mechanics manifest in the world (e.g., “its pounce summons…”) and let the title act as a thematic anchor.
    - Depth: Add at least two new details—such as a setting, a character motivation, or a historic event—that enrich the card's background without exceeding 80 words.
    - Clarity: Keep sentences concise; avoid jargon unrelated to the game world.
    - Consistency: Ensure the expanded lore could plausibly replace the original text without breaking existing flavor conventions.

    Output: One paragraph (max 80 words) that meets all the above criteria.    
    `;

    // Define safety settings to block harmful content at low and above thresholds
    const safetySettings = [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
    ];

    // Generate extended lore text using Gemini AI with safety settings
    const { text } = await ai.generate(prompt, {
      safetySettings: safetySettings,
    });

    // Return the generated extended lore text
    return text;
  } catch (error) {
    // Log error for debugging
    console.error("Error generating extended lore:", error);
    // Re-throw error to be handled by caller
    throw error;
  }
}
