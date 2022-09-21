import type { NextPage } from "next";
import Navbar from "./components/Navbar";
import Input from "./components/Input";
import TextArea from "./components/TextArea";
import Head from "next/head";
import MarkdownPreview from "./components/MarkdownPreview";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import {
	useAccount,
	useContract,
	useContractWrite,
	usePrepareContractWrite,
	useProvider,
	useSigner,
	useSignMessage,
} from "wagmi";
import { ipfs } from "../utils/IPFS";
import Modal from "./components/Modal";
import ABI from "../utils/WAGMI.json";

const Home: NextPage = () => {
	const [agreement, setAgreement] = useState<string>();
	const [address, setAddress] = useState<string>();
	const [preview, setPreview] = useState<boolean>(false);
	const [cid, setCid] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);
	const [created, setCreated] = useState<boolean>(false);
	const [id, setId] = useState<string>();
	let agreementHash;

	const { isConnected, address: signee } = useAccount();
	const { data: signer } = useSigner();

	const { data, signMessageAsync } = useSignMessage({
		message: agreementHash,
	});

	let contract: ethers.Contract;

	const createAgreement = async () => {
		if (
			isConnected &&
			ethers.utils.isAddress(address as string) &&
			agreement
		) {
			contract = new ethers.Contract(
				"0xCb4aD097Aa4E40756EfFaEa3085F1a910DdEd375",
				ABI.abi,
				signer as any
			);
			setLoading(true);
			const { cid: cidHash } = await ipfs.add(agreement);
			setCid(cidHash.toString());
			console.log("Added to IPFS with hash ", cidHash.toString());
			ipfs.pin.add(cidHash);
			try {
				const msg = await signMessageAsync({
					message: cidHash.toString(),
				});
				const { cid: agreementHash } = await ipfs.add(
					JSON.stringify({
						signature: msg,
						agreement: cidHash,
					})
				);
				console.log(agreementHash.toString());
				console.log("Signed Agreement with signature, ", msg);
				ipfs.pin.add(agreementHash);
				console.log(contract);
				let txn = await contract.addAgreement({
					id: 0,
					signer: address,
					agreement: cidHash.toString(),
					signature: msg,
					isSigned: false,
				});
				let receipt = await txn.wait();
				setId(receipt.events[0].args.id.toString());
				toast.success("Succesfully created agreement!");
				setCreated(true);
				setLoading(false);
			} catch (e) {
				console.log(e);
				setLoading(false);
			}
		} else {
			setLoading(false);
			toast.error(
				"Please check the agreement and wallet address & make sure wallet is connected."
			);
		}
	};

	const copy = () => {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(
				`${window.location.href}agreement/${cid}`
			);
			toast.success("Copied to clipboard!");
		}
	};

	return (
		<div className="flex justify-center flex-space flex-col">
			<Head>
				<title>Wagmi Signatures</title>
			</Head>
			{created && <Modal set={setCreated} cid={id} copy={copy} />}
			<span className=" text-xs mt-8 flex justify-center">
				<p>
					Use <a href="https://dillinger.io/">Dillinger</a> for
					writing markdown easily!
				</p>
			</span>
			<span className="flex justify-center mt-6 ">
				<label
					htmlFor="default-toggle"
					className="inline-flex relative items-center cursor-pointer"
				>
					<input
						type="checkbox"
						value=""
						id="default-toggle"
						className="sr-only peer "
						onChange={(e) => setPreview(e.target.checked)}
					/>
					<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 -z-1"></div>
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
					disabled={loading}
					className="p-3 text-white bg-blue-600 rounded-md top-1/2 right-4 hover:bg-sky-700 ease-in-out duration-300"
					type="button"
					onClick={createAgreement}
				>
					{loading ? (
						<>
							<svg
								className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
								viewBox="0 0 100 101"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
						</>
					) : (
						<span className="flex flex-row justify-center items-center">
							<p className="mx-2">Create Agreement</p>
						</span>
					)}
				</button>
			</span>
		</div>
	);
};

export default Home;
