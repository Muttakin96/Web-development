function Footer() {
    return (
        <div className="flex justify-between mt-20 px-20 p-5 border-t-2 border-black bg-slate-900 text-white">
            <div className="flex flex-col gap-5">
                <p>Info</p>
                <a href="#" className="hover:text-green-500 hover:border-b-2 hover:border-green-500">About</a>
                <a href="#" className="hover:text-green-500 hover:border-b-2 hover:border-green-500">Pricing</a>
                <a href="#" className="hover:text-green-500 hover:border-b-2 hover:border-green-500">Contacts</a>
            </div>
            <div className="flex flex-col gap-5">
                <h4>Technologies</h4>
                <img src="/src/assets/technologies.png" alt="" />
            </div>
        </div>
    )
}

export default Footer