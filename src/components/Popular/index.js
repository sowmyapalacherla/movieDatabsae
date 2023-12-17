import {useState, useEffect, useContext, useCallback} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import {SearchContext} from '../../searchContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

function Popular() {
  const [popularMovies, setPopular] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const {searchValue} = useContext(SearchContext)

  const getMovies = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const API_KEY = 'c45a857c193f6302f2b5061c3b85e743'
    const apiUrl =
      searchValue === ''
        ? `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        : `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchValue}&page=1`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(each => ({
        id: each.id,
        imgUrl: each.poster_path,
        title: each.title,
        rating: each.vote_average,
      }))
      setPopular(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [searchValue])

  useEffect(() => {
    getMovies()
  }, [searchValue, getMovies])

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

  const renderPopularMoviesView = () => (
    <div className="container">
      <h1 className="heading">Popular</h1>

      <ul className="home-container">
        {popularMovies.map(each => (
          <li className="list" key={each.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${each.imgUrl}`}
              alt="movieImage"
              className="movie-image"
            />
            <p className="title">{each.title}</p>
            <p className="rating">Rating {each.rating}</p>
            <Link
              key={each.id}
              className="link-element"
              to={`/movie/${each.id}`}
            >
              <button type="button" className="view-details">
                View Details
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
  const getSwitchedResults = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderPopularMoviesView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <div className="bg-home-container">
      <Header />
      {getSwitchedResults()}
    </div>
  )
}

export default Popular
