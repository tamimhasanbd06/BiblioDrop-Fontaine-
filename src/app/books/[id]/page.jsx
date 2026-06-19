"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:8000/books/${id}`);
        const data = await res.json();

        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center text-blue-300">
        Loading book details...
      </div>
    );
  }

  if (!book || book.error) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center text-red-400">
        Book not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-950 text-white p-6">

      <div className="max-w-6xl mx-auto bg-blue-900/40 border border-blue-700 rounded-2xl p-6">

        <div className="grid md:grid-cols-2 gap-8">

          <img
            src={book.image}
            className="w-full h-[420px] object-cover rounded-xl"
          />

          <div>

            <h1 className="text-3xl font-bold text-blue-200">
              {book.title}
            </h1>

            <p className="text-blue-300 mt-1">
              by {book.author}
            </p>

            <p className="text-sm mt-4 text-blue-200">
              {book.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 text-xs">

              <span className="bg-blue-700 px-3 py-1 rounded-full">
                {book.category}
              </span>

              <span className="bg-blue-700 px-3 py-1 rounded-full">
                {book.language}
              </span>

              <span className="bg-blue-700 px-3 py-1 rounded-full">
                {book.publisher}
              </span>

              <span className="bg-blue-700 px-3 py-1 rounded-full">
                ISBN: {book.isbn}
              </span>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 text-sm">

              <div className="bg-blue-800/40 p-3 rounded-lg">
                📄 Pages: <b>{book.pages}</b>
              </div>

              <div className="bg-blue-800/40 p-3 rounded-lg">
                ⭐ Rating: <b>{book.rating}</b>
              </div>

              <div className="bg-blue-800/40 p-3 rounded-lg">
                💬 Reviews: <b>{book.totalReviews}</b>
              </div>

              <div className="bg-blue-800/40 p-3 rounded-lg">
                🚚 Deliveries: <b>{book.totalDeliveries}</b>
              </div>

            </div>

            <div className="mt-6 flex justify-between items-center">

              <span className="text-green-300 font-bold">
                ৳ {book.deliveryFee}
              </span>

              <span className={`px-3 py-1 rounded-full text-xs ${
                book.availabilityStatus === "Available"
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}>
                {book.availabilityStatus}
              </span>

            </div>

            <button
              disabled={book.availabilityStatus !== "Available"}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
            >
              Request Delivery
            </button>

          </div>
        </div>

        <div className="mt-10 border-t border-blue-700 pt-6 flex items-center gap-4">

          <img
            src={book.ownerPhoto}
            className="w-14 h-14 rounded-full"
          />

          <div>
            <p className="text-blue-200 font-semibold">
              {book.ownerName}
            </p>
            <p className="text-xs text-blue-300">
              {book.ownerEmail}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}