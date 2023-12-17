import {useContext, useState} from 'react'
import {Link} from 'react-router-dom'
import {SearchContext} from '../../searchContext'

import './index.css'

const Header = () => {
  const [search, setSearch] = useState('')

  const {onSearchChanged} = useContext(SearchContext)

  const handleSearchInput = event => {
    setSearch(event.target.value)
  }

  const onButtonClicked = () => {
    onSearchChanged(search)
  }
  const onLogoClicked = () => {
    onSearchChanged('')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link className="home-link" to="/" onClick={onLogoClicked}>
          <p className="logo">movieDB</p>
        </Link>
        <div className="search-cont">
          <input
            onChange={handleSearchInput}
            value={search}
            className="search-input"
            type="search"
          />
          <button
            type="button"
            onClick={onButtonClicked}
            className="search-btn"
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

export default Header
