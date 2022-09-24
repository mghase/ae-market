
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