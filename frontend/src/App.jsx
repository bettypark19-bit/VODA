import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GNB from './components/GNB'
import Footer from './components/Footer'
import PersonPage from './pages/PersonPage'
import PersonCategoryPage from './pages/PersonCategoryPage'
import PersonProfilePage from './pages/PersonProfilePage'

const App = () => {
  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col bg-[#0e0e13]'>
        <GNB />
        <main className='flex-1'>
          <Routes>
            <Route path='/' element={<PersonPage />} />
            <Route path='/people' element={<PersonPage />} />
            <Route path='/people/category' element={<PersonCategoryPage />} />
            <Route path='/people/:id' element={<PersonProfilePage />} />
            {/* Placeholder routes for GNB links */}
            <Route path='/movie' element={<PersonPage />} />
            <Route path='/tv' element={<PersonPage />} />
            <Route path='/ask' element={<PersonPage />} />
            <Route path='/search' element={<PersonPage />} />
            <Route path='/profile' element={<PersonPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
