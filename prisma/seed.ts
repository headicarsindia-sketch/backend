import { PrismaClient, abstract_submission_file_type, abstract_submission_status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const transactionId = "1.14266E+11"; // keep exactly as provided


  // 2️⃣ create abstract_submission (child)
  await prisma.abstract_submission.create({
    data: {
      registration_id: transactionId,
      delegate_category: "Student Delegate (STD)",
      sub_category: null,
      full_name_with_salutation: "Col Vinay Singh",
      gender: "MALE",
      affiliation_organization: "Indian Army/Rashtriya Raksha University, Lucknow Campus",
      designation_role: "Colonel/Student at RRU",
      mobile_number: "7388973749",
      city_country: "Lucknow, India",

      abstract_type: "Research Paper",
      keywords:
        "Disaster Diplomacy; Disaster Risk Reduction (DRR); South Asia; Humanitarian Assistance and Disaster Relief (HADR); Soft Power; Climate Security.",
      preferred_presentation: "Oral Presentation",
      corresponding_author: "Vinay Singh",

      upload_abstract_name: "gdrive_link.txt",
      upload_abstract_type: abstract_submission_file_type.PDF, // change if enum differs
      upload_abstract_size_kb: 0,
      upload_abstract: Buffer.from(
        "https://drive.google.com/open?id=1lzNPnCeS9uRUliDg5TSIgpyX3Nn1LJLv"
      ),

      status: abstract_submission_status.SUBMITTED
    }
  });

  console.log("✅ Seed data inserted");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });