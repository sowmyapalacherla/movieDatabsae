import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Header extends Component {
  state = {
    searchInput: '',
    searchedData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSearchResults()
  }

  getSearchResults = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.state
    const MOVIE_NAME = searchInput
    const API_KEY = 'c45a857c193f6302f2b5061c3b85e743'
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${MOVIE_NAME}&page=1`
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
        searchedData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  handleSearchInput = () => {
    this.setState(this.getSearchResults())
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

  renderSearchView = () => {
    const {searchedData} = this.state
    return (
      <ul className="home-container">
        {searchedData.map(each => (
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
    )
  }

  renderMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <nav className="nav-header">
        <div className="nav-content">
          <Link className="home-link" to="/">
            <h1 className="logo">movieDB</h1>
          </Link>
          <div className="search-cont">
            <input
              value={searchInput}
              className="search-input"
              type="search"
              onChange={this.onChangeSearchInput}
            />
            <button
              type="button"
              className="search-btn"
              onClick={this.handleSearchInput}
            >
              Search
            </button>
          </div>
          <div className="nav-bar-large-container">
            <ul className="nav-menu">
              <li className="nav-menu-item">
                <Link to="/" className="nav-link">
                  Popular
                </Link>
              </li>

              <li className="nav-menu-item">
                <Link to="/top-rated" className="nav-link">
                  Top Rated
                </Link>
              </li>

              <li className="nav-menu-item">
                <Link to="/upcoming" className="nav-link">
                  UpComing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
export default Header
