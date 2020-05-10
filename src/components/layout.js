import React from 'react'
import { Link } from 'gatsby'

import Nav from './nav'

const RootPageHeader = ({ title }) => (
  <>
    <h1 className='py-8'>
      <Link className='text-gray-800 hover:text-gray-900' to={`/`}>
        {title}
      </Link>
    </h1>
    <Nav />
  </>
)

const PageHeader = ({ title }) => (
  <div className='flex items-center justify-between pb-4'>
    <h3>
      <Link className='text-gray-800 hover:text-gray-900' to={`/`}>
        {title}
      </Link>
    </h3>
    <Nav />
  </div>
)
const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='mx-auto max-w-2xl py-8 px-4'>
        <header>
          {location.pathname === rootPath ? (
            <RootPageHeader title={title} />
          ) : (
            <PageHeader title={title} />
          )}
        </header>
        <main>{children}</main>
        <footer className='py-10'>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a
            className='text-teal-500 hover:text-teal-700'
            href='https://www.gatsbyjs.org'
          >
            Gatsby
          </a>
        </footer>
      </div>
    </div>
  )
}

export default Layout
