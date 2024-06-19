"use client"

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { storyFormQuery } from "@/helpers/ChatSteps/story-form-query"
import AIMassage from "@/components/Phases/ai-message";
import HumanMessageComponent from "./Phases/human-message";
import { Button } from "./ui/button";
import { beginConvo } from "@/helpers/ChatSteps/general-query";

import { ConversationChain } from "langchain/chains";
import { ZepMemory } from "@langchain/community/memory/zep";

import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables"
import { retriever } from "@/helpers/retriever"
import { combineDocuments, formatConvHistory } from "@/helpers/index";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatGroq } from "@langchain/groq";
import { storyPlotGuide } from "@/lib/data";


const id = Math.floor(Math.random() * 9999999999)
const storyFormStep = {
    id: id,
    type: 'ai',
    message: "Hi, What are we creating today?",
    disable: false,
    loader: false,
    suggestions: [
        {
            id: id,
            title: "Creative Writing",
            description: "Creative Writing",
        },
        {
            id: id,
            title: "Business Storytelling",
            description: "Business Storytelling",
        }
    ]
}

const StoryBotComponent = () => {
    
    const [chatbotConversation, setChatbotConversation] = useState([
        storyFormStep
    ]);
    const [storyForm, setStoryForm] = useState<string>("");
    const [previousAIQuestion, setPreviousAIQuestion] = useState<string>("Hi, What are we creating today?");
    const [question, setQuestion] = useState<string>('')
    const [humanResponse, setHumanResponse] = useState<string>('')
    const [convHistory, setConvHistory] = useState<string[]>(["Hi, What are we creating today?"])
    const chatbotConversationContainer = useRef<HTMLDivElement | null>(null);
    
    const [conversationStarted, setConversationStarted] = useState<boolean>(false)

    const llm = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        model: "llama3-70b-8192"            
    });




    // (1) The first question you would ask, is to ask the user what form of story he is trying to create today? Ask the user if he/she wants to engage in Creative Writing or Business Storytelling?.
    // These are two forms of storytelling that is accepted on the platform and if the user does not choose either Creative Writing or Business Storytelling, respond by telling to user to provide a proper storytelling form and set the error key value to true.     
    // (2) The second question would be to ask the user to choose a genre from a list of genres suggestions in the suggestions array that you would provide. If the user does not provide a valid storytelling genre, respond by telling to user to provide a proper storytelling genre and set the error key value to true.
    // (3) The third question would be to ask the user to choose the story thematic element from a list of thematic element suggestions that you would generate in the suggestions array that you would provide. If the user does not provide a valid thematic element, respond by telling to user to provide a proper storytelling thematic element and set the error key value to true.
    // (4) The fourth question would be to ask the user to choose the story suspense technique from a list of suspense technique suggestions that you would generate in the suggestions array that you would provide. If the user does not provide a valid thematic element, respond by telling to user to provide a proper storytelling thematic element and set the error key value to true.
    // (5) The fifth question would be to ask the user to provide a story idea. If the use provide a response that does not look like a reasonable or valid story idea, respond in the message key by saying the user should provide a valid story idea.
    // If the users response is valid the error key should be true, if not it should be false.
    
    // Initial Prompt: After the user chooses between Creative Writing and Business Storytelling, provide a brief introduction to the chosen genre and its importance in storytelling.
    // Ask about genre, main character and Character Development, story setting, central conflict of your story, plot outline and twist, Dialogue and Narrative, Conflict and Tension, Discuss potential themes and symbolism that could enhance the depth and meaning of the story and how to conclude the story.

    const questions = `
    Genre Selection: Prompt the user to select a specific genre within the chosen category (Provide a list of suggestions for Creative Writing; Provide a list of suggestions for for Business Storytelling).
    Character Creation: Begin by asking the user to create the main characters for the story. Encourage them to provide details such as names, backgrounds, personalities, and motivations.
    Setting Development: Guide the user in creating the setting for the story. Ask questions about the time period, location, atmosphere, and any unique features of the world.
    Plot Construction: Help the user outline the plot of the story. Start by identifying the central conflict or goal, then brainstorm key events, twists, and resolutions. Encourage the user to think about pacing, suspense, and character arcs.
    Dialogue and Narrative: Assist the user in crafting engaging dialogue and narrative descriptions. Offer tips on developing distinct voices for characters, incorporating sensory details, and building tension through suspenseful scenes.
    Themes and Symbolism: Discuss potential themes and symbolism that could enhance the depth and meaning of the story. Explore how the characters, plot, and setting can reflect larger ideas or messages.
    Editing and Revising: Guide the user through the process of editing and revising their story. Provide suggestions for refining language, improving pacing, strengthening characterization, and enhancing overall coherence.
    Feedback and Iteration: Encourage the user to seek feedback from others and iterate on their story based on constructive criticism. Offer support and guidance as they refine their narrative skills.
    Finalizing the Story: Once the user is satisfied with their story, assist them in finalizing it for publication or sharing. Provide options for formatting, publishing platforms, and distribution strategies.
    Generate the Story: Based on the user's input, generate a story that incorporates the elements they've chosen:
	Use natural language processing and machine learning algorithms to create a narrative that flows smoothly
	Incorporate the user's choices, ensuring the story aligns with their vision.
    Remember to keep the process engaging and interactive, allowing users to refine their choices and make adjustments as needed. By doing so, you'll create a more immersive experience and increase user satisfaction with the generated story.
    Do not repeat any question or information more than once, ensure to enforce this instruction.
    `;
    // If the users response {user_response} is not related to the previous question in the provided conversation history. Response by telling the user to provide a valid response.

    const beginConvo = async (useResponse = "", convHistory = []) => {        

        try {

            const startingTemplate = `Given some conversation history (if any), some questions will be provided for the user to answer sequentially.
            If there is no previous conversation start with the first question then wait for a response from the user. 
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
                user_response: question ?? '',
                conv_history: formatConvHistory(convHistory)
            });
            console.log(response);
        }catch(e){
            console.error(e);
            
        }

    }

    useEffect(() => {
        scrollToBottom()
    }, [chatbotConversation]); // Run the effect whenever chatbotConversation changes

    const beginConvo2 = async () => {        
        try {
            // // If there is no previous conversation start with the first question then wait for a response from the user. 
            // // some questions will be provided for the user to answer sequentially
            // const startingTemplate = `Given some conversation history (if any).
            // Here is the current question in the conversation {last_ai_question} and here is the users response {user_response}. Do not repeat any question similar to {last_ai_question} again, analyze the conversation history and make every final response unique.
            // Here are the question steps ${questions}. Ensure the generate engaging questions from these steps to guide to user to their story. Start from the first to the last question sequentially. After the user gives a response which is {user_response} then ask the next question.
            // So basically you are going to be asking the user these question in order to build and engaging story. 
            // As we explore the story we should be able to find the answers to the following questions: {character_plot_development} and use it to develop the characters, plot, setting and story. 
            // So use the following guide {character_plot_development} and the steps like ${questions} to guide the user through creating the story.           
            // Return your response in json or javascript object format like: message(string), suggestions(array) & error(boolean) as keys and the message should just be a string value, suggestions should be an array of objects(it should contain title and description keys only. The next question should be inside the message key and the suggestions options should be in the suggestions array. 
            // Do not add any text extra line or text with the json response, just a json object no acknowledgement or saying anything just json. Do not go beyond this instruction.
            // Ensure the data in the suggestion array always relates to the data in the message string. 
            // Always examine the conversation history and ensure that no question is repeated twice, ensure that no question should be similar to a previous conversation.
            // conversation history: {conv_history}.        
            // Users response: {user_response}.            
            // response:`

            const startingTemplate = `
            Given some conversation history (if any).
            Here is the current question in the conversation {last_ai_question} and here is the current user's response {user_response}. Do not repeat any question similar to {last_ai_question} again, analyze the conversation history and make every final response unique.
            To generate a story, I'll need you to generate a series of questions. 
            Please respond with a brief answer for each question. 
            You would use the conversation history to generate a unique story at some point. 
            Here are the areas the questions should generated around:
            1. Ask about genre
            2. Ask about main character and Character Development
            3. Ask about the story setting
            4. Ask about the central conflict of your story
            5. Ask about the plot outline and twist
            6. Discuss potential themes and symbolism that could enhance the depth and meaning of the story
            7. Ask about Dialogue and Narrative
            8. Ask about Conflict and Tension
            9. How do you want to conclude the story?
            If the user response {user_response} is unrelated to story-building, provide a direct answer to the user's query meaning the suggestions array in your response can be empty and seamlessly guide them back to the storytelling process without repeating any previous question.
            If the user response {user_response} is a whole new idea to the story, be smart enough to incorporate it into the narrative or the story
            Construct the questions in an engaging and fun way, expand and also come up other questions relating to each step of story creation.
            Never repeat a previously asked question from the previous conversation {conv_history} if it already have an answer, So if an information about the story has been gotten or if the question has been answered do not repeat the question unless a new idea has been introduced that requires us going back to reconfirm our previous choice or if the question have not been answered.   
            Use the following information also as a guide while generating the questions: {character_plot_development}.
            Return your response in json or javascript object format like: message(string), suggestions(array) & error(boolean) as keys and the message should just be a string value, suggestions should be an array of objects(it should contain title and description keys only. The next question should be inside the message key and the suggestions options should be in the suggestions array. 
            Do not add any text extra line or text with the json response, just a json object no acknowledgement or saying anything just json. Do not go beyond this instruction.            
            Always examine the conversation history.
            Use this for character development {character_plot_development}.
            conversation history: {conv_history}.        
            Current user response: {user_response}.            
            response:
            `

            // const startingTemplate = `
            //     **Introduction**
            //     Generate a unique story based on the user's input. Please respond with a brief answer for each question.
            //     Never repeat a previously asked question from the previous conversation {conv_history}, So if an information about the story has been gotten do not repeat the question unless a new idea has been introduced that requires us going back to reconfirm our previous choice.   
            
            //     **Story Generation Steps**
            //     1. Ask about genre
            //     2. Ask about main character and Character Development
            //     3. Ask about the story setting
            //     4. Ask about the central conflict of your story
            //     5. Ask about the plot outline and twist
            //     6. Discuss potential themes and symbolism that could enhance the story
            //     7. Ask about Dialogue and Narrative
            //     8. Ask about Conflict and Tension
            //     9. How do you want to conclude the story?

            //     **Conversation History Analysis**

            //     Analyze the conversation history to generate a unique story. Use the conversation history to guide the storytelling process and ensure that no question is repeated twice.

            //     **Response Guidelines**

            //     * If the user response is unrelated to story-building, provide the answer to best knowledge you have and guide them back to the storytelling process.
            //     * If the user response introduces a new idea to the story, incorporate it into the narrative.
            //     * Construct questions in an engaging and fun way, expanding on each step of story creation as needed.

            //     **JSON Response Format**

            //     Return your response in JSON format with the following keys:

            //     * message: a string value containing the next question or response.
            //     * suggestions: an array of objects containing 
            //     Return your response in json or javascript object format like: message(string), suggestions(array) & error(boolean) as keys and the message should just be a string value, suggestions should be an array of objects(it should contain title and description keys only. The next question should be inside the message key and the suggestions options should be in the suggestions array. 
            //     Do not add any text extra line or text with the json response, just a json object no acknowledgement or saying anything just json. Do not go beyond this instruction.   
            //     Current user response: {user_response}.            
            //     `


            // Ensure the data in the suggestion array always relates to the data in the message string.
            // Always examine the conversation history and ensure that no question is repeated twice, ensure that no question should be similar to a previous conversation.

            const startingPrompt = ChatPromptTemplate.fromMessages([
                ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
                ["human", startingTemplate],
            ]);
            
            const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
                
            const response = await chain.invoke({
                conv_history: formatConvHistory(convHistory),
                user_response: humanResponse,
                character_plot_development: storyPlotGuide,
                last_ai_question: previousAIQuestion
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





    const addToConversation = async (option: any) => {
        console.log(option);
        
        let conversation = chatbotConversation.find(convo => convo.id === option.id)
        console.log(conversation);

        if (!conversation) {
           return 
        }
        if (conversation?.disable === true) {
            return
        }

        setConvHistory(prevQuestion => [...prevQuestion, option.title]);
        setQuestion(option.title);
        setHumanResponse(option.title)
        
        let humanElementId = Math.floor(Math.random() * 9999999999)        
        disableChatButton(option.id)
        // Add human message to conversation
        setChatbotConversation(prevConversation => [...prevConversation, { id: humanElementId, type: 'human', message: option.title, disable: false }]);

        let aiElementId = Math.floor(Math.random() * 9999999999)
        // Add AI message to conversation
        setChatbotConversation(prevConversation => [...prevConversation, { type: 'ai', message: '', id: aiElementId, disable: false, loader: true, suggestions: [] }]);
        
        setQuestion("");

        let response = await beginConvo2()
        console.log(response);
        if (!response) {
            console.log(response);            
            alert("There was issue with prompt response")
            return
        }
        setPreviousAIQuestion(response.message)
        
        updateLoaderById(aiElementId, false);
        updateAIDataById(aiElementId, response)

        setConvHistory(prevResponse => [...prevResponse, response.message]);

        scrollToBottom()
    }

    const progressConversation = async (e: FormEvent) => {
        try {
            
            e.preventDefault()
    
            setConvHistory(prevQuestion => [...prevQuestion, question]);
    
            setQuestion('');
    
            let humanElementId = Math.floor(Math.random() * 9999999999)
            // Add human message to conversation
            setChatbotConversation((prevConversation) => [...prevConversation, { type: 'human', message: question, id: humanElementId }]);
    
            let aiElementId = Math.floor(Math.random() * 9999999999)
            // Add AI message to conversation
            setChatbotConversation(prevConversation => [...prevConversation, { type: 'ai', message: '', id: aiElementId, disable: false, loader: true, suggestions: [] }]);
    
            // console.log(chatbotConversation);
            // return
            let response = await beginConvo2()
            console.log(response);
            
            updateLoaderById(aiElementId, false);
            updateAIDataById(aiElementId, response)
    
            setConvHistory(prevResponse => [...prevResponse, response.message]);

            scrollToBottom()
        } catch (error) {
            console.error(error);            
        }
    }

    const disableChatButton = (id: string|number) => {
        setChatbotConversation(prevConversation => {
          return prevConversation.map(conversation => {
            if (conversation.id === id) {                
              return { ...conversation, disable: true };
            } else {
              return conversation;
            }
          });
        });
    };
    
    const queryForGenres = async (option: any) => {
        console.log(option);
        setStoryForm(option.key)
        const response = await storyFormQuery(option.key)
    }

    const updateLoaderById = (idToUpdate, newLoaderValue) => {
        setChatbotConversation(prevConversation => {
          return prevConversation.map(conversation => {
            if (conversation.id === idToUpdate) {
              return { ...conversation, loader: newLoaderValue };
            } else {
              return conversation;
            }
          });
        });
    };

    const updateAIDataById = (idToUpdate: string|number, data: any) => {
        if (!data?.suggestions || !data?.suggestions?.length) {
            alert("There is a problem with the AI's response")
            console.log(data);            
            return
        }
        setChatbotConversation(prevConversation => {
          return prevConversation.map(conversation => {
            if (conversation.id === idToUpdate) {      
                const newSuggestions = data?.suggestions.map((suggestion: any) => {
                    return { id: idToUpdate, title: suggestion.title, description: suggestion.description }
                })                          
              return { ...conversation, message: data?.message, suggestions: newSuggestions ?? [] };
            } else {
              return conversation;
            }
          });
        });
    };

    const scrollToBottom = () => {
        if (chatbotConversationContainer.current) {
            chatbotConversationContainer.current.scrollTo({
              top: chatbotConversationContainer.current.scrollHeight,
              behavior: 'smooth'
            });
          }
    }

    const updateUserResponse = (e: FormEvent) => {
        setHumanResponse(e.target.value)
        setQuestion(e.target.value)
    }
    

    return (
            <>
                {
                    conversationStarted &&
                    <div className="bg-gray-300 rounded-xl w-full min-h-full flex flex-col justify-between">
                        <div className="flex justify-center rounded-t-xl p-5 bg-[#202020]">
                            <img src="/images/fable_transp.svg" alt="logo" className="w-24" />
                        </div>
                    
                        <div className="p-5 flex flex-col justify-between h-[350px]">
                            <div ref={chatbotConversationContainer} className="overflow-y-auto">
                                {
                                    chatbotConversation.map((convo, index) => (
                                        ( convo.type === 'ai'? 
                                            <AIMassage key={index} onSelectOption={addToConversation} 
                                            message={convo.message} 
                                            loader={convo.loader} 
                                            options={convo.suggestions}/> :
                                            <HumanMessageComponent key={index}  message={convo.message} />
                                        )
                                    ))
                                }
                            </div>                            
                        </div>

                        <form onSubmit={progressConversation}                 
                        className="p-5">
                            <div className="flex items-center bg-gray-100 border border-gray-400 rounded-xl px-5">
                                <input 
                                value={question}
                                onChange={updateUserResponse}
                                type="text" 
                                className="p-4 outline-none text-sm  bg-gray-100  w-full" />
                                <button type="submit" className="flex items-center justify-center">
                                    <i  className='bx bx-send text-2xl cursor-pointer'></i>
                                </button>
                            </div>
                        </form>
                    
                    </div>
                }


                {
                    !conversationStarted &&
                    <div className="p-5 flex items-center bg-gray-300 rounded-xl justify-center h-full ">
                        <Button onClick={() => setConversationStarted(true)}>Start</Button>
                    </div>

                }
            </>
            
        


    )
}

export default StoryBotComponent