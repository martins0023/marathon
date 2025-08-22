import { HOTELS } from '../../data/hotels';
import Image from 'next/image';

export default function HotelsPage() {
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Hotels & Apartments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOTELS.map(h => (
          <div key={h.id} className="bg-white rounded-xl p-4 card-shadow">
            <div className="relative h-44 rounded overflow-hidden">
              <Image src={h.images[0]} alt={h.name} fill className="object-cover" />
            </div>
            <h3 className="font-semibold mt-3">{h.name}</h3>
            <p className="text-sm text-gray-500">{h.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
