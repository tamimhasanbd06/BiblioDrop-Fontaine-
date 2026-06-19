"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BrowseBooksPage() {
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:8000/books");
        const data = await res.json();

        const safe = Array.isArray(data) ? data : [];
        setBooks(safe);
        setFiltered(safe);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let temp = [...books];

    if (search) {
      temp = temp.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      temp = temp.filter((b) => b.category === category);
    }

    setFiltered(temp);
  }, [search, category, books]);

  const goDetails = (id) => {
    if (!id) return;
    router.push(`/books/${id}`);
  };

  const categories = ["All", ...new Set(books.map((b) => b.category))];

  return (
    <div className="min-h-screen bg-blue-950 text-white p-6">

      <h1 className="text-3xl font-bold text-center text-blue-200 mb-6">
        📚 Browse Books
      </h1>

      {/* SEARCH + FILTER */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 mb-8">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="p-3 rounded-lg bg-blue-900 border border-blue-700"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-lg bg-blue-900 border border-blue-700"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-blue-300">Loading books...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-red-400">No books found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filtered.map((book) => (
            <div
              key={book._id}
              className="bg-blue-900/40 border border-blue-700 rounded-xl overflow-hidden hover:-translate-y-2 transition"
            >

              {/* IMAGE */}
              <img
                src={book.image}
                onClick={() => goDetails(book._id)}
                className="h-40 w-full object-cover cursor-pointer"
              />

              {/* CONTENT */}
              <div className="p-3">

                <h3 className="font-semibold text-sm truncate">
                  {book.title}
                </h3>

                <p className="text-xs text-blue-300">
                  {book.author}
                </p>

                <div className="flex justify-between mt-2 text-xs">
                  <span className="bg-blue-700 px-2 py-1 rounded-full">
                    {book.category}
                  </span>

                  <span>৳ {book.deliveryFee}</span>
                </div>

                {book.availabilityStatus !== "Available" && (
                  <p className="text-red-400 text-xs mt-2">
                    Unavailable
                  </p>
                )}

                {/* BUTTON */}
                <button
                  onClick={() => goDetails(book._id)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-xs py-2 rounded-lg"
                >
                  View Details
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}