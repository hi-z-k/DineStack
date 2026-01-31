import "../styles/AdminOrders.css";

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="filter-pill-row">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn-pill-base ${
                        selectedCategory === cat ? "pill-active" : "pill-idle"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;