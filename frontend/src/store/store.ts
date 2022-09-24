import create from 'zustand';
import {devtools, persist} from 'zustand/middleware';
//import { useToast } from "@chakra-ui/react";
import { AeSdk, Node, AE_AMOUNT_FORMATS } from "@aeternity/aepp-sdk";
import { iniSDK } from "../utils/aeternity";
import { nftContractAddress,nftContractSource,marketContractAddress,marketContractSource } from "../constants/contractConstants";


const NODE_URL = 'https://testnet.aeternity.io';
const COMPILER_URL = 'https://compiler.aeternity.io';


interface MarketState {
  connectedAccount:boolean,
  btnLoading: boolean,
  address: string,
  balance: string,
  account: any,
  marketContract: any,
  nftContract: any,
  modal: string,
  updateModal: string,
  init() : void,
  fetchAccount():void,
  setModal(modal:string): void,
  setUpdateModal(updateModal:string): void,
}
export const useStore = create<MarketState>()(
    persist(
      (set,get)=>({
            connectedAccount:false,
            btnLoading:false,
            address: '',
            balance: '0',
            account: null,
            nftContract: null,
            marketContract:null, 
            modal: 'scale-0',
            updateModal: 'scale-0',
            nftsMarket:[],

            init : async () => {
              try {
                const node = new Node("https://testnet.aeternity.io"); // ideally host your own node
          
                const aeSdk = new AeSdk({
                  compilerUrl: COMPILER_URL,
                  nodes: [{ name: "testnet", instance: node }],
                });
             // try{
             const nftContractInstance = await aeSdk.getContractInstance({
              contractAddress: nftContractAddress,
              source: nftContractSource
                });

                const marketContractInstance = await aeSdk.getContractInstance({
                  contractAddress: marketContractAddress,
                  source: marketContractSource
                    });
             
               // setContract(contractInstance.methods);
                set((state)=>({
                  ...state,
                  marketContract : marketContractInstance.methods,
                  nftContract :nftContractInstance.methods
                 }))
                const { decodedResult } = await marketContractInstance.methods.getTotalItem();
               // getAssets(decodedResult, contractInstance);
             //  const { nftdecodedResult } = await nftContractInstance.methods.getTotalItem();
               const nfts = await Promise.all(
                [...new Array(8)].map(async (_, i) => {
                  const { decodedResult: metadata } = await nftContractInstance.methods.metadata(
                    i + 1
                  );
                  return metadata;
                  // return {
                  //   name: metadata["MetadataMap"][0].get("name"),
                  //   description: metadata["MetadataMap"][0].get("description"),
                  //   image_url: metadata["MetadataMap"][0]
                  //     .get("media_url")
                  //     .replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/"),
                  // };
                })
              );

              console.log("nfts====",nfts)
                 for(let i=0;i<decodedResult;i++){
                  console.log("i===",i)
                 }
               console.log("total===",decodedResult);
              // }catch(e){
              //   console.log("mmee==",e)
              // }
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

                   const a = get().address;
                    console.log("address===",a);
                    set((state)=>(
                      {...state,
                        connectedAccount:true,
                        btnLoading:false,
                        balance: _balance,
                
                      }))
                      get().init();
                 
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