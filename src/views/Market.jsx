import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import MapReact from 'google-map-react'
import Axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { BASE_URL } from '../config'
import { Cookies } from 'react-cookie'
const cookies = new Cookies()

function Market(props) {
  const [marketData, setMarketData] = useState([])
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)

  const id = props?.match?.params?.id

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const token = cookies.get("token")
        if (token) {
          setAccessToken(token)
          setLoggedIn(true)
        }
        const { data } = await Axios.get(`${BASE_URL}/api/market/${id}`)
        console.log(data?.location?.coordinates)
        setMarketData(data)
        setLoading(false)
      } catch (error) {
        console.log(`Error getting market`)
        setIsError(true)
        setLoading(false)
      }
    })()
  }, [])

  const location = {
    address: marketData?.address,
    lat: marketData?.location?.coordinates[0],
    lng: marketData?.location?.coordinates[0],
  }

  const handleDeleteMarket = async () => {
    try {
      confirmAlert({
        title: 'Delete Market',
        message: 'Are you sure you want to delete this market?',

        buttons: [{
          label: 'Yes',
          onClick: async () => { await deleteMarket() },
        }, {
          label: 'No, go back',
          onClick: () => { } // no-operation. 
        }],
      })
    } catch (error) {
      console.log(`Error deleting market`)
      console.log(error)
    }
  }


  const deleteMarket = async () => {
    try {
      console.log(`Now delete`)
      await Axios.delete(`${BASE_URL}/api/market/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      window.location = "/"
    } catch (error) {
      console.log(`Error deleteing marking`)
    }
  }


  return (

    <div className="flex h-screen w-screen flex-col flex-1">
      <Header />

      {loading ? <span className="flex flex-row items-center">Loading..</span> : <div className="w-full flex md:items-center flex-col mt-6">
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
            <span className="md:ml-20 justify-end flex sm:mx-10">{marketData?.name}</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10">
            <span>Address:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10">{marketData?.address ?? <span className="italic">No address found</span>}</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10">
            <span>Description:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10" >{marketData?.description}</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10">
            <span>Category:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10">{marketData?.category}</span>
          </div>
        </div>

      </div>}
      <div className="mx-32 sm:mx-5 md:mx-32">
        <div className="h-88 w-full">
          <MapReact bootstrapURLKeys={{ key: 'AIzaSyCLcovDlecYhOB3MHc8gEMrC2HBowTX8sM' }} defaultCenter={location} defaultZoom={12} />
        </div>
      </div>

      {loggedIn && <div className="mt-10 md:mx-32 sm:mx-10">
        <div className="flex flex-row justify-between">
          <button className="bg-black text-white py-3 px-3 rounded-md sm:py-1 sm:px-1" onClick={e => deleteMarket()}>Delete market</button>
          <button className="bg-black text-white py-3 px-3 rounded-md sm:py-1 sm:px-1">Update market</button>
        </div>
      </div>}


    </div>
  )
}

export default Market