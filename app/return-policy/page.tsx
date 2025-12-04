'use client';

import React from 'react';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function ReturnPolicyPage() {
  return (
    <main className={`${playfair.variable} min-h-screen bg-white text-black`}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#800000] transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Return Policy</h1>

        <div className="font-serif space-y-8 text-gray-700 leading-relaxed">
          
          <p>
            At ART MASONS, we are committed to quality and your satisfaction is 100% guaranteed. If for reasonable reason you are not satisfied with your order, you may return it within 14 days of receipt for corrections or a full refund.
          </p>

          <p>
            Please note that returns are evaluated at our discretion, and a valid reason for the return must be provided. Before returning any item, please contact us by email on <a href="mailto:info@artmasons.com" className="underline">info@artmasons.com</a> so we can clarify the issue and guide you through the process. Shipping costs are non-refundable.
          </p>

          <section className="bg-gray-50 p-8 rounded-sm border-l-4 border-[#800000]">
            <h3 className="font-serif text-2xl font-bold mb-4 text-black">Damaged Items</h3>
            <p className="mb-4">If your painting arrives damaged during transportation:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Take a digital photo of the painting and the shipping container.</li>
              <li>
                Email the images to <a href="mailto:info@artmasons.com" className="underline">info@artmasons.com</a> along with:
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                   <li>Your order number</li>
                   <li>Painting name</li>
                   <li>A brief description of the issue</li>
                   <li>Whether you would like a correction, free replacement, or refund</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-serif text-2xl font-bold mb-4 text-black">Returning Your Painting</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>If you choose to return the painting, pack it carefully in the original postal tube.</li>
              <li>Clearly specify the reason for the return and the action you would like us to take.</li>
              <li>We strongly recommend using a traceable shipping method to ensure safe delivery.</li>
            </ul>
            <p className="mt-4">
              By following these steps, we can quickly and efficiently resolve any issues and ensure your satisfaction with your hand-painted artwork.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}