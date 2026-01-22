function Hero() {
    return (
        <section className="bg-slate-900 text-white px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
        
        {/* Left content */}
        <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Discover Quality <br />
            Products for <span className="text-green-400">Everyday Life</span>
            </h1>

            <p className="text-gray-300 mt-5">
            Shop the latest collections with trusted quality, fast delivery,
            and seamless checkout experience.
            </p>

            <div className="mt-8 flex gap-4">
            <button className="bg-green-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-green-300 transition">
                Shop Now
            </button>
            <button className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
                Explore
            </button>
            </div>
        </div>
        <img src="/src/assets/hero.png" alt="" className="w-[650px] absolute -right-60 bottom-0" />

        </section>
    )
}

export default Hero