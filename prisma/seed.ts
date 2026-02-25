import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.resolve(__dirname, "..", "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.invoice.deleteMany();
  await prisma.job.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.inventoryVehicle.deleteMany();
  await prisma.marketingCampaign.deleteMany();

  console.log("Cleared existing data.");

  // ─── Date helpers ─────────────────────────────────────────────
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000);

  // ─── Customers ───────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Marcus Chen",
        email: "marcus.chen@gmail.com",
        phone: "(415) 555-0101",
        address: "2847 Pacific Heights Blvd, San Francisco, CA 94115",
        notes: "Tech founder. Prefers matte finishes. Has referred 3 clients.",
        tags: JSON.stringify(["vip", "repeat", "referral-source"]),
        lastContactedAt: daysAgo(2),
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sofia Reyes",
        email: "sofia.reyes@icloud.com",
        phone: "(415) 555-0202",
        address: "1200 Broadway, Burlingame, CA 94010",
        notes: "Interior designer. Very particular about color matching.",
        tags: JSON.stringify(["vip", "repeat"]),
        lastContactedAt: daysAgo(5),
      },
    }),
    prisma.customer.create({
      data: {
        name: "James Whitfield III",
        email: "jwhitfield@whitfieldcap.com",
        phone: "(650) 555-0303",
        address: "450 Atherton Ave, Atherton, CA 94027",
        notes: "Hedge fund. Has 8-car collection. Budget is never an issue.",
        tags: JSON.stringify(["vip", "high-value", "collector"]),
        lastContactedAt: daysAgo(1),
      },
    }),
    prisma.customer.create({
      data: {
        name: "Aaliyah Thompson",
        email: "aaliyah.t@outlook.com",
        phone: "(510) 555-0404",
        address: "3100 Lakeshore Ave, Oakland, CA 94610",
        notes: "Content creator. Wants builds documented for social media.",
        tags: JSON.stringify(["influencer", "social-media"]),
        lastContactedAt: daysAgo(14),
      },
    }),
    prisma.customer.create({
      data: {
        name: "Viktor Petrov",
        email: "vpetrov@proton.me",
        phone: "(408) 555-0505",
        address: "8800 Saratoga Hills Rd, Saratoga, CA 95070",
        notes: "Russian collector. Flies cars in from overseas. PPF everything.",
        tags: JSON.stringify(["collector", "international", "ppf-only"]),
        lastContactedAt: daysAgo(8),
      },
    }),
    prisma.customer.create({
      data: {
        name: "Diana Nakamura",
        email: "diana.nak@gmail.com",
        phone: "(415) 555-0606",
        address: "560 Marina Blvd, San Francisco, CA 94123",
        notes: "Porsche enthusiast. Trades up every 2 years.",
        tags: JSON.stringify(["repeat", "porsche-club"]),
        lastContactedAt: daysAgo(22),
      },
    }),
    prisma.customer.create({
      data: {
        name: "Roberto Castellano",
        email: "roberto@castellanomotors.com",
        phone: "(650) 555-0707",
        address: "1400 El Camino Real, Menlo Park, CA 94025",
        notes: "Dealership owner. Sends bulk PPF and ceramic work.",
        tags: JSON.stringify(["dealership", "bulk", "b2b"]),
        lastContactedAt: daysAgo(3),
      },
    }),
    prisma.customer.create({
      data: {
        name: "Priya Sharma",
        email: "priya.sharma@stanford.edu",
        phone: "(650) 555-0808",
        address: "900 Welch Rd, Palo Alto, CA 94304",
        notes: "First-time customer. Referred by Marcus Chen.",
        tags: JSON.stringify(["new", "referral"]),
        lastContactedAt: daysAgo(45),
      },
    }),
    // Haven Vu — demo customer
    prisma.customer.create({
      data: {
        name: "Haven Vu",
        email: "haven.vu@gmail.com",
        phone: "+1(714)725-0215",
        address: "15 Strada Corsa, Newport Beach, CA 92660",
        notes:
          "Close friend of Brandon. Getting a full color change wrap on the Urus. Very particular — wants to review progress photos throughout.",
        tags: JSON.stringify(["vip", "friend"]),
        lastContactedAt: daysAgo(1),
      },
    }),
    // Cindy Nguyen
    prisma.customer.create({
      data: {
        name: "Cindy Nguyen",
        email: "cindy.nguyen@icloud.com",
        phone: "+1(714)855-7828",
        address: "4200 MacArthur Blvd, Newport Beach, CA 92660",
        notes:
          "Referred by a mutual friend. Brand new Cayenne GTS straight from the dealer — wants full PPF before putting any miles on it. Waiting on quote approval.",
        tags: JSON.stringify(["referral", "new"]),
        lastContactedAt: daysAgo(7),
      },
    }),
  ]);

  console.log(`Created ${customers.length} customers.`);

  // ─── Vehicles ────────────────────────────────────────────────
  const vehicles = await Promise.all([
    // Marcus Chen — 2 vehicles
    prisma.vehicle.create({
      data: {
        customerId: customers[0].id,
        year: 2024,
        make: "Lamborghini",
        model: "Revuelto",
        color: "Grigio Telesto",
        vin: "ZHWEC4ZD5RLA00142",
        notes: "Full body Satin Black wrap. PPF underneath.",
      },
    }),
    prisma.vehicle.create({
      data: {
        customerId: customers[0].id,
        year: 2023,
        make: "Porsche",
        model: "911 GT3 RS",
        color: "Signal Green",
        vin: "WP0AF2A93PS270015",
        notes: "Track car. Full PPF only. No wrap.",
      },
    }),
    // Sofia Reyes
    prisma.vehicle.create({
      data: {
        customerId: customers[1].id,
        year: 2025,
        make: "Ferrari",
        model: "296 GTS",
        color: "Rosso Corsa",
        vin: "ZFF96LHA5R0301887",
        notes: "Wants to keep factory red. Full ceramic + PPF.",
      },
    }),
    // James Whitfield III — 3 vehicles
    prisma.vehicle.create({
      data: {
        customerId: customers[2].id,
        year: 2024,
        make: "McLaren",
        model: "750S Spider",
        color: "Papaya Spark",
        vin: "SBM14DCA4RW000319",
        notes: "Satin PPF. Do NOT wrap — collector spec.",
      },
    }),
    prisma.vehicle.create({
      data: {
        customerId: customers[2].id,
        year: 2023,
        make: "Mercedes-Benz",
        model: "AMG GT Black Series",
        color: "Designo Graphite Grey Magno",
        notes: "Full color change wrap to Satin Khaki Green.",
      },
    }),
    prisma.vehicle.create({
      data: {
        customerId: customers[2].id,
        year: 2025,
        make: "Porsche",
        model: "918 Spyder",
        color: "Liquid Metal Silver",
        vin: "WP0CA2A18FS800021",
        notes: "Museum piece. Full PPF, ceramic, and tint. Handle with extreme care.",
      },
    }),
    // Aaliyah Thompson
    prisma.vehicle.create({
      data: {
        customerId: customers[3].id,
        year: 2024,
        make: "BMW",
        model: "M4 Competition",
        color: "Brooklyn Grey",
        notes: "Color change to Midnight Purple. Document the process for her TikTok.",
      },
    }),
    // Viktor Petrov
    prisma.vehicle.create({
      data: {
        customerId: customers[4].id,
        year: 2024,
        make: "Ferrari",
        model: "SF90 XX Stradale",
        color: "Nero Daytona",
        vin: "ZFF95NXA0R0305500",
        notes: "Full XPEL Stealth PPF. Flew in from Dubai.",
      },
    }),
    // Diana Nakamura
    prisma.vehicle.create({
      data: {
        customerId: customers[5].id,
        year: 2025,
        make: "Porsche",
        model: "911 S/T",
        color: "PTS Fashion Grey",
        vin: "WP0ZZZ99ZRS100088",
        notes: "Paint-to-sample color. Customer wants to preserve with PPF + ceramic.",
      },
    }),
    // Roberto Castellano (dealership)
    prisma.vehicle.create({
      data: {
        customerId: customers[6].id,
        year: 2025,
        make: "Mercedes-Benz",
        model: "AMG SL 63",
        color: "Obsidian Black",
        notes: "Dealership prep — PPF nose, mirrors, rocker panels.",
      },
    }),
    prisma.vehicle.create({
      data: {
        customerId: customers[6].id,
        year: 2025,
        make: "Porsche",
        model: "Cayenne Turbo GT",
        color: "Arctic Grey",
        notes: "Dealership customer — full ceramic coat before delivery.",
      },
    }),
    // Priya Sharma
    prisma.vehicle.create({
      data: {
        customerId: customers[7].id,
        year: 2023,
        make: "Lamborghini",
        model: "Huracan Tecnica",
        color: "Verde Mantis",
        vin: "ZHWUT4ZF4PLA17005",
        notes: "New customer. Window tint + ceramic.",
      },
    }),
    // Haven Vu
    prisma.vehicle.create({
      data: {
        customerId: customers[8].id,
        year: 2023,
        make: "Lamborghini",
        model: "Urus S",
        color: "Bianco Monocerus",
        vin: "ZPBUA1ZL2PLA12345",
        notes:
          "Full color change wrap. White base going to a custom color. Handle with care — very personal vehicle.",
      },
    }),
    // Cindy Nguyen
    prisma.vehicle.create({
      data: {
        customerId: customers[9].id,
        year: 2024,
        make: "Porsche",
        model: "Cayenne GTS",
        color: "Carmine Red",
        vin: "WP1AF2AY4RDA00100",
        notes: "Brand new from dealer. 0 miles. Full body PPF before first drive.",
      },
    }),
  ]);

  console.log(`Created ${vehicles.length} vehicles.`);

  // ─── Jobs ────────────────────────────────────────────────────
  const jobs = await Promise.all([
    // Job 1 — Marcus Chen Lambo: full wrap — COMPLETE
    prisma.job.create({
      data: {
        customerId: customers[0].id,
        vehicleId: vehicles[0].id,
        type: "WRAP",
        status: "COMPLETE",
        title: "Full Body Satin Black Wrap — Revuelto",
        description:
          "Complete color change wrap in 3M Satin Black with PPF base layer on high-impact areas.",
        estimatedHours: 40,
        actualHours: 44,
        materialNotes: "3M 2080 Satin Black — 75 ft. XPEL Ultimate Plus for nose/fenders.",
        assignedTo: "Mike",
        bayNumber: 1,
        scheduledDate: daysAgo(21),
        completedDate: daysAgo(14),
        quotedPrice: 8500,
        finalPrice: 8500,
        depositAmount: 4250,
        depositPaid: true,
        photos: JSON.stringify(["/photos/revuelto-before.jpg", "/photos/revuelto-after.jpg"]),
      },
    }),
    // Job 2 — Marcus Chen GT3 RS: PPF — INVOICED
    prisma.job.create({
      data: {
        customerId: customers[0].id,
        vehicleId: vehicles[1].id,
        type: "PPF",
        status: "INVOICED",
        title: "Full PPF — 911 GT3 RS",
        description: "Complete XPEL Ultimate Plus PPF coverage. Track-ready protection.",
        estimatedHours: 30,
        actualHours: 28,
        materialNotes: "XPEL Ultimate Plus — full kit. Extra material for rear wing.",
        assignedTo: "Danny",
        bayNumber: 2,
        scheduledDate: daysAgo(35),
        completedDate: daysAgo(28),
        quotedPrice: 7200,
        finalPrice: 7200,
        depositAmount: 3600,
        depositPaid: true,
        photos: JSON.stringify(["/photos/gt3rs-ppf-complete.jpg"]),
      },
    }),
    // Job 3 — Sofia Reyes Ferrari: PPF + Ceramic — IN_PROGRESS
    prisma.job.create({
      data: {
        customerId: customers[1].id,
        vehicleId: vehicles[2].id,
        type: "PPF",
        status: "IN_PROGRESS",
        title: "Full PPF + Ceramic Coat — 296 GTS",
        description:
          "XPEL Stealth PPF (matte finish on Rosso Corsa), followed by Ceramic Pro Gold package.",
        estimatedHours: 35,
        actualHours: 20,
        materialNotes: "XPEL Stealth full body. Ceramic Pro 9H (4 layers) + top coat.",
        assignedTo: "Mike",
        bayNumber: 1,
        scheduledDate: daysAgo(3),
        quotedPrice: 9800,
        depositAmount: 5000,
        depositPaid: true,
        photos: JSON.stringify(["/photos/296gts-in-progress.jpg"]),
      },
    }),
    // Job 4 — James Whitfield McLaren: PPF — QC
    prisma.job.create({
      data: {
        customerId: customers[2].id,
        vehicleId: vehicles[3].id,
        type: "PPF",
        status: "QC",
        title: "Satin PPF — 750S Spider",
        description:
          "Full body Satin PPF to maintain factory matte Papaya. Extra care on aero surfaces.",
        estimatedHours: 32,
        actualHours: 34,
        materialNotes: "XPEL Stealth — 80 ft. Custom template for active aero panels.",
        assignedTo: "Danny",
        bayNumber: 3,
        scheduledDate: daysAgo(7),
        quotedPrice: 8800,
        depositAmount: 4400,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
    // Job 5 — James Whitfield Mercedes: wrap — SCHEDULED
    prisma.job.create({
      data: {
        customerId: customers[2].id,
        vehicleId: vehicles[4].id,
        type: "WRAP",
        status: "SCHEDULED",
        title: "Color Change Wrap — AMG GT Black Series",
        description:
          "Full color change from Graphite Grey to Avery Satin Khaki Green. Chrome delete in Satin Black.",
        estimatedHours: 45,
        materialNotes: "Avery SW900 Satin Khaki Green — 80 ft. 3M Satin Black for chrome delete.",
        assignedTo: "Mike",
        bayNumber: 2,
        scheduledDate: daysFromNow(3),
        quotedPrice: 7500,
        depositAmount: 3750,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
    // Job 6 — Aaliyah BMW: wrap — QUOTED
    prisma.job.create({
      data: {
        customerId: customers[3].id,
        vehicleId: vehicles[6].id,
        type: "WRAP",
        status: "QUOTED",
        title: "Midnight Purple Wrap — M4 Competition",
        description:
          "Full color change to Inozetek Midnight Purple. Customer wants process documented for content.",
        estimatedHours: 30,
        materialNotes: "Inozetek Midnight Purple — 65 ft.",
        quotedPrice: 5200,
        photos: JSON.stringify([]),
      },
    }),
    // Job 7 — Viktor Petrov Ferrari: PPF — SCHEDULED
    prisma.job.create({
      data: {
        customerId: customers[4].id,
        vehicleId: vehicles[7].id,
        type: "PPF",
        status: "SCHEDULED",
        title: "Full Stealth PPF — SF90 XX Stradale",
        description: "Complete XPEL Stealth PPF. Car flown in from Dubai. Top priority.",
        estimatedHours: 38,
        materialNotes: "XPEL Stealth — 85 ft. Custom templates needed for XX aero kit.",
        assignedTo: "Danny",
        bayNumber: 1,
        scheduledDate: daysFromNow(7),
        quotedPrice: 12000,
        depositAmount: 6000,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
    // Job 8 — Roberto dealership Mercedes: PPF — IN_PROGRESS
    prisma.job.create({
      data: {
        customerId: customers[6].id,
        vehicleId: vehicles[9].id,
        type: "DEALERSHIP",
        status: "IN_PROGRESS",
        title: "Partial PPF — AMG SL 63 (Castellano Motors)",
        description: "Dealership package: PPF on nose, mirrors, rocker panels, door edges.",
        estimatedHours: 8,
        actualHours: 5,
        materialNotes: "XPEL Ultimate Plus — partial kit.",
        assignedTo: "Junior",
        bayNumber: 4,
        scheduledDate: daysAgo(1),
        quotedPrice: 2200,
        depositPaid: false,
        photos: JSON.stringify([]),
      },
    }),
    // Job 9 — Roberto dealership Porsche: Ceramic — INQUIRY
    prisma.job.create({
      data: {
        customerId: customers[6].id,
        vehicleId: vehicles[10].id,
        type: "CERAMIC",
        status: "INQUIRY",
        title: "Ceramic Coat — Cayenne Turbo GT (Castellano Motors)",
        description:
          "Pre-delivery ceramic coat. Dealership wants quote for full exterior + wheels.",
        estimatedHours: 6,
        quotedPrice: 1800,
        photos: JSON.stringify([]),
      },
    }),
    // Job 10 — Priya Sharma Lambo: Tint + Ceramic — QUOTED
    prisma.job.create({
      data: {
        customerId: customers[7].id,
        vehicleId: vehicles[11].id,
        type: "TINT",
        status: "QUOTED",
        title: "Window Tint + Ceramic — Huracan Tecnica",
        description:
          "XPEL XR Plus ceramic tint all around (15% rear, 35% front). Ceramic Pro Sport on exterior.",
        estimatedHours: 10,
        materialNotes: "XPEL XR Plus tint rolls. Ceramic Pro Sport (2 layers).",
        quotedPrice: 2800,
        photos: JSON.stringify([]),
      },
    }),
    // Job 11 — Cindy Nguyen Cayenne GTS: Full PPF — QUOTED
    prisma.job.create({
      data: {
        customerId: customers[9].id,
        vehicleId: vehicles[13].id,
        type: "PPF",
        status: "QUOTED",
        title: "Full Stealth PPF — Cayenne GTS",
        description:
          "Full body XPEL Stealth PPF. Brand new vehicle, 0 miles. Customer wants matte finish to contrast the Carmine Red paint. Quote sent, awaiting approval.",
        estimatedHours: 28,
        materialNotes:
          "XPEL Stealth full kit — 70 ft for Cayenne GTS. Extra material for rear bumper and sill plates.",
        quotedPrice: 5800,
        photos: JSON.stringify([]),
      },
    }),
    // Job 12 — Haven Vu Urus: Full Color Change Wrap — IN_PROGRESS
    prisma.job.create({
      data: {
        customerId: customers[8].id,
        vehicleId: vehicles[12].id,
        type: "WRAP",
        status: "IN_PROGRESS",
        title: "Full Color Change Wrap — Urus S",
        description:
          "Full color change from Bianco Monocerus (white) to Gloss Midnight Blue. Chrome delete in Satin Black. Door handles and mirrors wrapped to match.",
        estimatedHours: 50,
        actualHours: 18,
        materialNotes:
          "Avery SW900 Gloss Midnight Blue — 120 ft for full SUV coverage. 3M 1080 Satin Black for chrome delete.",
        assignedTo: "Mike",
        bayNumber: 2,
        scheduledDate: daysAgo(2),
        quotedPrice: 7500,
        depositAmount: 3750,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
  ]);

  console.log(`Created ${jobs.length} jobs.`);

  // ─── Invoices ────────────────────────────────────────────────
  const invoices = await Promise.all([
    // Invoice for Marcus Lambo wrap (PAID)
    prisma.invoice.create({
      data: {
        jobId: jobs[0].id,
        customerId: customers[0].id,
        invoiceNumber: "ATL-2025-001",
        lineItems: JSON.stringify([
          { description: "Full Body Wrap — 3M Satin Black", qty: 1, unitPrice: 6500, total: 6500 },
          {
            description: "PPF Base Layer — High-Impact Areas",
            qty: 1,
            unitPrice: 2000,
            total: 2000,
          },
        ]),
        subtotal: 8500,
        tax: 743.75,
        total: 9243.75,
        status: "PAID",
        paidAt: daysAgo(12),
      },
    }),
    // Invoice for Marcus GT3 RS PPF (SENT — not yet paid)
    prisma.invoice.create({
      data: {
        jobId: jobs[1].id,
        customerId: customers[0].id,
        invoiceNumber: "ATL-2025-002",
        lineItems: JSON.stringify([
          { description: "Full PPF — XPEL Ultimate Plus", qty: 1, unitPrice: 7200, total: 7200 },
        ]),
        subtotal: 7200,
        tax: 630,
        total: 7830,
        status: "SENT",
      },
    }),
    // Invoice for dealership Mercedes partial PPF (DRAFT)
    prisma.invoice.create({
      data: {
        jobId: jobs[7].id,
        customerId: customers[6].id,
        invoiceNumber: "ATL-2025-003",
        lineItems: JSON.stringify([
          {
            description: "Partial PPF Package — Nose/Mirrors/Rockers",
            qty: 1,
            unitPrice: 2200,
            total: 2200,
          },
        ]),
        subtotal: 2200,
        tax: 192.5,
        total: 2392.5,
        status: "DRAFT",
      },
    }),
  ]);

  console.log(`Created ${invoices.length} invoices.`);

  // ─── Inventory Vehicles ──────────────────────────────────────
  const inventoryVehicles = await Promise.all([
    prisma.inventoryVehicle.create({
      data: {
        year: 2021,
        make: "Lamborghini",
        model: "Huracan EVO",
        color: "Bianco Monocerus",
        vin: "ZHWUF4ZF0MLA13200",
        mileage: 8400,
        askingPrice: 225000,
        costBasis: 195000,
        status: "AVAILABLE",
        description:
          "Extremely clean single-owner EVO. Full PPF, ceramic, and tint done in-house. Ready for the showroom floor.",
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1682825132000-4670b89ee97b?w=800&q=80",
        ]),
      },
    }),
    prisma.inventoryVehicle.create({
      data: {
        year: 2020,
        make: "McLaren",
        model: "720S Performance",
        color: "Azores Orange",
        vin: "SBM14DCA2LW000750",
        mileage: 11200,
        askingPrice: 198000,
        costBasis: 172000,
        status: "AVAILABLE",
        description:
          "MSO spec with carbon aero kit. Minor stone chips on nose — included PPF before listing.",
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1522441040106-2621f423b5eb?w=800&q=80",
        ]),
      },
    }),
    prisma.inventoryVehicle.create({
      data: {
        year: 2022,
        make: "Porsche",
        model: "911 GT3",
        color: "Shark Blue",
        vin: "WP0AC2A92NS270042",
        mileage: 4200,
        askingPrice: 245000,
        costBasis: 215000,
        status: "PENDING",
        description:
          "PTS Shark Blue with Weissach package. Deposit received — awaiting buyer financing.",
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80",
        ]),
      },
    }),
    prisma.inventoryVehicle.create({
      data: {
        year: 2019,
        make: "Ferrari",
        model: "488 Pista",
        color: "Blu Tour de France",
        vin: "ZFF96LHA0K0248800",
        mileage: 3100,
        askingPrice: 425000,
        costBasis: 380000,
        status: "SOLD",
        soldAt: daysAgo(10),
        description: "Collector-grade Pista. Full PPF since new. Sold to a Bay Area collector.",
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
        ]),
      },
    }),
  ]);

  console.log(`Created ${inventoryVehicles.length} inventory vehicles.`);

  // ─── Marketing Campaigns ─────────────────────────────────────
  const campaigns = await Promise.all([
    prisma.marketingCampaign.create({
      data: {
        name: "Spring PPF Special",
        message:
          "Hey! Atelier Motors is running 15% off full PPF installs through the end of March. Book your appointment today — limited bay availability. Reply STOP to opt out.",
        recipientTags: JSON.stringify(["vip", "repeat", "collector"]),
        sentAt: daysAgo(5),
        recipientCount: 42,
        deliveredCount: 40,
        readCount: 28,
        status: "SENT",
      },
    }),
    prisma.marketingCampaign.create({
      data: {
        name: "New Inventory Alert — 488 Pista",
        message:
          "Just landed: 2019 Ferrari 488 Pista in Blu Tour de France. 3,100 mi, full PPF, collector-grade. DM for details before it hits the market.",
        recipientTags: JSON.stringify(["collector", "high-value", "vip"]),
        status: "DRAFT",
        recipientCount: 0,
        deliveredCount: 0,
        readCount: 0,
      },
    }),
  ]);

  console.log(`Created ${campaigns.length} marketing campaigns.`);
  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
