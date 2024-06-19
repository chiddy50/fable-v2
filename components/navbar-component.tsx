"use client"
import { DynamicWidget, getAuthToken, useEmbeddedWallet, useUserWallets, useUserUpdateRequest } from '@dynamic-labs/sdk-react-core';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

const NavbarComponent = () => {
    const { user, primaryWallet, setShowAuthFlow, setShowDynamicUserProfile, handleLogOut } = useDynamicContext()

    return (
        <div className="nav-bar bg-[#202020] px-5 w-full flex justify-between items-center">
            <img src="/images/fable_transp.svg" alt="logo" className="w-24" />
            <div className='flex items-center gap-4'>
                { !user && 
                    <div onClick={() => setShowAuthFlow(true)} className='flex cursor-pointer text-black bg-white px-3 py-1 rounded-lg items-center gap-1'>     
                        <span className='text-xs'>Login</span>               
                        <i className='bx bx-log-in text-2xl '></i>
                    </div>
                }
                { user && 
                    <div onClick={() => handleLogOut()} className='flex cursor-pointer text-black bg-white px-3 py-1 rounded-lg items-center gap-1'>     
                        <span className='text-xs'>Logout</span>               
                        <i className='bx bx-log-out text-2xl '></i>
                    </div>
                }
            </div>
        </div>
    )
}

export default NavbarComponent