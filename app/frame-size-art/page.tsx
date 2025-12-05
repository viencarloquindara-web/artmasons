'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { Ruler, Frame, Palette, CheckCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function FrameSizeArtPage() {
  return (
    <main className={`${playfair.variable} min-h-screen bg-white text-black`}>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Frame & Size Art', href: '/frame-size-art' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Frame & Size Art</h1>

        <div className="font-serif space-y-16 text-gray-700 leading-relaxed">
          
          {/* Introduction */}
          <section>
            <h2 className="font-serif text-3xl font-bold mb-6 text-[#800000]">Perfect Proportions, Timeless Elegance</h2>
            <p className="text-lg mb-4">
              At ART MASONS, we understand that the presentation of your artwork is just as important as the painting itself. Our approach to sizing and framing ensures that every reproduction maintains the authentic proportions and aesthetic integrity of the original masterpiece.
            </p>
            <p className="text-lg">
              Whether you're looking for a specific size or need guidance on framing options, we're here to help you create the perfect display for your space.
            </p>
          </section>

          {/* Size Options */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <Ruler className="text-[#800000]" size={32} />
              <h2 className="font-serif text-3xl font-bold text-[#800000]">Size Options</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">Proportional Accuracy</h3>
                <p className="text-lg mb-4">
                  Unlike many reproduction services that offer standardized sizes, we take a different approach. Our paintings are available either in the exact size of the original artwork or in carefully calculated dimensions that maintain perfect proportional accuracy to the original.
                </p>
                <p className="text-lg">
                  This means you'll never receive a distorted or stretched reproduction that compromises the artist's original vision. Every dimension is calculated to preserve the authentic composition and visual balance of the masterpiece.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">Available Sizes</h3>
                <p className="text-lg mb-4">
                  On each painting's detailed page, you'll find a selection of size options along with their corresponding prices. These sizes are carefully chosen to work well in various spaces while maintaining the artwork's original proportions.
                </p>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-lg font-semibold mb-2 text-[#800000]">Common Size Categories:</p>
                  <ul className="space-y-2 text-lg">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span><strong>Small:</strong> Perfect for intimate spaces, galleries, or as part of a collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span><strong>Medium:</strong> Ideal for living rooms, offices, and feature walls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span><strong>Large:</strong> Statement pieces for grand spaces and impressive displays</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span><strong>Original Size:</strong> Exact dimensions of the historical masterpiece</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">Custom Sizing</h3>
                <p className="text-lg mb-4">
                  If you would like your painting in a size that is not listed on our website, we're happy to accommodate your needs. Simply contact us at <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-semibold">info@artmasons.com</a> with your request.
                </p>
                <p className="text-lg">
                  Our team will guide you through the process and recommend the most suitable dimensions for your space, always ensuring the size remains proportional to the original artwork. This way, your custom-sized piece will perfectly complement your interior while maintaining artistic integrity.
                </p>
              </div>
            </div>
          </section>

          {/* Framing Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Frame className="text-[#800000]" size={32} />
              <h2 className="font-serif text-3xl font-bold text-[#800000]">Framing Your Artwork</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">Why We Ship Unframed</h3>
                <p className="text-lg mb-4">
                  Our paintings are shipped unstretched and unframed due to international mailing limitations. High-quality oil paintings are valuable and delicate artworks that can be easily damaged during transit if shipped already stretched on a frame.
                </p>
                <p className="text-lg">
                  By shipping your painting rolled in a secure protective tube, we ensure it arrives in pristine condition, ready for professional stretching and framing at your location. This method has been proven to be the safest way to transport fine art across long distances.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="font-serif text-xl font-semibold mb-4 text-gray-800">Professional Framing Made Easy</h3>
                <p className="text-lg mb-4">
                  Once your artwork arrives, framing is a simple and enjoyable process. Any professional frame shop will offer a wide selection of options to match your personal style and interior design.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg mb-2 text-[#800000]">Frame Material Options:</p>
                    <ul className="space-y-2 text-lg pl-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                        <span><strong>Wood Frames:</strong> Classic elegance in various finishes (oak, walnut, mahogany, gilt)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                        <span><strong>Metal Frames:</strong> Modern and sleek, perfect for contemporary spaces</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                        <span><strong>Ornate Frames:</strong> Traditional and decorative, ideal for classical paintings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                        <span><strong>Minimalist Frames:</strong> Simple and understated, letting the art take center stage</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <p className="font-semibold text-lg mb-2 text-[#800000]">The Framing Process:</p>
                    <ol className="space-y-3 text-lg list-decimal list-inside">
                      <li>Take your rolled canvas to a local professional frame shop</li>
                      <li>Discuss your preferences with their framing specialists</li>
                      <li>Select a frame style, material, and finish that complements your artwork</li>
                      <li>The shop will stretch your canvas onto a frame and install it in your chosen frame</li>
                      <li>Your artwork will be ready to hang and enjoy in your space</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">Dubai Framing Service</h3>
                <p className="text-lg mb-4">
                  If you are based in Dubai, we are pleased to offer additional assistance with stretching and framing your artwork. Through our trusted network of professional framing partners, we can help you select the ideal frame and ensure your painting is stretched and finished to the highest standard.
                </p>
                <p className="text-lg mb-4">
                  We will connect you directly with one of our recommended frame shops, where you can choose from a wide variety of materials, finishes, and styles that complement both your artwork and your interior design.
                </p>
                <div className="bg-[#800000] text-white p-6 rounded-lg">
                  <p className="text-lg">
                    <strong>Note:</strong> All payments for stretching and framing are made directly to the framing shop, giving you full transparency and flexibility in selecting the service that best meets your needs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Choosing the Right Frame */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="text-[#800000]" size={32} />
              <h2 className="font-serif text-3xl font-bold text-[#800000]">Choosing the Right Frame</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg">
                The frame you choose can dramatically enhance the presentation of your artwork. Here are some guidelines to help you make the perfect choice:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">For Classical Paintings</h3>
                  <ul className="space-y-2 text-lg">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Ornate gilt or wooden frames in warm tones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Wider frames with decorative details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Traditional museum-style framing</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">For Impressionist Works</h3>
                  <ul className="space-y-2 text-lg">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Simple wooden frames in natural tones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Light-colored or white frames</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Medium-width frames that don't overpower</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">For Modern Art</h3>
                  <ul className="space-y-2 text-lg">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Sleek metal frames in black or silver</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Minimalist wooden frames</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Float frames for a contemporary look</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">General Tips</h3>
                  <ul className="space-y-2 text-lg">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Consider your room's color scheme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Match the frame to your interior style</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                      <span>Don't let the frame overpower the artwork</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-[#800000] text-white p-8 rounded-lg text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Need Assistance?</h2>
            <p className="text-lg mb-6">
              Our team is here to help you choose the perfect size and provide guidance on framing options that will beautifully showcase your artwork.
            </p>
            <div className="space-y-2">
              <p className="text-lg">
                <strong>Email us at:</strong> <a href="mailto:info@artmasons.com" className="underline hover:text-gray-200 transition-colors">info@artmasons.com</a>
              </p>
              <p className="text-lg">
                We typically respond within 24 hours
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
