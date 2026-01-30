import "../../styles/ProductManager.css"

const ProductManager = ({ products, editingId, formData, setFormData, handleSubmitProduct, handleImageUpload, startEdit, setEditingId }) => {
    return (
        <div className="manager-stack">
            {/* Editor Card */}
            <div className="manager-card">
                <h3 className="manager-title">
                    {editingId ? 'Edit Product' : 'Add New Menu Item'}
                </h3>
                
                <form className="manager-grid-form" onSubmit={handleSubmitProduct}>
                    {/* Left Column */}
                    <div className="manager-form-column">
                        <AdminInput 
                            label="Food Name" 
                            value={formData.name} 
                            onChange={e => setFormData({ ...formData, name: e.target.value })} 
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <AdminInput 
                                label="Price (ETB)" 
                                type="number" 
                                value={formData.price} 
                                onChange={e => setFormData({ ...formData, price: e.target.value })} 
                            />
                            <AdminInput 
                                label="Category" 
                                value={formData.category} 
                                onChange={e => setFormData({ ...formData, category: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label className="manager-label">Image Upload (Local)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="manager-file-input" 
                            />
                        </div>
                    </div>
                    <div className="manager-form-column">
                        <textarea 
                            className="manager-textarea" 
                            placeholder="Description..." 
                            value={formData.description} 
                            onChange={e => setFormData({ ...formData, description: e.target.value })} 
                        />
                        
                        {formData.image && (
                            <div className="preview-container group">
                                <img src={formData.image} className="preview-image" alt="Preview" />
                                <button 
                                    type="button" 
                                    onClick={() => setFormData({ ...formData, image: '' })} 
                                    className="btn-remove-preview"
                                >
                                    X
                                </button>
                            </div>
                        )}
                        
                        <div className="manager-action-row">
                            <button type="submit" className="btn-save">
                                {editingId ? 'Update Product' : 'Save Product'}
                            </button>
                            {editingId && (
                                <button 
                                    type="button" 
                                    onClick={() => { 
                                        setEditingId(null); 
                                        setFormData({ name: '', price: '', description: '', category: '', image: '' }) 
                                    }} 
                                    className="btn-cancel-edit"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <div className="inventory-grid">
                {products.map(p => (
                    <div key={p._id} className="inventory-item-card group">
                        <div className="inventory-details">
                            <img src={p.image} className="inventory-thumb" alt={p.name} />
                            <div>
                                <p className="inventory-name">{p.name}</p>
                                <p className="inventory-price">{p.price} ETB</p>
                            </div>
                        </div>
                        <button onClick={() => startEdit(p)} className="btn-edit-float">
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminInput = ({ label, placeholder, type = "text", value, onChange }) => (
    <div>
        <label className="manager-label">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
            className="manager-input" 
        />
    </div>
);

export default ProductManager;