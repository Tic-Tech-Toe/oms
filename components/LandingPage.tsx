import React from 'react'
import Header from './Header'
import Hero from './Hero'

const LandingPage = () => {
  return (
    <div className="relative w-screen h-screen overflow-x-hidden">
      <Header />
      <Hero />
      {/* <Features /> */}
      <div className="aurora dark:opacity-80"></div>
    </div>
  )
}

export default LandingPage