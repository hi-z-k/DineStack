import "../styles/Components.css";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="group search-wrapper">
            <input 
                type="text"
                placeholder="SEARCH FOOD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <span className="search-icon">🔍</span>
        </div>
    );
};

export default SearchBar;