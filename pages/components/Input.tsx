import React from "react";

function Input({ placeholder, handler }: any) {
	return (
		<div className="relative w-1/2 ">
			<label className="sr-only" htmlFor={placeholder}>
				{placeholder}
			</label>

			<input
				className="w-full py-4 pl-3 pr-16 text-sm border-2 border-gray-200 rounded-lg"
				id="email"
				type="text"
				placeholder={placeholder}
			/>

			<button
				className="absolute p-2 text-white bg-blue-600 rounded-full -translate-y-1/2 top-1/2 right-4 hover:bg-sky-700 ease-in-out duration-300"
				type="button"
				onClick={handler}
			>
				<svg
					className="w-4 h-4 hover:animate-spin transition-transform"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</button>
		</div>
	);
}

export default Input;
