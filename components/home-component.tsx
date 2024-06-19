"use client"

import { useContext, useEffect, useState } from "react"
import StorytellingTechniqueComponent from "@/components/StorytellingForm/storytelling-technique";
import StorytellingFormComponent from "@/components/StorytellingForm/storytelling-form";
import { AppContext } from "@/context/MainContext"
import StorySettingComponent from "@/components/Story/story-setting-component";
import * as Typewriter from "react-effect-typewriter";

const HomeComponent = () => {
    const { 
        storytellingFormSelected, 
        storytellingTechniqueSelected,
        storyGenreSelected, 
        storyData,
        currentTab 
    } = useContext(AppContext)

    useEffect(() => {
        console.log({currentTab});        
    }, [])

    return (
        <div className="flex flex-col gap-5 items-center justify-center w-full min-h-svh p-5 bg-[#424242]">
            {
                currentTab === "story_form" && (
                    <StorytellingFormComponent />
                )
            }

            {/* {
                currentTab === "story_technique" && 
                (                
                    <StorytellingTechniqueComponent/>   
                )
            } */}

            {
                currentTab === "story_setting" && 
                (
                    <StorySettingComponent />
                )
            }

            {
                storyData && currentTab === "generated_story" && 
                (
                    <div className="p-10">
                        <div className="w-3/4 mx-auto bg-[#202020] p-7 rounded-xl">
                            <h1 className="text-3xl text-gray-200">
                                {storyData?.story?.title}
                            </h1>

                            <h1 className="text-xl my-7 text-gray-200">
                                {storyData?.story?.setting}
                            </h1>

                            <Typewriter.Paragraph className="text-sm text-gray-200">
                                {storyData?.story?.plot}
                            </Typewriter.Paragraph>                        
                            
                            <div className="mt-7 grid grid-cols-2 gap-5">
                                {
                                    storyData?.characters.map((character, index) => (
                                        <div key={index} className="mb-5 text-gray-200 bg-[#424242] p-5 rounded-lg">
                                            <div className="flex flex-col mb-3">
                                                <p className="font-bold">Name</p>
                                                <p className="text-sm">{character?.name}</p>
                                            </div>
                                            <div className="flex flex-col mb-3">
                                                <p className="font-bold">Age</p>
                                                <p className="text-sm">{character?.age}</p>
                                            </div>
                                            <div className="flex flex-col mb-3">
                                                <p className="font-bold">Role</p>
                                                <p className="text-sm">{character?.role}</p>
                                            </div>
                                            <div className="flex flex-col mb-3">
                                                <p className="font-bold">Description</p>
                                                <p className="text-xs">{character?.description}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                )
            }

        </div>
    )
}

export default HomeComponent