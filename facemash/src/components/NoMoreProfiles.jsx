import React from 'react';

const NoMoreProfiles = ({ onRefresh }) => (


    <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v1m0 14v1m8.485-8.485l-.707.707M4.222 4.222l-.707.707m15.263 0l.707.707M4.222 19.778l.707-.707M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
        </svg>
        <p className="text-lg text-white font-semibold mb-2">No more profiles</p>
        <p className="text-gray-400 mb-4">You've reached the end. Want to start over?</p>
        <button
            onClick={onRefresh}
            className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition"
        >
            Start Search Again
        </button>
    </div>
);


export default NoMoreProfiles;