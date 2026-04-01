function GenreTab({ tabs, active, onChange }) {
  return (
    <div className="w-full backdrop-blur-md bg-neutral-900/80 py-9">
      <div className="flex flex-wrap justify-center gap-4 max-w-content mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`h-16 rounded-full font-serif text-2xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              active === tab.id
                ? 'bg-primary-400 text-primary-950 px-9 py-3.5'
                : 'bg-zinc-800 border-2 border-zinc-600 text-zinc-400 px-9 py-3.5'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenreTab
