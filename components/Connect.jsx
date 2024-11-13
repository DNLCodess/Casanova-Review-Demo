"use client";

import { useState, useRef, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
import EmojiPicker from "emoji-picker-react";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Mock user data (in a real app, this would come from authentication)
const currentUser = {
  id: "1",
  name: "Current User",
  avatar: "/placeholder.svg?height=40&width=40",
};

const Chatroom = () => {
  const messagesRef = collection(db, "messages");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifSearch, setShowGifSearch] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Retrieve messages ordered by createdAt in ascending order
  useEffect(() => {
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      await addDoc(messagesRef, {
        text: newMessage,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  const handleFileUpload = (res) => {
    if (res && res[0]) {
      const newMessage = {
        id: Date.now().toString(),
        user: currentUser,
        content: "Sent an image",
        timestamp: new Date(),
        attachment: res[0].url,
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleGifSearch = async () => {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=YOUR_GIPHY_API_KEY&q=${gifSearchTerm}&limit=10`
    );
    const data = await response.json();
    setGifs(data.data.map((gif) => gif.images.fixed_height.url));
  };

  const handleGifSelect = (gifUrl) => {
    const newMessage = {
      id: Date.now().toString(),
      user: currentUser,
      content: "Sent a GIF",
      timestamp: new Date(),
      attachment: gifUrl,
    };
    setMessages([...messages, newMessage]);
    setShowGifSearch(false);
    setGifSearchTerm("");
    setGifs([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.userId === currentUser.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[70%] ${
                message.userId === currentUser.id
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <img
                src={message.userAvatar}
                alt={message.userName}
                className="w-10 h-10 rounded-full"
              />
              <div
                className={`p-3 rounded-lg ${
                  message.userId === currentUser.id
                    ? "bg-pink-600"
                    : "bg-gray-700"
                }`}
              >
                <p className="font-semibold">{message.userName}</p>
                <p>{message.text}</p>
                {message.attachment && (
                  <img
                    src={message.attachment}
                    alt="Attachment"
                    className="mt-2 rounded-lg max-w-full h-auto"
                  />
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {message.createdAt?.toDate().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-pink-500 hover:text-pink-600"
          >
            <Smile className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowGifSearch(!showGifSearch)}
            className="text-pink-500 hover:text-pink-600"
          >
            GIF
          </button>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={handleFileUpload}
            onUploadError={(error) => {
              console.error(error);
            }}
          >
            {({ onClick }) => (
              <button
                onClick={onClick}
                className="text-pink-500 hover:text-pink-600"
              >
                <Paperclip className="w-6 h-6" />
              </button>
            )}
          </UploadButton>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        {showGifSearch && (
          <div className="mb-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={gifSearchTerm}
                onChange={(e) => setGifSearchTerm(e.target.value)}
                placeholder="Search GIFs..."
                className="flex-1 p-2 rounded bg-gray-700 text-white"
              />
              <button
                onClick={handleGifSearch}
                className="p-2 bg-pink-600 rounded hover:bg-pink-700"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {gifs.map((gif, index) => (
                <img
                  key={index}
                  src={gif}
                  alt="GIF"
                  className="w-20 h-20 object-cover cursor-pointer rounded"
                  onClick={() => handleGifSelect(gif)}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded bg-gray-700 text-white"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-pink-600 rounded hover:bg-pink-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
