import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import MapReact from 'google-map-react'
import Axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { BASE_URL, DropdownOptions } from '../config'
import { Cookies } from 'react-cookie'
import Select from 'react-dropdown-select'
import ImageUploader from 'react-images-upload'
import Modal from 'react-modal'
import axios from 'axios'
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import { UploadImagesToFirebase } from '../util'


const cookies = new Cookies()

function Market(props) {
  const [marketData, setMarketData] = useState({})

  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateMarketDescription, setUpdateMarketDescription] = useState('')
  const [images, setUpdateImages] = useState([])
  const [updateMarketAddress, setUpdateMarketAddress] = useState()
  const [updateMarketCategory, setUpdateMarketCategory] = useState('')
  const [updateMarketName, setUpdateMarketName] = useState('')
  const [disableNewMarketButton, setDisableNewMarketButton] = useState(true)
  const [coordinates, setCoordinates] = useState({})


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
        console.log(`Data is: `, data?.images[0])
        setMarketData(data)
        setLoading(false)
        setCoordinates({
          lng: data?.location?.coordinates[0],
          lat: data?.location?.coordinates[1]
        })
      } catch (error) {
        console.log(`Error getting market`)
        setLoading(false)
      }
    })()
  }, [])

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
      console.log(`Error deleting marking`)
      console.log(error)
    }
  }
  let set = new Set()
  const imageSelectStatusChange = async ({ meta, file }, status) => {
    if (set.size <= 3) {
      set.add(meta?.previewUrl)
    }
    setDisableNewMarketButton(false)
  }

  const updateMarket = async (e) => {
    e.preventDefault()
    try {
      setDisableNewMarketButton(true)
      const firebaseImages = await UploadImagesToFirebase(set)

      const body = {
        name: updateMarketName,
        description: updateMarketDescription,
        category: updateMarketCategory,
        address: updateMarketAddress,
        images: firebaseImages
      }

      await axios.put(`${BASE_URL}/api/market/${id}`, body, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      window.location = "/"
      disableNewMarketButton(false)
    } catch (error) {
      console.log(`Error adding updating market`)
      console.log(error?.response)
      if (error?.response?.status === 400) {
        alert('Could not geocode your address. Please enter another one')
        return
      }
      alert('Error creating new market. Please try again')
    }
  }

  return (

    <div className="flex h-screen w-screen flex-col flex-1">
      <Header />
      <Modal isOpen={updateOpen} onRequestClose={e => setUpdateOpen(false)} style={{
        content: {
          backgroundColor: '#364145',
        }
      }}>

        <div className="flex flex-col">
          <form className="flex justify-center flex-col md:mx-112 mx-2">
            <input type="text" name="name" id="name" placeholder={marketData?.name} className="my-2 border bg-transparent px-1 py-2 rounded text-gray-500" onChange={e => setUpdateMarketName(e.target.value)} />
            <input type="text" name="description" id="descr" placeholder={marketData?.description} className="my-3 border bg-transparent px-1 py-8 rounded text-gray-500" onChange={e => setUpdateMarketDescription(e.target.value)} />
            <input type="text" name="address" id="addr" placeholder={marketData?.address} className="border bg-transparent rounded px-1 py-1 text-gray-500" onChange={e => setUpdateMarketAddress(e.target.value)} />
            <Select options={DropdownOptions} clearable className="my-3 text-gray-500" onChange={e => setUpdateMarketCategory(e[0]?.value)} />
            <Dropzone onChangeStatus={imageSelectStatusChange} accept="image/png" submitButtonDisabled />
            <div className="text-center">
              <button className="bg-teal-500 text-white items rounded-md md:px-32 px-10 py-3 uppercase" onClick={async e => await updateMarket(e)} disabled={disableNewMarketButton}>Update market</button>
            </div>
          </form>
        </div>
      </Modal>
      {loading ? <span className="flex flex-row items-center">Loading..</span> : <div className="w-full flex md:items-center flex-col mt-6">
        <div className="flex flex-row mx-32 sm:mx-5">
          <Carousel>
            {marketData?.images && <img src={marketData?.images[0] ?? "https://via.placeholder.com/150"} alt="Image of market" />}
          </Carousel>
        </div>

        <div className="flex flex-col w-full mx-32 sm:mx-5 xl:mx-112">
          <div className="border xl:mx-112 border-black"></div>
          <div className="flex flex-row justify-between md:mx-32 sm:mx-10 xl:mx-112">
            <span className="text-gray-500 xl:text-xl md:text-xl">Name:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10 text-gray-500 xl:text-xl md:text-xl">{marketData?.name}</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10 xl:mx-112">
            <span className="text-gray-500  xl:text-xl md:text-xl">Address:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10 text-gray-500 xl:text-xl md:text-xl">{marketData?.address ?? <span className="italic">No address found</span>}</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10 xl:mx-112">
            <span className="text-gray-500  xl:text-xl md:text-xl">Description:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10 text-gray-500 xl:text-xl md:text-xl" >{marketData?.description}</span>
          </div>
          <div className="flex flex-row justify-between mx-88 md:mx-32 sm:mx-10 xl:mx-112">
            <span className="text-gray-500">Category:</span>
            <span className="md:ml-20 justify-end flex sm:mx-10 text-gray-500 xl:text-xl md:text-xl">{marketData?.category}</span>
          </div>
          <div className="border xl:mx-112 border-black"></div>
        </div>

      </div>}
      {coordinates?.lng ? <div className="mx-32 sm:mx-5 md:mx-32 xl:mx-112 lg:mx-112">
        <div className="h-64 w-full">
          <MapReact bootstrapURLKeys={{ key: 'AIzaSyBYBl5_61hLCt3S1t9ptMm0IV9VPc5B0uI' }} defaultCenter={coordinates} defaultZoom={12} />
        </div>
      </div> : <span className="text-gray-500 my-10 text-center">Market address could not be geolocated</span>}

      {loggedIn && <div className="mt-10 md:mx-32 sm:mx-10 xl:mx-112 my-5">
        <div className="flex flex-row justify-between">
          <button className="bg-red-500 text-white py-3 px-5 rounded-md sm:py-1 sm:px-1" onClick={e => handleDeleteMarket()}>Delete market</button>
          <button className="bg-teal-600 text-white py-3 px-3 rounded-md sm:py-1 sm:px-1" onClick={e => setUpdateOpen(true)}>Update market</button>
        </div>
      </div>}


    </div>
  )
}

export default Market