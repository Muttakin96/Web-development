import Header from '../Components/Home/Header'
import Main from '../Components/Home/Main'
import Footer from '../Components/Home/Footer'
import Hero from '../Components/Home/Hero'

function Home() {

  return (
    <>
      <div className='max-w-[1440px] m-auto'>
          <Header />
          <Hero />
          <Main />
          <Footer />
      </div>
    </>
  )
}

export default Home
