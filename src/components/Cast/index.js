import {Component} from 'react'
import {withRouter} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Cast extends Component {
  state = {
    cast: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCastDetails()
  }

  getCastDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const MOVIE_ID = id

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const API_KEY = 'c45a857c193f6302f2b5061c3b85e743'
    const url = `https://api.themoviedb.org/3/movie/${MOVIE_ID}/credits?api_key=${API_KEY}&language=en-US`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      //   console.log(fetchedData)
      const updatedData = fetchedData.cast.map(each => ({
        characterName: each.character,
        originalName: each.original_name,
        profileUrl: each.profile_path,
        id: each.id,
      }))
      //   console.log(fetchedData)
      this.setState({
        cast: updatedData,
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

  renderCastDetails = () => {
    const {cast} = this.state

    return (
      <>
        <ul className="cast-ul">
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
        </ul>
      </>
    )
  }

  renderCast = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCastDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div className="bg-home-container">{this.renderCast()}</div>
  }
}
export default withRouter(Cast)
