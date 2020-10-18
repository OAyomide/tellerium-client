import React from 'react'

function Footer() {
  return (
    <div>
      <footer>
        <div className="flex flex-col justify-center mx-5 sm:mt-20">
          <span className="mb-3 text-black mt-10 text-center">The media assets on this page are all copyright of their various owners.</span>
          <span className="text-center text-black">Zoove {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}

export default Footer