import {Link} from 'react-router-dom'

export default function Navbar() {
    return (
        <div className="navbar flex justify-between items-center py-3 mb-8 mx-auto w-full max-w-7xl">
            <h1 className="text-3xl font-bold">ReGain</h1>
            <ul className="flex gap-5 text-lg">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/graph">Graph Mode</Link></li>
                <li><Link to="/map">Map Mode</Link></li>
            </ul>
        </div>
    );
}