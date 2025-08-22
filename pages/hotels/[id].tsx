import { useRouter } from 'next/router';
import Image from 'next/image';
import { HOTELS } from '../../data/hotels';

export default function HotelDetail() {
  const { query } = useRouter();
  const hotel = HOTELS.find(h => h.id === query.id);
  if (!hotel) return <div className="container">Hotel not found</div>;

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">{hotel.name}</h1>
      <p className="mt-2 text-gray-700">{hotel.summary}</p>
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-96 h-56">
          <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover rounded" />
        </div>
        <div>
          <p><strong>Location:</strong> {hotel.location}</p>
          <p><strong>Price:</strong> ${hotel.pricePerNight}/night</p>
        </div>
      </div>
    </div>
  );
}
