import React from 'react'
import { Link } from 'react-router'

const Navebar = () => {
    return (
        <nav className='py-10 shadow-2xl'>
            <div className="container  flex justify-between items-center">

                <Link className='text-3xl font-bold ' to={"/"}>EraaSoft</Link>
                <ul className='flex gap-3'>
                    <li>
                        <Link  className='text-lg font-bold hover:text-sky-600' to={"/"}>Home</Link>
                    </li>

                    <li>
                        <Link  className='text-lg font-bold hover:text-sky-600'  to={"/About"}>About</Link>
                    </li>
                    <li>
                        <Link  className='text-lg font-bold hover:text-sky-600'  to={"/Contant"}>Contact</Link>
                    </li>
                    <li>
                        <Link  className='text-lg font-bold hover:text-sky-600'  to={"/products"}>Products</Link>
                    </li>
                </ul>
            </div>

        </nav>
    )
}

export default Navebar
