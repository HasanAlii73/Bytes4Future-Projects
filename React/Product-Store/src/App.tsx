import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import ProductsContainer from './components/ProductsContainer'


function App() {
  const [cartCounter, setCartCounter] = useState(0);

  const handleAddToCart = () => {
    setCartCounter(cartCounter + 1);
  } 

  return (
    <>
      <Header cartCounter={cartCounter} />
      <main className="bg-white">
        <Hero />
        <ProductsContainer onAddToCart={handleAddToCart} />
      </main>
      <Footer />
    </>
  )
}

export default App
