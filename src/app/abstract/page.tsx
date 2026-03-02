
"use client";
import { useEffect, useState } from "react";

interface Abstract {
  registration_id: string;
  full_name_with_salutation: string;
  abstract_type: string;
  delegate_category: string;
  keywords: string;
  upload_abstract_name: string;
  upload_abstract_type: string;
  submission_date: string;
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
          key={a.registration_id}
          className="border p-4 rounded flex justify-between items-start"
        >
          <div>
            <p>
              <strong>{a.full_name_with_salutation}</strong> ({a.registration_id})
            </p>

            <p><strong>Type:</strong> {a.abstract_type}</p>
            <p><strong>Category:</strong> {a.delegate_category}</p>
            <p><strong>Keywords:</strong> {a.keywords}</p>

            <p>
              <strong>File:</strong> {a.upload_abstract_name} ({a.upload_abstract_type})
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(a.submission_date).toLocaleString()}
            </p>
          </div>

          <div className="ml-4">
            <a
              href={`/api/abstract/${a.registration_id}`}
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