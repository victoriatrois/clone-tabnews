import database from "/infra/database";
import { NextApiRequest, NextApiResponse } from "next";

async function getStatus(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  try {
    const result = await database.query("SELECT 1+1 as Sum;");
    console.log("===> result\n", result.rows);
    response
      .status(200)
      .json({ resposta: "endpoint status enviando uma resposta." });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to connect to database" });
  }
}

export default getStatus;
