"use client"

import { creativeWritingOptions, hideTransferLoader, showTransferLoader } from "@/lib/helper"
import * as Typewriter from "react-effect-typewriter";
import { useRouter } from 'next/navigation';
import { AppContext } from "@/context/MainContext";
import { useContext, useEffect, useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog"
import StoryIdeaComponent from "../StoryIdea/story-idea-component";
  
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables"
import { ChatOpenAI } from "@langchain/openai"
import { storyPlotGuide } from "@/lib/data";

const StorytellingTechniqueComponent = () => {
    const { 
        setStorytellingFormSelected, 
        setStorytellingTechniqueSelected,
        storytellingForm, 
        storytellingTechnique, setStorytellingTechnique,
        storytellingTechniqueDescription, setStorytellingTechniqueDescription,
        storyIdea,
        storyData, setStoryData,
        setCurrentTab
    } = useContext(AppContext)
    const [openStoryIdeaModal, setOpenStoryIdeaModal] = useState(false);
    const [testText, setTestText] = useState<string>("")

    const { push } = useRouter();
    const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    const llm = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        model: "llama3-70b-8192",            
    });
    // const llm = new ChatOpenAI({ openAIApiKey })

    const goBack = () => {
        setStorytellingFormSelected(false)
        setStorytellingTechniqueSelected(false)
    }

    const promptStoryIdea = async (option: any) => {
        let selectedStorytellingTechnique = `${option.title}: ${option.description}`
        setStorytellingTechnique(selectedStorytellingTechnique)
        // await mergeStorytellingFormsWithTechniques(selectedStorytellingTechnique)
        // setOpenStoryIdeaModal(true)  
    }

    const setTitleAndDescription = (option: StoryTechnique) => {
        setStorytellingTechnique(option.title)
        
        setCurrentTab("story_setting") 

        setStorytellingTechniqueDescription(option.description)
        setStorytellingTechniqueSelected(true)        
        // setOpenStoryIdeaModal(true)  
    }

       

    const test = async () => {
        
        const storytellingFormsWithTechniquesTemplate = `You are a professional storyteller and experienced writer, 
        Analyze the storytelling form provided of {storytelling_form} and also analyze the
        writing techniques or methods of {storytelling_form_technique} within the realm of {storytelling_form}. Then generate a statement asking the user to provide a story idea. Use simple grammar`;    
        const storytellingFormsWithTechniquesPrompt = PromptTemplate.fromTemplate(storytellingFormsWithTechniquesTemplate)

        // const summarizeTextTemplate = `Analyze the provided text {merged_prompt}, 
        // and simple give a response in the following format. State the storytelling form , 
        // then explain the storytelling technique in a simple yet engaging way, 
        // then ask the user to kindly provide a storytelling idea in an engaging way. Do not go beyond this response format
        // Your response should not be more than 5 lines. Do not give an story idea sample. Use simple grammar`
        const summarizeTextTemplate = `Analyze the provided text {merged_prompt}, and simple ask the user to provide their storytelling idea based on the storytelling form and technique they choose . Use simple grammar`
        const summarizeTextPrompt = PromptTemplate.fromTemplate(summarizeTextTemplate)

        const storytellingFormsWithTechniquesChain = storytellingFormsWithTechniquesPrompt.pipe(llm).pipe(new StringOutputParser())
        const summarizeTextChain = RunnableSequence.from([summarizeTextPrompt, llm, new StringOutputParser()])

        const chain = RunnableSequence.from([
            {
                merged_prompt: storytellingFormsWithTechniquesChain,
                prev: prev => console.log(prev),
                original_input: new RunnablePassthrough(),
                prev2: prev => console.log(prev)
                 
            },            
            summarizeTextChain,          
        ])

        const response = await chain.stream({
            storytelling_form_technique: technique,
            storytelling_form: storytellingForm
        })

        let d = ''

        for await (const chunk of response) {
            console.log(chunk);
            // setTestText((prevText) => prevText + chunk);
            d += chunk
        }
        console.log({d});
        
    }

    return (
        <>
            <div className="bg-[#202020] p-10 rounded-xl w-[50%]">
                <div className="flex justify-center mb-5">
                    <img src="/images/fable_transp.svg" alt="logo" className="w-20" />
                </div>
                <div className="flex items-center mb-7 gap-7">
                    <i onClick={goBack} className='bx bx-arrow-back text-white text-2xl cursor-pointer'></i>
                    <h1 className="text-white text-2xl font-bold text-center  tracking-wider">Choose Your Storytelling Path</h1>
                </div>
                {/* <p className="text-white text-xs my-4">{testText}</p> */}
                
                {
                    creativeWritingOptions.map((option: any, index: number) => (
                        <div key={index}
                        onClick={() => setTitleAndDescription(option)}
                        className="bg-[#424242] border-[#424242] border cursor-pointer text-gray-200 mb-5 rounded-xl p-5 transition-all hover:border-gray-100 "                                
                        >
                            <p className="text-lg font-semibold text-center mb-2">{option.title} </p>
                            <Typewriter.Paragraph className="text-xs ">{option.description}</Typewriter.Paragraph>
                        </div>              
                    ))
                }

            </div>

            
        </>
    )
}

export default StorytellingTechniqueComponent