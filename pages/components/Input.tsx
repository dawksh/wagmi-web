import React from "react";

function Input({ placeholder, set }: any) {
	return (
		<div className="relative md:w-1/3">
			<label className="sr-only" htmlFor={placeholder}>
				{placeholder}
			</label>

			<input
				className="w-full py-4 pl-3 pr-3 text-sm border-2 border-gray-200 rounded-lg"
				id="email"
				type="text"
				placeholder={placeholder}
				onChange={(e) => set(e.target.value)}
			/>
		</div>
	);
}

export default Input;
