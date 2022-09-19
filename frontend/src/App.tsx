// import Alert from './components/Alert'
// import Artworks from './components/Artworks'
// import CreateNFT from './components/CreateNFT'
// import Footer from './components/Footer'
// import Header from './components/Header'
// import Hero from './components/Hero'
// import Loading from './components/Loading'
// import ShowNFT from './components/ShowNFT'
// import Transactions from './components/Transactions'
// import UpdateNFT from './components/UpdateNFT'
// import { isUserLoggedIn } from './CometChat'
// import { loadWeb3 } from './TimelessNFT'
import { useEffect } from 'react'
import CreateNFT from './components/CreateNFT'
import Header from './components/Header'
import Hero from './components/Hero'
import ShowNFT from './components/ShowNFT'

const App = () => {
  useEffect(() => {
    // loadWeb3()
    // isUserLoggedIn()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <Hero />
      </div>
      <CreateNFT />
      <ShowNFT />
      {/* <Artworks />
      <Transactions />
      <CreateNFT />
      <UpdateNFT />
      <ShowNFT />
      <Footer />
      <Alert />
      <Loading /> */}
    </div>
  )
}

export default App