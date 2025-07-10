import React from 'react';
import { PiUserFocusDuotone } from 'react-icons/pi';
import { MdLocationOn } from 'react-icons/md';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { HiOutlineUser } from 'react-icons/hi';

const BottomNavigation = () => (
  <div className="flex justify-around items-center py-3 border-t border-gray-800 text-sm bg-black">
    <div className="flex flex-col items-center text-green-500 transition-transform hover:scale-110">
      <PiUserFocusDuotone size={20} />
      <span className="text-xs">Explore</span>
    </div>
    <div className="flex flex-col items-center hover:text-green-400 transition-colors">
      <MdLocationOn size={20} />
      <span className="text-xs">Events</span>
    </div>
    <div className="flex flex-col items-center hover:text-green-400 transition-colors">
      <IoChatbubblesOutline size={20} />
      <span className="text-xs">Chats</span>
    </div>
    <div className="flex flex-col items-center hover:text-green-400 transition-colors">
      <IoIosNotificationsOutline size={20} />
      <span className="text-xs">Notifications</span>
    </div>
    <div className="flex flex-col items-center hover:text-green-400 transition-colors">
      <HiOutlineUser size={20} />
      <span className="text-xs">Profile</span>
    </div>
  </div>
);

export default BottomNavigation;
