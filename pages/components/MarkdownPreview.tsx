import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownPreview({ markdown }: any) {
	return (
		<div>
			<ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
		</div>
	);
}

export default MarkdownPreview;
