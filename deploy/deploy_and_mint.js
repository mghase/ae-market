const { AeSdk, MemoryAccount, Node, getAddressFromPriv} = require('@aeternity/aepp-sdk');
const { utils } = require('@aeternity/aeproject');

const shutdown = (varName) => {
    console.error(`Missing ENV variable: ${varName}`);
    process.exit(1);
}

const NODE_URL = 'https://testnet.aeternity.io';
const COMPILER_URL = 'https://compiler.aeternity.io';

const collectionMetadata = require('../nfts/collection_metadata.json');

(async function () {
    secretKey = process.env.SECRET_KEY
    if(!secretKey) {
        shutdown('SECRET_KEY')
    }
    const senderAccount = new MemoryAccount({
        keypair: {
            secretKey,
            publicKey: getAddressFromPriv(secretKey)
        }
    });
    const senderAddress = await senderAccount.address();

    console.log(`Deploying with account: ${senderAddress}`);

    const node = new Node(NODE_URL);
    const aeSdk = new AeSdk({
        compilerUrl: COMPILER_URL,
        nodes: [{ name: 'testnet', instance: node }],
    });
    console.log(`Pass: 1`);
    await aeSdk.addAccount(senderAccount, { select: true });
    console.log(`Pass: 2`);
    const NFT_CONTRACT = './contracts/NFT.aes';
    const MARKET_CONTRACT = './contracts/Marketplace.aes';
    console.log(`Pass: 3`);
    const nft_source = utils.getContractContent(NFT_CONTRACT);
    const market_source = utils.getContractContent(MARKET_CONTRACT);
    console.log(`Pass: 4`);
    const nftFileSystem = utils.getFilesystem(NFT_CONTRACT);
    const marketFileSystem = utils.getFilesystem(MARKET_CONTRACT);
    console.log(`Pass: 5`);
    
    //try{
    const nft_contract = await aeSdk.getContractInstance({ source: nft_source,fileSystem: nftFileSystem });
    console.log(`Pass: 5.1`);
    const market_contract = await aeSdk.getContractInstance({ source: market_source,fileSystem: marketFileSystem });
   
    // }catch (error) {
    //     console.log(`errrror====: ${error}`);  
    // }
    console.log(`Pass: 6`);
    // deploy
    await nft_contract.deploy([
        collectionMetadata.name,
        collectionMetadata.symbol,
        ]);
    console.log(`Pass: 7`);
    console.log(`NFT Contract successfully deployed!`);
    console.log(`NFT Contract address: ${nft_contract.deployInfo.address}`);
    console.log(`Tx-Hash: ${nft_contract.deployInfo.txData.hash}`);
    console.log(`Gas used: ${nft_contract.deployInfo.result.gasUsed}`);
    console.log(`------------------------------------------------------------------------------------------`);
    console.log(`------------------------------------------------------------------------------------------`);

      // deploy market
      await market_contract.deploy([
        nft_contract.deployInfo.address,
           ]);
           console.log(`MARKET Contract successfully deployed!`);
           console.log(`MARKET Contract address: ${market_contract.deployInfo.address}`);
           console.log(`Tx-Hash: ${market_contract.deployInfo.txData.hash}`);
           console.log(`Gas used: ${market_contract.deployInfo.result.gasUsed}`);
           console.log(`--------------------end market----------------------------------------------------------------------`);
          


    // mint
    for(let i=0; i<collectionMetadata.nfts.length; i++) {
        const nftMetadataMapStringValues = new Map(Object.entries(collectionMetadata.nfts[i]).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v]));
        const tx = await nft_contract.methods.mint(
            senderAddress,
            {'MetadataMap': [nftMetadataMapStringValues]}
        );
        console.log(`Minted '${nftMetadataMapStringValues.get('name')}' with id '${tx.decodedResult}'`);
        console.log(`Tx-Hash: ${tx.hash}`);
        console.log(`Gas used: ${tx.result.gasUsed}`);
        console.log(`------------------------------------------------------------------------------------------`);
       
        console.log(`---------------------create  market items ---------------------------------------------------------------------`);
        console.log(`Pass: 8`);
        const mtx =await market_contract.call('createMarketItem',[ nft_contract.deployInfo.address,tx.decodedResult,1],{amount : 1}).catch(e =>console.error(e))
        console.log(`ITEM CREATED  with id '${mtx.decodedResult}'`);
       
        //    const mtx = await market_contract.methods.createMarketItem(
    //          nft_contract.deployInfo.address, //nft address
    //          tx.decodedResult, //token id
    //          1
    //     );
    console.log(`Pass: 9 ${mtx}`);
    };
})()
