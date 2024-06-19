
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

export const load = async () => {
    try {
        const result = await fetch('story-info.txt')
        const text = await result.text()
        
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            separators: ['\n\n', '\n', ' ', ''], // default setting
            chunkOverlap: 50
        }) 
        const output = await splitter.createDocuments([text])
        console.log(output);
        
        const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""
        const sbUrl = process.env.NEXT_PUBLIC_SUPERBASE_API_URL ?? ""
        const sbApiKey = process.env.NEXT_PUBLIC_SUPERBASE_API_KEY ?? ""

        const client = createClient(sbUrl, sbApiKey)

        const vectorStore = await SupabaseVectorStore.fromDocuments(
            output,
            new OpenAIEmbeddings({ openAIApiKey }),
            {
               client,
               tableName: "documents" 
            }
        )
        console.log(vectorStore);
        

    } catch (err) {
        console.log(err)
    }
}