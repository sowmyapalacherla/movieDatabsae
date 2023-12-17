import {useState, useEffect, useCallback} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

function Cast(props) {
  const {id} = props
  const [cast, setCast] = useState({})
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getCast = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const MOVIE_ID = id

    const API_KEY = 'c45a857c193f6302f2b5061c3b85e743'
    const apiUrl = `https://api.themoviedb.org/3/movie/${MOVIE_ID}/credits?api_key=${API_KEY}&language=en-US`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = fetchedData.cast.map(each => ({
        characterName: each.character,
        originalName: each.original_name,
        profileUrl: each.profile_path,
        id: each.id,
      }))
      console.log(fetchedData)
      setCast(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [id])

  useEffect(() => {
    getCast()
  }, [id, getCast])

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  const renderCast = () => (
    <>
      {cast.map(each => (
        <li className="cast-list" key={each.id}>
          <img
            src={`https://image.tmdb.org/t/p/w500${each.profileUrl}`}
            alt="movieImage"
            className="cast-image"
          />
          <p className="original-name">{each.originalName}</p>
          <p className="character-name">character: {each.characterName}</p>
        </li>
      ))}
    </>
  )
  const getSwitchedResults = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderCast()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <div className="bg-home-container">{getSwitchedResults()}</div>
}

export default Cast
