"use client"

import { MouseEvent, useContext, useState } from "react"
import * as Typewriter from "react-effect-typewriter";
import { AppContext } from "@/context/MainContext"

const StorytellingFormComponent = () => {
    
    const { 
        setStorytellingForm,
        setCurrentTab 
    } = useContext(AppContext)

    const updatePurpose = (businessStory:boolean = false) => {
        const selectedStorytellingForm = businessStory ? "Business Storytelling" : "Creative writing"
        setCurrentTab("story_setting") 
        setStorytellingForm(selectedStorytellingForm)
    }

    return (
        <div className="bg-[#202020] p-10 rounded-xl w-[50%]">
            <div className="flex justify-center mb-5">
                <img src="/images/fable_transp.svg" alt="logo" className="w-20" />
            </div>
            <h1 className="typing-demo text-white text-2xl font-bold text-center mb-7 tracking-wider">
                
                <Typewriter.Paragraph>What are we creating today?</Typewriter.Paragraph>                        
            </h1>

            <div className="grid grid-cols-2 gap-4">
                <div onClick={(e: MouseEvent<HTMLDivElement>) => updatePurpose()} className="flex gap-3 cursor-pointer p-5 items-center justify-center flex-col bg-[#424242] border-2 border-[#424242] text-white rounded-lg hover:border-[#5f5f5f]">
                    <i className='bx bx-brain text-green-600 text-2xl'></i>
                    <Typewriter.Paragraph>Narrative Storytelling</Typewriter.Paragraph>
                </div>

                <div onClick={(e: MouseEvent<HTMLDivElement>) => updatePurpose(true)} className="flex gap-3 cursor-pointer p-5 items-center justify-center flex-col bg-[#424242] border-2 border-[#424242] text-white rounded-lg hover:border-[#5f5f5f]">
                    <i className='bx bx-briefcase text-green-600 text-2xl'></i>       
                    <Typewriter.Paragraph>Business Storytelling</Typewriter.Paragraph>
                </div>
            </div>
        </div>
    )
}

export default StorytellingFormComponent