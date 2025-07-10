import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileInfo from './components/ProfileInfo';
import ActionButtons from './components/ActionButtons';
import BottomNavigation from './components/BottomNavigation';
import NoMoreProfiles from './components/NoMoreProfiles';

const API_BASE = 'https://facemash-86hr.onrender.com';


const App = () => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState('right');
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);
  const [profileReady, setProfileReady] = useState(false); // 👈 Disable buttons until ready

  const fetchNextProfile = async () => {
    setLoading(true);
    setNoMoreProfiles(false);
    setProfileReady(false);
    try {
      const response = await fetch(`${API_BASE}/api/next-profile`);
      const data = await response.json();
      if (response.ok) {
        setCurrentProfile(data);
      } else {
        console.error(data.error);
        setNoMoreProfiles(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const handleRateProfile = async (reaction) => {
    if (!profileReady || !currentProfile) return; // ❌ Block if not ready
    setDirection(reaction === 'like' ? 'right' : 'left');
    setProfileReady(false); // disable until next profile comes

    try {
      await fetch(`${API_BASE}/api/rate-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: currentProfile.profile_id, reaction }),
      });
      setTimeout(() => {
        fetchNextProfile();
      }, 300);
    } catch (error) {
      console.error('Error rating profile:', error);
    }
  };

  const handleResetSearch = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reset-search`, {
        method: 'POST',
      });
      const data = await res.json();
      console.log('Reset Response:', data);
      fetchNextProfile();
    } catch (error) {
      console.error('Error resetting search:', error);
    }
  };

  useEffect(() => {
    fetchNextProfile();
  }, []);

  if (loading && !currentProfile) {
    return <div className="text-white text-xl p-4">Loading...</div>;
  }

  const variants = {
    enter: (dir) => ({
      x: dir === 'right' ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: (dir) => ({
      x: dir === 'right' ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <div className="text-white min-h-screen flex bg-black items-center justify-center">
      <div>
        <div className="relative w-sm h-[90vh] bg-black rounded-lg shadow-lg overflow-hidden">
          {noMoreProfiles ? (
            <NoMoreProfiles onRefresh={handleResetSearch} />
          ) : (
            <>
              <AnimatePresence custom={direction} mode="wait">
                {currentProfile && (
                  <motion.div
                    key={currentProfile.profile_id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                    onAnimationComplete={() => setProfileReady(true)} // ✅ Enable buttons
                  >
                    <ProfileInfo
                      name={`${currentProfile.profile_id}`}
                      bio={currentProfile.interests.join(', ')}
                      university={currentProfile.university}
                      degree={currentProfile.degree}
                      year={currentProfile.year}
                      image={currentProfile.image}
                    />
                    <ActionButtons
                      onLike={() => handleRateProfile('like')}
                      onDislike={() => handleRateProfile('dislike')}
                      disabled={!profileReady}
                    />
                  </motion.div>
                )}

              </AnimatePresence>

              {/* ✅ Buttons stay fixed and only enabled when profile is fully shown */}

            </>
          )}
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default App;
