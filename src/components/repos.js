import React from 'react'

import StarIcon from '../icons/star.svg'

const Repos = ({ repos }) => {
  return (
    <ul className='ml-2'>
      {repos.map((repo) => {
        return (
          <li key={repo.name} className='pb-4 list-disc'>
            <a
              className='text-black underline hover:no-underline'
              href={repo.url}
            >
              {repo.name}
            </a>
            <p className='pt-1'>{repo.description}</p>
            <div className='pt-1 inline-flex items-center '>
              <span className='pr-4 text-sm text-gray-700'>
                <span
                  className='w-3 h-3 inline-block relative rounded-full mr-1'
                  style={{ backgroundColor: repo.languages.nodes[0].color }}
                ></span>
                {repo.languages.nodes[0].name}
              </span>
              <span className='inline-flex items-center pr-4 text-sm text-gray-700'>
                <span className='inline-flex items-center pr-1'>
                  <StarIcon className='inline w-4' />{' '}
                </span>
                <span>{repo.stargazers.totalCount}</span>
              </span>
              <span className='text-sm text-gray-700'>
                Updated {repo.pushedAt}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default Repos
