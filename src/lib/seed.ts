import connectDB from "@/lib/mongodb";
import { Tour, Contact, Newsletter } from "@/models";

// Sample tour data
const sampleTours = [
  {
    title: "Paris City Tour",
    description:
      "Discover the magic of Paris with our comprehensive city tour. Visit iconic landmarks including the Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and enjoy a romantic Seine River cruise.",
    shortDescription:
      "Explore the City of Light with our guided Paris city tour",
    price: 299,
    duration: "3 days",
    location: "Paris, France",
    category: "City Tour",
    images: [
      "/assets/img/destination/01.jpg",
      "/assets/img/destination/02.jpg",
      "/assets/img/destination/03.jpg",
    ],
    highlights: [
      "Eiffel Tower visit",
      "Louvre Museum tour",
      "Seine River cruise",
      "Notre-Dame Cathedral",
      "Montmartre district",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & City Orientation",
        description:
          "Arrive in Paris, check into hotel, and take a guided walking tour of the city center.",
      },
      {
        day: 2,
        title: "Iconic Landmarks",
        description:
          "Visit Eiffel Tower, Louvre Museum, and enjoy a Seine River cruise.",
      },
      {
        day: 3,
        title: "Historic Districts",
        description:
          "Explore Notre-Dame Cathedral and Montmartre district before departure.",
      },
    ],
    includes: [
      "2 nights accommodation",
      "Breakfast daily",
      "Professional guide",
      "Entrance fees",
      "Transportation",
    ],
    excludes: [
      "International flights",
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
    ],
    difficulty: "Easy",
    groupSize: 15,
    rating: 4.8,
    reviews: 156,
    featured: true,
    status: "Active",
  },
  {
    title: "Safari Adventure in Kenya",
    description:
      "Experience the ultimate African safari adventure in Kenya's world-famous national parks. Spot the Big Five, witness the Great Migration, and immerse yourself in authentic African culture.",
    shortDescription:
      "Ultimate African safari experience in Kenya's national parks",
    price: 1299,
    duration: "7 days",
    location: "Nairobi, Kenya",
    category: "Adventure",
    images: [
      "/assets/img/destination/04.jpg",
      "/assets/img/destination/05.jpg",
      "/assets/img/destination/06.jpg",
    ],
    highlights: [
      "Big Five game drives",
      "Great Migration viewing",
      "Maasai village visit",
      "Hot air balloon safari",
      "Cultural experiences",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Nairobi",
        description:
          "Arrive in Nairobi, transfer to hotel, and briefing session.",
      },
      {
        day: 2,
        title: "Masai Mara National Reserve",
        description: "Full day game drive in Masai Mara, home to the Big Five.",
      },
      {
        day: 3,
        title: "Hot Air Balloon Safari",
        description: "Early morning balloon safari over the Mara plains.",
      },
      {
        day: 4,
        title: "Lake Nakuru National Park",
        description: "Visit Lake Nakuru famous for its flamingo population.",
      },
      {
        day: 5,
        title: "Amboseli National Park",
        description: "Game drives with Mount Kilimanjaro as backdrop.",
      },
      {
        day: 6,
        title: "Maasai Village Experience",
        description: "Cultural visit to traditional Maasai village.",
      },
      {
        day: 7,
        title: "Departure",
        description: "Transfer to airport for departure.",
      },
    ],
    includes: [
      "6 nights accommodation",
      "All meals",
      "Professional safari guide",
      "Game drives",
      "Park entrance fees",
      "Transportation",
    ],
    excludes: [
      "International flights",
      "Visa fees",
      "Personal expenses",
      "Travel insurance",
      "Tips",
    ],
    difficulty: "Medium",
    groupSize: 12,
    rating: 4.9,
    reviews: 89,
    featured: true,
    status: "Active",
  },
  {
    title: "Tokyo Cultural Experience",
    description:
      "Immerse yourself in Japanese culture with our Tokyo tour. Experience traditional temples, modern districts, authentic cuisine, and learn about Japan's rich heritage.",
    shortDescription:
      "Cultural immersion tour of Tokyo's traditional and modern attractions",
    price: 599,
    duration: "5 days",
    location: "Tokyo, Japan",
    category: "Cultural",
    images: [
      "/assets/img/destination/07.jpg",
      "/assets/img/destination/08.jpg",
      "/assets/img/destination/09.jpg",
    ],
    highlights: [
      "Senso-ji Temple",
      "Tokyo Skytree",
      "Tsukiji Fish Market",
      "Traditional tea ceremony",
      "Shibuya Crossing",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Asakusa",
        description:
          "Arrive in Tokyo, visit Senso-ji Temple and traditional Asakusa district.",
      },
      {
        day: 2,
        title: "Modern Tokyo",
        description: "Explore Shibuya, Harajuku, and Tokyo Skytree.",
      },
      {
        day: 3,
        title: "Cultural Experiences",
        description:
          "Traditional tea ceremony and visit to Tsukiji Fish Market.",
      },
      {
        day: 4,
        title: "Day Trip to Nikko",
        description: "Visit UNESCO World Heritage sites in Nikko.",
      },
      {
        day: 5,
        title: "Departure",
        description: "Final shopping and transfer to airport.",
      },
    ],
    includes: [
      "4 nights accommodation",
      "Breakfast daily",
      "Professional guide",
      "Entrance fees",
      "Transportation",
      "Tea ceremony experience",
    ],
    excludes: [
      "International flights",
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
    ],
    difficulty: "Easy",
    groupSize: 20,
    rating: 4.7,
    reviews: 203,
    featured: false,
    status: "Active",
  },
];

// Sample contact inquiries
const sampleContacts = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    subject: "Inquiry about Paris Tour",
    message:
      "Hi, I'm interested in booking the Paris City Tour for next month. Could you please provide more details about the accommodation and group size?",
    status: "New",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-0456",
    subject: "Kenya Safari Questions",
    message:
      "Hello, I have some questions about the Kenya Safari tour. What's the best time to visit and do you offer any discounts for group bookings?",
    status: "New",
  },
];

// Sample newsletter subscribers
const sampleNewsletters = [
  {
    email: "newsletter@example.com",
    status: "Active",
  },
  {
    email: "subscriber@example.com",
    status: "Active",
  },
];

// Function to seed the database
export async function seedDatabase() {
  try {
    await connectDB();

    console.log("Starting database seeding...");

    // Clear existing data
    await Tour.deleteMany({});
    await Contact.deleteMany({});
    await Newsletter.deleteMany({});

    // Insert sample tours
    const tours = await Tour.insertMany(sampleTours);
    console.log(`Inserted ${tours.length} tours`);

    // Insert sample contacts
    const contacts = await Contact.insertMany(sampleContacts);
    console.log(`Inserted ${contacts.length} contacts`);

    // Insert sample newsletter subscribers
    const newsletters = await Newsletter.insertMany(sampleNewsletters);
    console.log(`Inserted ${newsletters.length} newsletter subscribers`);

    console.log("Database seeding completed successfully!");

    return {
      tours: tours.length,
      contacts: contacts.length,
      newsletters: newsletters.length,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Function to check if database is empty
export async function isDatabaseEmpty() {
  try {
    await connectDB();

    const tourCount = await Tour.countDocuments();
    const contactCount = await Contact.countDocuments();
    const newsletterCount = await Newsletter.countDocuments();

    return tourCount === 0 && contactCount === 0 && newsletterCount === 0;
  } catch (error) {
    console.error("Error checking database:", error);
    return false;
  }
}
