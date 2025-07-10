// src/components/ProfileInfo.jsx
import React, { useState } from 'react';
import { MdSchool } from 'react-icons/md';

const ProfileInfo = ({ name, bio, university, degree, year, image }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden min-h-[80vh] bg-black">
      {/* 🔮 Matching Loader Overlay */}
      {!imgLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-center">
          <div className="text-white text-2xl animate-pulse mb-2">🔮 Finding your match...</div>
          <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Hidden image for load detection */}
      <img
        src={image}
        alt="profile preload"
        onLoad={() => setImgLoaded(true)}
        className="hidden"
      />

      {/* Main content with fade-in */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${image || 'https://via.placeholder.com/300x300'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-end">
          <span className="bg-white/10 backdrop-blur-sm text-xs w-fit px-2 py-1 rounded mb-2">
            Friend
          </span>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-2">{name}</h1>
              <p className="text-sm text-gray-300">{bio}</p>
              <div className="flex items-center text-sm text-gray-300 mt-1">
                <MdSchool className="mr-1" /> {university} · {degree}
              </div>
            </div>
            <div className="flex flex-col items-center rounded-xl overflow-hidden">
              <div className="bg-gray-400 w-full text-center px-3 py-1 text-xs font-semibold">
                Year
              </div>
              <div className="text-white text-3xl font-extrabold px-4.5 py-2 bg-white/10 backdrop-blur-sm">
                {year - 2025 + 4}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
