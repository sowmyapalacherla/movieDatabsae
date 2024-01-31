import {Switch, Route} from 'react-router-dom'

import Popular from './components/Popular'
import TopRated from './components/TopRated'
import UpComing from './components/UpComing'
import MovieDetailPage from './components/movieDetailPage'
import './App.css'

// write your code here
const App = () => (
  <Switch>
    <Route exact path="/" component={Popular} />
    <Route exact path="/top-rated" component={TopRated} />
    <Route exact path="/upcoming" component={UpComing} />
    <Route path="/movie/:id" component={MovieDetailPage} />
  </Switch>
)

export default App
