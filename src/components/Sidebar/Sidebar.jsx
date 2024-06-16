// Import CSS styles for the Sidebar component
import "./Sidebar.css";

// Import assets from the assets module
import { assets } from "../../assets/assets";

// Import necessary hooks and components from React
import { useContext, useState } from "react";
import { Context } from "../../context/Context";

// Sidebar component definition
const Sidebar = () => {
	// State to manage the extended state of the sidebar
	const [extended, setExtended] = useState(false);

	// Destructure context values and functions from the Context
	const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

	// Function to load a previous prompt
	const loadPreviousPrompt = async (prompt) => {
		setRecentPrompt(prompt); // Set the recent prompt in context state
		await onSent(prompt); // Trigger sending the prompt action
	};

	// Render the Sidebar component
	return (
		<div className="sidebar">
			{/* Top section of the sidebar */}
			<div className="top">
				{/* Menu icon */}
				<img
					src={assets.menu_icon}
					className="menu"
					alt="menu-icon"
					onClick={() => {
						setExtended((prev) => !prev); // Toggle extended state on menu click
					}}
				/>
				{/* New chat section */}
				<div className="new-chat">
					<img
						src={assets.plus_icon}
						alt=""
						onClick={() => {
							newChat(); // Trigger new chat action on plus icon click
						}}
					/>
					{extended ? <p>New Chat</p> : null} {/* Display text if extended */}
				</div>
				{/* Recent prompts section */}
				{extended ? (
					<div className="recent">
						<p className="recent-title">Recent</p>
						{/* Map through previous prompts */}
						{prevPrompts.map((item, index) => {
							return (
								// Recent entry item
								<div
									key={index}
									onClick={() => {
										loadPreviousPrompt(item); // Load selected prompt on click
									}}
									className="recent-entry"
								>
									<img src={assets.message_icon} alt="" /> {/* Message icon */}
									<p>{item.slice(0, 18)}...</p> {/* Display truncated prompt */}
								</div>
							);
						})}
					</div>
				) : null}
			</div>
			{/* Bottom section of the sidebar */}
			<div className="bottom">
				{/* Help item */}
				<div className="bottom-item recent-entry">
					<img src={assets.question_icon} alt="" /> {/* Question icon */}
					{extended ? <p>Help</p> : null} {/* Display text if extended */}
				</div>
				{/* Activity item */}
				<div className="bottom-item recent-entry">
					<img src={assets.history_icon} alt="" /> {/* History icon */}
					{extended ? <p>Activity</p> : null} {/* Display text if extended */}
				</div>
				{/* Settings item */}
				<div className="bottom-item recent-entry">
					<img src={assets.setting_icon} alt="" /> {/* Settings icon */}
					{extended ? <p>Settings</p> : null} {/* Display text if extended */}
				</div>
			</div>
		</div>
	);
};

// Export the Sidebar component as the default export
export default Sidebar;
