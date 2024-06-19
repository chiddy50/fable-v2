"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"

const HumanMessageComponent = ({ content, metadata }) => {
    return (
        <div className="speech w-[70%] my-5 ml-auto">
            <div className=" border p-5 w-[100%] rounded-tl-xl rounded-b-xl bg-gray-500">
                <p className="text-white text-sm">{content}</p>
            </div>            
        </div>
    )
}

export default HumanMessageComponent