import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const transactionId = "TXN_TEST_001";

  await prisma.registered_master.create({
    data: {
      transaction_id: transactionId,
      abstract_submitted: true,
      affiliation: "Test University",
      amount: new Prisma.Decimal(1000.0),
      category: "General",
      city: "Test City",
      contact_no: "9999999999",
      delegate_type: "Speaker",
      email: "test@example.com",
      first_name: "test",
      last_name: "test",
      gender: "MALE",
      payment_mode: "ONLINE",
      postal_code: "123456",
      registration_fee_type: "Standard",
      salutation: "Mr",
      transaction_date: new Date(),
      sub_category: "Test Sub Category",

      abstract_submission: {
        create: {
          keywords: "test, prisma, seed",
          status: "SUBMITTED",
          remarks: "This is a test abstract submission",
          abstract_type: "Research Paper",
          affiliation_organization: "Test University",
          city_country: "Test City, India",
          corresponding_author: "test test",
          delegate_category: "Speaker",
          designation_role: "Researcher",
          full_name_with_salutation: "Mr test test",
          gender: "MALE",
          mobile_number: "9999999999",
          preferred_presentation: "Oral",
          sub_category: "Test Sub Category",
          email: "test@example.com",

          upload_abstract: Buffer.from(
            "https://docs.google.com/document/d/1GZBMpy_djoyRfwx7m4eNfLbhEG-3_j2f/edit?usp=drive_link&ouid=118123528396930614984&rtpof=true&sd=true"
          ),
          upload_abstract_name: "Abstract",
          upload_abstract_size_kb: 1,
          upload_abstract_type: "PDF",
        },
      },
    },
  });

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });