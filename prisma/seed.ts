import { Clinician, Patient, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLINICIANS: Omit<Clinician, "id">[] = [
  {
    first_name: "Karl",
    last_name: "Clinician",
    national_provider_number: "12345",
  },
  {
    first_name: "Amanda",
    last_name: "Clinician",
    national_provider_number: "22345",
  },
];

const PATIENTS: Omit<Patient, "id">[] = [
  {
    first_name: "Wesley",
    last_name: "Crusher",
  },
  {
    first_name: "Leonard",
    last_name: "McCoy",
  },
];

const THIRTY_MINUTES = 1000 * 60 * 30;

async function seed() {
  const clinicians = await prisma.clinician.findMany();
  for (const clinician of CLINICIANS) {
    if (!clinicians.find((c) => c.first_name === clinician.first_name)) {
      const times = [
        Date.now(),
        Date.now() + THIRTY_MINUTES,
        Date.now() + THIRTY_MINUTES + THIRTY_MINUTES,
      ];
      await prisma.clinician.create({
        data: {
          ...clinician,
          availabilities: {
            create: times.map((start) => ({
              start: new Date(start),
              end: new Date(start + THIRTY_MINUTES),
            })),
          },
        },
      });
    }
  }

  const patients = await prisma.patient.findMany();
  for (const patient of PATIENTS) {
    if (!patients.find((p) => p.first_name === patient.first_name)) {
      await prisma.patient.create({ data: patient });
    }
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
