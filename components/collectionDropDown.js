import { useState, useEffect } from "react";

const CollectionsDropdown = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          "https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/categories/all"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }
        const data = await response.json();
        setCollections(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return <div className="px-4 py-2 text-sm text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="px-4 py-2 text-sm text-red-500">Error: {error}</div>;
  }

  return (
    <div
      className="absolute top-full left-0 bg-black w-max py-2"
      style={{
        zIndex: 9999,
        position: "absolute",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {collections.map((collection) => (
        <a
          key={collection.id || collection._id || collection.name}
          href={`/collection/${
            collection.id || collection._id || collection.name
          }`}
          className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
        >
          {collection.name}
        </a>
      ))}
    </div>
  );
};

export default CollectionsDropdown;
