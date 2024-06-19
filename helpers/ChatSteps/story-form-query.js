import { ChatGroq } from "@langchain/groq";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables"
import { ChatOpenAI } from "@langchain/openai"

export const storyFormQuery = async (storytellingForm) => {
    try {

        const llm = new ChatGroq({
            apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
            model: "llama3-70b-8192",            
        });
        // const llm = new ChatOpenAI({ openAIApiKey })
        
        const storyFormQueryTemplate = `You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. 
        A writer just made a choice between Creative Writing and Business Storytelling form to create a story. And their choice is {storytelling_form}. I need you to give a response by telling the user that their option has been accepted and now they need to 
        select a genre relating to {storytelling_form} from a list of {storytelling_form} genres. 
        The following parameters will be available for you to work with:
        - The form of storytelling is {storytelling_form}               
        Return your response in json or javascript object format like: message and genres as keys and the message should just be a string value, genres should be an array of objects(it should contain name and description keys only. 
        Do not add any text extra line or text with the json response, just a json object no acknowledgement or saying anything just json. Do not go beyond this instruction      
        `;
    
        const storyFormQueryPrompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional storyteller, author and narrative designer"],
            ["human", storyFormQueryTemplate],
        ]);
        
        const chain = storyFormQueryPrompt.pipe(llm).pipe(new StringOutputParser());
            
        const response = await chain.invoke({
            storytelling_form: storytellingForm
        });
        console.log(response);
    
        const jsonObject = JSON.parse(response);            
        console.log(jsonObject);
        return jsonObject
    } catch (error) {
        console.error(error);
        return false
    }
    
}