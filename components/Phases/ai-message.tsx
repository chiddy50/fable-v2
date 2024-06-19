"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import * as Typewriter from "react-effect-typewriter";
import { Badge } from "@/components/ui/badge"

const AIMassage = ({ metadata, content, onSelectSuggestion }) => {

    const { loader, suggestions, hide } = metadata
    
    const [hideSuggestions, setHideSuggestions] = useState<boolean>(true)
    const showSuggestions = () => {
        setHideSuggestions(false)
    }

    return (
        <>
            {
                !hide &&
                <div className="speech w-[90%] my-5">
                    <div className=" border p-5 w-full rounded-tr-xl bg-gray-100">
                        <div className="text-gray-900 text-sm">
                            {
                                loader === false ? (
                                    
                                    <Typewriter.Paragraph onEnd={showSuggestions}>
                                    {content}                         
                                    </Typewriter.Paragraph>  
                                )
                                : <i className='bx bx-dots-horizontal-rounded bx-burst text-black text-2xl' ></i>
                            }
                        </div>
                    </div>
                    {
                        suggestions.length > 0 && 
                        <div className="p-5 w-full bg-white rounded-b-xl">
                            {
                                hideSuggestions && <i className='bx bx-dots-horizontal-rounded bx-burst text-black text-2xl' ></i>
                            }

                            {
                                !hideSuggestions &&
                                <div className="flex items-center gap-3 flex-wrap">
                                    {
                                        suggestions.map((option: any, index: number) => (
                                            <Badge 
                                            onClick={() => onSelectSuggestion(option, metadata)}
                                            className="cursor-pointer"
                                            key={index}
                                            >
                                                {option?.title ?? ''}
                                            </Badge>
                                            
                                            )
                                        )
                                    }
                                </div>
                            }                
                        </div>
                    }
                </div>
            }

            {
                hide &&
                <div className="speech w-[90%] my-5">
                    <div className=" border p-5 w-full rounded-tr-xl rounded-b-xl bg-gray-100">
                        <div className="text-gray-900 text-sm">
                            {
                                loader === false ? <p>{content}</p> : <i className='bx bx-dots-horizontal-rounded bx-burst text-black text-2xl' ></i>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default AIMassage