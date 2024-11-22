"use client";

import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore();

const currentUser = {
  id: "1",
  name: "Current User",
  avatar: "/placeholder.svg?height=40&width=40",
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentInput, setCommentInput] = useState({}); // Store comments for each post

  // Fetch posts from Firestore
  useEffect(() => {
    const unsubscribe = db
      .collection("Posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      });

    return () => unsubscribe();
  }, []);

  // Add a new post
  const handleAddPost = async () => {
    if (newPost.trim() === "") return;

    const post = {
      userId: currentUser.id,
      user: currentUser,
      content: newPost,
      likes: 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await db.collection("Posts").add(post);
      setNewPost("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Like a post
  const handleLikePost = async (postId, currentLikes) => {
    try {
      await db
        .collection("Posts")
        .doc(postId)
        .update({
          likes: currentLikes + 1,
        });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Add a comment to a post
  const handleAddComment = async (postId) => {
    const comment = commentInput[postId]?.trim();
    if (!comment) return;

    const newComment = {
      userId: currentUser.id,
      user: currentUser,
      content: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await db
        .collection("Posts")
        .doc(postId)
        .collection("Comments")
        .add(newComment);

      setCommentInput((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white md:w-[80%] mx-auto">
      {/* New Post Section */}
      <div className="p-4 bg-gray-800">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Create a new post..."
          className="w-full p-2 rounded bg-gray-700 text-white"
        ></textarea>
        <button
          onClick={handleAddPost}
          className="mt-2 p-2 bg-pink-600 rounded hover:bg-pink-700"
        >
          Post
        </button>
      </div>

      {/* Posts Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-gray-800 rounded">
            {/* Post Content */}
            <div className="flex items-start space-x-2">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{post.user.name}</p>
                <p className="text-sm">{post.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {post.timestamp && post.timestamp.toDate().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Like Button */}
            <div className="mt-2 flex items-center space-x-4">
              <button
                onClick={() => handleLikePost(post.id, post.likes)}
                className="text-pink-500 hover:text-pink-600"
              >
                ❤️ {post.likes}
              </button>
            </div>

            {/* Comment Section */}
            <div className="mt-4">
              <textarea
                value={commentInput[post.id] || ""}
                onChange={(e) =>
                  setCommentInput((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
                placeholder="Write a comment..."
                className="w-full p-2 rounded bg-gray-700 text-white"
              ></textarea>
              <button
                onClick={() => handleAddComment(post.id)}
                className="mt-2 p-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
