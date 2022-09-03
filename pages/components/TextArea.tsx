import React from "react";

function TextArea() {
	return (
		<div>
			<textarea
				id="message"
				rows={10}
				className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
				placeholder="Your agreement terms here. (Don't tell anyone I'm markdown supported 🤫)"
			></textarea>
		</div>
	);
}

export default TextArea;
