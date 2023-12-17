import {useState, useEffect, useCallback} from 'react'
import {format} from 'date-fns'
import {useParams} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Header from '../Header'
import Cast from '../Cast'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

function MovieDetailPage() {
  const [movieDetails, setMovieDetails] = useState({})
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const {id} = useParams()

  const getMovieDetails = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const MOVIE_ID = id
    const API_KEY = 'c45a857c193f6302f2b5061c3b85e743'
    const apiUrl = `https://api.themoviedb.org/3/movie/${MOVIE_ID}?api_key=${API_KEY}&language=en-US`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        backgroundUrl: fetchedData.backdrop_path,
        genre: fetchedData.genres.map(each => each.name).join(', '),
        title: fetchedData.original_title,
        overview: fetchedData.overview,
        posterUrl: fetchedData.poster_path,
        releaseDate: fetchedData.release_date,
        runTime: fetchedData.runtime,
        rating: fetchedData.vote_average,
      }
      console.log(fetchedData)

      setMovieDetails(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [id])

  useEffect(() => {
    getMovieDetails()
  }, [id, getMovieDetails])

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

  const renderPopularMoviesView = () => {
    const {releaseDate} = movieDetails
    const formattedDate = format(new Date(releaseDate), 'EEE MMM dd yyyy')

    return (
      <>
        <div className="movie-details-cont">
          <div className="details-box">
            <div className="img-det-cont">
              <img
                src={`https://image.tmdb.org/t/p/w500${movieDetails.posterUrl}`}
                alt="movieImage"
                className="poster"
              />
              <div className="all-details-cont">
                <h1 className="movie-title">{movieDetails.title}</h1>
                <p className="movie-ratings">Rating: {movieDetails.rating}</p>
                <p className="duration">
                  {movieDetails.runTime}mins {movieDetails.genre}
                </p>
                <p className="duration"> Release Date: {formattedDate}</p>
              </div>
            </div>
            <h1 className="over-heading">OVERVIEW</h1>
            <p className="overview">{movieDetails.overview}</p>
          </div>
          <img
            src={`https://image.tmdb.org/t/p/w500${movieDetails.backgroundUrl}`}
            alt="coverPhoto"
            className="cover-image"
          />
        </div>
        <h1 className="over-heading">CAST</h1>
        <div className="cast-container">
          <Cast id={id} />
        </div>
      </>
    )
  }

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

export default MovieDetailPage
