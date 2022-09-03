import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownPreview({ markdown }: any) {
	return (
		<div>
			<ReactMarkdown remarkPlugins={[remarkGfm]}>
				{markdown}
			</ReactMarkdown>
		</div>
	);
}

export default MarkdownPreview;
