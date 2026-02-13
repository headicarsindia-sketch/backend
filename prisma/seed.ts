import "dotenv/config";           // <-- Load .env first
import { PrismaClient } from "@prisma/client";

console.log("DATABASE_URL:", process.env.DATABASE_URL);  // <-- check if it's loaded

const prisma = new PrismaClient();


async function main() {

  // Clear in dependency order
  await prisma.award_proof_link.deleteMany();
  await prisma.award_nomination.deleteMany();
  await prisma.award_focus_area.deleteMany();
  await prisma.award_category.deleteMany();
  await prisma.award_pillar.deleteMany();

  // ================= PILLARS =================

  const industry = await prisma.award_pillar.create({
    data: { name: "Industry Excellence Awards" }
  });

  const youth = await prisma.award_pillar.create({
    data: { name: "Youth, Innovation & Vision 2047 Awards" }
  });

  const summit = await prisma.award_pillar.create({
    data: { name: "Summit-Linked Performance Awards" }
  });

  // ================= CATEGORIES — PILLAR I =================

  const resilience = await prisma.award_category.create({
    data: {
      pillar_id: industry.id,
      name: "Industry Resilience Leadership Awards",
      total_awards: 3
    }
  });

  const novelResearch = await prisma.award_category.create({
    data: {
      pillar_id: industry.id,
      name: "Novel Research Excellence Awards",
      total_awards: 3
    }
  });

  const youngResearchers = await prisma.award_category.create({
    data: {
      pillar_id: industry.id,
      name: "Young Researchers Awards (Under 35)",
      total_awards: 3,
      age_limit: 35
    }
  });

  const womenResearchers = await prisma.award_category.create({
    data: {
      pillar_id: industry.id,
      name: "Women Researchers Awards",
      total_awards: 3,
      gender_restriction: "FEMALE"
    }
  });

  const schoolCampus = await prisma.award_category.create({
    data: {
      pillar_id: industry.id,
      name: "Sustainable School Campus Awards",
      total_awards: 3
    }
  });

  const grassroot = await prisma.award_category.create({
    data: {
      pillar_id: industry.id,
      name: "Grassroot Leaders Awards",
      total_awards: 3
    }
  });

  const womenGrassroot = await prisma.award_category.create({
    data: {
      pillar_id: industry.id,
      name: "Women Grassroot Leaders Awards",
      total_awards: 2,
      gender_restriction: "FEMALE"
    }
  });

  const championInstitute = await prisma.award_category.create({
    data: {
      pillar_id: industry.id,
      name: "Champion Institute Award",
      total_awards: 1
    }
  });

  // ================= FOCUS AREAS =================

  const researchAreas = [
    "Climate Research",
    "DRR Research",
    "Sustainability Research",
    "Safety Research",
    "Health Research"
  ];

  const resilienceAreas = [
    "Sustainability",
    "Disaster Risk Reduction (DRR)",
    "Climate Resilience",
    "Corporate Social Responsibility",
    "Business Continuity",
    "Investment in R&D",
    "Innovation",
    "Startups",
    "Industrial Safety & NaTech DRR"
  ];

  const schoolAreas = [
    "Disaster Preparedness",
    "Climate Smart Campus",
    "Green & Energy Efficient",
    "Ecosystems & Nature Education"
  ];

  const grassrootAreas = [
    "Community Mobilisation",
    "Children’s Resilience",
    "Traditional Wisdom"
  ];

  // Industry Resilience
  for (const area of resilienceAreas) {
    await prisma.award_focus_area.create({
      data: { category_id: resilience.id, name: area }
    });
  }

  // Research categories (B, C, D)
  for (const area of researchAreas) {
    await prisma.award_focus_area.create({ data: { category_id: novelResearch.id, name: area } });
    await prisma.award_focus_area.create({ data: { category_id: youngResearchers.id, name: area } });
    await prisma.award_focus_area.create({ data: { category_id: womenResearchers.id, name: area } });
  }

  // School campus
  for (const area of schoolAreas) {
    await prisma.award_focus_area.create({
      data: { category_id: schoolCampus.id, name: area }
    });
  }

  // Grassroot (F, G, H share same themes)
  for (const area of grassrootAreas) {
    await prisma.award_focus_area.create({ data: { category_id: grassroot.id, name: area } });
    await prisma.award_focus_area.create({ data: { category_id: womenGrassroot.id, name: area } });
    await prisma.award_focus_area.create({ data: { category_id: championInstitute.id, name: area } });
  }

  // ================= PILLAR II =================

  const youthCategories = [
    "Emerging Youth Policy Leader Award",
    "Young Resilience Innovator Award",
    "Young Champion for Nature-based Solutions",
    "Young Champion for AI & Digital Innovation Award",
    "Young Researcher for Emergency Preparedness Award"
  ];

  for (const name of youthCategories) {
    await prisma.award_category.create({
      data: { pillar_id: youth.id, name, total_awards: 1 }
    });
  }

  // ================= PILLAR III =================

  await prisma.award_category.create({
    data: {
      pillar_id: summit.id,
      name: "Best Paper Award",
      total_awards: 18
    }
  });

  await prisma.award_category.create({
    data: {
      pillar_id: summit.id,
      name: "Best Budding Quest Champion Award",
      total_awards: 2
    }
  });

  console.log("✅ Awards data seeded exactly from document");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
