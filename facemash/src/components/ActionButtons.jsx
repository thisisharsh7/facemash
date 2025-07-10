// src/components/ActionButtons.jsx
import React from 'react';

const ActionButtons = ({ onLike, onDislike }) => (
  <div className="flex justify-between gap-4 font-bold px-4 my-4 transition-opacity duration-300">
    <button
      className="w-1/2 py-2 cursor-pointer rounded text-white hover:bg-white hover:text-black transition-colors duration-300"
      onClick={onDislike}
    >
      Dislike
    </button>
    <button
      className="w-1/2 py-2 cursor-pointer bg-[#1BEA7B] rounded text-black hover:bg-green-400 transition-colors duration-300"
      onClick={onLike}
    >
      Like
    </button>
  </div>
);

export default ActionButtons;