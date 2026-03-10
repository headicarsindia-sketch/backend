import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";
import { corsHeaders } from "../_utils/cors";

/* ================= TYPES ================= */

interface Delegate {
  fullName: string;
  designationDept: string;
  category: string;
  subcategory: string;   // ✅ ADD THIS
  email: string;
  mobile: string;
  abstractLink?: string;
}

interface GroupFormData {
  instituteName: string;
  type: string;
  postalAddress: string;
  representativeName: string;
  designation: string;
  email: string;
  mobile: string;
  delegates: Delegate[];
}

/* ================= UTILITIES ================= */

function validateEnv() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are not configured.");
  }
}

function isValidGoogleLink(link: string): boolean {
  return /^https:\/\/(docs\.google\.com|drive\.google\.com)\//.test(link);
}

// Basic HTML escape (security improvement)
function escapeHTML(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDelegateHTML(delegates: Delegate[]): string {
  return delegates
    .map((d, i) => {
      const abstractCell = d.abstractLink
        ? `<a href="${escapeHTML(d.abstractLink)}" target="_blank">
            View Abstract
           </a>
           <br/>
           <small>(Delegate confirmed public access & under 2MB)</small>`
        : "Not Submitted";

      return `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHTML(d.fullName)}</td>
          <td>${escapeHTML(d.designationDept)}</td>
          <td>${escapeHTML(d.category)}</td>
          <td>${escapeHTML(d.subcategory)}</td>   <!-- ✅ NEW -->
          <td>${escapeHTML(d.email)}</td>
          <td>${escapeHTML(d.mobile)}</td>
          <td>${abstractCell}</td>
        </tr>
      `;
    })
    .join("");
}

/* ================= CORS OPTIONS ================= */

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

/* ================= POST ================= */

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");

  try {
    validateEnv();

    const data: GroupFormData = await req.json();

    /* ===== BASIC VALIDATION ===== */

    if (!data.instituteName?.trim()) {
      return NextResponse.json(
        { message: "Institute name is required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    if (!data.email?.trim()) {
      return NextResponse.json(
        { message: "Representative email is required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    if (!Array.isArray(data.delegates) || data.delegates.length === 0) {
      return NextResponse.json(
        { message: "At least one delegate must be added" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    /* ===== DELEGATE VALIDATION ===== */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{8,15}$/;

    for (const [index, delegate] of data.delegates.entries()) {
      if (!delegate.fullName?.trim()) {
        return NextResponse.json(
          { message: `Delegate ${index + 1}: Full name is required` },
          { status: 400, headers: corsHeaders(origin) }
        );
      }

      if (!delegate.designationDept?.trim()) {
        return NextResponse.json(
          { message: `Delegate ${index + 1}: Designation/Department required` },
          { status: 400, headers: corsHeaders(origin) }
        );
      }

      if (!delegate.category?.trim()) {
        return NextResponse.json(
          { message: `Delegate ${index + 1}: Category required` },
          { status: 400, headers: corsHeaders(origin) }
        );
      }

      if (!delegate.subcategory?.trim()) {
        return NextResponse.json(
          { message: `Delegate ${index + 1}: Subcategory required` },
          { status: 400, headers: corsHeaders(origin) }
        );
      }

      if (!emailRegex.test(delegate.email)) {
        return NextResponse.json(
          { message: `Delegate ${index + 1}: Invalid email address` },
          { status: 400, headers: corsHeaders(origin) }
        );
      }

      if (!mobileRegex.test(delegate.mobile)) {
        return NextResponse.json(
          { message: `Delegate ${index + 1}: Invalid mobile number` },
          { status: 400, headers: corsHeaders(origin) }
        );
      }

      if (
        delegate.abstractLink &&
        !isValidGoogleLink(delegate.abstractLink)
      ) {
        return NextResponse.json(
          {
            message: `Delegate ${index + 1}: Abstract must be a Google Drive/Docs link`,
          },
          { status: 400, headers: corsHeaders(origin) }
        );
      }
    }

    /* ===== EMAIL TRANSPORTER ===== */

    const transporter: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const delegateTableRows = buildDelegateHTML(data.delegates);

    const secretariatHTML = `
      <h2>New Group Discount Registration – RESSummit 2047</h2>

      <p><strong>Total Delegates:</strong> ${data.delegates.length}</p>

      <h3>SECTION A: Institutional Details</h3>
      <p><strong>Institute Name:</strong> ${escapeHTML(data.instituteName)}</p>
      <p><strong>Delegate Type:</strong> ${escapeHTML(data.type)}</p>
      <p><strong>Postal Address:</strong> ${escapeHTML(data.postalAddress)}</p>

      <h3>SECTION B: Representative Contact</h3>
      <p><strong>Name:</strong> ${escapeHTML(data.representativeName)}</p>
      <p><strong>Designation:</strong> ${escapeHTML(data.designation)}</p>
      <p><strong>Email:</strong> ${escapeHTML(data.email)}</p>
      <p><strong>Mobile:</strong> ${escapeHTML(data.mobile)}</p>

      <h3>SECTION C: Delegate Roster</h3>

      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Category</th>
            <th>Sub Category</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Abstract</th>
          </tr>
        </thead>

        <tbody>
          ${delegateTableRows}
        </tbody>
      </table>
    `;

    /* ===== SEND EMAIL TO SECRETARIAT ===== */

    await transporter.sendMail({
      from: `"RESSummit 2047" <${process.env.EMAIL_USER}>`,
      to: "santosh.wr@sric.iitr.ac.in",
      cc: [
        "anilg.icars@wr.iitr.ac.in",
        "vibhanshuverma.dpsr@gmail.com"
      ],
      subject: "New Group Discount Registration – RESSummit 2047",
      html: secretariatHTML,
    });

    /* ===== CONFIRMATION EMAIL ===== */

    await transporter.sendMail({
      from: `"RESSummit 2047" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Group Registration Received – RESSummit 2047",
      html: `
        <p>Dear ${escapeHTML(data.representativeName)},</p>

        <p>Your <strong>Group Registration Proforma</strong> has been received successfully.</p>

        <p><strong>Total Delegates Submitted:</strong> ${data.delegates.length}</p>

        <p>Please check your registered email address for the payment details and further instructions.</p>

        <p>If abstracts were submitted, kindly ensure they are publicly accessible.</p>

        <br/>

        <p>Regards,<br/>RESSummit 2047 Secretariat</p>
      `,
    });

    return NextResponse.json(
      { message: "Group registration submitted successfully" },
      { status: 200, headers: corsHeaders(origin) }
    );

  } catch (error) {
    console.error("Email Error:", error);

    return NextResponse.json(
      { message: "Email sending failed" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
