import {Route, Switch} from 'react-router-dom'
import {useState} from 'react'
import Popular from './components/Popular'
import TopRated from './components/TopRated'
import {SearchContext} from './searchContext'

import UpComing from './components/UpComing'
import MovieDetailPage from './components/movieDetailPage'
import './App.css'

const App = () => {
  const [searchInput, setSearchInput] = useState('')

  const onSearchChanged = value => {
    setSearchInput(value)
  }

  return (
    <SearchContext.Provider value={{searchValue: searchInput, onSearchChanged}}>
      <Switch>
        <Route path="/" component={Popular} />
        <Route path="/top-rated" component={TopRated} />
        <Route path="/upcoming" component={UpComing} />
        <Route path="/movie/:id" component={MovieDetailPage} />
      </Switch>
    </SearchContext.Provider>
  )
}

export default App
