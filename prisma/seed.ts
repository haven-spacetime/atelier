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
    // Brandon Nguyen — shop owner
    prisma.customer.create({
      data: {
        name: "Brandon Nguyen",
        email: "brandon@ateliermotors.com",
        phone: "+1(714)867-4410",
        address: "Atelier Motors, 18600 Main St, Huntington Beach, CA 92648",
        notes:
          "Shop owner. Personal McLaren kept in-house — full PPF + ceramic done in-house. Test account for CRM demos.",
        tags: JSON.stringify(["owner", "vip"]),
        lastContactedAt: daysAgo(0),
      },
    }),
    // Tyler Vang — [11]
    prisma.customer.create({
      data: {
        name: "Tyler Vang",
        email: "tyler.vang@outlook.com",
        phone: "(949) 555-0911",
        address: "1 Monarch Beach Resort Dr, Dana Point, CA 92629",
        notes:
          "Bentley collector. Wanted a completely unique color change on the Flying Spur — chrome silver with satin gold accents. Loves standing out.",
        tags: JSON.stringify(["vip", "wrap", "repeat"]),
        lastContactedAt: daysAgo(3),
      },
    }),
    // Natasha Kim — [12]
    prisma.customer.create({
      data: {
        name: "Natasha Kim",
        email: "natasha.kim@gmail.com",
        phone: "(949) 555-0812",
        address: "101 Fashion Island Blvd, Newport Beach, CA 92660",
        notes:
          "New customer. Picked up the M8 Competition straight from BMW and wanted full PPF before the first drive. Very detail-oriented.",
        tags: JSON.stringify(["new", "ppf-only"]),
        lastContactedAt: daysAgo(6),
      },
    }),
    // Ethan Rhodes — [13]
    prisma.customer.create({
      data: {
        name: "Ethan Rhodes",
        email: "ethan.rhodes@rhodescapital.com",
        phone: "(310) 555-1901",
        address: "22 Crystal Cove Shore, Newport Coast, CA 92657",
        notes:
          "Private equity. Wants a blacked-out Cullinan unlike anything on the road. Budget is not a concern — wants it perfect.",
        tags: JSON.stringify(["vip", "high-value", "new"]),
        lastContactedAt: daysAgo(4),
      },
    }),
    // Julian Cross — [14]
    prisma.customer.create({
      data: {
        name: "Julian Cross",
        email: "julian.cross@icloud.com",
        phone: "(949) 555-2244",
        address: "5 Pelican Hill Rd, Newport Coast, CA 92657",
        notes:
          "Referred by Marcus Chen. Just took delivery of a GT2 RS from Porsche Laguna Hills. Wants full PPF + ceramic before the first track day.",
        tags: JSON.stringify(["referral", "new", "track"]),
        lastContactedAt: daysAgo(2),
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
    // Brandon Nguyen
    prisma.vehicle.create({
      data: {
        customerId: customers[10].id,
        year: 2024,
        make: "McLaren",
        model: "750S Spider",
        color: "Volcano Orange",
        vin: "SBM14DCA5RW000888",
        notes:
          "Owner's personal vehicle. Full XPEL Ultimate Plus PPF + Ceramic Pro 9H done in-house.",
      },
    }),
    // Tyler Vang — [15]
    prisma.vehicle.create({
      data: {
        customerId: customers[11].id,
        year: 2023,
        make: "Bentley",
        model: "Flying Spur W12",
        color: "Onyx Black",
        vin: "SCBCR2ZA4PC099001",
        notes:
          "Color change wrap — Gloss Liquid Chrome Silver with Satin Black chrome delete and Satin Gold brightwork accents.",
      },
    }),
    // Natasha Kim — [16]
    prisma.vehicle.create({
      data: {
        customerId: customers[12].id,
        year: 2024,
        make: "BMW",
        model: "M8 Competition",
        color: "Frozen Marina Bay Blue",
        vin: "WBSAE0C07NCJ00444",
        notes: "Full body PPF — preserving the Frozen Bay Blue. Customer wants zero imperfections.",
      },
    }),
    // Viktor Petrov second car — [17]
    prisma.vehicle.create({
      data: {
        customerId: customers[4].id,
        year: 2023,
        make: "Ferrari",
        model: "812 Competizione",
        color: "Rosso Corsa",
        notes:
          "Second Ferrari. Wants XPEL Stealth PPF on the entire car — matte finish over the Rosso.",
      },
    }),
    // Tyler Vang second car — [18]
    prisma.vehicle.create({
      data: {
        customerId: customers[11].id,
        year: 2024,
        make: "Rolls-Royce",
        model: "Ghost",
        color: "Arctic White",
        notes:
          "Wants a full color change wrap to match the Flying Spur project. Something understated but custom.",
      },
    }),
    // James Whitfield fourth car — [19]
    prisma.vehicle.create({
      data: {
        customerId: customers[2].id,
        year: 2024,
        make: "Bugatti",
        model: "Chiron Super Sport",
        color: "French Racing Blue",
        vin: "VF9SP3V31NM795001",
        notes:
          "The crown jewel of his collection. Full PPF + ceramic. Treat with the absolute highest care — irreplaceable.",
      },
    }),
    // Ethan Rhodes — [20]
    prisma.vehicle.create({
      data: {
        customerId: customers[13].id,
        year: 2024,
        make: "Rolls-Royce",
        model: "Cullinan Black Badge",
        color: "Obsidian Black",
        vin: "SCA666D02RUX12001",
        notes:
          "Full black-out wrap — stealth matte black with gloss black accents. Chrome delete everything.",
      },
    }),
    // Julian Cross — [21]
    prisma.vehicle.create({
      data: {
        customerId: customers[14].id,
        year: 2025,
        make: "Porsche",
        model: "911 GT2 RS",
        color: "Guards Red",
        vin: "WP0AE2A96SS270001",
        notes:
          "Track car. Full PPF + Gyeon quartz ceramic before first track day. Customer is very particular about surface prep.",
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
    // Job 13 — Brandon Nguyen McLaren: PPF + Ceramic — COMPLETE
    prisma.job.create({
      data: {
        customerId: customers[10].id,
        vehicleId: vehicles[14].id,
        type: "PPF",
        status: "COMPLETE",
        title: "Full PPF + Ceramic — 750S Spider (Owner's Car)",
        description:
          "Full XPEL Ultimate Plus PPF with Ceramic Pro 9H top coat. Done in-house by the team. Personal vehicle of the owner.",
        estimatedHours: 36,
        actualHours: 34,
        materialNotes: "XPEL Ultimate Plus — 78 ft. Ceramic Pro 9H (4 layers) + top coat.",
        assignedTo: "Danny",
        bayNumber: 1,
        scheduledDate: daysAgo(30),
        completedDate: daysAgo(25),
        quotedPrice: 0,
        finalPrice: 0,
        depositAmount: 0,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
    // Job 13 — James Whitfield 918 Spyder: Full PPF + Ceramic + Tint — INVOICED [customers[2], vehicles[5]]
    prisma.job.create({
      data: {
        customerId: customers[2].id,
        vehicleId: vehicles[5].id,
        type: "PPF",
        status: "INVOICED",
        title: "Full PPF + Ceramic + Tint — 918 Spyder",
        description:
          "Complete XPEL Ultimate Plus PPF, Ceramic Pro 9H 4-layer package, and XPEL XR Plus ceramic tint. Museum-quality full protection on a priceless car.",
        estimatedHours: 45,
        actualHours: 42,
        materialNotes:
          "XPEL Ultimate Plus — 90 ft. Ceramic Pro 9H (4 layers + top coat). XPEL XR Plus tint (all glass).",
        assignedTo: "Mike",
        bayNumber: 1,
        scheduledDate: daysAgo(18),
        completedDate: daysAgo(10),
        quotedPrice: 15800,
        finalPrice: 15800,
        depositAmount: 8000,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
    // Job 14 — Diana Nakamura 911 S/T: Full PPF + Ceramic — INVOICED [customers[5], vehicles[8]]
    prisma.job.create({
      data: {
        customerId: customers[5].id,
        vehicleId: vehicles[8].id,
        type: "PPF",
        status: "INVOICED",
        title: "Full PPF + Ceramic — 911 S/T",
        description:
          "Full body XPEL Ultimate Plus PPF with 2-stage paint correction. Ceramic Pro 9H 3-layer package on top. PTS color demands extra care.",
        estimatedHours: 32,
        actualHours: 30,
        materialNotes:
          "XPEL Ultimate Plus full kit. Paint correction supplies. Ceramic Pro 9H (3 layers + top coat).",
        assignedTo: "Danny",
        bayNumber: 3,
        scheduledDate: daysAgo(12),
        completedDate: daysAgo(5),
        quotedPrice: 8500,
        finalPrice: 8500,
        depositAmount: 4250,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
    // Job 15 — Tyler Vang Bentley Flying Spur: Color Change Wrap — INVOICED [customers[11], vehicles[15]]
    prisma.job.create({
      data: {
        customerId: customers[11].id,
        vehicleId: vehicles[15].id,
        type: "WRAP",
        status: "INVOICED",
        title: "Color Change Wrap — Flying Spur W12",
        description:
          "Full color change from Onyx Black to Gloss Liquid Chrome Silver. Chrome delete in Satin Black. Brightwork wrapped in Satin Gold. One of a kind.",
        estimatedHours: 48,
        actualHours: 50,
        materialNotes:
          "Avery Supreme Gloss Liquid Chrome Silver — 90 ft. 3M 1080 Satin Black for chrome delete. Avery Satin Gold for brightwork accents.",
        assignedTo: "Mike",
        bayNumber: 2,
        scheduledDate: daysAgo(9),
        completedDate: daysAgo(3),
        quotedPrice: 9800,
        finalPrice: 9800,
        depositAmount: 4900,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
    // Job 16 — Natasha Kim BMW M8: Full PPF — INVOICED [customers[12], vehicles[16]]
    prisma.job.create({
      data: {
        customerId: customers[12].id,
        vehicleId: vehicles[16].id,
        type: "PPF",
        status: "INVOICED",
        title: "Full PPF — M8 Competition",
        description:
          "Full body XPEL Ultimate Plus PPF. Customer wanted zero imperfections on the Frozen Marina Bay Blue factory paint before putting a single mile on it.",
        estimatedHours: 28,
        actualHours: 27,
        materialNotes:
          "XPEL Ultimate Plus full kit for M8. Extra care around door edges and rocker panels.",
        assignedTo: "Danny",
        bayNumber: 4,
        scheduledDate: daysAgo(12),
        completedDate: daysAgo(6),
        quotedPrice: 7200,
        finalPrice: 7200,
        depositAmount: 3600,
        depositPaid: true,
        photos: JSON.stringify([]),
      },
    }),
    // Pipeline Job 1 — James Whitfield Bugatti Chiron: Full PPF + Ceramic — INQUIRY [customers[2], vehicles[19]]
    prisma.job.create({
      data: {
        customerId: customers[2].id,
        vehicleId: vehicles[19].id,
        type: "PPF",
        status: "INQUIRY",
        title: "Full PPF + Ceramic — Bugatti Chiron Super Sport",
        description:
          "Full body XPEL Ultimate Plus PPF with Ceramic Pro Finest package. Customer wants museum-level protection. Possibly the most valuable car we have ever touched.",
        estimatedHours: 60,
        quotedPrice: 28000,
        photos: JSON.stringify([]),
      },
    }),
    // Pipeline Job 2 — Ethan Rhodes Rolls-Royce Cullinan: Full Wrap + Blackout — INQUIRY [customers[13], vehicles[20]]
    prisma.job.create({
      data: {
        customerId: customers[13].id,
        vehicleId: vehicles[20].id,
        type: "WRAP",
        status: "INQUIRY",
        title: "Full Stealth Wrap + Blackout — Cullinan Black Badge",
        description:
          "Complete color change to Satin Volcanic Black. Full chrome delete in Gloss Black. Emblems debadged and wrapped. Customer wants zero chrome visible.",
        estimatedHours: 55,
        quotedPrice: 24000,
        photos: JSON.stringify([]),
      },
    }),
    // Pipeline Job 3 — Tyler Vang Rolls-Royce Ghost: Color Change Wrap — INQUIRY [customers[11], vehicles[18]]
    prisma.job.create({
      data: {
        customerId: customers[11].id,
        vehicleId: vehicles[18].id,
        type: "WRAP",
        status: "INQUIRY",
        title: "Color Change Wrap — Rolls-Royce Ghost",
        description:
          "Full color change wrap — customer wants to complement the chrome Flying Spur. Leaning toward Satin Charcoal with gloss black accents. Second project from Tyler.",
        estimatedHours: 50,
        quotedPrice: 18000,
        photos: JSON.stringify([]),
      },
    }),
    // Pipeline Job 4 — Julian Cross Porsche GT2 RS: Full PPF + Ceramic — QUOTED [customers[14], vehicles[21]]
    prisma.job.create({
      data: {
        customerId: customers[14].id,
        vehicleId: vehicles[21].id,
        type: "PPF",
        status: "QUOTED",
        title: "Full PPF + Ceramic — 911 GT2 RS",
        description:
          "Full body XPEL Ultimate Plus PPF with 2-stage paint correction and Ceramic Pro 9H 4-layer top coat. Track-ready finish. Quote sent — awaiting sign-off.",
        estimatedHours: 38,
        quotedPrice: 18500,
        photos: JSON.stringify([]),
      },
    }),
    // Pipeline Job 5 — Viktor Petrov Ferrari 812: Full Stealth PPF — INQUIRY [customers[4], vehicles[17]]
    prisma.job.create({
      data: {
        customerId: customers[4].id,
        vehicleId: vehicles[17].id,
        type: "PPF",
        status: "INQUIRY",
        title: "Full Stealth PPF — 812 Competizione",
        description:
          "Full body XPEL Stealth PPF to give a satin finish over the Rosso Corsa. Viktor's second Ferrari in the shop. Needs custom templates for the 812 body kit.",
        estimatedHours: 42,
        quotedPrice: 14500,
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
    // ATL-2026-001 — James Whitfield 918 Spyder PPF+Ceramic+Tint (PAID this month)
    prisma.invoice.create({
      data: {
        jobId: jobs[13].id,
        customerId: customers[2].id,
        invoiceNumber: "ATL-2026-001",
        lineItems: JSON.stringify([
          { description: "Full PPF — XPEL Ultimate Plus", qty: 1, unitPrice: 11500, total: 11500 },
          {
            description: "Ceramic Pro 9H (4 layers + top coat)",
            qty: 1,
            unitPrice: 2800,
            total: 2800,
          },
          {
            description: "Window Tint — XPEL XR Plus (all glass)",
            qty: 1,
            unitPrice: 1500,
            total: 1500,
          },
        ]),
        subtotal: 15800,
        tax: 1382.5,
        total: 17182.5,
        status: "PAID",
        paidAt: daysAgo(10),
      },
    }),
    // ATL-2026-002 — Diana Nakamura 911 S/T PPF+Ceramic (PAID this month)
    prisma.invoice.create({
      data: {
        jobId: jobs[14].id,
        customerId: customers[5].id,
        invoiceNumber: "ATL-2026-002",
        lineItems: JSON.stringify([
          { description: "Full PPF — XPEL Ultimate Plus", qty: 1, unitPrice: 5800, total: 5800 },
          { description: "Paint Correction (2-stage)", qty: 1, unitPrice: 1200, total: 1200 },
          {
            description: "Ceramic Pro 9H (3 layers + top coat)",
            qty: 1,
            unitPrice: 1500,
            total: 1500,
          },
        ]),
        subtotal: 8500,
        tax: 743.75,
        total: 9243.75,
        status: "PAID",
        paidAt: daysAgo(5),
      },
    }),
    // ATL-2026-003 — Tyler Vang Flying Spur Color Change Wrap (PAID this month)
    prisma.invoice.create({
      data: {
        jobId: jobs[15].id,
        customerId: customers[11].id,
        invoiceNumber: "ATL-2026-003",
        lineItems: JSON.stringify([
          {
            description: "Color Change Wrap — Gloss Liquid Chrome Silver",
            qty: 1,
            unitPrice: 7200,
            total: 7200,
          },
          {
            description: "Chrome Delete Package — Satin Black",
            qty: 1,
            unitPrice: 1400,
            total: 1400,
          },
          {
            description: "Brightwork Wrap — Satin Gold Accents",
            qty: 1,
            unitPrice: 1200,
            total: 1200,
          },
        ]),
        subtotal: 9800,
        tax: 857.5,
        total: 10657.5,
        status: "PAID",
        paidAt: daysAgo(3),
      },
    }),
    // ATL-2026-004 — Natasha Kim BMW M8 Full PPF (PAID this month)
    prisma.invoice.create({
      data: {
        jobId: jobs[16].id,
        customerId: customers[12].id,
        invoiceNumber: "ATL-2026-004",
        lineItems: JSON.stringify([
          { description: "Full PPF — XPEL Ultimate Plus", qty: 1, unitPrice: 6200, total: 6200 },
          {
            description: "Ceramic Coat — Ceramic Pro Sport (2 layers)",
            qty: 1,
            unitPrice: 1000,
            total: 1000,
          },
        ]),
        subtotal: 7200,
        tax: 630,
        total: 7830,
        status: "PAID",
        paidAt: daysAgo(6),
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
