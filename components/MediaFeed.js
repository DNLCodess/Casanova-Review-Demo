// components/MediaFeed.js
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { useState, useEffect } from "react";

export default function MediaFeed() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const q = query(
        collection(firestore, "media"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const mediaItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMedia(mediaItems);
    };

    fetchMedia();
  }, []);

  return (
    <div className="media-feed">
      {media.map((item) => (
        <div key={item.id} className="media-item">
          {item.mediaType === "image" ? (
            <img src={item.url} alt="Uploaded" className="w-full" />
          ) : (
            <video src={item.url} controls className="w-full" />
          )}
          {/* Add like/comment functionality */}
        </div>
      ))}
    </div>
  );
}
