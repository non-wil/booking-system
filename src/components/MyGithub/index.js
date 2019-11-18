import React from 'react'
import './style.scss'

const MyGithub = props => {
  const { title, url } = props
  return (
    <div className="fixed-bottom-button">
      <a href={url} alt={title} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </div>
  )
}

export default MyGithub
