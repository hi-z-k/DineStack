const ProductManager = ({ products, editingId, formData, setFormData, handleSubmitProduct, handleImageUpload, startEdit, setEditingId }) => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black italic uppercase mb-8">{editingId ? 'Edit Product' : 'Add New Menu Item'}</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmitProduct}>
                    <div className="space-y-6">
                        <AdminInput label="Food Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <AdminInput label="Price (ETB)" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            <AdminInput label="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Image Upload (Local)</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <textarea className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none h-32" placeholder="Description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        {formData.image && (
                            <div className="relative w-24 h-24 group">
                                <img src={formData.image} className="w-full h-full rounded-2xl object-cover border-2 border-orange-500" alt="Preview" />
                                <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-[8px]">X</button>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <button type="submit" className="flex-1 bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-orange-500 transition-all">
                                {editingId ? 'Update Product' : 'Save Product'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', price: '', description: '', category: '', image: '' }) }} className="px-6 bg-gray-100 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                    <div key={p._id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between group shadow-sm">
                        <div className="flex items-center gap-4">
                            <img src={p.image} className="w-12 h-12 rounded-full object-cover border" alt="" />
                            <div>
                                <p className="font-black text-[11px] uppercase truncate w-32">{p.name}</p>
                                <p className="text-[10px] text-orange-500 font-bold font-mono">{p.price} ETB</p>
                            </div>
                        </div>
                        <button onClick={() => startEdit(p)} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminInput = ({ label, placeholder, type = "text", value, onChange }) => (
    <div>
        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">{label}</label>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-100" />
    </div>
);

export default ProductManager;