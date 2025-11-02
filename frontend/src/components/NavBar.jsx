import {Link} from 'react-router-dom'

export default function Navbar() {
    return (
        <div className="navbar flex justify-between items-center py-3 mb-8 mx-auto w-full max-w-7xl no-underline">
            <h1 className="font-bold text-xl md:text-3xl no-underline">ReGain</h1>
            <ul className="flex gap-4 md:gap-5 text-lg ">
                <li><Link to="/home" className="no-underline">Home</Link></li>
                <li><Link to="/graph" className="no-underline">Graph Mode</Link></li>
                <li><Link to="/map" className="no-underline">Map Mode</Link></li>
            </ul>
        </div>
    );
}