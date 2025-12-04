'use client';

import React from 'react';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function TermsConditionsPage() {
  return (
    <main className={`${playfair.variable} min-h-screen bg-white text-black`}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#800000] transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Terms and Conditions</h1>

        <div className="font-serif space-y-10 text-gray-700 leading-relaxed">
          
          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Website Access</h3>
             <p className="mb-2">We grant you limited, personal access to our website as a customer. You may not reproduce, duplicate, copy, sell, or otherwise exploit any content from the website for commercial purposes.</p>
             <p className="mb-2">This includes, but is not limited to: product images, listings, descriptions, videos, pricing, page layout, design, trade dress, trademarks, and logos.</p>
             <p>You may not use any meta tags, search terms, or key terms that contain the website’s name or trademarks.</p>
          </section>

          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Copyright</h3>
             <p>
                All website content is either our property, in the public domain, or provided by content suppliers, and is protected by international copyright laws. Content not owned by us is used with permission.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Pricing and Availability</h3>
             <p>
                The price you pay for products is the price shown on the website at the time of purchase. Despite our best efforts, some items may occasionally be unavailable. We reserve the right to update product prices at any time.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Product Descriptions</h3>
             <p>
                We strive to describe our products accurately and completely. If a purchased product does not match its description, your sole remedy is to return it in unused condition for a replacement or refund.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Invoicing</h3>
             <p>Customers will receive a purchase confirmation email upon completing an order.</p>
          </section>

          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Time for Creation – Hand-Painted Fine Art Reproductions</h3>
             <p>
                Hand-painted art reproductions require careful craftsmanship and sufficient drying time. We require 8–10 weeks from the moment of order to prepare your painting for shipment. The timeframe varies depending on complexity and size of the artwork.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Delivery Information</h3>
             <p>Customers are responsible for providing accurate delivery details.</p>
             <ul className="list-disc pl-5 mt-2">
                <li>We offer Free standard shipping: 10–14 working days</li>
                <li>Express shipping via DHL: 2–4 working days if the customer is willing to pay extra</li>
             </ul>
          </section>

          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Return Rights</h3>
             <p>
                ART MASONS is committed to quality and your satisfaction. If you are not satisfied with your order, you may return it within 14 days of receipt for adjustments or corrections.
             </p>
             <div className="mt-4 mb-4">
                 <strong>Please note:</strong>
                 <ul className="list-disc pl-5 mt-2">
                    <li>Returns are assessed at our discretion, and a valid reason must be provided.</li>
                    <li>Contact us by email on <a href="mailto:info@artmasons.com" className="underline">info@artmasons.com</a> before returning the item to clarify the issue.</li>
                    <li>Shipping costs are non-refundable.</li>
                 </ul>
             </div>
             <p className="font-bold">Damaged Items:</p>
             <p>If your painting arrives damaged:</p>
             <ol className="list-decimal pl-5 mt-2 mb-4">
                <li>Take a digital photo of the painting and the shipping container.</li>
                <li>Email these images with your order number, painting name, and description of the issue to <a href="mailto:info@artmasons.com" className="underline">info@artmasons.com</a></li>
                <li>Indicate the areas you would like us to address.</li>
             </ol>
             <p>
                If you choose to return the painting, please pack it in the original postal tube. We strongly encourage shipping via a traceable method.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-2xl font-bold mb-2">Conclusion</h3>
             <p>
                These terms are governed by DIFC law. Any contract for the purchase of goods from this website, and any dispute arising from it, will also be governed by DIFC law.
             </p>
          </section>

        </div>
      </div>
    </main>
  );
}