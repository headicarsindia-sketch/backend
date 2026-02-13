"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface RegisteredUser {
  transaction_id: string;
  delegate_type: string;
  salutation?: string;
  first_name: string;
  last_name: string;
  gender?: string;
  affiliation?: string;
  email: string;
  contact_no?: string;
  city?: string;
  postal_code?: string;
  category?: string;
  registration_fee_type?: string;
  amount: string;
  payment_mode?: string;
  transaction_date?: string | object;
  abstract_submitted: boolean;
  created_at?: string | object;
  updated_at?: string | object;
}

export default function AllRegisteredUsersPage() {
  const [data, setData] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
             const res = await fetch("/api/registered");

        if (!res.ok) throw new Error("Failed to fetch registered users");

        let result = await res.json();
        // Flatten array if backend returns [[...]]
        if (Array.isArray(result) && Array.isArray(result[0])) result = result[0];

        setData(result);
      } catch (err) {
        console.error(err);
        setError("Unable to load registered users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const formatDate = (date: string | object | undefined) => {
    if (!date || typeof date === "object") return "-";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  const handleExportExcel = () => {
    const formattedData = data.map((user) => ({
      ...user,
      transaction_date: formatDate(user.transaction_date),
      created_at: formatDate(user.created_at),
      updated_at: formatDate(user.updated_at),
      abstract_submitted: user.abstract_submitted ? "Yes" : "No",
      name: `${user.salutation ? user.salutation + " " : ""}${user.first_name} ${user.last_name}`,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RegisteredUsers");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "RegisteredUsers.xlsx");
  };

  if (loading) return <div className="p-6">Loading registered users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">All Registered Users</h1>

      {data.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <>
          <button
            onClick={handleExportExcel}
            className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>

          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-3 border">Transaction ID</th>
                  <th className="p-3 border">Delegate Type</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Gender</th>
                  <th className="p-3 border">Affiliation</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Contact No</th>
                  <th className="p-3 border">City</th>
                  <th className="p-3 border">Postal Code</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Fee Type</th>
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">Payment Mode</th>
                  <th className="p-3 border">Transaction Date</th>
                  <th className="p-3 border">Abstract Submitted</th>
                  <th className="p-3 border">Created At</th>
                  <th className="p-3 border">Updated At</th>
                </tr>
              </thead>

              <tbody>
                {data.map((user) => (
                  <tr key={user.transaction_id} className="hover:bg-gray-50">
                    <td className="p-3 border">{user.transaction_id}</td>
                    <td className="p-3 border">{user.delegate_type}</td>
                    <td className="p-3 border">
                      {user.salutation ? user.salutation + " " : ""}
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-3 border">{user.gender ?? "-"}</td>
                    <td className="p-3 border">{user.affiliation ?? "-"}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.contact_no ?? "-"}</td>
                    <td className="p-3 border">{user.city ?? "-"}</td>
                    <td className="p-3 border">{user.postal_code ?? "-"}</td>
                    <td className="p-3 border">{user.category ?? "-"}</td>
                    <td className="p-3 border">{user.registration_fee_type ?? "-"}</td>
                    <td className="p-3 border">{user.amount}</td>
                    <td className="p-3 border">{user.payment_mode ?? "-"}</td>
                    <td className="p-3 border">{formatDate(user.transaction_date)}</td>
                    <td className="p-3 border">{user.abstract_submitted ? "Yes" : "No"}</td>
                    <td className="p-3 border">{formatDate(user.created_at)}</td>
                    <td className="p-3 border">{formatDate(user.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
