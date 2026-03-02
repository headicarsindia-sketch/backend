"use client";

import { useEffect, useState } from "react";

interface ProofLink {
  id: number;
  url: string;
}

interface Nomination {
  id: number;
  nominee_name: string;
  organisation: string;
  designation: string;
  transaction_id: string;

  aadhaar?: string;
  pan?: string;
  achievement_writeup: string;
  status: string;
  created_at: string;

  awardPillar?: {
    id: number;
    name: string;
  };

  category?: {
    id: number;
    name: string;
  };

  focus_area?: {
    id: number;
    name: string;
  };

  proof_links?: ProofLink[];
}
export default function AllNominationsPage() {
  const [data, setData] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  // Typed fetch function for nominations
  const fetchNominations = async (): Promise<Nomination[]> => {
    const res = await fetch("/api/award/nominations", { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch nominations");
    }

    const data: Nomination[] = await res.json();
    return data;
  };

  const getData = async () => {
    try {
      const result = await fetchNominations();
      setData(result); // Type-safe assignment
    } catch (err: any) {
      console.error(err);
      setError("Unable to load nominations.");
    } finally {
      setLoading(false);
    }
  };

  getData();
}, []);
  const handleDownload = (id: number) => {
     window.open(
      `/api/award/nomination/${id}?download=true`,
      "_blank"
    );
  };

  if (loading)
    return <div className="p-6 text-black">Loading nominations...</div>;

  if (error)
    return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">
        All Nominations
      </h1>

      {data.length === 0 ? (
        <div>No nominations found.</div>
      ) : (
    <div className="overflow-x-auto bg-white shadow rounded">
  <table className="min-w-full border border-gray-300">
    
    {/* ✅ HEADER */}
    <thead className="bg-gray-100">
      <tr className="text-left">
        <th className="p-3 border">ID</th>
        <th className="p-3 border">Nominee</th>
        <th className="p-3 border">Organisation</th>
        <th className="p-3 border">Pillar</th>
        <th className="p-3 border">Category</th>
        <th className="p-3 border">Focus Area</th>
        <th className="p-3 border">Status</th>
        <th className="p-3 border">Proof Links</th>
        <th className="p-3 border text-center">Action</th>
      </tr>
    </thead>

    {/* ✅ BODY */}
    <tbody>
      {data.map((item) => (
        <tr key={item.id} className="hover:bg-gray-50 align-top">
          <td className="p-3 border">{item.id}</td>

          <td className="p-3 border">
            <div className="font-semibold">{item.nominee_name}</div>
            <div className="text-sm text-gray-600">
              {item.designation}
            </div>
          </td>

          <td className="p-3 border">{item.organisation}</td>

          <td className="p-3 border">
            {item.awardPillar?.name || "-"}
          </td>

          <td className="p-3 border">
            {item.category?.name || "-"}
          </td>

          <td className="p-3 border">
            {item.focus_area?.name || "-"}
          </td>

          <td className="p-3 border">
            {item.status}
          </td>

          <td className="p-3 border">
            {item.proof_links?.length ? (
              <ul className="list-disc ml-4 text-blue-600">
                {item.proof_links.map((proof) => (
                  <li key={proof.id}>
                    <a
                      href={proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              "No proofs"
            )}
          </td>

          <td className="p-3 border text-center">
            <button
              onClick={() => handleDownload(item.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            >
              Download
            </button>
          </td>
        </tr>
      ))}
    </tbody>

  </table>
</div>
      )}
    </div>
  );
}
