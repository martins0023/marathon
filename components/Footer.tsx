import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" bg-white py-8">
      {/* Footer-ish small CTA */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold">Ready to experience Marathon?</h4>
            <p className="text-gray-600">
              Book directly for the best rates and exclusive offers.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/rooms"
              className="px-6 py-3 bg-primary text-white font-semibold"
            >
              Browse rooms
            </Link>
            <Link href="/contact" className="px-6 py-3 border border-gray-200">
              Contact us
            </Link>
          </div>
        </div>
      </section>
      <div className="container mt-10 text-sm text-gray-600">
        © {new Date().getFullYear()} Marathon — Hotels & Apartments.
      </div>
    </footer>
  );
}
