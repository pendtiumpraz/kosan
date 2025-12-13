import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Use DATABASE_URL from environment for seeding
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Memulai seeding database...\n");

    // =========================================================================
    // 1. SEED FACILITIES (Master Data)
    // =========================================================================
    console.log("📦 Seeding facilities...");

    const facilities = [
        // Room Facilities
        { code: "AC", name: "AC", icon: "air-vent", category: "ROOM" },
        { code: "WIFI", name: "WiFi", icon: "wifi", category: "ROOM" },
        { code: "BATHROOM", name: "Kamar Mandi Dalam", icon: "bath", category: "ROOM" },
        { code: "BED", name: "Kasur", icon: "bed", category: "ROOM" },
        { code: "WARDROBE", name: "Lemari", icon: "cabinet", category: "ROOM" },
        { code: "DESK", name: "Meja", icon: "table", category: "ROOM" },
        { code: "CHAIR", name: "Kursi", icon: "chair", category: "ROOM" },
        { code: "TV", name: "TV", icon: "tv", category: "ROOM" },
        { code: "FRIDGE", name: "Kulkas", icon: "refrigerator", category: "ROOM" },
        { code: "WATER_HEATER", name: "Water Heater", icon: "thermometer", category: "ROOM" },
        // Property Facilities
        { code: "PARKING_MOTOR", name: "Parkir Motor", icon: "bike", category: "PROPERTY" },
        { code: "PARKING_CAR", name: "Parkir Mobil", icon: "car", category: "PROPERTY" },
        { code: "KITCHEN", name: "Dapur Bersama", icon: "chef-hat", category: "PROPERTY" },
        { code: "LIVING_ROOM", name: "Ruang Tamu", icon: "sofa", category: "PROPERTY" },
        { code: "LAUNDRY", name: "Laundry", icon: "washer", category: "PROPERTY" },
        { code: "CCTV", name: "CCTV", icon: "cctv", category: "PROPERTY" },
        { code: "SECURITY", name: "Security 24 Jam", icon: "shield", category: "PROPERTY" },
        { code: "ROOFTOP", name: "Rooftop", icon: "sun", category: "PROPERTY" },
        { code: "GARDEN", name: "Taman", icon: "tree", category: "PROPERTY" },
        { code: "MUSHOLLA", name: "Musholla", icon: "mosque", category: "PROPERTY" },
    ];

    for (const facility of facilities) {
        await prisma.facility.upsert({
            where: { code: facility.code },
            update: { name: facility.name, icon: facility.icon, category: facility.category },
            create: facility,
        });
    }
    console.log(`   ✅ ${facilities.length} facilities created\n`);

    // =========================================================================
    // 2. SEED SUBSCRIPTION PLANS
    // =========================================================================
    console.log("💳 Seeding subscription plans...");

    const subscriptionPlans = [
        {
            code: "FREE",
            name: "Free",
            priceMonthly: 0,
            priceYearly: 0,
            maxProperties: 1,
            maxListings: 2,
            maxResidents: 10,
            storageMb: 100,
            features: {
                chat: true,
                analytics: false,
                prioritySupport: false,
            },
            isActive: true,
        },
        {
            code: "STARTER",
            name: "Starter",
            priceMonthly: 99000,
            priceYearly: 990000,
            maxProperties: 3,
            maxListings: 10,
            maxResidents: 50,
            storageMb: 500,
            features: {
                chat: true,
                analytics: true,
                prioritySupport: false,
            },
            isActive: true,
        },
        {
            code: "PRO",
            name: "Professional",
            priceMonthly: 249000,
            priceYearly: 2490000,
            maxProperties: 10,
            maxListings: 50,
            maxResidents: 200,
            storageMb: 2000,
            features: {
                chat: true,
                analytics: true,
                prioritySupport: true,
            },
            isActive: true,
        },
        {
            code: "ENTERPRISE",
            name: "Enterprise",
            priceMonthly: 499000,
            priceYearly: 4990000,
            maxProperties: 0, // Unlimited
            maxListings: 0,
            maxResidents: 0,
            storageMb: 0,
            features: {
                chat: true,
                analytics: true,
                prioritySupport: true,
                apiAccess: true,
            },
            isActive: true,
        },
    ];

    for (const plan of subscriptionPlans) {
        await prisma.subscriptionPlan.upsert({
            where: { code: plan.code },
            update: { ...plan },
            create: plan,
        });
    }
    console.log(`   ✅ ${subscriptionPlans.length} subscription plans created\n`);

    // =========================================================================
    // 3. SEED USERS
    // =========================================================================
    console.log("👥 Seeding users...");

    const seedPassword = process.env.SEED_PASSWORD || "Password123";
    const passwordHash = await bcrypt.hash(seedPassword, 12);

    const users = [
        // ===================
        // SUPER ADMIN
        // ===================
        {
            email: "superadmin@kosanhub.com",
            name: "Super Admin",
            phone: "+6281234567890",
            role: "SUPER_ADMIN" as const,
            verificationStatus: "VERIFIED" as const,
            isActive: true,
            trustScore: 100,
            emailVerifiedAt: new Date(),
            phoneVerifiedAt: new Date(),
            verifiedAt: new Date(),
        },
        // ===================
        // PEMILIK PROPERTI (OWNER)
        // ===================
        {
            email: "pemilik1@example.com",
            name: "Budi Santoso",
            phone: "+6281234567891",
            role: "OWNER" as const,
            verificationStatus: "VERIFIED" as const,
            isActive: true,
            trustScore: 75,
            emailVerifiedAt: new Date(),
            phoneVerifiedAt: new Date(),
            verifiedAt: new Date(),
            ktpNumber: "3201234567890001",
            businessName: "Kos Melati Indah",
            businessAddress: "Jl. Melati No. 10, Bandung",
        },
        {
            email: "pemilik2@example.com",
            name: "Siti Rahayu",
            phone: "+6281234567892",
            role: "OWNER" as const,
            verificationStatus: "VERIFIED" as const,
            isActive: true,
            trustScore: 80,
            emailVerifiedAt: new Date(),
            phoneVerifiedAt: new Date(),
            verifiedAt: new Date(),
            ktpNumber: "3201234567890002",
            businessName: "Villa Puncak Indah",
            businessAddress: "Jl. Puncak No. 88, Bogor",
        },
        // ===================
        // PEMBELI / PENCARI KOS (USER)
        // ===================
        {
            email: "pembeli1@example.com",
            name: "Andi Pratama",
            phone: "+6281234567893",
            role: "USER" as const,
            verificationStatus: "PENDING" as const,
            isActive: true,
            trustScore: 10,
            emailVerifiedAt: new Date(),
        },
        {
            email: "pembeli2@example.com",
            name: "Dewi Lestari",
            phone: "+6281234567894",
            role: "USER" as const,
            verificationStatus: "PENDING" as const,
            isActive: true,
            trustScore: 10,
            emailVerifiedAt: new Date(),
        },
        // ===================
        // PENGHUNI / TENANT (sudah jadi penyewa)
        // ===================
        {
            email: "penghuni1@example.com",
            name: "Rina Wulandari",
            phone: "+6281234567895",
            role: "TENANT" as const,
            verificationStatus: "VERIFIED" as const,
            isActive: true,
            trustScore: 50,
            emailVerifiedAt: new Date(),
            phoneVerifiedAt: new Date(),
        },
        {
            email: "penghuni2@example.com",
            name: "Rudi Hermawan",
            phone: "+6281234567896",
            role: "TENANT" as const,
            verificationStatus: "VERIFIED" as const,
            isActive: true,
            trustScore: 55,
            emailVerifiedAt: new Date(),
            phoneVerifiedAt: new Date(),
        },
    ];

    const createdUsers: Record<string, string> = {};

    for (const user of users) {
        const created = await prisma.user.upsert({
            where: { email: user.email },
            update: { ...user, passwordHash },
            create: { ...user, passwordHash },
        });
        createdUsers[user.email] = created.id;
    }
    console.log(`   ✅ ${users.length} users created\n`);

    // =========================================================================
    // 4. SEED PROPERTIES
    // =========================================================================
    console.log("🏠 Seeding properties...");

    const owner1Id = createdUsers["pemilik1@example.com"];
    const owner2Id = createdUsers["pemilik2@example.com"];

    const properties = [
        {
            ownerId: owner1Id,
            name: "Kos Putri Melati",
            type: "KOS" as const,
            description: "Kos putri eksklusif dengan fasilitas lengkap di pusat kota Bandung. Dekat dengan kampus ITB dan area kuliner.",
            address: "Jl. Melati No. 10, Kelurahan Lebakgede",
            province: "Jawa Barat",
            city: "Bandung",
            district: "Coblong",
            subdistrict: "Lebakgede",
            postalCode: "40132",
            latitude: -6.8893,
            longitude: 107.6108,
            landArea: 300,
            buildingArea: 450,
            totalRooms: 12,
            totalFloors: 3,
            yearBuilt: 2020,
            isVerified: true,
            verifiedAt: new Date(),
            isPublished: true,
        },
        {
            ownerId: owner1Id,
            name: "Kontrakan Jaya Abadi",
            type: "KONTRAKAN" as const,
            description: "Rumah kontrakan 2 lantai dengan 3 kamar tidur. Cocok untuk keluarga kecil.",
            address: "Jl. Sukajadi No. 45",
            province: "Jawa Barat",
            city: "Bandung",
            district: "Sukajadi",
            postalCode: "40162",
            latitude: -6.8847,
            longitude: 107.5856,
            landArea: 120,
            buildingArea: 90,
            totalRooms: 3,
            totalFloors: 2,
            yearBuilt: 2018,
            isVerified: true,
            verifiedAt: new Date(),
            isPublished: true,
        },
        {
            ownerId: owner2Id,
            name: "Villa Puncak Indah",
            type: "VILLA" as const,
            description: "Villa mewah dengan pemandangan pegunungan. Cocok untuk liburan keluarga atau gathering.",
            address: "Jl. Raya Puncak KM 88",
            province: "Jawa Barat",
            city: "Bogor",
            district: "Cisarua",
            postalCode: "16750",
            latitude: -6.7033,
            longitude: 106.9317,
            landArea: 1000,
            buildingArea: 350,
            totalRooms: 5,
            totalFloors: 2,
            yearBuilt: 2019,
            isVerified: true,
            verifiedAt: new Date(),
            isPublished: true,
        },
        {
            ownerId: owner2Id,
            name: "Rumah Dijual Menteng",
            type: "HOUSE" as const,
            description: "Rumah klasik di kawasan elite Menteng. Luas tanah 500m2, bangunan 300m2.",
            address: "Jl. Menteng No. 25",
            province: "DKI Jakarta",
            city: "Jakarta Pusat",
            district: "Menteng",
            postalCode: "10310",
            latitude: -6.1956,
            longitude: 106.8420,
            landArea: 500,
            buildingArea: 300,
            totalRooms: 6,
            totalFloors: 2,
            yearBuilt: 1985,
            certificate: "SHM" as const,
            isVerified: true,
            verifiedAt: new Date(),
            isPublished: true,
        },
    ];

    const createdProperties: Record<string, string> = {};

    for (const property of properties) {
        const created = await prisma.property.upsert({
            where: { id: property.name }, // Will create new since ID won't match
            update: {},
            create: property,
        });
        createdProperties[property.name] = created.id;
    }
    console.log(`   ✅ ${properties.length} properties created\n`);

    // =========================================================================
    // 5. SEED ROOMS
    // =========================================================================
    console.log("🚪 Seeding rooms...");

    const kosId = createdProperties["Kos Putri Melati"];

    // Check if rooms already exist
    const existingRooms = await prisma.room.count({ where: { propertyId: kosId } });

    if (existingRooms === 0) {
        const rooms = [];
        for (let floor = 1; floor <= 3; floor++) {
            for (let num = 1; num <= 4; num++) {
                const roomNumber = floor * 100 + num;
                rooms.push({
                    propertyId: kosId,
                    name: `Kamar ${roomNumber}`,
                    floor,
                    roomSize: 16,
                    priceMonthly: floor === 1 ? 1200000 : floor === 2 ? 1500000 : 1800000,
                    deposit: 500000,
                    status: num <= 3 ? "OCCUPIED" as const : "AVAILABLE" as const,
                });
            }
        }

        for (const room of rooms) {
            await prisma.room.create({ data: room });
        }
        console.log(`   ✅ ${rooms.length} rooms created\n`);
    } else {
        console.log(`   ⏭️  Rooms already exist, skipping\n`);
    }

    // Get room IDs
    const allRooms = await prisma.room.findMany({ where: { propertyId: kosId } });
    const createdRooms: Record<string, string> = {};
    for (const room of allRooms) {
        createdRooms[room.name] = room.id;
    }

    // =========================================================================
    // 6. SEED RESIDENTS
    // =========================================================================
    console.log("👤 Seeding residents...");

    const tenant1Id = createdUsers["penghuni1@example.com"];
    const tenant2Id = createdUsers["penghuni2@example.com"];

    const existingResidents = await prisma.resident.count({ where: { propertyId: kosId } });

    if (existingResidents === 0 && createdRooms["Kamar 101"]) {
        const residents = [
            {
                propertyId: kosId,
                roomId: createdRooms["Kamar 101"],
                userId: tenant1Id,
                fullName: "Rina Wulandari",
                ktpNumber: "3201234567890010",
                phone: "+6281234567895",
                email: "penghuni1@example.com",
                dateOfBirth: new Date("1998-05-15"),
                gender: "FEMALE" as const,
                occupation: "Mahasiswa",
                checkInDate: new Date("2024-01-01"),
                rentalPrice: 1200000,
                depositAmount: 500000,
                depositStatus: "PAID" as const,
                paymentDueDay: 5,
                rentalStatus: "ACTIVE" as const,
            },
            {
                propertyId: kosId,
                roomId: createdRooms["Kamar 201"],
                userId: tenant2Id,
                fullName: "Rudi Hermawan",
                ktpNumber: "3201234567890011",
                phone: "+6281234567896",
                email: "penghuni2@example.com",
                dateOfBirth: new Date("1997-03-10"),
                gender: "MALE" as const,
                occupation: "Freelancer",
                checkInDate: new Date("2024-03-01"),
                rentalPrice: 1500000,
                depositAmount: 500000,
                depositStatus: "PAID" as const,
                paymentDueDay: 1,
                rentalStatus: "ACTIVE" as const,
            },
        ];

        for (const resident of residents) {
            await prisma.resident.create({ data: resident });
        }
        console.log(`   ✅ ${residents.length} residents created\n`);
    } else {
        console.log(`   ⏭️  Residents already exist or rooms not ready, skipping\n`);
    }

    // =========================================================================
    // 7. SEED LISTINGS
    // =========================================================================
    console.log("📋 Seeding listings...");

    const existingListings = await prisma.listing.count();

    if (existingListings === 0) {
        const listings = [
            {
                ownerId: owner1Id,
                propertyId: kosId,
                title: "Kos Putri Melati - Kamar Tersedia di Lantai 3",
                listingType: "RENT" as const,
                propertyType: "KOS" as const,
                description: "Tersedia kamar kosong di lantai 3 dengan fasilitas lengkap. AC, WiFi, kamar mandi dalam.",
                address: "Jl. Melati No. 10, Lebakgede",
                province: "Jawa Barat",
                city: "Bandung",
                district: "Coblong",
                latitude: -6.8893,
                longitude: 107.6108,
                buildingArea: 16,
                price: 1800000,
                pricePeriod: "MONTHLY",
                depositAmount: 500000,
                isNegotiable: false,
                condition: "GOOD",
                furnished: "FULLY",
                isVerified: true,
                verifiedAt: new Date(),
                status: "ACTIVE",
                views: 156,
            },
            {
                ownerId: owner2Id,
                propertyId: createdProperties["Villa Puncak Indah"],
                title: "Villa Puncak Indah - Sewa Harian/Weekend",
                listingType: "RENT" as const,
                propertyType: "VILLA" as const,
                description: "Villa mewah dengan pemandangan pegunungan. 5 kamar tidur, kolam renang, BBQ area.",
                address: "Jl. Raya Puncak KM 88",
                province: "Jawa Barat",
                city: "Bogor",
                district: "Cisarua",
                latitude: -6.7033,
                longitude: 106.9317,
                landArea: 1000,
                buildingArea: 350,
                bedrooms: 5,
                bathrooms: 4,
                floors: 2,
                price: 3500000,
                pricePeriod: "DAILY",
                isNegotiable: true,
                condition: "GOOD",
                furnished: "FULLY",
                isVerified: true,
                verifiedAt: new Date(),
                status: "ACTIVE",
                views: 423,
            },
            {
                ownerId: owner2Id,
                propertyId: createdProperties["Rumah Dijual Menteng"],
                title: "Dijual Rumah Klasik di Menteng - Lokasi Premium",
                listingType: "SALE" as const,
                propertyType: "HOUSE" as const,
                description: "Rumah bergaya kolonial di kawasan elite Menteng. Cocok untuk hunian atau investasi.",
                address: "Jl. Menteng No. 25",
                province: "DKI Jakarta",
                city: "Jakarta Pusat",
                district: "Menteng",
                latitude: -6.1956,
                longitude: 106.8420,
                landArea: 500,
                buildingArea: 300,
                bedrooms: 6,
                bathrooms: 4,
                floors: 2,
                certificate: "SHM" as const,
                price: 25000000000,
                pricePeriod: "ONCE",
                isNegotiable: true,
                condition: "RENOVATED",
                furnished: "SEMI",
                isVerified: true,
                verifiedAt: new Date(),
                status: "ACTIVE",
                views: 892,
            },
        ];

        for (const listing of listings) {
            await prisma.listing.create({ data: listing });
        }
        console.log(`   ✅ ${listings.length} listings created\n`);
    } else {
        console.log(`   ⏭️  Listings already exist, skipping\n`);
    }

    // =========================================================================
    // DONE
    // =========================================================================
    console.log("🎉 Seeding selesai!\n");
    console.log("🔐 Login credentials (Password: set via SEED_PASSWORD env or default):");
    console.log("   SUPER ADMIN : superadmin@kosanhub.com");
    console.log("   PEMILIK 1   : pemilik1@example.com");
    console.log("   PEMILIK 2   : pemilik2@example.com");
    console.log("   PEMBELI 1   : pembeli1@example.com");
    console.log("   PEMBELI 2   : pembeli2@example.com");
    console.log("   PENGHUNI 1  : penghuni1@example.com");
    console.log("   PENGHUNI 2  : penghuni2@example.com");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
