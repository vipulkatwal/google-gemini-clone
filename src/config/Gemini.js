// Import necessary classes from the @google/generative-ai package
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";

// Define constants for the model name and API key
const MODEL_NAME = "gemini-1.0-pro";
// API key should be securely managed in production, not hardcoded
const API_KEY = "AIzaSyDFaxS3bCHtEL6TkZHbm62uNVhKfgOVDE8";

/**
 * Function to run a chat with the Google Generative AI model
 * @param {string} prompt - The input prompt for the chat model
 * @returns {Promise<string>} - The response text from the model
 */
async function runChat(prompt) {
	// Initialize the Google Generative AI client with the provided API key
	const genAI = new GoogleGenerativeAI(API_KEY);
	// Retrieve the generative model using the specified model name
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });

	// Configuration for the generation settings
	const generationConfig = {
		temperature: 0.9, // Controls the creativity of the response
		topK: 1, // Limits the sampling pool to the top K choices
		topP: 1, // Limits the sampling pool to the top P probability mass
		maxOutputTokens: 2048, // Maximum number of tokens in the output
	};

	// Safety settings to avoid generating harmful content
	const safetySettings = [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
	];

	// Start a new chat session with the model, applying generation and safety configurations
	const chat = model.startChat({
		generationConfig,
		safetySettings,
		history: [], // Chat history is empty initially
	});

	// Send the input prompt to the model and await the response
	const result = await chat.sendMessage(prompt);
	const response = result.response;
	// Output the response text to the console
	console.log(response.text());
	// Return the response text
	return response.text();
}

// Export the runChat function as the default export of this module
export default runChat;
