import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';
import type Product from '../types.ts';

const limit = 8;

function ProductsContainer({ onAddToCart }: { onAddToCart: () => void }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const load = async() => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${(currentPage - 1) * limit}`);
                const data = await res.json();
                if (!res.ok) throw new Error('Failed to fetch products');
                console.log(data);
                setProducts(data.products);
                setTotal(data.total);
            }
            catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, [currentPage]);

    const totalPages = Math.ceil(total / limit);
    

    return (
        <div id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Our Products</h2>
            {loading && <p className="text-center text-lg font-medium text-slate-500 my-4">Loading...</p>}
            {error && <p className="text-center text-lg font-medium text-red-500 my-4">Error: {error}</p>}
            {products.length === 0 && !loading && !error && <p className="text-center text-lg font-medium text-red-500 my-4">No products found</p>}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row" >
                <button onClick={() => {setCurrentPage(currentPage - 1); window.scrollTo({top: 700, behavior: 'smooth' });} } disabled={currentPage === 1} className="cursor-pointer rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">previous</button>
                <p className="text-center text-sm font-medium text-slate-500">Page {currentPage} of {totalPages}</p>
                <button onClick={() => {setCurrentPage(currentPage + 1); window.scrollTo({top: 700, behavior: 'smooth' });} } disabled={currentPage === totalPages} className="cursor-pointer rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">next</button>
            </div>
        </div>
    );
}

export default ProductsContainer;