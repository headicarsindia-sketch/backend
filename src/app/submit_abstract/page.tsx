"use client";
import { useState } from "react";
import "./popup.css";
export default function AbstractPopup({ close }: { close: () => void }) {
 const [form, setForm] = useState({
  registration_id: "",
  delegate_category: "",
  sub_category: "",
  full_name_with_salutation:"",
  gender: "",
  affiliation_organization: "",
  designation_role: "",
  mobile_number: "",
  city_country: "",
  abstract_type: "",
  keywords: "",
  preferred_presentation: "",
  corresponding_author: "",
});


  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!file) {
    alert("Please upload a file");
    return;
  }

  const data = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    data.append(key, value as string);
  });
  data.append("abstract_file", file);

  try {
    setLoading(true);

    const res = await fetch("http://localhost:3000/api/submit_abstract", {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Failed to submit abstract" }));
      throw new Error(errorData.error || "Failed to submit abstract");
    }

    const result = await res.json();
    alert(result.message || "Submitted successfully");
    close();
  } catch (err) {
    alert(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="overlay">
    <div className="modal">
      <button onClick={close} className="closeBtn">x</button>

      <div className="modal-scroll">
        <form id="Abstract_submission_form" onSubmit={handleSubmit} className="form">

          <h2 style={{ textAlign: "center" }}>Abstract Submission</h2>

          <label>Registration Id*</label>
          <input name="registration_id" required onChange={handleChange} className="input_field"/>
          
          <label>Select Delegate Category</label>
          <select name="delegate_category"onChange={handleChange} className="input_field" required>
            <option disabled>Select Delegate Category</option>
            <option>Industry/PSU Delegates(IPD)-(IIT-Roorkee Delegate)</option>
            <option>Centeral/State Government(GOV)-(IIT-Roorkee Delegate)</option>
            <option>Civil Society/ NFPOs(CSN)-(IIT-Roorkee Delegate)</option>
            <option>School Delegation - Group of 5 including 4 students & 1 Teacher(SDN)-(IIT Roorkee Delegate) </option>
            <option>Academic & Research Delegates(ARD)(IIT-Roorkee Delegates)</option>
            <option>Student Delegate (STD)-(IIT-Roorkee Delegate) </option>
            <option>Industry/PSU Delegates(IPD)</option>
            <option>Central/State Goverenment(GOV)</option>
            <option>Academic & Research Delegates(ARD)</option>
            <option>Student Delegate (STD)</option>
            <option>Civil Society/ NFPOs(CNS)</option>
            <option>School Delegatio - Group of 5 including 4 students & 1 Teacher(SDN)</option>
          </select>
          <label>Select Sub Category * </label>
          <select name="sub_category" onChange={handleChange} required className="input_field">
            <option disabled> Select Sub Category</option>
            <option>Climate & Sustainability(CS)</option>
            <option>Industry & Safety Symposium(IS)</option>
            <option>Climate & Sustainability + Industry & Safety Symposium (CS+IS)</option>
          </select>


          <label>Full Name With Salutation</label>
          <input name="full_name_with_salutation" required onChange={handleChange} className="input_field" />
          <label> Gender</label>
          <select name="gender" onChange={handleChange} className="input_field"required> 
            <option disabled> Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER"> Prefer Not to Say</option>
          </select>          
          <label>Affiliation/Organisation</label>
          <input name="affiliation_organization" required onChange={handleChange} className="input_field"></input>
          <label>Designation/Role</label>
          <input name="designation_role" onChange={handleChange} className="input_field"required/>
          <label>Enter Registered Mobile Number</label>
          <input name ="mobile_number" onChange={handleChange} className="input_field" required></input>
          <label>City & Country </label>
          <input name="city_country" onChange={handleChange} className="input_field"required></input>
          <label>Abstract Type</label>
          <select name="abstract_type" onChange={handleChange} className="input_field"required>
            <option disabled >Choose</option>
            <option>Policy Brief/ Policy Paper</option>
            <option>Case Study</option>
            <option>Research Paper</option>
          </select>
          
          <label>Keywords*</label>
          <input name="keywords"required onChange={handleChange} className="input_field"/>
          <label>Preferred Mode of Presentation</label>
          <select name="preferred_presentation"required onChange={handleChange} className="input_field">
            <option disabled>Choose presentation option </option>
            <option>Oral Presentation</option>
            <option>Poster Presentation</option>
          </select>
          <label>Corresponding Author Name</label>
          <input name="corresponding_author" required onChange={handleChange} className="input_field"></input>
          <label>File Upload*</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="input_field"
            required
          />

          <button disabled={loading} type="submit" className="ButtonColor">
            {loading ? "Submitting..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  </div>
);
}