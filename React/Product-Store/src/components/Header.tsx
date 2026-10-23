import logo from '../assets/logo.svg'

interface HeaderProps {
    cartCounter: number;
}

function Header({ cartCounter }: HeaderProps) {
    return (
        <>
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2.5">
                        <img src={logo} alt="logo" className="h-10 w-10 drop-shadow-sm" />
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Product Store</h1>
                    </div>
                    <p className="hidden text-sm font-medium tracking-wide text-slate-500 md:block">All your needs in one place</p>
                    <nav>
                        <ul className="flex items-center gap-1 sm:gap-2">
                            <li><a href="#" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">Home</a></li>
                            <li><a href="#products" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">Products</a></li>
                            <li><a href="#" className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-sky-600 hover:shadow-md"><img src={logo} alt="logo" className='h-5 w-5'/> Cart ({cartCounter})</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Header