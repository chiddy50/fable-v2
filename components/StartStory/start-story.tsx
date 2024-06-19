"use client"

import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers"
import { hideTransferLoader, showTransferLoader } from "@/lib/helper";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/MainContext";

const StartStoryComponent = () => {
    const { 
        setStorytellingFormSelected, 
        setStorytellingTechniqueSelected,
        storytellingForm, 
        storytellingTechnique, setStorytellingTechnique,
        storytellingTechniqueDescription, setStorytellingTechniqueDescription,
        storyIdea
    } = useContext(AppContext)

    const [data, setData] = useState(null);

    const llm = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        model: "llama3-70b-8192",            
    });

    useEffect(() => {
        mergeStorytellingFormWithIdea()
    }, [])

    const mergeStorytellingFormWithIdea = async () => {

        const startingStoryTemplate = `You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through their words. 
        I need you to come up with a creative story from the storytelling form and technique provided and random generate some number of characters and relate them to each other. 
        Add engaging plot elements.
        The following parameters will be available for the LLM to work with:
        - The form of storytelling is {storytelling_form}
        - The storytelling technique for {storytelling_form} is {storytelling_form_technique}
        - The story idea is {story_idea}.   
        If the story idea which is {story_idea} does not make any sense or even look like a story idea, or if you do not understand what is being said, kindly respond by saying, Please provide a reasonable story idea.
        Return your response in json format like:  story and characters as keys, do not add any text extra like Here's the response in JSON format just in json format    
        `;

        const startingStoryPrompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional storyteller, author and narrative designer"],
            ["human", startingStoryTemplate],
        ]);
        const chain = startingStoryPrompt.pipe(llm).pipe(new StringOutputParser());
        
        showTransferLoader()

        const response = await chain.invoke({
            storytelling_form: storytellingForm,
            storytelling_form_technique: `${storytellingTechnique}: ${storytellingTechniqueDescription}`,
            story_idea: storyIdea
        });
        console.log(response);
        hideTransferLoader()

        const jsonObject = JSON.parse(response);
        console.log(jsonObject);
        setData(jsonObject)
    }  

    return (
        <>
            <div className="bg-blue-500 w-[30%]">
                
            </div>
            <div className="bg-gray-500 w-[70%]">
                <div className="p-5">
                    {data}
                </div>
            </div>
        </>
    )
}

export default StartStoryComponent