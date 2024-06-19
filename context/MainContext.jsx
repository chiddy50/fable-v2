"use client"

import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function MainContext({ children }) {
    const [chatbotConversation, setChatbotConversation] = useState([]);
    const [loadingMemories, setLoadingMemories] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [limit, setLimit] = useState(5)
    const [memories, setMemories] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)
    const [totalPages, setTotalPages] = useState(false)

    const [sessions, setSessions] = useState([])
    const [sessionsLoading, setSessionsLoading] = useState(false)

    const [storytellingFormSelected, setStorytellingFormSelected] = useState(false)
    const [storytellingTechniqueSelected, setStorytellingTechniqueSelected] = useState(false)
    const [storyGenreSelected, setStoryGenreSelected] = useState(false)
    const [storytellingForm, setStorytellingForm] = useState("")
    const [storytellingTechnique, setStorytellingTechnique] = useState("")
    const [storytellingTechniqueDescription, setStorytellingTechniqueDescription] = useState("")
    const [storyIdea, setStoryIdea] = useState("")
    const [storyData, setStoryData] = useState(null)
    const [currentTab, setCurrentTab] = useState("story_form")
    const [storyThematicElement, setStoryThematicElement] = useState(null)    
    const [storyThematicOption, setStoryThematicOption] = useState([])
    const [storyGenre, setStoryGenre] = useState(null)
    const [storySuspenseTechnique, setStorySuspenseTechnique] = useState(null)
    
    return (
        <AppContext.Provider value={{ 
            chatbotConversation, setChatbotConversation,
            loadingMemories, setLoadingMemories,
            fetching, setFetching,
            limit, setLimit,
            memories, setMemories,
            currentPage, setCurrentPage,
            hasNextPage, setHasNextPage,
            hasPrevPage, setHasPrevPage,
            totalPages, setTotalPages,
            aiLoading, setAiLoading,
            
            sessions, setSessions,
            sessionsLoading, setSessionsLoading,

            storytellingFormSelected, setStorytellingFormSelected,
            storytellingTechniqueSelected, setStorytellingTechniqueSelected,
            storytellingForm, setStorytellingForm,
            storytellingTechnique, setStorytellingTechnique,
            storyGenreSelected, setStoryGenreSelected,
            storytellingTechniqueDescription, setStorytellingTechniqueDescription,
            storyIdea, setStoryIdea,
            storyData, setStoryData,
            currentTab, setCurrentTab,
            storyThematicElement, setStoryThematicElement,
            storyThematicOption, setStoryThematicOption,
            storyGenre, setStoryGenre,
            storySuspenseTechnique, setStorySuspenseTechnique
        }}>
            {children}
        </AppContext.Provider>
    );
}