import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method == "GET") {
		const { id } = req.query;
		const gqlQuery = {
			operationName: "getAgreements",
			query: `query getAgreements {
				agreementEntities(where: {id: ${id?.toString()}}) {
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
			res.status(200).send({ agreement: data.data.agreementEntities[0] });
		} else {
			res.status(200).send({ error: "No Data found" });
		}
	} else {
		res.status(200).send({ error: "Wrong Method" });
	}
}
