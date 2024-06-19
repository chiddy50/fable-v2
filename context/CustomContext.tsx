"use client"
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { MainContext } from '@/context/MainContext' 
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { useRouter } from 'next/navigation';


const CustomContext = ({ children }) => {
  const createUser = async (payload: any) => {
    try {
      let res = await axiosInterceptorInstance.post("/users", payload)
      console.log(res);        
    } catch (error) {
      console.log(error);            
    }
  }

  return (
      <DynamicContextProvider 
        settings={{ 
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? "",
          walletConnectors: [ SolanaWalletConnectors ],
          eventsCallbacks: {
            onAuthSuccess: (args) => {
              console.log('onLinkSuccess was called', args);
              let { authToken, primaryWallet, user } = args

                let payload = {
                  // token: authToken,
                  publicAddress: primaryWallet?.address,
                  email: user?.email,
                  username: user?.username,
                  id: user?.userId,
                }

                createUser(payload)
            },
            onLogout(user) {
                console.log(user);
                // push("/")
            },
          }
        }}
      > 
          <MainContext>
              {children}                
          </MainContext>  

      </DynamicContextProvider>

  )
}

export default CustomContext