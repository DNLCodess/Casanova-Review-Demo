// pages/api/media.js
import { storage } from "@/lib/firebaseConfig"; // Adjust the import path accordingly
import { ref, listAll, getDownloadURL } from "firebase/storage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const storageRef = ref(storage, "Home-Videos/"); // Specify the path to your files

    try {
      const resList = await listAll(storageRef);
      const urls = await Promise.all(
        resList.items.map((item) => getDownloadURL(item))
      );
      console.log("Fetched URLs:", urls);
      return res.status(200).json(urls); // Return the URLs
    } catch (error) {
      console.error("Error fetching files:", error);
      return res.status(500).json({ error: "Failed to fetch media." });
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ error: "Method not allowed." });
  }
}
