"use client";
import { useEffect, useState } from "react";

interface Abstract {
  transaction_id: string;
  first_name: string;
  last_name: string;
  abstract_title: string;
  abstract_category: string;
  keywords: string;
  file_name: string;
  file_type: string;
  file_size_kb: number;
  created_at: string;
}

export default function AbstractList() {
  const [abstracts, setAbstracts] = useState<Abstract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/abstract")
      .then((res) => res.json())
      .then((data) => {
        if (data.abstracts) setAbstracts(data.abstracts);
        else setError("No abstracts found");
      })
      .catch(() => setError("Failed to fetch abstracts"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading abstracts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-4">
      {abstracts.map((a) => (
        <div
          key={a.transaction_id}
          className="border p-4 rounded flex justify-between items-start"
        >
          <div>
            <p>
              <strong>{a.first_name} {a.last_name}</strong> ({a.transaction_id})
            </p>
            <p><strong>Title:</strong> {a.abstract_title}</p>
            <p><strong>Category:</strong> {a.abstract_category}</p>
            <p><strong>Keywords:</strong> {a.keywords}</p>
            <p>
              <strong>File:</strong> {a.file_name} ({a.file_type}, {a.file_size_kb} KB)
            </p>
            <p><strong>Submitted:</strong> {new Date(a.created_at).toLocaleString()}</p>
          </div>

          <div className="ml-4">
            <a
              href={`/api/abstract/${a.transaction_id}`}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
