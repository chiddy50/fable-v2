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
    context: any
) {  
    let { params } =  context
    console.log(params);
    let sessionId = params.id
    
    const API_KEY = process.env.NEXT_ZEP_SECRET_KEY
    const client = new ZepClient({
        apiKey: API_KEY,
    });

    return Response.json({ message: params })

}