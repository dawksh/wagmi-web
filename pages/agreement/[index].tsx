import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ipfs } from "../../utils/IPFS";
import ABI from "../../utils/WAGMI.json";

import { WidgetProps } from "@worldcoin/id";
import dynamic from "next/dynamic";
import axios from "axios";
import MarkdownPreview from "../components/MarkdownPreview";
import { useAccount, useSigner, useSignMessage } from "wagmi";
import toast from "react-hot-toast";

const WorldIDWidget = dynamic<WidgetProps>(
	() => import("@worldcoin/id").then((mod) => mod.WorldIDWidget),
	{ ssr: false }
);

type ProofType = {
	merkle_root: string;
	nullifier_hash: string;
	proof: string;
};

function index({ res }: any) {
	const router = useRouter();
	const { query } = router;
	const [cid, setCid] = useState();
	const [proof, setProof] = useState<ProofType>();
	const r = JSON.parse(res);
	let contract: ethers.Contract;
	console.log(r);
	const { data: signer } = useSigner();
	const { address, isConnected } = useAccount();
	const { signMessageAsync } = useSignMessage();

	useEffect(() => {
		(async function () {
			if (r) {
				const { data } = await axios.get(
					`https://gateway.pinata.cloud/ipfs/${r[2]}`
				);
				setCid(data);
			}
		})();
	}, [res]);

	const signAgreement = async () => {
		if (isConnected) {
			let sig = await signMessageAsync({
				message: r[2],
			});

			contract = new ethers.Contract(
				"0x2745aB0234a88DE38b46AA6791ec3AE204D06717",
				ABI.abi,
				signer as any
			);
			let txn = await contract.signAgreement(
				sig,
				query.index as string,
				proof?.merkle_root,
				proof?.nullifier_hash,
				ethers.utils.defaultAbiCoder.decode(
					["uint256[8]"],
					proof?.proof as any
				)[0],
				{ gasLimit: 10000000 }
			);
		} else {
			toast.error("Wallet not connected");
		}
	};

	return (
		<div className="flex justify-center flex-col p-10 ">
			<div className="my-4">
				<WorldIDWidget
					actionId="wid_staging_540388d46bc3d34e6451300bc77bb782" // obtain this from developer.worldcoin.org
					signal="my_signal"
					enableTelemetry
					onSuccess={(verificationResponse) => {
						console.log("response: ", verificationResponse);
						setProof(verificationResponse);
					}} // you'll actually want to pass the proof to the API or your smart contract
					onError={(error) => console.error(error)}
				/>
			</div>
			{proof && (
				<>
					<span className="my-4">Agreement: </span>
					<div className="border-2 border-gray-400 p-4 rounded-md">
						{cid && <MarkdownPreview markdown={cid} />}
					</div>
					{r && (
						<div className="my-4 text-sm">
							Agreement by{" "}
							{ethers.utils.verifyMessage(r[2], r[3])}
						</div>
					)}
					<button
						onClick={signAgreement}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
					>
						Sign
					</button>
				</>
			)}
		</div>
	);
}

export default index;

export async function getServerSideProps({ query }: any) {
	const provider = new ethers.providers.JsonRpcProvider(
		"https://polygon-mumbai.g.alchemy.com/v2/OakS6vDx0Vps1b2No88N3mDKXF0a2E35"
	);

	const index = query.index;

	const contract = new ethers.Contract(
		"0x2745aB0234a88DE38b46AA6791ec3AE204D06717",
		ABI.abi,
		provider
	);

	let res = await contract.indexToAgreementStorage(index);

	return {
		props: {
			res: JSON.stringify(res),
		},
	};
}
