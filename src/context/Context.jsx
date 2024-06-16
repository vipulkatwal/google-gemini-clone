// Import necessary modules and functions from React and other files
import { createContext, useState } from "react";
import runChat from "../config/Gemini"; // Import function to run chat from Gemini configuration

// Create a new context
export const Context = createContext();

// Define ContextProvider component
const ContextProvider = (props) => {
	// State variables for managing input, recent prompt, previous prompts, results display, loading state, and result data
	const [input, setInput] = useState(""); // State for user input
	const [recentPrompt, setRecentPrompt] = useState(""); // State for the most recent prompt
	const [prevPrompts, setPrevPrompts] = useState([]); // State for storing previous prompts
	const [showResults, setShowResults] = useState(false); // State to control display of results
	const [loading, setLoading] = useState(false); // State to indicate loading state
	const [resultData, setResultData] = useState(""); // State to store result data

	// Function to delay displaying each character of the response for a typing effect
	const delayPara = (index, nextWord) => {
		setTimeout(function () {
			setResultData((prev) => prev + nextWord); // Append next character to resultData after delay
		}, 10 * index); // Delay each character display
	};

	// Function to reset loading and result display states for new chat
	const newChat = () => {
		setLoading(false); // Reset loading state
		setShowResults(false); // Hide results display
	};

	// Function triggered when user sends a prompt
	const onSent = async (prompt) => {
		setResultData(""); // Clear previous result data
		setLoading(true); // Set loading state to true
		setShowResults(true); // Show results display

		let response; // Variable to store response from chat

		// Check if prompt is defined
		if (prompt !== undefined) {
			response = await runChat(prompt); // Run chat with provided prompt
			setRecentPrompt(prompt); // Set recent prompt to the provided prompt
		} else {
			setPrevPrompts((prev) => [...prev, input]); // Add current input to previous prompts array
			setRecentPrompt(input); // Set recent prompt to the current input
			response = await runChat(input); // Run chat with current input
		}

		try {
			// Format response for code blocks (replace ```...``` with <pre><code>...</code></pre>)
			let formattedResponse = response.replace(
				/```([\s\S]*?)```/g,
				"<pre><code>$1</code></pre>"
			);

			// Replace single asterisks with line breaks
			formattedResponse = formattedResponse.split("*").join("<br/>");

			// Convert formatted response to array for animated typing effect
			let newResponseArray = formattedResponse.split("");
			for (let i = 0; i < newResponseArray.length; i++) {
				const nextWord = newResponseArray[i];
				delayPara(i, nextWord); // Delay displaying each character
			}
		} catch (error) {
			console.error("Error while running chat:", error); // Log error if any occurs during chat execution
			// Handle error appropriately
		} finally {
			setLoading(false); // Reset loading state
			setInput(""); // Clear input after sending
		}
	};

	// Context value containing state variables and functions accessible by consuming components
	const contextValue = {
		prevPrompts,
		setPrevPrompts,
		onSent,
		setRecentPrompt,
		recentPrompt,
		input,
		setInput,
		showResults,
		loading,
		resultData,
		newChat,
	};

	// Provide context value to children components
	return (
		<Context.Provider value={contextValue}>{props.children}</Context.Provider>
	);
};

// Export ContextProvider as the default export of this module
export default ContextProvider;
