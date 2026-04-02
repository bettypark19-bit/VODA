import SearchBar from '../components/SearchBar'

const AskPage = () => {
  const handleAsk = (query) => {
    console.log('AI 질문:', query)
  }

  return (
    <div className='text-white px-12 py-16 min-h-[70vh] flex flex-col justify-center'>
      <SearchBar variant='ai' onSubmit={handleAsk} />
    </div>
  )
}

export default AskPage
