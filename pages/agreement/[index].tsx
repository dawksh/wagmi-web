import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ipfs } from "../../utils/IPFS";
import ABI from "../../utils/WAGMI.json";

import { WidgetProps } from "@worldcoin/id";
import dynamic from "next/dynamic";
import axios from "axios";
import MarkdownPreview from "../components/MarkdownPreview";

const WorldIDWidget = dynamic<WidgetProps>(
	() => import("@worldcoin/id").then((mod) => mod.WorldIDWidget),
	{ ssr: false }
);

function index({ res }: any) {
	const router = useRouter();
	const { query } = router;
	const [cid, setCid] = useState();
	const [proof, setProof] = useState<object>();
	const r = JSON.parse(res);
	console.log(r);

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
			{!proof && (
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
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
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
		"0x652cADF0120a1A55F583F5B2dcC001DF577D5c8B",
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
