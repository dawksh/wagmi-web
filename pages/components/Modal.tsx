import React from "react";
import toast from "react-hot-toast";

function Modal({ set, cid }: any) {
	const close = () => {
		set(false);
	};

	return (
		<div className="z-10">
			<div className="relative flex justify-center items-center">
				<div
					id="menu"
					className="w-full h-full bg-gray-900 bg-opacity-80 top-0 fixed sticky-0"
				>
					<div className="2xl:container  2xl:mx-auto py-48 px-4 md:px-28 flex justify-center items-center">
						<div className="w-96 md:w-auto dark:bg-gray-800 relative flex flex-col justify-center items-center bg-white py-16 px-4 md:px-24 xl:py-24 xl:px-36 rounded-lg">
							<div role="banner"></div>
							<div className="mt-12">
								<h1
									role="main"
									className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-center text-gray-800"
								>
									Agreement Created Successfully!
								</h1>
							</div>
							<div className="mt">
								<p className="mt-6 sm:w-80 text-base dark:text-white leading-7 text-center text-gray-800">
									Share the link below with the signer!
								</p>
							</div>

							<div className="m-4">
								<div className="relative">
									<label className="sr-only" htmlFor="email">
										{" "}
										Link{" "}
									</label>

									<input
										className="w-full py-4 pl-3 pr-16 text-sm border-2 border-gray-200 rounded-lg"
										id="email"
										placeholder="Link"
										value={`https://wagmi-web/agreement/${cid}`}
										readOnly={true}
									/>

									<button
										className="absolute p-2 text-white bg-blue-600 rounded-full -translate-y-1/2 top-1/2 right-4"
										type="button"
									>
										<svg
											className="w-4 h-4"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 6v6m0 0v6m0-6h6m-6 0H6"
											/>
										</svg>
									</button>
								</div>
							</div>

							<button
								onClick={close}
								className="text-gray-800 dark:text-gray-400 absolute top-8 right-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
								aria-label="close"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18 6L6 18"
										stroke="currentColor"
										strokeWidth="1.66667"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M6 6L18 18"
										stroke="currentColor"
										strokeWidth="1.66667"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Modal;
