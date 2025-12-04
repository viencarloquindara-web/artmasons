'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { ArrowLeft, User } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

// --- THEME COLORS ---
const THEME_RED = '#800000';

// --- DATA: CURATED COLLECTION ---
const COLLECTION_DATA = [
  { artist: "John Otis Adams", title: "In Poppyland (Poppy field)" },
  { artist: "Wilem Van Aelst", title: "Glass Vase With Branches Bearing Fruit" },
  { artist: "Wilem Van Aelst", title: "Still Life With A Basket Of Fruit On A Marble Edge" },
  { artist: "Wilem Van Aelst", title: "Still Life Fruit And Crystal Vase" },
  { artist: "Wilem Van Aelst", title: "Still Life Grapes, A Roemer, A Silver Ewer And A Plate" },
  { artist: "Wilem Van Aelst", title: "The Breakfast" },
  { artist: "Pieter Aertsen", title: "The Market Scene" },
  { artist: "Pieter Aertsen", title: "The Egg Dance" },
  { artist: "Jaques-Laurent Agasse", title: "The Nubian Giraffe" },
  { artist: "Jaques-Laurent Agasse", title: "A Pointer In Landscape" },
  { artist: "Ivan Konstantinovich Aivazovsky", title: "The Rainbow" },
  { artist: "Ivan Konstantinovich Aivazovsky", title: "Boat On The Nile With Pyramids Of Gizeh" },
  { artist: "Ivan Konstantinovich Aivazovsky", title: "Sunrise In Yalta" },
  { artist: "John White Alexander", title: "Repose" },
  { artist: "John White Alexander", title: "Repose (Lady Reading A Book)" },
  { artist: "Sir Lawreance Alma-Tadema", title: "The favourite Poet" },
  { artist: "Sir Lawreance Alma-Tadema", title: "The Coign Of Vantage" },
  { artist: "Sir Lawreance Alma-Tadema", title: "The Years At Spring. All's Right With The World" },
  { artist: "Sir Lawreance Alma-Tadema", title: "Under The Roof Of The Blue Ionion Weather" },
  { artist: "Joachim Beuckelaer", title: "Green Grocers Stall With The Flight Into Egypt Boyond" },
  { artist: "Pompeo Girolamo Batoni", title: "St Paul" },
  { artist: "Pompeo Girolamo Batoni", title: "St Peter" },
  { artist: "Pompeo Girolamo Batoni", title: "Matthew" },
  { artist: "Pompeo Girolamo Batoni", title: "God The Father" },
  { artist: "Pompeo Girolamo Batoni", title: "Madonna and Child" },
  { artist: "Barthel Beham", title: "Portrait Ludwig X Of Bavaria" },
  { artist: "Giovanni Bellini", title: "Feast Of The Gods" },
  { artist: "Antonio De Bellis", title: "Saint Sebastian" },
  { artist: "Bernado Belotto", title: "View Of. Perna From The Right Bank Of The Elbe" },
  { artist: "Bernado Belotto", title: "The Liechestein Garden Palace From The Garden Side" },
  { artist: "Bernado Belotto", title: "Square With The Kreuz In Dresden" },
  { artist: "Bernado Belotto", title: "The Ponte Vecchio Florence" },
  { artist: "Frank Weston Benson", title: "Portrait of My Daughters" },
  { artist: "Frank Weston Benson", title: "Summer" },
  { artist: "Jean Beraud", title: "The Cycle Shop In The Bois Du Boulonge" },
  { artist: "Jean Beraud", title: "After The Service At The Church Of Holy Trinity Christmas" },
  { artist: "Jean Beraud", title: "Pont Neuf" },
  { artist: "Albert Bierstadt", title: "Moose" },
  { artist: "Albert Bierstadt", title: "Valley of Yosemite" },
  { artist: "Thomas Birch", title: "Philadelphia Winter Landscape" },
  { artist: "Eugen De Blaas", title: "The Eavesdropper" },
  { artist: "Edmund Blair (Leighton)", title: "God Speed" },
  { artist: "Edmund Blair (Leighton)", title: "The Accolade" },
  { artist: "Edmund Blair (Leighton)", title: "Tristan And Isolade" },
  { artist: "Edmund Blair (Leighton)", title: "Lilac" },
  { artist: "Edmund Blair (Leighton)", title: "How Liza Loved The King" },
  { artist: "Edmund Blair (Leighton)", title: "The Golden Train" },
  { artist: "Nikolay Bogdanov Belsky", title: "Young Drivers On A Bear Hunt" },
  { artist: "Giovanni Boldini", title: "The Two Children" },
  { artist: "Francois Boucher", title: "The Love Letter" },
  { artist: "Francois Boucher", title: "Madame De Pompadour" },
  { artist: "Francois Boucher", title: "The Rising Of The Sun" },
  { artist: "Francois Boucher", title: "The Four Seasons Spring" },
  { artist: "Valentin De Boulogne", title: "Samson" },
  { artist: "Valentin De Boulogne", title: "The Fortune Teller" },
  { artist: "Valentin De Boulogne", title: "Moses With The Tablets Of The Law" },
  { artist: "Valentin De Boulogne", title: "Last Supper" },
  { artist: "Valentin De Boulogne", title: "David With The Head Of Goliath Two Soldiers" },
  { artist: "Frederick Arthur Bridgman", title: "The Siesta (Afternoon In Dreams)" },
  { artist: "Frederick Arthur Bridgman", title: "Dolce For Niente (Sweet Nothings)" },
  { artist: "Frederick Arthur Bridgman", title: "Tender Moments" },
  { artist: "Frederick Arthur Bridgman", title: "Arab Woman On A Rooftop Algiers" },
  { artist: "Pieter Bruegel The Elder", title: "The Tower Of Babel" },
  { artist: "Pieter Bruegel The Elder", title: "The Wedding Dance" },
  { artist: "Augostino Brunias", title: "Two Carribean Women Returning From The Market" },
  { artist: "Gustave Caillebotte", title: "The Floor Scrapers" },
  { artist: "Gustave Caillebotte", title: "Young Man At His Window" },
  { artist: "Gustave Caillebotte", title: "The Yerres Rain (Riverbank In The Rain)" },
  { artist: "Gustave Caillebotte", title: "Paris Street Rainy Weather" },
  { artist: "Gustave Caillebotte", title: "View Of The Roofs Snow Effect" },
  { artist: "Gustave Caillebotte", title: "Still Life With Oysters" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "View Of Grand Canal From San Vio Venice" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "Grand Canal From Palazzo Balbi" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "Piazza San Marco With The Cathedral" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "Piazzetta And The Doge's Palace" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "St Paul's Cathedral" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "The Coloseum" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "View Of Rialto Bridge At Venice South" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "Entrance To The Grand Canal Looking West" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "The Entrance To The Grand Canal Venice" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "Capriccio With Colonnade In The Interior Of The Palace" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "Rome A Caprice Viw With Ruins Based On The Forum" },
  { artist: "Giovanni Antonio Canal Canaletto", title: "Venice The Interior Of St Marco By Day" },
  { artist: "Michelangelo Merisi Da Caravaggio", title: "The Supper at Emmaus" },
  { artist: "Michelangelo Merisi Da Caravaggio", title: "Bacchus" },
  { artist: "Michelangelo Merisi Da Caravaggio", title: "The Calling Of Saint Matthew" },
  { artist: "Michelangelo Merisi Da Caravaggio", title: "The Conversion Of Saint Paul" },
  { artist: "Michelangelo Merisi Da Caravaggio", title: "Judith Beheading Holofernes" },
  { artist: "Michelangelo Merisi Da Caravaggio", title: "David With The Head Of Goliath" },
  { artist: "Charles Emile August Caralus -Duran", title: "Marie-Anne Caralus Duran ( The Artists Daughter)" },
  { artist: "Paul Cezanne", title: "The Card Players" },
  { artist: "Paul Cezanne", title: "Monte Sainte-Victoire" },
  { artist: "Paul Cezanne", title: "Still Life With Apples" },
  { artist: "Paul Cezanne", title: "The Bathers" },
  { artist: "Paul Cezanne", title: "View Through The Trees L' Estaque" },
  { artist: "Paul Cezanne", title: "Still Life Leg Of Mutton Bread" },
  { artist: "Paul Cezanne", title: "Still Life Bread And Eggs" },
  { artist: "Philippe De Champaigne", title: "Portrait Of Cardinal Richelieu" },
  { artist: "Philippe De Champaigne", title: "Triple Portrait Of Cardinal Richelieu" },
  { artist: "Philippe De Champaigne", title: "The Annunciation" },
  { artist: "Philippe De Champaigne", title: "Portrait Of A Man Possibly Of Robert Arnauld Of Andilly" },
  { artist: "Jean Baptiste-Simeon Chardin", title: "Basket Of Wild Strawberries" },
  { artist: "Jean Baptiste-Simeon Chardin", title: "Glass Of Water And Coffee Pot" },
  { artist: "Eduard Charlemont", title: "The Moorish Chief" },
  { artist: "Eduard Charlemont", title: "Austrian" },
  { artist: "William Merrit Chase", title: "Fish And Still Life" },
  { artist: "William Merrit Chase", title: "Dora Wheeler" },
  { artist: "William Merrit Chase", title: "A Corner Of My Studio" },
  { artist: "William Merrit Chase", title: "Venice Façade" },
  { artist: "William Merrit Chase", title: "The Antiquary Shop" },
  { artist: "William Merrit Chase", title: "I think I am Ready Now" },
  { artist: "Pieter Claesz", title: "Still Life With Large Roemer, Lemon and Grapes" },
  { artist: "Pieter Claesz", title: "Still Life Lobster" },
  { artist: "Pieter Claesz", title: "Fruit Still Life With Basket Of Cheese" },
  { artist: "Pieter Claesz", title: "Tabletop Still Life Pigeon Pie and Delfware Jug" },
  { artist: "Pieter Claesz", title: "Still Life Books Burning Candle" },
  { artist: "Pieter Claesz", title: "A Breakfast Still Life With Strawberries and Cherries" },
  { artist: "Pieter Claesz", title: "Vanitas Still Life (Violin)" },
  { artist: "Pieter Claesz", title: "Still Life With Crab" },
  { artist: "Georges Clarin", title: "Portrait Of Sarah Bernhardt" },
  { artist: "Jean The Younger Clouet", title: "Portrait Of Francis I Roi De France" },
  { artist: "Francois Clouet", title: "Head Of A Man" },
  { artist: "Francois Clouet", title: "Portrait Of Charles IX" },
  { artist: "Francois Clouet", title: "Portrait of Henri II King Of France" },
  { artist: "Francois Clouet", title: "Portrait Of Elizabeth Of Austria" },
  { artist: "Francois Clouet", title: "Portrait Of Odet De Coligny Cardinal Of Chatillon" },
  { artist: "Francois Clouet", title: "Portrait Of Mary Queen Of Scots" },
  { artist: "Francois Clouet", title: "Portrait Henri VI England" },
  { artist: "Francois Clouet", title: "Portrait Of Catherine De Medici" },
  { artist: "Francois Clouet", title: "Portrait King Charles IX Of France" },
  { artist: "Francois Clouet", title: "Portrait Of Elizabeth Of Austris Queen Of France" },
  { artist: "Francois Clouet", title: "Portrait Of Louise De Lorraine" },
  { artist: "Adriaen Coote", title: "Still Life Asparagus and Red Currants" },
  { artist: "Adriaen Coote", title: "Four Apricots Ob A Stone Plinth" },
  { artist: "Adriaen Coote", title: "Three Peaches On A Stone Plinth" },
  { artist: "Adriaen Coote", title: "Gooseberries On A Table" },
  { artist: "Edouard Cortes", title: "Quai Du Louvre In Winter" },
  { artist: "Melchior D'Hondecoeter", title: "Peacocks" },
  { artist: "Melchior D'Hondecoeter", title: "A Cockrel With Other Birds" },
  { artist: "Melchior D'Hondecoeter", title: "Palace Of Amsterdam With Exotic Birds" },
  { artist: "Leonardo Da Vinci", title: "Mona Lisa (La Gioconda)" },
  { artist: "Leonardo Da Vinci", title: "St John The Baptist" },
  { artist: "Leonardo Da Vinci", title: "The Last Supper" },
  { artist: "Leonardo Da Vinci", title: "The Virgin On The Rocks" },
  { artist: "Leonardo Da Vinci", title: "Virgin And Child With St Anne" },
  { artist: "Jaques-Louis David", title: "Death Of Marat" },
  { artist: "Jaques-Louis David", title: "Lictors Bearing To Brutus The Bodies Of His Sons" },
  { artist: "Jaques-Louis David", title: "The Death Of Socrates" },
  { artist: "Jaques-Louis David", title: "The Emporer Napoleon In His Study At The Tuileries" },
  { artist: "Jaques-Louis David", title: "Mars Disarmed By Venus And The Three Graces" },
  { artist: "Jaques-Louis David", title: "The Coronation Of Napoleon" },
  { artist: "Jaques-Louis David", title: "Emporer Napoleon I" },
  { artist: "Hilaire Germaine Edgar Degas", title: "Dancers In Pink" },
  { artist: "Hilaire Germaine Edgar Degas", title: "Two Dancers On A Stage" },
  { artist: "Hilaire Germaine Edgar Degas", title: "The Opera Orchestra" },
  { artist: "Hilaire Germaine Edgar Degas", title: "Portrait Of Emma Dobigny" },
  { artist: "Hilaire Germaine Edgar Degas", title: "Miss La La At The Cirque Fernando" },
  { artist: "Hilaire Germaine Edgar Degas", title: "After The Bath Woman Drying Her Neck" },
  { artist: "Hilaire Germaine Edgar Degas", title: "Blue Dancers" },
  { artist: "Alexandre-Francois Desportes", title: "Pompee And Florissant The Dogs Of Lois XV" },
  { artist: "Alexandre-Francois Desportes", title: "Diane Ans Blondie" },
  { artist: "Thomas Eakins", title: "Sailboats Racing On The Delaware" },
  { artist: "Thomas Eakins", title: "The Belgin Brothers Racing" },
  { artist: "Muad Earl", title: "Borzoi Heads" },
  { artist: "Gentile De Fabriano", title: "Adoration Of The Magi" },
  { artist: "Hippolyte Flandrin", title: "Nude Youth Sitting B The Sea" },
  { artist: "Hippolyte Flandrin", title: "Madame Hippolyte Flandrin" },
  { artist: "Thomas Gainsborough", title: "Portrait" },
  { artist: "Paul Gauguin", title: "Two Tahitian Women" },
  { artist: "Vincent Van Gogh", title: "Starry Night" },
  { artist: "Vincent Van Gogh", title: "Irises" },
  { artist: "Vincent Van Gogh", title: "Red Vineyards At Airies" },
  { artist: "Vincent Van Gogh", title: "Vincent's Chair With His Pipe" },
  { artist: "Vincent Van Gogh", title: "Still Life Vase. With Fourteen Sunflowers" },
  { artist: "Vincent Van Gogh", title: "Self Portrait With Bandaged Ear And Pipe" },
  { artist: "Vincent Van Gogh", title: "Portrait Of Dr Felix Rey" },
  { artist: "Vincent Van Gogh", title: "Portrait Of The Postman Joseph Roulin" },
  { artist: "Vincent Van Gogh", title: "Lilac Bush (lilacs)" },
  { artist: "Vincent Van Gogh", title: "The Olive Trees" },
  { artist: "Vincent Van Gogh", title: "Wheat Field With Cypresses" },
  { artist: "Vincent Van Gogh", title: "Lanscape Of Wheat Sheaves And Rising Moon" },
  { artist: "Vincent Van Gogh", title: "Self Portrait" },
  { artist: "Vincent Van Gogh", title: "The Reaper (after Millet)" },
  { artist: "Vincent Van Gogh", title: "Vincent's Bedroom In Airies" },
  { artist: "Vincent Van Gogh", title: "The Mulberry Tree" },
  { artist: "Vincent Van Gogh", title: "Olive Tress" },
  { artist: "Vincent Van Gogh", title: "Blossoming Almomd Tree" },
  { artist: "Vincent Van Gogh", title: "Vase With Irises Against Yellow Background" },
  { artist: "Vincent Van Gogh", title: "Vase Of Roses" },
  { artist: "Vincent Van Gogh", title: "Landscape Couple Walking Crescent Moon" },
  { artist: "Vincent Van Gogh", title: "Portrait Of Doctor Gachet" },
  { artist: "Vincent Van Gogh", title: "Whaet Field With Crows 1890" },
  { artist: "Vincent Van Gogh", title: "Starry Night Over The Rhone" },
  { artist: "Vincent Van Gogh", title: "The Cafe Terrace On The Place Du Forum Airies" },
  { artist: "Vincent Van Gogh", title: "Haystacks In Provence" }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// --- HELPER ---
const getSurnameChar = (fullName: string) => {
  const parts = fullName.trim().split(' ');
  
  // Check for "De" or "Da" prefixes - count them as "D"
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === 'De' || parts[i] === 'Da') {
      return 'D';
    }
  }
  
  // For "Van" prefix, use the next word
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i] === 'Van') {
      return parts[i + 1].charAt(0).toUpperCase();
    }
  }
  
  // Default: use last name
  const surname = parts[parts.length - 1];
  return surname.charAt(0).toUpperCase();
};

// Helper function to generate slug from artwork title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .trim();
};

export default function ArtistsAZPage() {
  const [selectedLetter, setSelectedLetter] = useState<string>('A');

  // Derive unique artists from the collection data
  const uniqueArtists = useMemo(() => {
    const artists = COLLECTION_DATA.map(item => item.artist);
    return Array.from(new Set(artists)).sort();
  }, []);

  // Get count of artists per letter
  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALPHABET.forEach(letter => {
      counts[letter] = uniqueArtists.filter(artist => getSurnameChar(artist) === letter).length;
    });
    return counts;
  }, [uniqueArtists]);

  const filteredArtists = useMemo(() => {
    if (!selectedLetter) return [];
    return uniqueArtists.filter(artist => getSurnameChar(artist) === selectedLetter);
  }, [selectedLetter, uniqueArtists]);

  // Get artworks by selected artists
  const getArtworksByArtist = (artist: string) => {
    return COLLECTION_DATA.filter(item => item.artist === artist).map(item => item.title);
  };

  return (
    <main className={`${playfair.variable} min-h-screen bg-white text-black font-serif`}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#800000] transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-[#800000]">Artists A-Z</h1>
          <p className="font-serif text-lg text-gray-600 max-w-3xl">
            Explore our curated collection of master artists from throughout history. Browse by last name to discover their available works.
          </p>
        </div>

        {/* Alphabet Filter */}
        <div className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="font-serif text-xl font-bold mb-4 text-gray-800">Browse by Letter</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {ALPHABET.map((letter) => {
              const count = letterCounts[letter];
              const hasArtists = count > 0;
              
              return (
                <button
                  key={letter}
                  onClick={() => hasArtists && setSelectedLetter(letter)}
                  disabled={!hasArtists}
                  className={`
                    relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-200 rounded font-serif text-lg font-bold
                    ${!hasArtists 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : selectedLetter === letter 
                        ? 'bg-[#800000] text-white shadow-lg scale-110' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#800000] hover:text-[#800000] hover:scale-105 shadow-sm'
                    }
                  `}
                >
                  {letter}
                  {hasArtists && count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#800000] text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        <div className="min-h-[400px]">
          {filteredArtists.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-gray-800">
                  <span className="text-4xl font-bold text-[#800000]">{filteredArtists.length}</span> {filteredArtists.length === 1 ? 'Artist' : 'Artists'} starting with "{selectedLetter}"
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtists.map((artist, idx) => {
                  const artworks = getArtworksByArtist(artist);
                  
                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#800000]"
                    >
                      <div className="flex items-start gap-4 mb-5">
                        <div className="flex-shrink-0 w-14 h-14 bg-[#800000] rounded-full flex items-center justify-center">
                          <User className="text-white" size={26} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-serif text-2xl font-bold text-[#800000] leading-tight">
                            {artist}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-serif text-base font-semibold text-gray-600">
                          <span className="text-2xl font-bold text-[#800000]">{artworks.length}</span> {artworks.length === 1 ? 'Artwork' : 'Artworks'}
                        </p>
                        <ul className="space-y-2">
                          {artworks.map((artwork, artIdx) => {
                            const slug = generateSlug(artwork);
                            
                            return (
                              <li key={artIdx}>
                                <Link 
                                  href={`/artworks/${slug}`}
                                  className="font-serif text-gray-700 text-base flex items-start gap-2 hover:text-[#800000] transition-colors leading-relaxed group"
                                >
                                  <span className="text-[#800000] mt-1">•</span>
                                  <span className="flex-1 group-hover:underline">{artwork}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="text-gray-400" size={40} />
              </div>
              <p className="text-xl font-serif text-gray-400 mb-2">No artists found for letter "{selectedLetter}"</p>
              <p className="font-serif text-sm text-gray-500">Try selecting a different letter above</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}