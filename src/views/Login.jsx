import React, { useState } from 'react'
import Header from '../components/Header'
import { useHistory, withRouter } from 'react-router-dom'
import Footer from '../components/Footer'
import Axios from 'axios'
import { BASE_URL } from '../config'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()

function Login() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const body = { email, password }
      const { data } = await Axios.post(`${BASE_URL}/api/auth/login`, body)
      cookies.set('token', data?.token, { path: "/" })
      history.push('/')
    } catch (error) {
      console.log(`Error logging admin i`)
      console.log(error)
      alert('Could not log you in. Please check your email and password is correct')
    }
  }


  return (
    <div>

      <Header />
      <div className="flex h-screen w-screen flex-col flex-1 items-center">

        <div className="w-full flex justify-center items-center flex-col mt-6">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
           </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
            </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" onChange={e => setPassword(e.target.value)} />
              {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={async e => await handleLogin(e)}>
                Log In
          </button>
              {/* <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Login)