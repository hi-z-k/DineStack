const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="relative group w-full md:w-80">
            <input 
                type="text"
                placeholder="SEARCH FOOD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-200 py-2 focus:outline-none focus:border-orange-500 font-mono text-sm transition-colors uppercase tracking-widest"
            />
            <span className="absolute right-0 bottom-2 text-gray-300 group-focus-within:text-orange-500">🔍</span>
        </div>
    );
};

export default SearchBar;