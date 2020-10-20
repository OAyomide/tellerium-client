import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Select from 'react-dropdown-select'
import { useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import ImageUploader from 'react-images-upload'
import axios from 'axios'
import { BASE_URL } from '../config'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()
function Landing() {
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

  useEffect(() => {
    (async () => {
      const token = cookies.get('token')
      if (token) {
        setAccessToken(token)
        setLoggedIn(false)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        console.log(market)
        if (!market) {
          console.log(`Empty.. noop`)
        }
        const { data } = await axios.get(`${BASE_URL}/api/market/search/markets?name=${market}&category=${category}&nearest=${searchByProximity}&userCoordinates=${coordinates}`)
        console.log(data)
        setMarkets(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    })()
  }, [market])

  const addNewMarket = async () => {
    try {
      const body = {
        name: newMarketName,
        description: newMarketDescription,
        category: newMarketCategory,
        address: newMarketAddress,
        images
      }

      const { data: creationData } = await axios.post(`${BASE_URL}/api/market`, body, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      console.log(`ID of new market is: ${creationData?.id}`)
    } catch (error) {
      console.log(`Error adding new market`)
    }
  }

  const options = [{ value: 'spices', label: 'Spices' }, { value: 'foodstuff', label: 'Food Stuff' }, { value: 'pepper', label: 'Pepper', value: 'fishandmeat', label: 'Fish and Meat', value: 'other', label: 'Others' }]
  return (
    <div className="flex h-screen w-screen flex-col flex-1">
      <Header />
      <Modal isOpen={isOpen} onRequestClose={e => setIsOpen(false)}>

        <div className="flex flex-col">
          <form action="g" method="post" className="flex justify-center flex-col md:mx-112 mx-2">
            <input type="text" name="name" id="name" placeholder="Enter market name" className="my-2 border border-black px-1 py-2 rounded" />
            <input type="text" name="description" id="descr" placeholder="Enter market description" className="my-3 border border-black px-1 py-8 rounded" onChange={e => setNewMarketDescription(e.target.value)} />
            <input type="text" name="address" id="addr" placeholder="Address" className="border border-black rounded px-1 py-1" onChange={e => setNewMarketAddress(e.target.value)} />
            <Select options={options} clearable className="my-3" onChange={e => setNewMarketCategory(e[0]?.value)} />
            <ImageUploader imgExtension={['.jpg', '.png']} withIcon={true} buttonText="Select images" maxFileSize={5242880} onChange={e => setImages(images.concat(e))} withPreview={true} />
            <div className="text-center">
              <button className="bg-black text-white items rounded-md md:px-32 px-10 py-3 uppercase">Add market</button>
            </div>
          </form>
        </div>
      </Modal>


      <div className="w-full flex xl:items-start flex-col my-10 sm:mx-5">

        <div className="flex flex-col md:flex-row md:mx-32 mt-5 xl:mx-88">
          <input type="search" name="search" id="searchbox" placeholder="Search for markets"
            onChange={async e => setMarket(e.target.value)}
            className="border border-black focus:border-indigo-600 focus:border-opacity-0 px-3 py-1 rounded w-auto" />
          <Select options={options} className="md:ml-1 sm:mt-2 md:mt-0 lg:mt-0 xl:mt-0" clearable onChange={e => setCategory(e[0]?.value)} />
          <div className="flex-row">
            <input type="checkbox" name="search by proximity" id="prox" className="ml-2 mt-3" onChange={e => setSearchByProximity(!searchByProximity)} />
            <label htmlFor="prox" className="ml-2 mt-2">Search by proximity</label>
          </div>
        </div>


        <div className="w-full my-10">
          <button className="md:mx-32 xl:mx-88 bg-black text-white px-3 py-3 rounded-md" onClick={e => setIsOpen(true)}>Add New Market</button>
          {markets.length === 0 && !loading ? <span>No market found</span> : markets.map((x, y) => {
            return (
              <div className="flex flex-col shadow-md my-3 mx-1 md:mx-32 xl:mx-88 py-2 px-2 cursor-pointer" onClick={e => history.push(`/market/${x?._id}`)} key={y} data-id={x?._id} >
                <div className="flex flex-row">
                  <img src={"https://via.placeholder.com/150"} alt="shopimage" style={{ width: 50, height: 50, borderRadius: 25 }} />
                  <div className="flex flex-col mt-1 mx-3">
                    <span>{x?.name}</span>
                    <span>{x?.description}</span>
                  </div>
                </div>
              </div>
            )
          })}
          {loading && <span>Loading...</span>}
        </div>
      </div>
    </div>
  )
}

export default Landing