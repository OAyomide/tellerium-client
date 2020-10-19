import React from 'react'
import Select from 'react-dropdown-select'
import { withRouter } from 'react-router-dom'

function Header() {
  return (
    <div>
      <header className="flex flex-row mx-5 xl:mx-88 md:mx-32 cursor-pointer" onClick={e => window.location = "/"}>
        <h1 className="text-6xl text-black sm:text-3xl lg:ml-0 mt-2">Tellerrium Test</h1>
      </header>
    </div>
  )
}

export default withRouter(Header)