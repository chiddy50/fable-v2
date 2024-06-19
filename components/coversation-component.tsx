"use client"

import { useContext, useEffect, useRef, useState } from "react";
import AIMassage from "./Phases/ai-message";
import HumanMessageComponent from "./Phases/human-message";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import { AppContext } from "@/context/MainContext";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

const ConversationComponent = ({ 
    chatbotConversation, 
    addSuggestionToConversation, 
    progressConversation, 
    question, 
    updateUserResponse 
}) => {
    const chatbotConversationContainer = useRef<HTMLDivElement | null>(null);

    const [lastScrollTop, setLastScrollTop] = useState(0);

    const dynamicJwtToken = getAuthToken();

    const { 
        setChatbotConversation,
        loadingMemories, setLoadingMemories,
        fetching, setFetching,
        limit, setLimit,
        memories, setMemories,
        currentPage, setCurrentPage,
        hasNextPage, setHasNextPage,
        hasPrevPage, setHasPrevPage,
        totalPages, setTotalPages,
    } = useContext(AppContext)

    useEffect(() => {
        const element = chatbotConversationContainer.current;
        if (!element) return;

        const handleScroll = () => {
            if (!element) return;

            if (element.scrollTop < lastScrollTop) {
                setLoadingMemories(false)                

                // Upward scroll
                console.log("Scrolling up");
                if (element.scrollTop === 0) {
                    // Scrolled to the top
                    console.log("Scrolled to the top");       

                    console.log({hasNextPage});
                    
                    // Trigger your function here
                    if (hasNextPage) {                        
                        paginateMemories()
                    }
                }
            } 

            setLastScrollTop(element.scrollTop <= 0 ? 0 : element.scrollTop);
        };

        element.addEventListener('scroll', handleScroll);

        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    const paginateMemories = () => {
        let set_next_page = currentPage + 1        
        setCurrentPage(set_next_page)

        console.log({set_next_page, currentPage, hasPrevPage});
                   
        fetchMemories(set_next_page)
    }

    const fetchMemories = async (page = 1) => {        
        try {   
            setLoadingMemories(true) 
            setFetching(true)

            let response = await axiosInterceptorInstance.get(`memories?page=${page}&limit=${limit}`, 
                {
                    headers: {
                        Authorization: `Bearer ${dynamicJwtToken}`
                    }
                }
            )

            let data = response?.data?.memories
            let reverseData = data.reverse()

            setChatbotConversation(prevConversations => [...reverseData, ...prevConversations]);
            setMemories(prevMemories => [...reverseData, ...prevMemories]);

            setHasNextPage(response?.data?.hasNextPage)
            setHasPrevPage(response?.data?.hasPrevPage)
            setTotalPages(response?.data?.totalPages)            
            
        } catch (error) {
            console.error(error);            
        }finally{
            setLoadingMemories(false)   
            setFetching(false)
        }
        
    }

    return (
        <div className="bg-gray-300 rounded-xl w-full min-h-full flex flex-col justify-between">
            <div className="flex justify-center rounded-t-xl p-5 bg-[#202020]">
                <img src="/images/fable_transp.svg" alt="logo" className="w-24" />
            </div>
        
            <div className="p-5 flex flex-col justify-between h-[350px]">
                <div ref={chatbotConversationContainer} id="chatbot-container" className="overflow-y-scroll">
                    
                    {
                        loadingMemories && fetching &&
                        <div className="flex justify-center p-4">
                            <i className='bx bx-loader bx-spin text-3xl' ></i>
                        </div>
                    }
                
                    {
                        chatbotConversation.map((convo, index) => (
                            ( 
                                convo.roleType === 'assistant' ? 
                                <AIMassage key={index} 
                                onSelectSuggestion={addSuggestionToConversation} 
                                content={convo.content} 
                                metadata={convo.metaData} 
                                /> :
                                <HumanMessageComponent 
                                key={index} 
                                content={convo.content} 
                                metadata={convo.metaData} 
                                />
                            )
                        ))
                    }
                </div>                            
            </div>

            <form onSubmit={progressConversation}                 
            className="p-5">
                <div className="flex items-center bg-gray-100 border border-gray-400 rounded-xl px-5">
                    <input 
                    value={question}
                    onChange={updateUserResponse}
                    type="text" 
                    className="p-4 outline-none text-sm  bg-gray-100  w-full" />
                    <button type="submit" className="flex items-center  rounded-full justify-center">
                        <i  className='bx bx-send text-2xl cursor-pointer'></i>
                    </button>
                    {/* <button className="flex items-center bg-gray-300 rounded-full justify-center">
                        <i  className='bx bx-stop bx-flashing text-2xl text-gray-600 cursor-pointer'></i>
                    </button> */}
                </div>
            </form>
        
        </div>
    )
}

export default ConversationComponent

