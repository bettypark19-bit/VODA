import SearchBar from '../components/SearchBar'
import SectionTitle from '../components/SectionTitle'

const PersonPage = () => {
  const handleSearch = (query) => {
    console.log('인물 검색:', query)
  }

  return (
    <div className='text-white px-12 py-16'>
      <h1 className='text-4xl font-black mb-8 tracking-tighter'>사람을 보다</h1>
      
      <div className='mb-12'>
        <SearchBar variant='normal' onSubmit={handleSearch} />
      </div>

      <SectionTitle title='인기 인물' link='/person/category' />

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8'>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className='flex flex-col items-center gap-4 animate-pulse'>
            <div className='w-full aspect-square rounded-full bg-zinc-800' />
            <div className='h-4 w-20 bg-zinc-800 rounded' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PersonPage
