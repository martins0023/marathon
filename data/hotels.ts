export type Hotel = {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  images: string[];
  summary: string;
};

export const HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'Marathon Suites Lagos',
    location: 'Ikeja, Lagos',
    pricePerNight: 120,
    rating: 4.5,
    images: ['/images/sample-hotel.jpg'],
    summary: 'Modern suites in the heart of the city.'
  },
  {
    id: 'h2',
    name: 'Seaside Apartments',
    location: 'Lekki, Lagos',
    pricePerNight: 80,
    rating: 4.2,
    images: ['/images/sample-hotel.jpg'],
    summary: 'Cozy apartments near the beach.'
  }
];
