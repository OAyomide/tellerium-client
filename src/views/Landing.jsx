import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Select from 'react-dropdown-select'
import { useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import ImageUploader from 'react-images-upload'
import axios from 'axios'

function Landing() {
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState([])
  const [market, setMarket] = useState("")

  useEffect(() => {
    (async () => {
      await Search(market)
    })()
  }, [market])
  const Search = async (text) => {
    try {
      await getGeocode(text)
    } catch (error) {
      console.log(`Error searching for market`)
      console.log(error)
    }
  }


  const getGeocode = async (text) => {
    try {
      const encoded = encodeURI(text)
      console.log(`Encoded is: ${encoded}`)
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=AIzaSyCLcovDlecYhOB3MHc8gEMrC2HBowTX8sM`
      const req = await axios.post(url)
      return req
    } catch (error) {
      console.log(`Error getting geocode`)
      console.log(error?.response)
    }
  }

  const options = [{ value: 'spices', label: 'Spices' }, { value: 'foodstuff', label: 'Food Stuff' }, { value: 'fashion', label: 'Fashion', value: 'toys', label: 'Toys', value: 'other', label: 'Others' }]
  return (
    <div className="flex h-screen w-screen flex-col flex-1">
      <Header />
      <Modal isOpen={isOpen} onRequestClose={e => setIsOpen(false)}>

        <div className="flex flex-col">
          <form action="g" method="post" className="flex justify-center flex-col md:mx-112 mx-2">
            <input type="text" name="name" id="name" placeholder="Enter market name" className="my-2 border border-black px-1 py-2 rounded" />
            <input type="text" name="description" id="descr" placeholder="Enter market description" className="my-3 border border-black px-1 py-8 rounded" />
            <input type="text" name="address" id="addr" placeholder="Address" className="border border-black rounded px-1 py-1" />
            <Select options={options} clearable className="my-3" />
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
          <Select options={options} className="md:ml-1 sm:mt-2 md:mt-0 lg:mt-0 xl:mt-0" clearable />
          <div className="flex-row">
            <input type="checkbox" name="search by proximity" id="prox" className="ml-2 mt-3" />
            <label htmlFor="prox" className="ml-2 mt-2">Search by proximity</label>
          </div>
        </div>


        <div className="w-full my-10">
          <button className="md:mx-32 xl:mx-88 bg-black text-white px-3 py-3 rounded-md" onClick={e => setIsOpen(true)}>Add New Market</button>
          <div className="flex flex-col shadow-md my-3 mx-1 md:mx-32 xl:mx-88 py-2 px-2 cursor-pointer" onClick={e => history.push('/market/1')}>
            <div className="flex flex-row">
              <img src={"https://via.placeholder.com/150"} alt="shopimage" style={{ width: 50, height: 50, borderRadius: 25 }} />
              <div className="flex flex-col mt-1 mx-3">
                <span>Dr Mateo's shop</span>
                <span>Pharmacy</span>
              </div>
            </div>
          </div>


          <div className="flex flex-col shadow-md my-3 mx-1 md:mx-32 xl:mx-88 py-2 px-2 cursor-pointer">
            <div className="flex flex-row">
              <img src={"https://via.placeholder.com/150"} alt="shopimage" style={{ width: 50, height: 50, borderRadius: 25 }} />
              <div className="flex flex-col mt-1 mx-3">
                <span>Dr Mateo's shop</span>
                <span>Pharmacy</span>
              </div>
            </div>
          </div>


          <div className="flex flex-col shadow-md my-3 mx-1 md:mx-32 xl:mx-88 py-2 px-2 cursor-pointer">
            <div className="flex flex-row">
              <img src={"https://via.placeholder.com/150"} alt="shopimage" style={{ width: 50, height: 50, borderRadius: 25 }} />
              <div className="flex flex-col mt-1 mx-3">
                <span>Dr Mateo's shop</span>
                <span>Pharmacy</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Landing