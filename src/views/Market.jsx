import React from 'react'
import Header from '../components/Header'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import MapReact from 'google-map-react'


function Market(props) {
  const location = {
    address: '1600 Amphitheatre Parkway, Mountain View, california.',
    lat: 37.42216,
    lng: -122.08427,
  }
  return (

    <div className="flex h-screen w-screen flex-col flex-1">
      <Header />

      <div className="w-full flex md:items-center flex-col mt-6">
        {/* <div>
          <img src="https://via.placeholder.com/150" alt="Image of market" />
        </div> */}

        <div className="flex flex-row mx-32 sm:mx-5">
          <Carousel>

            <img src="https://via.placeholder.com/150" alt="Image of market" />
            <img src="https://via.placeholder.com/150" alt="Image of market" />
            <img src="https://via.placeholder.com/150" alt="Image of market" />
          </Carousel>
        </div>

        <div className="flex flex-col w-full mx-32 sm:mx-5">
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10">
            <span>Name:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10">Dr Mateo's pharmacy</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10">
            <span>Address:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10">32A MacPherson drive, Ikeja, Lagos.</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10">
            <span>Description:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10" >Dr Mateo's pharmacy offers pharmacy service. We sell various stuff and such.</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10">
            <span>Category:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10">Medical</span>
          </div>
        </div>

      </div>
      <div className="mx-32 sm:mx-5 md:mx-32">
        <div className="h-88 w-full">
          <MapReact bootstrapURLKeys={{ key: 'AIzaSyCLcovDlecYhOB3MHc8gEMrC2HBowTX8sM' }} defaultCenter={location} defaultZoom={12} />
        </div>
      </div>

      <div className="mt-10 md:mx-32 sm:mx-10">
        <div className="flex flex-row justify-between">
          <button className="bg-black text-white py-3 px-3 rounded-md sm:py-1 sm:px-1">Delete market</button>
          <button className="bg-black text-white py-3 px-3 rounded-md sm:py-1 sm:px-1">Delete market</button>
        </div>
      </div>


    </div>
  )
}

export default Market