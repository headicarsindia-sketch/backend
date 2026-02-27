// "use client";

// import { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// interface RegisteredUser {
//   transaction_id: string;
//   delegate_type: string;
//   salutation?: string;
//   first_name: string;
//   last_name: string;
//   gender?: string;
//   affiliation?: string;
//   email: string;
//   contact_no?: string;
//   city?: string;
//   postal_code?: string;
//   category?: string;
//   sub_category?: string;
//   registration_fee_type?: string;
//   amount: string;
//   payment_mode?: string;
//   transaction_date?: string | object;
//   abstract_submitted: boolean;
//   created_at?: string | object;
//   updated_at?: string | object;
// }

// export default function AllRegisteredUsersPage() {
//   const [data, setData] = useState<RegisteredUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
// const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
// const categories = [
//   "all",
//   ...Array.from(new Set(data.map((u) => u.category).filter(Boolean))),
// ];

// const subCategories = [
//   "all",
//   ...Array.from(new Set(data.map((u) => u.sub_category).filter(Boolean))),
// ];
// const filteredData = data.filter((user) => {
//   const categoryMatch =
//     selectedCategory === "all" || user.category === selectedCategory;

//   const subCategoryMatch =
//     selectedSubCategory === "all" ||
//     user.sub_category === selectedSubCategory;

//   return categoryMatch && subCategoryMatch;
// });
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//              const res = await fetch("/api/registered");

//         if (!res.ok) throw new Error("Failed to fetch registered users");

//         let result = await res.json();
//         // Flatten array if backend returns [[...]]
//         if (Array.isArray(result) && Array.isArray(result[0])) result = result[0];

//         setData(result);
//       } catch (err) {
//         console.error(err);
//         setError("Unable to load registered users.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const formatDate = (date: string | object | undefined) => {
//     if (!date || typeof date === "object") return "-";
//     const d = new Date(date);
//     return isNaN(d.getTime()) ? "-" : d.toLocaleString();
//   };

//   const handleExportExcel = () => {
//    const formattedData = filteredData.map((user) => ({
//       ...user,
//       transaction_date: formatDate(user.transaction_date),
//       created_at: formatDate(user.created_at),
//       updated_at: formatDate(user.updated_at),
//       abstract_submitted: user.abstract_submitted ? "Yes" : "No",
//       name: `${user.salutation ? user.salutation + " " : ""}${user.first_name} ${user.last_name}`,
//     }));

//     const ws = XLSX.utils.json_to_sheet(formattedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "RegisteredUsers");
//     const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([buf]), "RegisteredUsers.xlsx");
//   };

//   if (loading) return <div className="p-6">Loading registered users...</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;

//   return (
//     <div className="p-8 text-black">
//       <h1 className="text-2xl font-bold mb-6">All Registered Users</h1>

//       {data.length === 0 ? (
//         <div>No users found.</div>
//       ) : (
//         <>
//         <div className="flex gap-4 mb-4">
//   <select
//     value={selectedCategory}
//     onChange={(e) => setSelectedCategory(e.target.value)}
//     className="border p-2 rounded"
//   >
//     {categories.map((cat) => (
//       <option key={cat} value={cat}>
//         {cat === "all" ? "All Categories" : cat}
//       </option>
//     ))}
//   </select>

//   <select
//     value={selectedSubCategory}
//     onChange={(e) => setSelectedSubCategory(e.target.value)}
//     className="border p-2 rounded"
//   >
//     {subCategories.map((sub) => (
//       <option key={sub} value={sub}>
//         {sub === "all" ? "All Sub Categories" : sub}
//       </option>
//     ))}
//   </select>
// </div>
//           <button
//             onClick={handleExportExcel}
//             className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//           >
//             Export to Excel
//           </button>

//           <div className="overflow-x-auto bg-white shadow rounded">
//             <table className="min-w-full border border-gray-300 text-sm">
//               <thead className="bg-gray-100">
//                 <tr className="text-left">
//                   <th className="p-3 border">Transaction ID</th>
//                   <th className="p-3 border">Delegate Type</th>
//                   <th className="p-3 border">Name</th>
//                   <th className="p-3 border">Gender</th>
//                   <th className="p-3 border">Affiliation</th>
//                   <th className="p-3 border">Email</th>
//                   <th className="p-3 border">Contact No</th>
//                   <th className="p-3 border">City</th>
//                   <th className="p-3 border">Postal Code</th>
//                   <th className="p-3 border">Category</th>
//                  <th className="p-3 border">Sub category</th>
//                   <th className="p-3 border">Amount</th>
//                   <th className="p-3 border">Payment Mode</th>
//                   <th className="p-3 border">Transaction Date</th>
//                   <th className="p-3 border">Abstract Submitted</th>
            
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.map((user) => (
//                   <tr key={user.transaction_id} className="hover:bg-gray-50">
//                     <td className="p-3 border">{user.transaction_id}</td>
//                     <td className="p-3 border">{user.delegate_type}</td>
//                     <td className="p-3 border">
//                       {user.salutation ? user.salutation + " " : ""}
//                       {user.first_name} {user.last_name}
//                     </td>
//                     <td className="p-3 border">{user.gender ?? "-"}</td>
//                     <td className="p-3 border">{user.affiliation ?? "-"}</td>
//                     <td className="p-3 border">{user.email}</td>
//                     <td className="p-3 border">{user.contact_no ?? "-"}</td>
//                     <td className="p-3 border">{user.city ?? "-"}</td>
//                     <td className="p-3 border">{user.postal_code ?? "-"}</td>
//                     <td className="p-3 border">{user.category ?? "-"}</td>
//                     <td className="p-3 border">{user.sub_category ?? "-"}</td>
//                     <td className="p-3 border">{user.amount}</td>
//                     <td className="p-3 border">{user.payment_mode ?? "-"}</td>
//                     <td className="p-3 border">{formatDate(user.transaction_date)}</td>
//                     <td className="p-3 border">{user.abstract_submitted ? "Yes" : "No"}</td>
                   
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useMemo } from "react";
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
  sub_category?: string;
  registration_fee_type?: string;
  amount: string;
  payment_mode?: string;
  transaction_date?: string | null;
  abstract_submitted: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

/* =========================================
   ✅ 10 STATIC FRONTEND CATEGORIES
========================================= */

const STATIC_CATEGORIES = [
  "Industry/PSU Delegates(IPD)",
  "Central/State Government(GOV)",
  "Civil Society/ NFPOs(CSN)",
  "Student Delegate (STD)",
  "Academic & Research Delegates(ARD)",
  "School Delegation - Group of 5 including 4 students & 1 Teacher (SDN)",
  "Student Delegate (STD)-(IIT-Roorkee Delegate)",
  "Industry/PSU Delegates(IPD)-(IIT-Roorkee Delegate)",
  "Central/State Government(GOV)-(IIT-Roorkee Delegate)",
  "Civil Society/ NFPOs(CSN)-(IIT-Roorkee Delegate)",
  "School Delegation - Group of 5 including 4 students & 1 Teacher (SDN)-(IIT Roorkee Delegate)",
  "Academic & Research Delegates(ARD)-(IIT-Roorkee Delegate)",
];
const STATIC_SUBCATEGORIES = [
  "Climate & Sustainability(CS)",
  "Industry & Safety Symposium(IS)",
  "Climate & Sustainability + Industry & Safety Symposium (CS+IS)",
];
/* =========================================
   ✅ CATEGORY MAPPING FUNCTION
========================================= */

const normalizeCategory = (backendCategory?: string) => {
  if (!backendCategory) return "";

  const value = backendCategory.toLowerCase().trim();
  const isIIT = value.includes("iit");

  if (value.includes("industry") || value.includes("psu")) {
    return isIIT
      ? "Industry/PSU Delegates(IPD)-(IIT-Roorkee Delegate)"
      : "Industry/PSU Delegates(IPD)";
  }

  if (value.includes("government") || value.includes("gov")) {
    return isIIT
      ? "Central/State Government(GOV)-(IIT-Roorkee Delegate)"
      : "Central/State Government(GOV)";
  }

  if (value.includes("civil") || value.includes("nfpo")) {
    return isIIT
      ? "Civil Society/ NFPOs(CSN)-(IIT-Roorkee Delegate)"
      : "Civil Society/ NFPOs(CSN)";
  }

  if (value.includes("student")) {
    return isIIT
      ? "Student Delegate (STD)-(IIT-Roorkee Delegate)"
      : "Student Delegate (STD)";
  }

  if (value.includes("academic") || value.includes("research")) {
    return isIIT
      ? "Academic & Research Delegates(ARD)-(IIT-Roorkee Delegate)"
      : "Academic & Research Delegates(ARD)";
  }

  if (value.includes("school")) {
    return isIIT
      ? "School Delegation - Group of 5 including 4 students & 1 Teacher (SDN)-(IIT Roorkee Delegate)"
      : "School Delegation - Group of 5 including 4 students & 1 Teacher (SDN)";
  }

  return "";
};
const normalizeSubCategory = (backendSub?: string) => {
  if (!backendSub) return "";

  const value = backendSub.toLowerCase();

  if (value.includes("cs+is"))
    return "Climate & Sustainability + Industry & Safety Symposium (CS+IS)";

  if (value.includes("climate"))
    return "Climate & Sustainability(CS)";

  if (value.includes("industry") || value.includes("safety"))
    return "Industry & Safety Symposium(IS)";

  return "";
};

export default function AllRegisteredUsersPage() {
  const [data, setData] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<string>("all");

  /* =========================================
     ✅ Fetch Data
  ========================================= */

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/registered");
        if (!res.ok) throw new Error("Failed to fetch registered users");

        let result = await res.json();
        if (Array.isArray(result) && Array.isArray(result[0]))
          result = result[0];

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

  /* =========================================
     ✅ Sub Categories (from backend only)
  ========================================= */

  const subCategories = useMemo(() => {
    return [
      "all",
      ...Array.from(
        new Set(data.map((u) => u.sub_category).filter(Boolean))
      ),
    ];
  }, [data]);

  /* =========================================
     ✅ Filtered Data
  ========================================= */

const filteredData = data.filter((user) => {
  const mappedCategory = normalizeCategory(user.category);
  const mappedSub = normalizeSubCategory(user.sub_category);

  const categoryMatch =
    selectedCategory === "all" || mappedCategory === selectedCategory;

  const subCategoryMatch =
    selectedSubCategory === "all" || mappedSub === selectedSubCategory;

  return categoryMatch && subCategoryMatch;
});
  /* =========================================
     ✅ DATE FORMAT FIX (@db.Date)
  ========================================= */

 const formatDate = (date?: string | null) => {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("en-IN"); // Only Date
};

  /* =========================================
     ✅ Export Excel
  ========================================= */

  const handleExportExcel = () => {
    const formattedData = filteredData.map((user) => ({
      transaction_id: user.transaction_id,
      delegate_type: user.delegate_type,
      name: `${user.salutation ? user.salutation + " " : ""}${
        user.first_name
      } ${user.last_name}`,
      gender: user.gender ?? "-",
      affiliation: user.affiliation ?? "-",
      email: user.email,
      contact_no: user.contact_no ?? "-",
      city: user.city ?? "-",
      postal_code: user.postal_code ?? "-",
      category: normalizeCategory(user.category),
      sub_category: user.sub_category ?? "-",
      amount: user.amount,
      payment_mode: user.payment_mode ?? "-",
      transaction_date: formatDate(user.transaction_date),
      abstract_submitted: user.abstract_submitted ? "Yes" : "No",
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
      <h1 className="text-2xl font-bold mb-6">
        All Registered Users
      </h1>

      <div className="flex gap-4 mb-4">
        {/* ✅ STATIC CATEGORY DROPDOWN */}
       <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="border p-2 rounded"
>
  <option value="all">All Categories</option>
  {STATIC_CATEGORIES.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>

        {/* ✅ BACKEND SUBCATEGORY DROPDOWN */}
     <select
  value={selectedSubCategory}
  onChange={(e) => setSelectedSubCategory(e.target.value)}
  className="border p-2 rounded"
>
  <option value="all">All Sub Categories</option>
  {STATIC_SUBCATEGORIES.map((sub) => (
    <option key={sub} value={sub}>
      {sub}
    </option>
  ))}
</select>
      </div>

      <button
        onClick={handleExportExcel}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Export to Excel
      </button>

     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
        <tr>
          <th className="px-6 py-4 text-left">User</th>
          <th className="px-6 py-4 text-left">Contact</th>
          <th className="px-6 py-4 text-left">Category</th>
          <th className="px-6 py-4 text-left">Payment</th>
          <th className="px-6 py-4 text-left">Date</th>
          <th className="px-6 py-4 text-left">Status</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {filteredData.map((user) => (
          <tr
            key={user.transaction_id}
            className="hover:bg-gray-50 transition"
          >
            {/* USER COLUMN */}
            <td className="px-6 py-4">
              <div className="font-medium text-gray-900">
                {user.salutation ? user.salutation + " " : ""}
                {user.first_name} {user.last_name}
              </div>
              <div className="text-xs text-gray-500">
                {user.delegate_type}
              </div>
              <div className="text-xs text-gray-400">
                {user.gender ?? ""}
              </div>
            </td>

            {/* CONTACT COLUMN */}
            <td className="px-6 py-4">
              <div className="text-gray-900">{user.email}</div>
              <div className="text-xs text-gray-500">
                {user.contact_no ?? "-"}
              </div>
              <div className="text-xs text-gray-400">
                {user.city ?? "-"} {user.postal_code ?? ""}
              </div>
            </td>

            {/* CATEGORY COLUMN */}
            <td className="px-6 py-4">
              <div className="font-medium">
                {normalizeCategory(user.category)}
              </div>
              <div className="text-xs text-gray-500">
                {normalizeSubCategory(user.sub_category)}
              </div>
            </td>

            {/* PAYMENT COLUMN */}
            <td className="px-6 py-4">
              <div className="font-semibold text-gray-900">
                ₹ {user.amount}
              </div>
              <div className="text-xs text-gray-500">
                {user.payment_mode ?? "-"}
              </div>
              <div className="text-xs text-gray-400">
                TXN: {user.transaction_id}
              </div>
            </td>

            {/* DATE */}
            <td className="px-6 py-4 text-gray-600">
              {formatDate(user.transaction_date)}
            </td>

            {/* STATUS */}
            <td className="px-6 py-4">
              {user.abstract_submitted ? (
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Abstract Submitted
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  No Abstract
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
}