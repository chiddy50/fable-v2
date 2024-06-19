"use client"

import axiosInterceptorInstance from "@/axiosInterceptorInstance"
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { AppContext } from "@/context/MainContext";

const StorySummaryComponent = () => {

    const dynamicJwtToken = getAuthToken();

    const { 
        sessions, setSessions,
        sessionsLoading, setSessionsLoading,
    } = useContext(AppContext)

    useEffect(() => {
        getUserSessions()
    }, [])
    const getUserSessions = async () => {
        try {
            setSessionsLoading(true)
            const response = await axiosInterceptorInstance.get(`/sessions`,
            {
                headers: {
                    Authorization: `Bearer ${dynamicJwtToken}`
                }
            })
            console.log(response);
            setSessions(response.data.sessions)
            
        } catch (error) {
            console.error(error);            
        }finally{
            setSessionsLoading(false)
        }
    }

    const createSession = async () => {
        try {
            const response = await axiosInterceptorInstance.post(`/sessions`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${dynamicJwtToken}`
                }
            })
            console.log(response);
            await getUserSessions()
            
        } catch (error) {
            console.error(error);            
        }
    }

    return (
        <div>
            <div className="my-5 flex justify-center ">
                <Button onClick={createSession} className="flex items-center gap-1">
                    <span className="text-xs">New Session</span>
                    <i className="bx bx-plus"></i>
                </Button>
            </div>

            { sessionsLoading && 
                <div className="my-5 flex justify-center">
                    <i className='bx bx-loader bx-spin text-white text-2xl'></i>
                </div>

            }
            {
                !sessionsLoading && sessions.length &&
                <div className="flex flex-col p-3">
                    {
                        sessions.map((session, index) => (
                            <Button variant="outline" className="mb-2" key={session?.sessionId}>Session {index + 1}</Button>
                        ))
                    }
                </div>
            }
        </div>
    )
} 

export default StorySummaryComponent