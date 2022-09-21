import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method == "GET") {
		const { address } = req.query;
		const gqlQuery = {
			operationName: "getAgreements",
			query: `query getAgreements {
				agreementEntities(where: {signer: "${String(address).toLowerCase()}"}) {
            agreement,
            signer,
            isSigned
        }
			}`,
		};
		const { data } = await axios.post(
			"https://api.thegraph.com/subgraphs/name/dawksh/wagmi-sig",
			gqlQuery
		);

		if (data.data.agreementEntities.length > 0) {
			res.status(200).send({
				agreements: data.data.agreementEntities,
			});
		} else {
			res.status(200).send({ error: "No Data found" });
		}
	} else {
		res.status(200).send({ error: "Wrong Method" });
	}
}
