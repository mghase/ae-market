import create from 'zustand';
import {devtools, persist} from 'zustand/middleware';
//import { useToast } from "@chakra-ui/react";
import { AeSdk, Node, AE_AMOUNT_FORMATS } from "@aeternity/aepp-sdk";
import { iniSDK } from "../utils/aeternity";
import { ContractAci } from "../constants/constants";
interface MarketState {
  connectedAccount:boolean,
  btnLoading: boolean,
  address: string,
  balance: string,
  account: any,
  contract: any,
  modal: string,
  updateModal: string,
  init(account:any,address:string) : void,
  fetchAccount():void,
  setModal(modal:string): void,
  setUpdateModal(updateModal:string): void,
}
export const useStore = create<MarketState>()(
  devtools(
    persist(
      (set)=>({
            connectedAccount:false,
            btnLoading:false,
            address: '',
            balance: '0',
            account: null,
            contract: null,
            modal: 'scale-0',
            updateModal: 'scale-0',
            init : async (account:any,address:string) => {
              try {
                const node = new Node("https://testnet.aeternity.io"); // ideally host your own node
          
                const aeSdk = new AeSdk({
                  nodes: [{ name: "testnet", instance: node }],
                });
          
                const aci = ContractAci; // ACI of the contract
                const contractAddress =
                  "ct_SjV3mnz56BkpJdCQZfp1giwjNaHVqEt9EiKfBFbqBcbmdJyaC"; // the address of the contract
                const contractInstance = await aeSdk.getContractInstance({
                  aci,
                  contractAddress,
                });
               // setContract(contractInstance.methods);
          
                const { decodedResult } =
                  await contractInstance.methods.getPositionIdForAddress(address, {
                    onAccount: account,
                  });
               // getAssets(decodedResult, contractInstance);
               set((state)=>({
                ...state
               }))
              } catch (error) {
                console.log(error);
              }
            },
          
            fetchAccount: async ()=>{
                set((state)=>({...state,btnLoading:true}));
                try {
                    const aeSdk = await iniSDK();
              
                    const _address = await aeSdk!.address();
                
                    set((state)=>({...state,
                      account: aeSdk, 
                      address: _address
                      }));
              
                    const _balance = await aeSdk!.getBalance(_address, {
                      format: AE_AMOUNT_FORMATS.AE,
                    });
                    set((state)=>(
                      {...state,
                        connectedAccount:true,
                        btnLoading:false,
                        balance: _balance,
                
                      }))
                 
                  } catch (error) {
                    console.log(error);
                   
                  }
                
            }, 
            setModal(modal) {
                set((state)=>({...state, modal}))
            },
            setUpdateModal(updateModal) {
              set((state)=>({...state, updateModal}))
            },
        }),
      {
        name: 'market-storage',
      }
    )
  )
)
  
    
    
//     persist((set)=>({
//     connectedAccount:false,
//     btnLoading:false,
//     address: '',
//     balance: '0',
//     account: null,
//     contract: null,
//     modal: 'scale-0',
//     updateModal: 'scale-0',
//     init : async (account:any,address:string) => {
//       try {
//         const node = new Node("https://testnet.aeternity.io"); // ideally host your own node
  
//         const aeSdk = new AeSdk({
//           nodes: [{ name: "testnet", instance: node }],
//         });
  
//         const aci = ContractAci; // ACI of the contract
//         const contractAddress =
//           "ct_SjV3mnz56BkpJdCQZfp1giwjNaHVqEt9EiKfBFbqBcbmdJyaC"; // the address of the contract
//         const contractInstance = await aeSdk.getContractInstance({
//           aci,
//           contractAddress,
//         });
//        // setContract(contractInstance.methods);
  
//         const { decodedResult } =
//           await contractInstance.methods.getPositionIdForAddress(address, {
//             onAccount: account,
//           });
//        // getAssets(decodedResult, contractInstance);
//        set((state)=>({
//         ...state
//        }))
//       } catch (error) {
//         console.log(error);
//       }
//     },
  
//     fetchAccount: async ()=>{
//         set((state)=>({...state,btnLoading:true}));
//         try {
//             const aeSdk = await iniSDK();
      
//             const _address = await aeSdk!.address();
        
//             set((state)=>({...state,
//               account: aeSdk, 
//               address: _address
//               }));
      
//             const _balance = await aeSdk!.getBalance(_address, {
//               format: AE_AMOUNT_FORMATS.AE,
//             });
//             set((state)=>(
//               {...state,
//                 connectedAccount:true,
//                 btnLoading:false,
//                 balance: _balance,
        
//               }))
//           //  setBalance(_balance);
//             // toast({
//             //   position: "top-left",
//             //   title: "Wallet connect",
//             //   description: "Wallet connected successfully ",
//             //   status: "success",
//             //   duration: 9000,
//             //   isClosable: true,
//             // });
//           } catch (error) {
//             console.log(error);
//             // toasts({
//             //   position: "top-left",
//             //   title: "Not Connected",
//             //   description: "No SuperHero wallet found",
//             //   status: "error",
//             //   duration: 9000,
//             //   isClosable: true,
//             // });
//           }
        
//     }, 
//     setModal(modal) {
//         set((state)=>({...state, modal}))
//     },
//     setUpdateModal(updateModal) {
//       set((state)=>({...state, updateModal}))
//     },
// })),
//  {name:"mystore"}

// )