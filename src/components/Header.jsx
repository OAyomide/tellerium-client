import React from 'react'
import Select from 'react-dropdown-select'
import { useHistory, withRouter } from 'react-router-dom'
import { ReactComponent as AdminLoginIcon } from '../assets/user.svg'
import { Cookies } from 'react-cookie'
const cookies = new Cookies()

function Header() {
  const history = useHistory()
  const token = cookies.get('token')

  return (
    <div>
      <header className="flex flex-row mx-5 xl:mx-88 md:mx-32 cursor-pointer justify-between" onClick={e => window.location = "/"}>
        <h1 className="text-6xl text-black sm:text-3xl lg:ml-0 mt-2">Tellerrium Test</h1>

        {token ? null : <div className="block lg:hidden md:hidden" onClick={e => history.push('/login')}>
          <span className="text-white px-2 mt-5 cursor-pointer">
            <AdminLoginIcon className="w-5 h-5" />
          </span>
        </div>}

        {token ? null : <div className="block sm:hidden lg:flex md:flex mx-2 mt-2" onClick={e => history.push('/login')}>
          <span className="text-white bg-blue-500 rounded-md px-2 cursor-pointer">Admin Login</span>
        </div>}
      </header>
    </div>
  )
}

export default withRouter(Header)