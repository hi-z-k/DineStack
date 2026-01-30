const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                        selectedCategory === cat 
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200" 
                        : "bg-white border-gray-200 text-gray-400 hover:border-orange-300"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;