import React from 'react'
import Header from '../components/Header'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
function Market(props) {
  return (
    <div className="flex h-screen w-screen flex-col flex-1">
      <Header />

      <div className="w-full flex md:items-center flex-col mt-6">
        {/* <div>
          <img src="https://via.placeholder.com/150" alt="Image of market" />
        </div> */}

        <div className="flex flex-row my-2">
          <Carousel>

            <img src="https://via.placeholder.com/150" alt="Image of market" />
            <img src="https://via.placeholder.com/150" alt="Image of market" />
            <img src="https://via.placeholder.com/150" alt="Image of market" />
          </Carousel>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between mx-88">
            <span>Name:</span>
            <span>Dr Mateo's pharmacy</span>
          </div>
          <div className="flex flex-row justify-between mx-88">
            <span>Address:</span>
            <span>32A MacPherson drive, Ikeja, Lagos.</span>
          </div>
          <div className="flex flex-row justify-between mx-88">
            <span>Description:</span>
            <span>Dr Mateo's pharmacy offers pharmacy service. We sell various stuff and such.</span>
          </div>
          <div className="flex flex-row justify-between mx-88">
            <span>Category:</span>
            <span>Medical</span>
          </div>
        </div>

      </div>
      <div className="mt-10 md:mx-88">
        <button className="bg-black text-white py-3 px-3 rounded-md">Delete market</button>
      </div>
    </div>
  )
}

export default Market