import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { ZepMemory } from "@langchain/community/memory/zep";
import { ZepClient } from "@getzep/zep-cloud";
import type { Message } from "@getzep/zep-cloud/api";
import * as uuid from "uuid";
import { ZepRetriever } from "@langchain/community/retrievers/zep";

export async function GET(
    req: NextApiRequest,
  ) {       

    const API_KEY = process.env.NEXT_ZEP_SECRET_KEY
    const client = new ZepClient({
        apiKey: API_KEY,
    });
    const sessionId: string = uuid.v4(); // A new session identifier
    const history: Message[] = [
        { role: "Jane", roleType: "user", content: "Who was Octavia Butler?" },
        {
            role: "HistoryBot",
            roleType: "assistant",
            content:
            "Octavia Estelle Butler (June 22, 1947 – February 24, 2006) was an American science fiction author.",
        },
        {
            role: "Jane",
            roleType: "user",
            content: "Which books of hers were made into movies?",
            metadata: { foo: "bar" },
        },
    ];
    const result = await client.memory.add(sessionId, { messages: history });
    // const result = await client.memory.getSummaries("7be7af06-bc94-48ac-a280-e363ddbf12b5");
    
    // const result = await client.memory.delete("7be7af06-bc94-48ac-a280-e363ddbf12b5");
    console.log({sessionId});
    console.log(result);
    
    return Response.json({ message: result })
}