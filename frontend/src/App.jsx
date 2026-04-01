// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GNB from './components/GNB'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MoviePage from './pages/MoviePage'
import TVPage from './pages/TVPage'
import AskPage from './pages/AskPage'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import PersonPage from './pages/PersonPage'
import PersonCategoryPage from './pages/PersonCategoryPage'
import PersonProfilePage from './pages/PersonProfilePage'
import ChatBtn from './components/ChatBtn'

const App = () => {
  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col bg-[#0e0e13]'>
        <GNB />
        <main className='flex-1'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/movie' element={<MoviePage />} />
            <Route path='/tv' element={<TVPage />} />
            <Route path='/people' element={<PersonPage />} />
            <Route path='/people/category' element={<PersonCategoryPage />} />
            <Route path='/people/:id' element={<PersonProfilePage />} />
            <Route path='/ask' element={<AskPage />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
        <ChatBtn />
      </div>
    </BrowserRouter>
  )
}

export default App
