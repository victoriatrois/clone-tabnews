import { NextApiRequest, NextApiResponse } from "next";

function getStatus(request: NextApiRequest, response: NextApiResponse): void {
  response
    .status(200)
    .json({ resposta: "endpoint status enviando uma resposta." });
}

export default getStatus;
