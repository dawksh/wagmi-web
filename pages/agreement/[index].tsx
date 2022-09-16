import { ethers } from "ethers";
import { useRouter } from "next/router";
import ABI from "../../utils/WAGMI.json";
function index({ res }: any) {
	const router = useRouter();
	const { query } = router;
	let r = JSON.parse(res);
	console.log(r[2], r[3]);
	console.log(JSON.parse(res));
	return (
		<div className="flex justify-center py-10 ">
			Agreement by{" "}
			{ethers.utils.verifyMessage(
				ethers.utils.keccak256("\x19Ethereum Signed Message\n32") +
					ethers.utils.keccak256(r[2]),
				r[3]
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
