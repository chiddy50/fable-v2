import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"

const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const sbApiKey = process.env.NEXT_PUBLIC_SUPERBASE_API_KEY
const sbUrl = process.env.NEXT_PUBLIC_SUPERBASE_API_URL
const client = createClient(sbUrl, sbApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
})

const retriever = vectorStore.asRetriever()

export { retriever }