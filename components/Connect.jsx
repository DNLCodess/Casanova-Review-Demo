"use client";

import { useState } from "react";

const currentUser = {
  id: "1",
  name: "Current User",
  avatar: "/placeholder.svg?height=40&width=40",
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentInput, setCommentInput] = useState({});

  // Add a new post
  const handleAddPost = () => {
    if (newPost.trim() === "") return;

    const post = {
      id: `${Date.now()}`, // Use timestamp as a unique ID
      userId: currentUser.id,
      user: currentUser,
      content: newPost,
      likes: 0,
      comments: [], // Placeholder for comments
      timestamp: new Date().toLocaleString(),
    };

    setPosts((prevPosts) => [post, ...prevPosts]);
    setNewPost("");
  };

  // Like a post
  const handleLikePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // Add a comment to a post
  const handleAddComment = (postId) => {
    const comment = commentInput[postId]?.trim();
    if (!comment) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `${Date.now()}`, // Use timestamp as comment ID
                  userId: currentUser.id,
                  user: currentUser,
                  content: comment,
                  timestamp: new Date().toLocaleString(),
                },
              ],
            }
          : post
      )
    );

    setCommentInput((prev) => ({ ...prev, [postId]: "" }));
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
                <p className="text-xs text-gray-400 mt-1">{post.timestamp}</p>
              </div>
            </div>

            {/* Like Button */}
            <div className="mt-2 flex items-center space-x-4">
              <button
                onClick={() => handleLikePost(post.id)}
                className="text-pink-500 hover:text-pink-600"
              >
                ❤️ {post.likes}
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-2 bg-gray-700 rounded mb-2 text-sm"
                >
                  <p className="font-semibold">{comment.user.name}</p>
                  <p>{comment.content}</p>
                  <p className="text-xs text-gray-400">{comment.timestamp}</p>
                </div>
              ))}
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
