import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
	return (
		<div className="flex flex-row py-4 px-10 flex-space justify-between item-center rounded-lg border-2 border-violet-400 mx-5 lg:mx-20 bg-gradient-to-r from-indigo-300 to-purple-400">
			<span className="font-bold mt-2">WAGMI</span>
			<ConnectButton />
		</div>
	);
}

export default Navbar;
