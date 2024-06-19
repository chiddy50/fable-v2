"use client"

import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AppContext } from "@/context/MainContext"
import { KeyboardEvent, useContext } from "react"

const StoryIdeaComponent = ({ testClick, testText }) => {
    const { 
        storytellingTechnique, storytellingTechniqueDescription,
        setStoryIdea
    } = useContext(AppContext)

    const submitStoryIdea = (e) => {
        e.preventDefault()
        testClick()
    }
    return (
        <AlertDialogContent className="bg-gray-100">
            <AlertDialogHeader>
                <AlertDialogTitle>{storytellingTechnique}</AlertDialogTitle>
                <AlertDialogDescription>
                {storytellingTechniqueDescription}
                </AlertDialogDescription>
            </AlertDialogHeader>

            <section className="chatbot-container bg-[#171f26] w-full h-full rounded-xl p-4">
                <div className="chatbot-header flex flex-col gap-2">
                    <img src="/images/fable_transp.svg" alt="logo" className="w-20" />
                    <p className="sub-heading">LET'S HEAR YOUR IDEA</p>
                </div>

                <div className="chatbot-conversation-container h-[250px] overflow-y-scroll my-3 mx-0" id="chatbot-conversation-container">
                    <form onSubmit={submitStoryIdea} id="form" className="chatbot-input-container h-full flex flex-col gap-3" >
                    
                        <textarea 
                        onKeyUp={(e: KeyboardEvent<HTMLTextAreaElement>) => setStoryIdea(e.target.value)}
                        className="w-full h-full bg-[#586e88] text-gray-100 rounded-lg outline-none resize-none p-4"></textarea>
                        <button onClick={submitStoryIdea} type="submit" className="w-full p-2 text-white bg-blue-600 rounded-lg text-sm">Send</button>
                    </form>

                </div>
            </section>
    
            {/* <pre className="text-black overflow-scroll min-h-56" style={{ whiteSpace: 'pre-wrap' }}>{testText}</pre> */}
            <AlertDialogFooter>

                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}

export default StoryIdeaComponent