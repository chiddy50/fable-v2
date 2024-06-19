"use client"

import { FormEvent, useContext, useEffect, useId, useRef, useState } from "react";
import { storyFormQuery } from "@/helpers/ChatSteps/story-form-query"
import AIMassage from "@/components/Phases/ai-message";
import HumanMessageComponent from "./Phases/human-message";
import { Button } from "./ui/button";
// import { beginConvo } from "@/helpers/ChatSteps/general-query";

import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables"
import { retriever } from "@/helpers/retriever"
import { addSecondsToISOString, combineDocuments, formatConvHistory } from "@/helpers/index";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatGroq } from "@langchain/groq";
import { storyPlotGuide } from "@/lib/data";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";

import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import ConversationComponent from "./coversation-component";
import { ConversationChain } from "langchain/chains";
import { ZepMemory } from "@langchain/community/memory/zep";

import { ChatOpenAI } from "@langchain/openai"
// memory imports
import { BufferMemory } from 'langchain/memory'
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import * as uuid from "uuid";
import { AppContext } from "@/context/MainContext";
import _ from 'lodash';

const id = Math.floor(Math.random() * 9999999999)

let currentConvo:ConversationData[] = []

const StoryBotComponent2 = () => {
    
    
    const [previousAIResponseId, setPreviousAIResponseId] = useState<string>("");
    
    
    const [memoryLoading, setMemoryLoading] = useState<boolean>(false);

    const [previousAIQuestion, setPreviousAIQuestion] = useState<string>("");
    const [question, setQuestion] = useState<string>('')
    const [humanResponse, setHumanResponse] = useState<string>('')
    const chatbotConversationContainer = useRef<HTMLDivElement | null>(null);
    
    const [conversationStarted, setConversationStarted] = useState<boolean>(false)

    const { 
        chatbotConversation, setChatbotConversation,
        loadingMemories, setLoadingMemories,
        fetching, setFetching,
        limit, setLimit,
        memories, setMemories,
        currentPage, setCurrentPage,
        hasNextPage, setHasNextPage,
        hasPrevPage, setHasPrevPage,
        totalPages, setTotalPages,
    } = useContext(AppContext)

    const dynamicJwtToken = getAuthToken();
    const { user, setShowAuthFlow } = useDynamicContext()

    const llm = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        model: "llama3-70b-8192"         
    });

    // const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    // const llm = new ChatOpenAI({ 
    //     openAIApiKey,
    //     model: "gpt-4-vision-preview",        
    // })

    useEffect(() => {
        fetchMemories()
    }, [])
    
    const fetchMemories = async (page = 1) => {        
        try {   
            setLoadingMemories(true)     
            
            let params = {
                page: page,
                limit: limit,
            }

            let response = await axiosInterceptorInstance.get(`memories?page=${page}&limit=${limit}`, 
                {
                    headers: {
                        Authorization: `Bearer ${dynamicJwtToken}`
                    }
                }
            )
            console.log(response);

            let data = response?.data?.memories
            let reverseData = data.reverse()
            console.log({reverseData});
            setMemories(reverseData);
            setChatbotConversation(reverseData)

            setHasNextPage(response?.data?.hasNextPage)
            setHasPrevPage(response?.data?.hasPrevPage)
            setTotalPages(response?.data?.totalPages)     
            
            if (data.length < 1) {
                // await startDefaultConversation()
            }
            
        } catch (error) {
            console.error(error);            
        }finally{
            setLoadingMemories(false)         
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatbotConversation]); // Run the effect whenever chatbotConversation changes

    const startDefaultConversation = async () => {
        let aiElementId = uuid.v4()
        let aiConvo = {
            roleType: "assistant",
            role: 'assistant',
            content: "Hi, I am your Fable assistant. Need any assistance?",
            createdAt: new Date().toISOString(),
            metaData: {
                id: aiElementId,
                disable: false,
                loader: false,
                hide: false,
                suggestions: [
                    {
                        id: aiElementId,
                        title: "I would like to create a story",
                        description: "I would like to create a story"
                    },
                    {
                        id: aiElementId,
                        title: "I would like to do something else",
                        description: "I would like to do something else"
                    }
                ]
            },
        }
        
        setPreviousAIResponseId(aiElementId)

        setChatbotConversation(prevConversation => [...prevConversation, aiConvo]);

        // clone the conversation with lodash and disable to hide to true
        let aiConvoClone = _.cloneDeep(aiConvo); 
        aiConvoClone.metaData.hide = true
        currentConvo = [aiConvoClone]
    }

    const addSuggestionToConversation = async (option: any, metaData: any) => {  
        
        let conversation = chatbotConversation.find(convo => convo.metaData.id === option.id)
        console.log({option, conversation, metaData, chatbotConversation});
        
        if (!conversation) {
            return 
        }
        if (conversation?.disable === true) {
            return
        }

        updateMetadataById(previousAIResponseId, "hide", true)

        setQuestion(option.title);
        setHumanResponse(option.title)
        
        disableChatButton(option.id)

        let humanElementId = uuid.v4()
        let aiElementId = uuid.v4()

        const now = new Date();
        const secondsToAdd = 5; // Example: Add 5 seconds

        const humanConversationTimeStamp = now.toISOString(); // This will be in the ISO-8601 format

        const aiConversationTimeStamp = addSecondsToISOString(humanConversationTimeStamp, secondsToAdd);

        setChatbotConversation((prevConversation) => [...prevConversation, { role: 'user', roleType: 'user', content: option.title, createdAt: humanConversationTimeStamp, metaData: { id: humanElementId } }]);                            
        
        let aiConvo = { 
            role: 'assistant', 
            roleType: 'assistant', 
            content: '', 
            createdAt: aiConversationTimeStamp, 
            metaData: { id: aiElementId, disable: false, loader: true, suggestions: [], hide: false } 
        }
        setChatbotConversation(prevConversation => [...prevConversation, aiConvo]);
        setPreviousAIResponseId(aiElementId)

        setQuestion("");

        let response = await beginConvo()
        console.log(response);
        updateMetadataById(aiElementId, "loader", false);
        updateAIDataById(aiElementId, response)
        
        currentConvo.push({ 
            role: 'user', 
            roleType: 'user', 
            content: option.title, 
            createdAt: humanConversationTimeStamp, 
            metaData: { id: humanElementId } 
        })

        currentConvo.push({ 
            role: 'assistant', 
            roleType: 'assistant', 
            content: response.message, 
            createdAt: aiConversationTimeStamp,
            metaData: { id: aiElementId, disable: true, loader: false, suggestions: response.suggestions, hide: true } 
        })
        console.log({currentConvo});
        

        await recordConversation()
    
        scrollToBottom()
    }

    const progressConversation = async (e: FormEvent) => {
        try {
            updateMetadataById(previousAIResponseId, "hide", true)

            e.preventDefault()
        
            setQuestion('');
    
            let humanElementId = uuid.v4()
            let aiElementId = uuid.v4()

            const now = new Date();
            const secondsToAdd = 5; // Example: Add 5 seconds

            const humanConversationTimeStamp = now.toISOString(); // This will be in the ISO-8601 format

            const aiConversationTimeStamp = addSecondsToISOString(humanConversationTimeStamp, secondsToAdd);

            // Add human message to conversation
            setChatbotConversation((prevConversation) => [...prevConversation, { role: 'user', roleType: 'user', content: question, createdAt: humanConversationTimeStamp, metaData: { id: humanElementId } }]);                            
            // Add AI message to conversation
            setChatbotConversation(prevConversation => [...prevConversation, ]);
            
            let aiConvo = { role: 'assistant', roleType: 'assistant', content: '', createdAt: aiConversationTimeStamp, metaData: { id: aiElementId, disable: false, loader: true, suggestions: [], hide: false } }
            setChatbotConversation(prevConversation => [...prevConversation, aiConvo]);
            setPreviousAIResponseId(aiElementId)

            scrollToBottom()

            let response = await beginConvo()
            console.log(response);
            
            updateMetadataById(aiElementId, "loader", false);
            updateAIDataById(aiElementId, response)
            
            currentConvo.push({ role: 'user', roleType: 'user', content: question, createdAt: humanConversationTimeStamp, metaData: { id: humanElementId } })
            currentConvo.push({ 
                role: 'assistant', 
                roleType: 'assistant', 
                content: response.message, 
                createdAt: aiConversationTimeStamp,
                metaData: { id: aiElementId, disable: true, loader: false, suggestions: response.suggestions, hide: true } 
            })
  
            await recordConversation()
    
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
    
    const recordConversation = async () => {
        try {
            
            const response = await axiosInterceptorInstance.post(`/memories`,
            {
                conversations: currentConvo
            },
            {
                headers: {
                    Authorization: `Bearer ${dynamicJwtToken}`
                }
            })
            console.log(response);
            currentConvo = []
        } catch (error) {
            console.error(error);            
        }
    }

    const updateMetadataById = (id, key, value) => {
        setChatbotConversation((prevConversations) =>
            prevConversations.map((conversation) =>
                conversation.metaData.id === id
                ? {
                    ...conversation,
                    metaData: {
                        ...conversation.metaData,
                        [key]: value,
                    },
                }
                : conversation
            )
        );
    };

    const updateAIDataById = (idToUpdate: string | number, data: any) => {
        if (!data?.suggestions || !data?.suggestions?.length) {
            alert("There is a problem with the AI's response");
            console.log(data);
            return;
        }
    
        setChatbotConversation(prevConversation => {
            return prevConversation.map(conversation => {
                if (conversation.metaData.id === idToUpdate) {
                    const newSuggestions = data?.suggestions.map((suggestion: any) => {
                        return { id: idToUpdate, title: suggestion.title, description: suggestion.description };
                    });
    
                    return { 
                        ...conversation, 
                        content: data?.message,
                        metaData: {
                            ...conversation.metaData,
                            suggestions: newSuggestions ?? []
                        } 
                    };
                } else {
                    return conversation;
                }
            });
        });
    };    

    const scrollToBottom = () => {
        let chatbotContainer = document.getElementById("chatbot-container")
        if (chatbotContainer) {            
            chatbotContainer.scrollTo({
              top: chatbotContainer.scrollHeight,
              behavior: 'smooth'
            });
        }
    }

    const updateUserResponse = (e: FormEvent) => {
        setHumanResponse(e.target.value)
        setQuestion(e.target.value)
    }

    const beginConvo = async () => {        
        try {
            
            const prompt = ChatPromptTemplate.fromTemplate(`
                Your name is Fable and you are a helpful and enthusiastic assistant.             
                Return your response in json or javascript object format like: message(string), suggestions(array) & error(boolean) as keys and the message should just be a string value, suggestions should be an array of objects(it should contain title and description keys only. The next ai response message should be inside the message key and the suggestions options should be in the suggestions array. 
                Do not add any text extra line or text with the json response, just a json object no acknowledgement or saying anything just json. Do not go beyond this instruction.
                History: {history}
                {input}
            `)
    
            const upstashChatHistory = new UpstashRedisChatMessageHistory({
                sessionId: user?.email as string,
                config: {
                    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_URL, // UPSTASH_REDIS_URL
                    token: process.env.NEXT_PUBLIC_UPSTASH_TOKEN // UPSTASH_TOKEN
                }
            })
    
            const memory = new BufferMemory({
                memoryKey: "history",
                chatHistory: upstashChatHistory
            })
    
            // Using the Chain Classes
            // const chain = new ConversationChain({
            //     llm: llm,
            //     prompt,
            //     memory
            // })
    
            // Using LCEL
            // const chain = prompt.pipe(llm).pipe(new StringOutputParser());
            
            const chain = RunnableSequence.from([
                {
                    input: (initialInput) => initialInput.input,
                    memory: () => memory.loadMemoryVariables()
                },
                {
                    input: (previousOutput) => previousOutput.input,
                    history: (previousOutput) => previousOutput.memory.history,
                },
                prompt,
                llm
            ])
    
            const inputs = {
                input: humanResponse,
            }
            const response = await chain.invoke(inputs);
            console.log(response);
            const data = JSON.parse(response?.content as string)
            console.log(data);
            
            await memory.saveContext(inputs, {
                output: data.message
            })
    
            console.log(await memory.loadMemoryVariables());
            return data
        } catch (error) {
            console.error(error);            
        }
        
    }
    
    return (
            <>
                {
                    <ConversationComponent 
                    chatbotConversation={chatbotConversation} 
                    addSuggestionToConversation={addSuggestionToConversation} 
                    progressConversation={progressConversation}
                    question={question} 
                    updateUserResponse={updateUserResponse}
                    />
                }
            </>
    )
}

export default StoryBotComponent2