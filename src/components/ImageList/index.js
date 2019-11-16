import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './style.scss'

const ImageList = () => {
  const [imgList, setImgList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = `Image List`
    fetchImageList()
  }, [])

  const fetchImageList = async () => {
    setIsLoading(true)
    await axios
      .get('https://picsum.photos/v2/list')
      .then(response => {
        setIsLoading(false)
        setImgList(response.data)
      })
      .catch(error => {
        console.log('Cannot fetch image list: ', error)
      })
  }

  if (isLoading) return <div>Loading...</div>
  return (
    <div className="container">
      <div className="img-list">
        {imgList.map(img => {
          return (
            <div key={img.id} className="img-item">
              <img src={img.download_url} alt={`img-${img.id}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImageList
