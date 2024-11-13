"use client";

import { useState, useRef, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
import EmojiPicker from "emoji-picker-react";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore();

const currentUser = {
  id: "1",
  name: "Current User",
  avatar: "/placeholder.svg?height=40&width=40",
};

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifSearch, setShowGifSearch] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const newMessage = {
        userId: currentUser.id,
        user: currentUser,
        content: inputMessage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      setInputMessage("");
      try {
        await db
          .collection("Groups")
          .doc("group1")
          .collection("Messages")
          .add(newMessage);
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleFileUpload = (res) => {
    if (res && res[0]) {
      const newMessage = {
        userId: currentUser.id,
        user: currentUser,
        content: "Sent an image",
        attachment: res[0].url,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      db.collection("Groups")
        .doc("group1")
        .collection("Messages")
        .add(newMessage);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setInputMessage((prevInput) => prevInput + emojiObject.emoji);
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
      userId: currentUser.id,
      user: currentUser,
      content: "Sent a GIF",
      attachment: gifUrl,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    db.collection("Groups")
      .doc("group1")
      .collection("Messages")
      .add(newMessage);
    setShowGifSearch(false);
    setGifSearchTerm("");
    setGifs([]);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("Groups")
      .doc("group1")
      .collection("Messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(newMessages);
      });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white md:w-[80%] mx-auto">
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
              className={`flex items-start space-x-2 max-w-[90%] sm:max-w-[80%] lg:max-w-[70%] ${
                message.userId === currentUser.id
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <img
                src={message.user.avatar}
                alt={message.user.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              />
              <div
                className={`p-3 rounded-lg ${
                  message.userId === currentUser.id
                    ? "bg-pink-600"
                    : "bg-gray-700"
                }`}
              >
                <p className="font-semibold text-sm sm:text-base">
                  {message.user.name}
                </p>
                <p className="text-xs sm:text-sm">{message.content}</p>
                {message.attachment && (
                  <img
                    src={message.attachment}
                    alt="Attachment"
                    className="mt-2 rounded-lg max-w-full h-auto"
                  />
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp &&
                    message.timestamp.toDate().toLocaleTimeString()}
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
            <Smile className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setShowGifSearch(!showGifSearch)}
            className="text-pink-500 hover:text-pink-600 text-xs sm:text-base"
          >
            GIF
          </button>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={handleFileUpload}
            onUploadError={(error) => console.error(error)}
          >
            {({ onClick }) => (
              <button
                onClick={onClick}
                className="text-pink-500 hover:text-pink-600"
              >
                <Paperclip className="w-5 h-5 sm:w-6 sm:h-6" />
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
                className="flex-1 p-2 rounded bg-gray-700 text-white text-sm sm:text-base"
              />
              <button
                onClick={handleGifSearch}
                className="p-2 bg-pink-600 rounded hover:bg-pink-700"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {gifs.map((gif, index) => (
                <img
                  key={index}
                  src={gif}
                  alt="GIF"
                  onClick={() => handleGifSelect(gif)}
                  className="w-20 h-20 rounded-lg cursor-pointer hover:opacity-80"
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-pink-600 rounded hover:bg-pink-700 ml-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
