import type { NextPage } from "next";
import Navbar from "./components/Navbar";
import Input from "./components/Input";
import TextArea from "./components/TextArea";
import Head from "next/head";
import MarkdownPreview from "./components/MarkdownPreview";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useAccount, useSignMessage } from "wagmi";
import { ipfs } from "../utils/IPFS";

const Home: NextPage = () => {
	const [agreement, setAgreement] = useState<string>();
	const [address, setAddress] = useState<string>();
	const [preview, setPreview] = useState<boolean>(false);
	const [cid, setCid] = useState<string>();

	const { isConnected } = useAccount();

	const { data, isSuccess, signMessageAsync } = useSignMessage({
		message: cid,
	});

	const createAgreement = async () => {
		if (
			isConnected &&
			ethers.utils.isAddress(address as string) &&
			agreement
		) {
			const { cid: cidHash } = await ipfs.add(agreement);
			setCid(cidHash.toString());
			console.log("Added to IPFS with hash ", cid);
			ipfs.pin.add(cidHash);
			await signMessageAsync();
			const { cid: agreementHash } = await ipfs.add(
				JSON.stringify({
					signature: data,
					agreement: cid,
				})
			);
			ipfs.pin.add(agreementHash);
			toast.success("Succesfully created agreement!");
		} else {
			toast.error(
				"Please check the agreement and wallet address & make sure wallet is connected."
			);
		}
	};

	return (
		<div className="flex justify-center flex-space flex-col">
			<Head>
				<title>Wagmi Signatures</title>
			</Head>
			<Navbar />
			<span className="flex justify-center mt-6">
				<label
					htmlFor="default-toggle"
					className="inline-flex relative items-center cursor-pointer"
				>
					<input
						type="checkbox"
						value=""
						id="default-toggle"
						className="sr-only peer"
						onChange={(e) => setPreview(e.target.checked)}
					/>
					<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
					<span className="ml-3 text-md font-medium text-gray-900">
						Preview
					</span>
				</label>
			</span>
			{preview ? (
				<span className="lg:mx-40 mx-5 mt-10 border-2 border-gray-400 p-4 rounded-md ">
					<MarkdownPreview markdown={agreement} />
				</span>
			) : (
				<span className="lg:mx-40 mx-5 mt-10">
					<TextArea val={agreement} set={setAgreement} />
				</span>
			)}
			<span className="flex justify-center my-6">
				<Input placeholder={"Wallet Address"} set={setAddress} />
			</span>

			<span className="flex justify-center">
				<button
					className="p-3 text-white bg-blue-600 rounded-md top-1/2 right-4 hover:bg-sky-700 ease-in-out duration-300"
					type="button"
					onClick={createAgreement}
				>
					<span className="flex flex-row justify-center items-center">
						<p className="mx-2">Create Agreement</p>
					</span>
				</button>
			</span>
		</div>
	);
};

export default Home;
