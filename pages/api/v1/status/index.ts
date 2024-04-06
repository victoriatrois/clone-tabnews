import database from "../../../../infra/database";
import { NextApiRequest, NextApiResponse } from "next";

async function getStatus(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const result = await database.query("SELECT 1+1 as Sum;");
  console.log("===> result\n", result.rows);
  response
    .status(200)
    .json({ resposta: "endpoint status enviando uma resposta." });
}

export default getStatus;
