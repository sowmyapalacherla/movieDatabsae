import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {
    popularMovies: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const API_KEY = 'c45a857c193f6302f2b5061c3b85e743'
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(each => ({
        id: each.id,
        imgUrl: each.poster_path,
        title: each.title,
        rating: each.vote_average,
      }))
      console.log(fetchedData)
      this.setState({
        popularMovies: updatedData,
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

  renderPopularMovies = () => {
    const {popularMovies} = this.state
    return (
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
  }

  renderMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPopularMovies()
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
export default Popular
