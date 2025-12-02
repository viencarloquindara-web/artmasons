'use client';

import React from 'react';
import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function DeliveryInfoPage() {
  return (
    <main className={`${playfair.variable} ${inter.variable} min-h-screen bg-white text-black font-sans`}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#800000] transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Delivery Information</h1>

        <div className="space-y-12 text-gray-700 leading-relaxed">
          
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4">Cost of Delivery</h2>
            <p>
              We are delighted to offer free shipping. There are no additional standard delivery charges.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-4">Delivery Timeframes</h2>
            <ul className="list-disc pl-5 space-y-2">
               <li><strong>Free Standard Shipping:</strong> 10–14 working days (after the painting is created and dried).</li>
               <li><strong>Express Shipping via DHL:</strong> 2–4 working days (available if the customer is willing to pay extra).</li>
            </ul>
            <p className="mt-4 italic text-sm text-gray-500">
               Note: This shipping time is in addition to the 8–10 weeks required for the creation and drying of your hand-painted artwork.
            </p>
          </section>

          <section>
             <h2 className="font-serif text-2xl font-bold mb-4">Shipping Method & Packaging</h2>
             <p className="mb-4">
               We ship our paintings using globally recognised and reputable courier companies to ensure safe and reliable delivery. All unframed art reproductions are carefully rolled and placed into secure, protective postal tubes to prevent any damage during transit.
             </p>
             <p>
               If you would like to track your shipment, we will provide an online tracking number via email as soon as your painting has been dispatched.
             </p>
          </section>

          <section>
             <h2 className="font-serif text-2xl font-bold mb-4">Address Requirements</h2>
             <p className="mb-4">
               Please ensure that the delivery address provided is accurate and that someone is available to receive the shipment, as this is the customer’s responsibility.
             </p>
             <div className="bg-red-50 border-l-4 border-red-800 p-4 text-sm">
                <strong>Important:</strong> Please note that we do not ship to P.O. Boxes. A physical home or business address is required for all deliveries to ensure safe and successful receipt of your artwork.
             </div>
             <p className="mt-4">
                Any additional delivery costs beyond the original delivery address are not the ART MASONS responsibility and must be paid for by the customer, we appreciate your kind understanding.
             </p>
          </section>

        </div>
      </div>
    </main>
  );
}