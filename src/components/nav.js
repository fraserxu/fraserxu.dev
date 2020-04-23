import React from 'react'
import { Link } from 'gatsby'

import navStyles from './nav.module.css'

const Nav = () => {
  return (
    <nav>
      <ul className={navStyles.ul}>
        <li className={navStyles.li}>
          <Link to='/'>Home</Link>
        </li>
        <li className={navStyles.li}>
          <Link to='/blog'>Blog</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
