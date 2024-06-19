"use client"

import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import StorySummaryComponent from "./Story/story-summary-component"
import StoryBotComponent2 from "./story-bot-component2"
import { Button } from "./ui/button";

const LandingComponent = () => {

    const { user, setShowAuthFlow } = useDynamicContext()

    return (
        <>
            {
                user && 
                <div>
                    <div className="flex flex-grow w-full mt-[80px]">
                    
                        <div className="bg-[#585858] left-0 h-screen w-[30%] overflow-auto">
                            {/* <StorySummaryComponent /> */}
                        </div>
                        <div className="center w-[70%] p-7">
                            <StoryBotComponent2 />
                        </div>


                    </div>
                </div>
            }

            {
                !user && 
                <div className="p-5 flex items-center bg-gray-300 rounded-xl justify-center h-full ">
                    <Button onClick={() => setShowAuthFlow(true)}>Login/Sign up</Button>                     
                </div>
            }
        </>
    )
}

export default LandingComponent