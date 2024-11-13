"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  User,
  Bookmark,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from "lucide-react";
import { BsSend } from "react-icons/bs";
import { storage, auth } from "/lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="loader"></div>
  </div>
);

export default function SocialMediaReel() {
  const [reels, setReels] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      setLoading(true);
      const reelsRef = ref(storage, "Reel-Images");
      const reelsList = await listAll(reelsRef);
      const reelsData = await Promise.all(
        reelsList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            id: item.name,
            user: `user${Math.floor(Math.random() * 1000)}`,
            video: url,
            likes: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 500),
          };
        })
      );
      setReels(reelsData);
      setLoading(false);
    };

    fetchReels();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = (id) => {
    console.log("Liked reel:", id);
  };

  const handleComment = () => {
    if (user && user.emailVerified) {
      console.log("User can comment");
    } else {
      alert("Only verified users can comment. Please verify your email.");
    }
  };

  return (
    <div className="bg-none text-white relative">
      {loading ? (
        <Loader />
      ) : (
        reels.map((reel) => (
          <div key={reel.id} className="flex justify-center relative my-10">
            {/* Container for reel and interactive icons */}
            <div className="relative w-[85%] flex items-center">
              {/* Reels Div */}
              <div className="relative h-[700px] shadow-custom-white rounded-2xl w-full snap-start overflow-hidden flex flex-col justify-center items-center">
                {/* Top Text Banner */}
                <div className="absolute top-4 w-full text-center px-4">
                  <p className="text-white text-lg font-bold bg-black bg-opacity-60 px-3 py-2 rounded-lg">
                    After completing the internship and the manager says, "You
                    can stay as a permanent employee."
                  </p>
                </div>

                {/* Background Video */}
                <div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url(${reel.video})` }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>

                {/* Bottom User Information */}
                <div className="absolute bottom-5 left-4 z-20 flex items-center space-x-2 bg-black bg-opacity-60 px-3 py-2 rounded-lg">
                  <User className="h-8 w-8 rounded-full border-2 border-white" />
                  <div className="text-sm">
                    <p className="font-semibold">{reel.user}</p>
                    <p className="text-xs opacity-80">@username</p>
                  </div>
                </div>
              </div>

              {/* Interactive Icons Beside Reels */}
              <div className="absolute right-[-60px] bottom-1/2 transform translate-y-1/2 flex flex-col items-center space-y-6 z-20">
                {/* Profile Icon */}

                <button
                  onClick={() => handleLike(reel.id)}
                  className="text-pink-500 hover:text-pink-600"
                >
                  <Heart className="h-8 w-8" />
                  <span className="text-xs">{reel.likes}</span>
                </button>
                <button
                  onClick={handleComment}
                  className="text-white hover:text-gray-300"
                >
                  <MessageCircle className="h-8 w-8" />
                  <span className="text-xs">{reel.comments}</span>
                </button>
                <button className="text-white hover:text-gray-300">
                  <Bookmark className="h-8 w-8" />
                </button>
                <div className="group relative">
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 hidden group-hover:flex flex-col space-y-1 p-2 bg-white rounded-md shadow-md">
                    <Facebook className="h-5 w-5 text-blue-600 cursor-pointer" />
                    <Instagram className="h-5 w-5 text-pink-500 cursor-pointer" />
                    <Twitter className="h-5 w-5 text-blue-400 cursor-pointer" />
                    <Send className="h-5 w-5 text-green-500 cursor-pointer" />
                  </div>
                  <button className="text-white hover:text-gray-300">
                    <BsSend className="h-8 w-8" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
