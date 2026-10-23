import logo from '../assets/logo.svg'

function Hero() {
    return (
        <div className="flex flex-col items-center justify-center gap-10 bg-linear-to-b from-sky-50 via-white to-white px-4 py-16 text-center sm:px-6 lg:flex-row lg:px-20 lg:py-24 lg:text-left">
            <div className="max-w-xl lg:w-1/2 lg:pr-8">
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Welcome to Product Store</h1>
                <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-slate-600 lg:mx-0">Discover a wide range of products at unbeatable prices. Shop now and enjoy exclusive deals!</p>
                <button className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-sky-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 active:translate-y-0">Shop Now</button>
            </div>
            <div className="flex justify-center lg:mt-0 lg:w-1/2">
                <img src={logo} alt="Hero Image" className="h-64 w-64 drop-shadow-2xl transition-transform duration-300 hover:scale-105 sm:h-80 sm:w-80 lg:h-96 lg:w-96" />
            </div>
        </div>
    );
}
export default Hero;