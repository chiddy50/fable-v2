import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables"
import { retriever } from "@/helpers/retriever"
import { combineDocuments } from "@/helpers/index";
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatGroq } from "@langchain/groq";


const questions = `
        (1) The first question you would ask, is to ask the user what form of story he is trying to create today? Ask the user if he/she wants to engage in Creative Writing or Business Storytelling?.
        These are two forms of storytelling that is accepted on the platform and if the user does not choose either Creative Writing or Business Storytelling, respond by telling to user to provide a proper storytelling form and set the error key value to true.     
        (2) The second question would be to ask the user to choose a genre from a list of genres suggestions in the suggestions array that you would provide. If the user does not provide a valid storytelling genre, respond by telling to user to provide a proper storytelling genre and set the error key value to true.
        (3) The third question would be to ask the user to choose the story thematic element from a list of thematic element suggestions that you would generate in the suggestions array that you would provide. If the user does not provide a valid thematic element, respond by telling to user to provide a proper storytelling thematic element and set the error key value to true.
        (4) The fourth question would be to ask the user to choose the story suspense technique from a list of suspense technique suggestions that you would generate in the suggestions array that you would provide. If the user does not provide a valid thematic element, respond by telling to user to provide a proper storytelling thematic element and set the error key value to true.
        (5) The fifth question would be to ask the user to provide a story idea. If the use provide a response that does not look like a reasonable or valid story idea, respond in the message key by saying the user should provide a valid story idea.
        The the users response is valid the error key should be true, if not it should be false.
    `;

export const beginConvo = async (useResponse = "", convHistory) => {

    const llm = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        model: "llama3-70b-8192"            
    });

    try {

        const startingTemplate = `Given some conversation history (if any), some questions will be provided for the user to answer sequentially. 
        Here are the questions ${questions}. Start from the first to the last question sequentially. After the user gives a response which is {user_response} then ask the next question.
        So basically you are going to be asking the user these question in order to build and engaging story. 
        Return your response in json or javascript object format like: message(string), suggestions(array) & error(boolean) as keys and the message should just be a string value, suggestions should be an array of objects(it should contain name and description keys only. 
        Do not add any text extra line or text with the json response, just a json object no acknowledgement or saying anything just json. Do not go beyond this instruction.
        conversation history: {conv_history}        
        response: {user_response} 
        response:`
        // question: {question} 
        const startingPrompt = PromptTemplate.fromTemplate(startingTemplate)

        const startingChain = startingPrompt.pipe(llm).pipe(new StringOutputParser())

        const retrieverChain = RunnableSequence.from([
            prevResult => prevResult.standalone_question,
            retriever,
            combineDocuments
        ])    

        const answerTemplate = `
        You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words and you are also helpful and enthusiastic.
        Based on the context provided and the conversation history. Try to give a get the options for the suggestion array from the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that.". Don't try to make up an answer. Always speak as if you were chatting to a friend.
        context: {context}
        conversation history: {conv_history}
        answer: `
        const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)
        const answerChain =  answerPrompt.pipe(llm).pipe(new StringOutputParser())

        const chain = RunnableSequence.from([
            startingChain,
            {
                context: retrieverChain,
                user_response: ({ original_input }) => original_input.user_response,
                conv_history: ({ original_input }) => original_input.conv_history
            },
            answerChain
        ])

        const response = await chain.invoke({
            user_response: useResponse,
            conv_history: convHistory
        });
        console.log(response);
    }catch(e){
        console.error(e);
        
    }

}