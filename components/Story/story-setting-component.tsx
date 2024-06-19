"use client"

import { AppContext } from "@/context/MainContext"
import { useContext, useState } from "react"
import { ComboboxComponent } from "../CustomComponents/combobox-component"
import {storyGenres} from "@/lib/genre"
import {thematicElementList} from "@/lib/thematicElement"
import {suspenseTechniques} from "@/lib/suspenceTechnique"

import { DropdownMenuRadioGroupDemo } from "../CustomComponents/dropdown-component"
import { Button } from "../ui/button"
import { AlertDialog } from "@/components/ui/alert-dialog"
import StoryIdeaComponent from "../StoryIdea/story-idea-component";

import { ChatGroq } from "@langchain/groq";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables"
import { ChatOpenAI } from "@langchain/openai"
import { storyPlotGuide } from "@/lib/data";
import { hideTransferLoader, showTransferLoader } from "@/lib/helper"


const StorySettingComponent = () => {
    const { 
        setStorytellingTechniqueSelected,
        storyGenreSelected, setStoryGenreSelected,
        setCurrentTab,
        storytellingForm, 
        storytellingTechnique,
        storytellingTechniqueDescription,
        storyIdea,
        setStoryData,
        storyThematicElement, setStoryThematicElement,
        storyThematicOption, setStoryThematicOption,
        storyGenre, setStoryGenre,
        storySuspenseTechnique, setStorySuspenseTechnique
    } = useContext(AppContext)

    const [thematicOptions, setThematicOptions] = useState<null|[]>(null)

    const [openStoryIdeaModal, setOpenStoryIdeaModal] = useState(false);
    const [testText, setTestText] = useState<string>("")
    
    const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    const llm = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        model: "llama3-70b-8192",            
    });
    // const llm = new ChatOpenAI({ openAIApiKey })

    
    const goBack = () => {
        setStorytellingTechniqueSelected(false)
        setStoryGenreSelected(false)
    }

    const getThematicOptions = (thematicElement) => {
        console.log(thematicElement);
        setStoryThematicElement(thematicElement.label)
        setThematicOptions(thematicElement.types)
    }   

    const moveToStoryIdea = () => {
        setOpenStoryIdeaModal(true)
    }

    const mergeStorytellingFormWithIdea = async () => {
        try {
            
            // - The storytelling technique for {storytelling_form} is {storytelling_form_technique}
            const startingStoryTemplate = `You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. 
            I need you to come up with a creative story from the storytelling form and technique provided and randomly generate some number of characters and relate them to each other. Add engaging plot elements and make the plot very elaborate and engaging.
            As we explore the story we should be able to find the answers to the following questions: {character_plot_development} and use it to develop the characters, plot, setting and story.
            The following parameters will be available for you to work with:
            - The form of storytelling is {storytelling_form}
            - The story idea is {story_idea}.   
            - The story genre is {story_genre}.   
            - The story thematic element is {story_thematic_element}.   
            - The story suspense technique is {story_suspense_technique}.               
            If the story idea which is {story_idea} does not make any sense or does not even look like a story idea, or if you do not understand what is being said, kindly respond by saying, Please provide a reasonable story idea.
            Return your response in json or javascript object format like: story and characters as keys and the story object should contain title, setting and plot(should be very descriptive, not just a short story) keys only, while the characters array should contains objects with keys name(string), age(string), role(string) and description(string). 
            Do not add any text extra line or text with the json response, just a json object no acknowledgement or saying anything just json. Do not go beyond this instruction      
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
                story_idea: storyIdea,
                story_genre: storyGenre,
                story_thematic_element: storyThematicElement,
                story_suspense_technique: storySuspenseTechnique,
                character_plot_development: storyPlotGuide
            });
            console.log(response);
            hideTransferLoader()
        
            try {
                const jsonObject = JSON.parse(response);
                // Handle the parsed JSON object
                console.log(jsonObject);
                setStoryData(jsonObject)
                setCurrentTab('generated_story')
                
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
            setStorytellingTechniqueSelected(true)
        
            let d = ''
            for await (const chunk of response) {
                console.log(chunk);
                setTestText((prevText) => prevText + chunk);
                d += chunk
            }
            console.log({d});
        } catch (error) {
            console.error(error);
            
        }
        
    } 

    return (
        <div className="bg-[#202020] p-10 rounded-xl w-[50%]">
            <div className="flex justify-center mb-5">
                <img src="/images/fable_transp.svg" alt="logo" className="w-20" />
            </div>
            <div className="flex items-center mb-7 gap-7">
                <i onClick={goBack} className='bx bx-arrow-back text-white text-2xl cursor-pointer'></i>
                <h1 className="text-white text-2xl font-bold text-center  tracking-wider">Choose Your Story Setting</h1>
            </div>

            <div className="mb-7">
                <ComboboxComponent value={storyGenre} setValue={setStoryGenre} label="Genre" data={storyGenres} />
                { storyGenre?.label && <p className="text-md mt-2 text-gray-200">{`Genre is ${storyGenre?.label}`}</p>}
            </div>
            
            <div className="mb-4">
                <p className="text-md font-semibold mb-1 text-gray-200">Thematic Element</p>
                <div className="grid grid-cols-3">
                    {
                        thematicElementList.map((element, index) => (
                            <div key={index} className="flex items-center gap-1 mb-2">
                                <input type="radio" id={element.label} onChange={() => getThematicOptions(element)} className="" name="thematicElement" />
                                <label htmlFor={element.label} className="text-xs text-white capitalize">{element.label}</label>
                            </div>
                        ))
                    }
                </div>
            </div>  

            {
                thematicOptions &&
                <div className="mb-7">
                    <ComboboxComponent value={storyThematicOption} setValue={setStoryThematicOption} label="Thematic Options" data={thematicOptions} />
                    <p className="text-xs mt-2 text-gray-200">{storyThematicOption?.label}</p>
                </div>
            }

            <div className="mb-7">
                <ComboboxComponent value={storySuspenseTechnique} setValue={setStorySuspenseTechnique} label="Suspense Technique" data={suspenseTechniques} />
                <p className="text-xs mt-2 text-gray-200">{storySuspenseTechnique?.description}</p>
            </div>
            
            <Button onClick={moveToStoryIdea} className="bg-gray-200 text-black hover:bg-gray-100">Next</Button>

            <AlertDialog open={openStoryIdeaModal} onOpenChange={setOpenStoryIdeaModal}>                
                <StoryIdeaComponent testClick={mergeStorytellingFormWithIdea} testText={testText} />
            </AlertDialog>
        </div>
    )
}

export default StorySettingComponent