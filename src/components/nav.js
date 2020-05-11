import React from 'react'
import { Link } from 'gatsby'

const Nav = () => {
  return (
    <nav>
      <ul>
        <li className='inline pr-4 mb-3 uppercase'>
          <Link className='text-gray-500 hover:text-gray-700' to='/'>
            Home
          </Link>
        </li>
        <li className='inline pr-4 mb-3 uppercase'>
          <Link className='text-gray-500 hover:text-gray-700' to='/blog'>
            Blog
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
