import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Select from 'react-dropdown-select'
import { useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import axios from 'axios'
import { BASE_URL, DropdownOptions } from '../config'
import { UploadImagesToFirebase } from '../util'
import { Cookies } from 'react-cookie'
const cookies = new Cookies()


function Landing(props) {
  const history = useHistory()

  const [isOpen, setIsOpen] = useState(false)
  const [market, setMarket] = useState("")
  const [markets, setMarkets] = useState([])
  const [searchByProximity, setSearchByProximity] = useState(false)
  const [category, setCategory] = useState('')
  const [coordinates, setCoordinates] = useState([])
  const [loading, setLoading] = useState(false)

  const [newMarketDescription, setNewMarketDescription] = useState('')
  const [images, setImages] = useState([])
  const [newMarketAddress, setNewMarketAddress] = useState()
  const [newMarketCategory, setNewMarketCategory] = useState('')
  const [newMarketName, setNewMarketName] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [geoEnabled, setGeoEnabled] = useState(false)

  const [imageUploadError, setImagUploadError] = useState('')
  const [disableNewMarketButton, setDisableNewMarketButton] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = cookies.get('token')
      if (token) {
        setAccessToken(token)
        setLoggedIn(true)
      }

      if ("geolocation" in navigator) {
        const permissions = await navigator.permissions.query({ name: 'geolocation' })
        if (permissions.state == "granted") {
          setGeoEnabled(true)
          setGeoEnabled(true)
          navigator.geolocation.getCurrentPosition(position => {
            console.log(`Latittude is: `, position?.coords?.latitude)
            console.log(`Longitude is: `, position?.coords?.longitude)
            setCoordinates([position.coords.longitude, position.coords.latitude])
          })
        } else {
          navigator.geolocation.getCurrentPosition(position => {
            console.log(`Latittude is: `, position?.coords?.latitude)
            console.log(`Longitude is: `, position?.coords?.longitude)
            setCoordinates([position.coords.longitude, position.coords.latitude])
            setGeoEnabled(true)
          }, error => console.log(`Error gettig potion: `, error))
        }
      } else {
        alert('Your browser does not support location.')
      }
    }

    init()
  }, [])

  useEffect(() => {
    const searchByMarketName = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${BASE_URL}/api/market/search/markets?name=${market}`)
        setMarkets(data)
        setLoading(false)
      } catch (error) {
        console.log(`Error searching`)
        console.log(error)
        setLoading(false)
      }
    }
    searchByMarketName()
  }, [market])

  useEffect(() => {
    const proximitySearch = async () => {
      try {
        if (searchByProximity) {
          setLoading(true)
          setMarkets([])
          const { data } = await axios.get(`${BASE_URL}/api/market/search/markets?userCoordinates=${JSON.stringify(coordinates)}&nearest=${searchByProximity}`)
          console.log(`Data is: `, data)
          setMarkets(data)
          setLoading(false)
        }
        setLoading(false)
      } catch (error) {
        console.log(`Error searching`)
        console.log(error)
        if (error?.response?.status == 400) {

        }
        setLoading(false)
      }
    }
    proximitySearch()
  }, [searchByProximity])

  useEffect(() => {
    const categorySearch = async () => {
      try {
        if (category) {
          setLoading(true)
          setMarkets([])
          const { data } = await axios.get(`${BASE_URL}/api/market/search/markets?category=${category}`)
          setMarkets(data)
          setLoading(false)
        }
      } catch (error) {
        console.log(`Error searching`)
        console.log(error)
        setLoading(false)
      }
    }
    categorySearch()
  }, [category])

  let set = new Set()
  const imageSelectStatusChange = async ({ meta, file }, status) => {
    if (set.size <= 3) {
      set.add(meta?.previewUrl)
    }
    setDisableNewMarketButton(false)
    console.log(`ALready more than 3`)
  }


  const addNewMarket = async (e) => {
    e.preventDefault()
    try {
      setDisableNewMarketButton(true)
      const firebaseImages = await UploadImagesToFirebase(set)
      const body = {
        name: newMarketName,
        description: newMarketDescription,
        category: newMarketCategory,
        address: newMarketAddress,
        images: firebaseImages
      }

      await axios.post(`${BASE_URL}/api/market`, body, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      window.location = "/"
      setDisableNewMarketButton(false)
    } catch (error) {
      console.log(error?.response)
      setDisableNewMarketButton(false)
      if (error?.response?.status === 400) {
        alert('Could not geocode your address. Please enter another one')
        return
      }
      alert('Error creating new market. Please try again')
    }
  }




  return (
    <div>



      <div className="flex flex-col">
        <Header />
        <div className="mx-10 flex flex-col lg:mt-24 md:mt-24">

          <div className="flex flex-wrap sm:flex-col text-gray-500 md:flex-col lg:flex-row xl:flex-row md:mx-24 xl:justify-center md:justify-center">
            <input type="search" name="search" id="searchbox" placeholder="Search for markets"
              onChange={async e => setMarket(e.target.value)}
              className="border  focus:outline-none focus:border-opacity-0 px-3 py-1 rounded bg-transparent text-white md:my-5" />


            <Select options={DropdownOptions} className="md:ml-1 sm:mt-2 md:mt-0 lg:mt-0 xl:mt-5 xl:ml-3 text-gray-500" clearable onChange={e => setCategory(e[0]?.value)} />
            {geoEnabled ? <div className="flex-row xl:mt-3">
              <input type="checkbox" name="search by proximity" id="prox" className="ml-2 mt-3 md:mt-5 xl:ml-5 xl:mt-5" onChange={e => setSearchByProximity(!searchByProximity)} />
              <label htmlFor="prox" className="ml-2 mt-2 text-gray-500 xl:mt-5">Around me</label>
            </div> : <span>Please enable location</span>}
          </div>

          <div className="flex flex-row justify-center">
            {loggedIn && <button className="md:mx-32 xl:mx-88 bg-teal-500 px-5 py-3 rounded-md mt-10 text-white" onClick={e => setIsOpen(true)}>Add New Market</button>}
          </div>
          {markets.length == 0 && !loading ? <span className="text-gray-500 my-10 text-center">No market found</span> :
            <div className="flex md:justify-center sm:flex-col md:flex-row lg:flex-row xl:flex-row">
              {markets.map((singlemarket, index) => {
                return (

                  <section className="flex px-2 mt-5" key={index}>
                    <div
                      className="wrapper max-w-xs bg-gray-50 rounded-b-md shadow-lg overflow-hidden"
                    >
                      <div>
                        <img src={singlemarket?.images[0]} alt="market-image" />
                      </div>
                      <div className="p-3 space-y-3">
                        <h3 className="text-gray-400 font-semibold text-md">
                          {singlemarket?.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-sm">
                          {singlemarket?.description}
                        </p>
                      </div>
                      <button
                        className="bg-teal-600 w-full flex justify-center py-2 text-white font-semibold transition duration-300 hover:bg-teal-500" onClick={e => history.push(`/market/${singlemarket?._id}`)}>Enter Market</button>
                    </div>
                  </section>
                )
              })}
            </div>}
        </div>

        <Modal isOpen={isOpen} onRequestClose={e => setIsOpen(false)} style={{
          content: {
            backgroundColor: '#364145',
          }
        }}>

          <div className="flex flex-col bg-gray-1000">
            <form className="flex justify-center flex-col md:mx-10 mx-2">
              <input type="text" name="name" id="name" placeholder="Enter market name" className="my-2 border px-1 py-2 rounded bg-transparent" onChange={e => setNewMarketName(e.target.value)} />
              <input type="text" name="description" id="descr" placeholder="Enter market description" className="my-3 border px-1 py-8 rounded bg-transparent" onChange={e => setNewMarketDescription(e.target.value)} />
              <input type="text" name="address" id="addr" placeholder="Address" className="border bg-transparent  rounded px-1 py-1" onChange={e => setNewMarketAddress(e.target.value)} />
              <Select options={DropdownOptions} clearable className="my-3" onChange={e => setNewMarketCategory(e[0]?.value)} />
              <Dropzone onChangeStatus={imageSelectStatusChange} accept="image/png" submitButtonDisabled />
              <div className="text-center">
                <span className="text-white my-3">Uploading your photos.. please hold on</span>
                <button className="bg-teal-500 text-white items rounded-md md:px-32 px-10 py-3 uppercase mt-5" onClick={async e => await addNewMarket(e)} disabled={disableNewMarketButton}>Add market</button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Landing