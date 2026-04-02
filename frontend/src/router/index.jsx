import { createBrowserRouter } from 'react-router'
import Layout from '../App'
import HomePage from '../pages/HomePage'
import MoviePage from '../pages/MoviePage'
import TVPage from '../pages/TVPage'
import PersonPage from '../pages/PersonPage'
import PersonCategoryPage from '../pages/PersonCategoryPage'
import PersonProfilePage from '../pages/PersonProfilePage'
import AboutPage from '../pages/AboutPage'
import AskPage from '../pages/AskPage'
import SearchPage from '../pages/SearchPage'
import ProfilePage from '../pages/ProfilePage'
import FindPage from '../pages/FindPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/movie', element: <MoviePage /> },
      { path: '/movie/:id', element: <AboutPage /> },
      { path: '/tv', element: <TVPage /> },
      { path: '/tv/:id', element: <AboutPage /> },
      { path: '/person', element: <PersonPage /> },
      { path: '/person/category', element: <PersonCategoryPage /> },
      { path: '/person/:id', element: <PersonProfilePage /> },
      { path: '/ask', element: <AskPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/find', element: <FindPage /> },
    ],
  },
])

export default router
