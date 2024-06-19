"use client"

import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { ZepMemory } from "@langchain/community/memory/zep";
import { ZepClient } from "@getzep/zep-cloud";
import type { Message } from "@getzep/zep-cloud/api";
import * as uuid from "uuid";


const Page2 = () => {

    const test = async () => {
        

        let res = await fetch(`api/user/memory/345`)
        let json = await res.json()
        console.log(json);
        
        
    }

    return (
        <div className="m-[100px]">
            <button onClick={test} className="px-4 py-2 bg-green-700 text-white">Testing</button>
        </div>
    )
}

export default Page2