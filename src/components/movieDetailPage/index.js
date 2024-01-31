import {Component} from 'react'
// import {format as formatFn} from 'date-fns'

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

class MovieDetailPage extends Component {
  state = {
    movieDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  getMovieDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const MOVIE_ID = id
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const API_KEY = 'c45a857c193f6302f2b5061c3b85e743'
    const url = `https://api.themoviedb.org/3/movie/${MOVIE_ID}?api_key=${API_KEY}&language=en-US`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
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
      this.setState({
        movieDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderMovieDetails = () => {
    const {movieDetails} = this.state
    // const {releaseDate} = movieDetails
    // const releaseDateObject = new Date(releaseDate)
    // console.log(releaseDateObject)

    // // Calculate the difference in hours

    // // Format the date
    // const formattedDate = formatFn(releaseDateObject, 'EEE MMM dd yyyy')
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
                {/* <p className="duration"> Release Date: {formattedDate}</p> */}
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
          <Cast />
        </div>
      </>
    )
  }

  renderMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMovieDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-home-container">
        <Header />
        {this.renderMovies()}
      </div>
    )
  }
}
export default MovieDetailPage
