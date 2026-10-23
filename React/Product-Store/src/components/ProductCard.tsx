import type Product from '../types.ts';


function ProductCard({ product, onAddToCart }: { product: Product, onAddToCart: () => void }) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-slate-200/70">
            <img src={product.thumbnail} alt={product.title} className="h-48 w-full bg-slate-100 object-cover transition-transform duration-500 group-hover:scale-105" />
            <h2 className="px-5 pt-5 text-lg font-semibold text-slate-900">{product.title}</h2>
            <p className="px-5 pt-1 text-sm leading-relaxed text-slate-500">{product.description}</p>
            <p className="px-5 pt-3 text-2xl font-extrabold tracking-tight text-slate-900">${product.price}</p>
            <p className="px-5 pb-5 pt-1 text-sm font-medium text-amber-500">Rating: {product.rating} / 5</p>
            <button onClick={onAddToCart} className="mx-5 mb-5 mt-auto cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">Add to Cart</button>
        </div>
    );
}

export default ProductCard;