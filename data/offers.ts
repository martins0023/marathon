// data/offers.ts
export type Amenity = { label: string };

export type Offer = {
  slug: string;
  offerType?: string;
  title: string;
  noOfPeople?: string | number;
  description?: string;
  price: string;
  src: string;
  oldPrice?: string;
  badge?: string | undefined;
  beds?: number;
  amenities?: Amenity[];
};

export type Room = {
  slug: string;
  title: string;
  short: string;
  price: string;
  oldPrice?: string;
  beds?: number;
  description: string;
  amenities: string[];
  images: string[];
  related?: string[]; // slugs
};

/**
 * OFFERS - used on the Home / listing pages
 */
export const OFFERS: Offer[] = [
  {
    slug: "honeymoon",
    offerType: "Room",
    title: "Honeymoon",
    noOfPeople: "2",
    description: "Indulge in a Memorable One-Time Romantic Dinner for Two",
    price: "₦699",
    src: "/images/honeymoon.png",
    oldPrice: "₦899",
    badge: "20% OFF",
    beds: 2,
    amenities: [{ label: "Free wifi" }, { label: "Breakfast included" }],
  },
  {
    slug: "meetings",
    offerType: "Room",
    title: "Meetings",
    noOfPeople: "10",
    description:
      "Experience an Exclusively Private Environment to Boost Your Productivity",
    price: "₦999",
    src: "/images/meetings.png",
    oldPrice: "₦1,299",
    badge: "10% OFF",
    beds: 0,
    amenities: [{ label: "Projector" }, { label: "Catering" }],
  },
  {
    slug: "romantic-dining",
    offerType: "Dining",
    title: "Romantic Dining",
    noOfPeople: "2",
    description: "Indulge in a Memorable One-Time Romantic Dinner for Two",
    price: "₦499",
    src: "/images/romantic-dining.png",
    oldPrice: "₦649",
    badge: undefined,
    beds: 0,
    amenities: [{ label: "Private seating" }, { label: "Chef special" }],
  },
];

/**
 * ROOMS - used on the details page for full room data (images, related slugs, etc.)
 */
export const ROOMS: Room[] = [
  {
    slug: "honeymoon",
    title: "Honeymoon Suite",
    short: "Luxury stay for two",
    price: "₦200,000",
    oldPrice: "₦250,000",
    beds: 2,
    description:
      "Relax in our Honeymoon Suite — curated with romantic lighting, a king bed, private balcony and an intimate dining experience.",
    amenities: [
      "Free wifi 24/7",
      "Big TV",
      "Air condition",
      "Free clean bathroom",
      "Breakfast included",
    ],
    images: [
      "/images/room1-1.png",
      "/images/room1-2.png",
      "/images/room1-3.png",
      "/images/room1-4.png",
    ],
    related: ["meetings", "romantic-dining"],
  },
  {
    slug: "meetings",
    title: "Meetings Room",
    short: "Private meeting space",
    price: "₦999,000",
    beds: 0,
    description:
      "Private meeting rooms with projector, high-speed internet, and full service catering options.",
    amenities: ["Free wifi 24/7", "Projector", "Whiteboard", "Catering available"],
    images: ["/images/meetings-1.jpg", "/images/meetings-2.jpg", "/images/meetings-3.jpg"],
    related: ["honeymoon"],
  },
  {
    slug: "romantic-dining",
    title: "Romantic Dining",
    short: "Dining for two",
    price: "₦499,000",
    beds: 0,
    description: "Candlelit dining with a curated menu and private service.",
    amenities: ["Free wifi 24/7", "Private seating", "Chef special"],
    images: ["/images/dining-1.jpg", "/images/dining-2.jpg", "/images/dining-3.jpg"],
    related: ["honeymoon"],
  },
];
