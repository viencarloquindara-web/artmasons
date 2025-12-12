'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { User } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

// --- DATA: CURATED COLLECTION ---
const COLLECTION_DATA = [
  { artist: "John Otis Adams", birth: 1851, death: 1927, title: "In Poppyland (Poppy field)" },
  { artist: "Wilem Van Aelst", birth: 1627, death: 1683, title: "Glass Vase With Branches Bearing Fruit" },
  { artist: "Wilem Van Aelst", birth: 1627, death: 1683, title: "Still Life With A Basket Of Fruit On A Marble Edge" },
  { artist: "Wilem Van Aelst", birth: 1627, death: 1683, title: "Still Life Fruit And Crystal Vase" },
  { artist: "Wilem Van Aelst", birth: 1627, death: 1683, title: "Still Life Grapes, A Roemer, A Silver Ewer And A Plate" },
  { artist: "Wilem Van Aelst", birth: 1627, death: 1683, title: "The Breakfast" },
  { artist: "Pieter Aertsen", birth: 1508, death: 1575, title: "The Market Scene" },
  { artist: "Pieter Aertsen", birth: 1508, death: 1575, title: "The Egg Dance" },
  { artist: "Jaques-Laurent Agasse", birth: 1767, death: 1849, title: "The Nubian Giraffe" },
  { artist: "Jaques-Laurent Agasse", birth: 1767, death: 1849, title: "A Pointer In Landscape" },
  { artist: "Ivan Konstantinovich Aivazovsky", birth: 1817, death: 1900, title: "The Rainbow" },
  { artist: "Ivan Konstantinovich Aivazovsky", birth: 1817, death: 1900, title: "Boat On The Nile With Pyramids Of Gizeh" },
  { artist: "Ivan Konstantinovich Aivazovsky", birth: 1817, death: 1900, title: "Sunrise In Yalta" },
  { artist: "John White Alexander", birth: 1856, death: 1915, title: "Repose" },
  { artist: "John White Alexander", birth: 1856, death: 1915, title: "Repose (Lady Reading A Book)" },
  { artist: "Sir Lawreance Alma-Tadema", birth: 1836, death: 1912, title: "The favourite Poet" },
  { artist: "Sir Lawreance Alma-Tadema", birth: 1836, death: 1912, title: "The Coign Of Vantage" },
  { artist: "Sir Lawreance Alma-Tadema", birth: 1836, death: 1912, title: "The Years At Spring. All's Right With The World" },
  { artist: "Sir Lawreance Alma-Tadema", birth: 1836, death: 1912, title: "Under The Roof Of The Blue Ionion Weather" },
  { artist: "Joachim Beuckelaer", birth: 1533, death: 1574, title: "Green Grocers Stall With The Flight Into Egypt Boyond" },
  { artist: "Pompeo Girolamo Batoni", birth: 1708, death: 1787, title: "St Paul" },
  { artist: "Pompeo Girolamo Batoni", birth: 1708, death: 1787, title: "St Peter" },
  { artist: "Pompeo Girolamo Batoni", birth: 1708, death: 1787, title: "Matthew" },
  { artist: "Pompeo Girolamo Batoni", birth: 1708, death: 1787, title: "God The Father" },
  { artist: "Pompeo Girolamo Batoni", birth: 1708, death: 1787, title: "Madonna and Child" },
  { artist: "Barthel Beham", birth: 1502, death: 1540, title: "Portrait Ludwig X Of Bavaria" },
  { artist: "Giovanni Bellini", birth: 1430, death: 1516, title: "Feast Of The Gods" },
  { artist: "Antonio De Bellis", birth: 1616, death: 1656, title: "Saint Sebastian" },
  { artist: "Bernado Belotto", birth: 1721, death: 1780, title: "View Of. Perna From The Right Bank Of The Elbe" },
  { artist: "Bernado Belotto", birth: 1721, death: 1780, title: "The Liechestein Garden Palace From The Garden Side" },
  { artist: "Bernado Belotto", birth: 1721, death: 1780, title: "Square With The Kreuz In Dresden" },
  { artist: "Bernado Belotto", birth: 1721, death: 1780, title: "The Ponte Vecchio Florence" },
  { artist: "Frank Weston Benson", birth: 1862, death: 1951, title: "Portrait of My Daughters" },
  { artist: "Frank Weston Benson", birth: 1862, death: 1951, title: "Summer" },
  { artist: "Jean Beraud", birth: 1849, death: 1935, title: "The Cycle Shop In The Bois Du Boulonge" },
  { artist: "Jean Beraud", birth: 1849, death: 1935, title: "After The Service At The Church Of Holy Trinity Christmas" },
  { artist: "Jean Beraud", birth: 1849, death: 1935, title: "Pont Neuf" },
  { artist: "Albert Bierstadt", birth: 1830, death: 1902, title: "Moose" },
  { artist: "Albert Bierstadt", birth: 1830, death: 1902, title: "Valley of Yosemite" },
  { artist: "Thomas Birch", birth: 1779, death: 1851, title: "Philadelphia Winter Landscape" },
  { artist: "Eugen De Blaas", birth: 1843, death: 1931, title: "The Eavesdropper" },
  { artist: "Edmund Blair (Leighton)", birth: 1853, death: 1922, title: "God Speed" },
  { artist: "Edmund Blair (Leighton)", birth: 1853, death: 1922, title: "The Accolade" },
  { artist: "Edmund Blair (Leighton)", birth: 1853, death: 1922, title: "Tristan And Isolade" },
  { artist: "Edmund Blair (Leighton)", birth: 1853, death: 1922, title: "Lilac" },
  { artist: "Edmund Blair (Leighton)", birth: 1853, death: 1922, title: "How Liza Loved The King" },
  { artist: "Edmund Blair (Leighton)", birth: 1853, death: 1922, title: "The Golden Train" },
  { artist: "Nikolay Bogdanov Belsky", birth: 1868, death: 1945, title: "Young Drivers On A Bear Hunt" },
  { artist: "Giovanni Boldini", birth: 1842, death: 1931, title: "The Two Children" },
  { artist: "Francois Boucher", birth: 1703, death: 1770, title: "The Love Letter" },
  { artist: "Francois Boucher", birth: 1703, death: 1770, title: "Madame De Pompadour" },
  { artist: "Francois Boucher", birth: 1703, death: 1770, title: "The Rising Of The Sun" },
  { artist: "Francois Boucher", birth: 1703, death: 1770, title: "The Four Seasons Spring" },
  { artist: "Valentin De Boulogne", birth: 1591, death: 1632, title: "Samson" },
  { artist: "Valentin De Boulogne", birth: 1591, death: 1632, title: "The Fortune Teller" },
  { artist: "Valentin De Boulogne", birth: 1591, death: 1632, title: "Moses With The Tablets Of The Law" },
  { artist: "Valentin De Boulogne", birth: 1591, death: 1632, title: "Last Supper" },
  { artist: "Valentin De Boulogne", birth: 1591, death: 1632, title: "David With The Head Of Goliath Two Soldiers" },
  { artist: "Frederick Arthur Bridgman", birth: 1847, death: 1928, title: "The Siesta (Afternoon In Dreams)" },
  { artist: "Frederick Arthur Bridgman", birth: 1847, death: 1928, title: "Dolce For Niente (Sweet Nothings)" },
  { artist: "Frederick Arthur Bridgman", birth: 1847, death: 1928, title: "Tender Moments" },
  { artist: "Frederick Arthur Bridgman", birth: 1847, death: 1928, title: "Arab Woman On A Rooftop Algiers" },
  { artist: "Pieter Bruegel The Elder", birth: 1525, death: 1569, title: "The Tower Of Babel" },
  { artist: "Pieter Bruegel The Elder", birth: 1525, death: 1569, title: "The Wedding Dance" },
  { artist: "Augostino Brunias", birth: 1730, death: 1796, title: "Two Carribean Women Returning From The Market" },
  { artist: "Gustave Caillebotte", birth: 1848, death: 1894, title: "The Floor Scrapers" },
  { artist: "Gustave Caillebotte", birth: 1848, death: 1894, title: "Young Man At His Window" },
  { artist: "Gustave Caillebotte", birth: 1848, death: 1894, title: "The Yerres Rain (Riverbank In The Rain)" },
  { artist: "Gustave Caillebotte", birth: 1848, death: 1894, title: "Paris Street Rainy Weather" },
  { artist: "Gustave Caillebotte", birth: 1848, death: 1894, title: "View Of The Roofs Snow Effect" },
  { artist: "Gustave Caillebotte", birth: 1848, death: 1894, title: "Still Life With Oysters" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "View Of Grand Canal From San Vio Venice" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "Grand Canal From Palazzo Balbi" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "Piazza San Marco With The Cathedral" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "Piazzetta And The Doge's Palace" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "St Paul's Cathedral" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "The Coloseum" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "View Of Rialto Bridge At Venice South" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "Entrance To The Grand Canal Looking West" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "The Entrance To The Grand Canal Venice" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "Capriccio With Colonnade In The Interior Of The Palace" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "Rome A Caprice Viw With Ruins Based On The Forum" },
  { artist: "Giovanni Antonio Canal Canaletto", birth: 1697, death: 1768, title: "Venice The Interior Of St Marco By Day" },
  { artist: "Michelangelo Merisi Da Caravaggio", birth: 1571, death: 1610, title: "The Supper at Emmaus" },
  { artist: "Michelangelo Merisi Da Caravaggio", birth: 1571, death: 1610, title: "Bacchus" },
  { artist: "Michelangelo Merisi Da Caravaggio", birth: 1571, death: 1610, title: "The Calling Of Saint Matthew" },
  { artist: "Michelangelo Merisi Da Caravaggio", birth: 1571, death: 1610, title: "The Conversion Of Saint Paul" },
  { artist: "Michelangelo Merisi Da Caravaggio", birth: 1571, death: 1610, title: "Judith Beheading Holofernes" },
  { artist: "Michelangelo Merisi Da Caravaggio", birth: 1571, death: 1610, title: "David With The Head Of Goliath" },
  { artist: "Charles Emile August Caralus -Duran", birth: 1837, death: 1917, title: "Marie-Anne Caralus Duran ( The Artists Daughter)" },
  { artist: "Paul Cezanne", birth: 1839, death: 1906, title: "The Card Players" },
  { artist: "Paul Cezanne", birth: 1839, death: 1906, title: "Monte Sainte-Victoire" },
  { artist: "Paul Cezanne", birth: 1839, death: 1906, title: "Still Life With Apples" },
  { artist: "Paul Cezanne", birth: 1839, death: 1906, title: "The Bathers" },
  { artist: "Paul Cezanne", birth: 1839, death: 1906, title: "View Through The Trees L' Estaque" },
  { artist: "Paul Cezanne", birth: 1839, death: 1906, title: "Still Life Leg Of Mutton Bread" },
  { artist: "Paul Cezanne", birth: 1839, death: 1906, title: "Still Life Bread And Eggs" },
  { artist: "Philippe De Champaigne", birth: 1602, death: 1674, title: "Portrait Of Cardinal Richelieu" },
  { artist: "Philippe De Champaigne", birth: 1602, death: 1674, title: "Triple Portrait Of Cardinal Richelieu" },
  { artist: "Philippe De Champaigne", birth: 1602, death: 1674, title: "The Annunciation" },
  { artist: "Philippe De Champaigne", birth: 1602, death: 1674, title: "Portrait Of A Man Possibly Of Robert Arnauld Of Andilly" },
  { artist: "Jean Baptiste-Simeon Chardin", birth: 1699, death: 1779, title: "Basket Of Wild Strawberries" },
  { artist: "Jean Baptiste-Simeon Chardin", birth: 1699, death: 1779, title: "Glass Of Water And Coffee Pot" },
  { artist: "Eduard Charlemont", birth: 1848, death: 1906, title: "The Moorish Chief" },
  { artist: "Eduard Charlemont", birth: 1848, death: 1906, title: "Austrian" },
  { artist: "William Merrit Chase", birth: 1849, death: 1916, title: "Fish And Still Life" },
  { artist: "William Merrit Chase", birth: 1849, death: 1916, title: "Dora Wheeler" },
  { artist: "William Merrit Chase", birth: 1849, death: 1916, title: "A Corner Of My Studio" },
  { artist: "William Merrit Chase", birth: 1849, death: 1916, title: "Venice Façade" },
  { artist: "William Merrit Chase", birth: 1849, death: 1916, title: "The Antiquary Shop" },
  { artist: "William Merrit Chase", birth: 1849, death: 1916, title: "I think I am Ready Now" },
  { artist: "Pieter Claesz", birth: 1597, death: 1660, title: "Still Life With Large Roemer, Lemon and Grapes" },
  { artist: "Pieter Claesz", birth: 1597, death: 1660, title: "Still Life Lobster" },
  { artist: "Pieter Claesz", birth: 1597, death: 1660, title: "Fruit Still Life With Basket Of Cheese" },
  { artist: "Pieter Claesz", birth: 1597, death: 1660, title: "Tabletop Still Life Pigeon Pie and Delfware Jug" },
  { artist: "Pieter Claesz", birth: 1597, death: 1660, title: "Still Life Books Burning Candle" },
  { artist: "Pieter Claesz", birth: 1597, death: 1660, title: "A Breakfast Still Life With Strawberries and Cherries" },
  { artist: "Pieter Claesz", birth: 1597, death: 1660, title: "Vanitas Still Life (Violin)" },
  { artist: "Pieter Claesz", birth: 1597, death: 1660, title: "Still Life With Crab" },
  { artist: "Georges Clarin", birth: 1843, death: 1919, title: "Portrait Of Sarah Bernhardt" },
  { artist: "Jean The Younger Clouet", birth: 1480, death: 1541, title: "Portrait Of Francis I Roi De France" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Head Of A Man" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait Of Charles IX" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait of Henri II King Of France" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait Of Elizabeth Of Austria" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait Of Odet De Coligny Cardinal Of Chatillon" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait Of Mary Queen Of Scots" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait Henri VI England" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait Of Catherine De Medici" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait King Charles IX Of France" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait Of Elizabeth Of Austris Queen Of France" },
  { artist: "Francois Clouet", birth: 1510, death: 1572, title: "Portrait Of Louise De Lorraine" },
  { artist: "Adriaen Coote", birth: 1665, death: 1707, title: "Still Life Asparagus and Red Currants" },
  { artist: "Adriaen Coote", birth: 1665, death: 1707, title: "Four Apricots Ob A Stone Plinth" },
  { artist: "Adriaen Coote", birth: 1665, death: 1707, title: "Three Peaches On A Stone Plinth" },
  { artist: "Adriaen Coote", birth: 1665, death: 1707, title: "Gooseberries On A Table" },
  { artist: "Edouard Cortes", birth: 1882, death: 1969, title: "Quai Du Louvre In Winter" },
  { artist: "Melchior D'Hondecoeter", birth: 1636, death: 1695, title: "Peacocks" },
  { artist: "Melchior D'Hondecoeter", birth: 1636, death: 1695, title: "A Cockrel With Other Birds" },
  { artist: "Melchior D'Hondecoeter", birth: 1636, death: 1695, title: "Palace Of Amsterdam With Exotic Birds" },
  { artist: "Leonardo Da Vinci", birth: 1452, death: 1519, title: "Mona Lisa (La Gioconda)" },
  { artist: "Leonardo Da Vinci", birth: 1452, death: 1519, title: "St John The Baptist" },
  { artist: "Leonardo Da Vinci", birth: 1452, death: 1519, title: "The Last Supper" },
  { artist: "Leonardo Da Vinci", birth: 1452, death: 1519, title: "The Virgin On The Rocks" },
  { artist: "Leonardo Da Vinci", birth: 1452, death: 1519, title: "Virgin And Child With St Anne" },
  { artist: "Jaques-Louis David", birth: 1748, death: 1825, title: "Death Of Marat" },
  { artist: "Jaques-Louis David", birth: 1748, death: 1825, title: "Lictors Bearing To Brutus The Bodies Of His Sons" },
  { artist: "Jaques-Louis David", birth: 1748, death: 1825, title: "The Death Of Socrates" },
  { artist: "Jaques-Louis David", birth: 1748, death: 1825, title: "The Emporer Napoleon In His Study At The Tuileries" },
  { artist: "Jaques-Louis David", birth: 1748, death: 1825, title: "Mars Disarmed By Venus And The Three Graces" },
  { artist: "Jaques-Louis David", birth: 1748, death: 1825, title: "The Coronation Of Napoleon" },
  { artist: "Jaques-Louis David", birth: 1748, death: 1825, title: "Emporer Napoleon I" },
  { artist: "Hilaire Germaine Edgar Degas", birth: 1834, death: 1917, title: "Dancers In Pink" },
  { artist: "Hilaire Germaine Edgar Degas", birth: 1834, death: 1917, title: "Two Dancers On A Stage" },
  { artist: "Hilaire Germaine Edgar Degas", birth: 1834, death: 1917, title: "The Opera Orchestra" },
  { artist: "Hilaire Germaine Edgar Degas", birth: 1834, death: 1917, title: "Portrait Of Emma Dobigny" },
  { artist: "Hilaire Germaine Edgar Degas", birth: 1834, death: 1917, title: "Miss La La At The Cirque Fernando" },
  { artist: "Hilaire Germaine Edgar Degas", birth: 1834, death: 1917, title: "After The Bath Woman Drying Her Neck" },
  { artist: "Hilaire Germaine Edgar Degas", birth: 1834, death: 1917, title: "Blue Dancers" },
  { artist: "Alexandre-Francois Desportes", birth: 1661, death: 1743, title: "Pompee And Florissant The Dogs Of Lois XV" },
  { artist: "Alexandre-Francois Desportes", birth: 1661, death: 1743, title: "Diane Ans Blondie" },
  { artist: "Thomas Eakins", birth: 1844, death: 1916, title: "Sailboats Racing On The Delaware" },
  { artist: "Thomas Eakins", birth: 1844, death: 1916, title: "The Belgin Brothers Racing" },
  { artist: "Muad Earl", birth: 1864, death: 1943, title: "Borzoi Heads" },
  { artist: "Gentile De Fabriano", birth: 1370, death: 1427, title: "Adoration Of The Magi" },
  { artist: "Hippolyte Flandrin", birth: 1809, death: 1864, title: "Nude Youth Sitting B The Sea" },
  { artist: "Hippolyte Flandrin", birth: 1809, death: 1864, title: "Madame Hippolyte Flandrin" },
  { artist: "Thomas Gainsborough", birth: 1727, death: 1788, title: "Portrait" },
  { artist: "Paul Gauguin", birth: 1848, death: 1903, title: "Two Tahitian Women" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Starry Night" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Irises" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Red Vineyards At Airies" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Vincent's Chair With His Pipe" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Still Life Vase. With Fourteen Sunflowers" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Self Portrait With Bandaged Ear And Pipe" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Portrait Of Dr Felix Rey" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Portrait Of The Postman Joseph Roulin" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Lilac Bush (lilacs)" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "The Olive Trees" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Wheat Field With Cypresses" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Lanscape Of Wheat Sheaves And Rising Moon" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Self Portrait" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "The Reaper (after Millet)" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Vincent's Bedroom In Airies" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "The Mulberry Tree" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Olive Tress" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Blossoming Almomd Tree" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Vase With Irises Against Yellow Background" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Vase Of Roses" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Landscape Couple Walking Crescent Moon" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Portrait Of Doctor Gachet" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Whaet Field With Crows 1890" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Starry Night Over The Rhone" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "The Cafe Terrace On The Place Du Forum Airies" },
  { artist: "Vincent Van Gogh", birth: 1853, death: 1890, title: "Haystacks In Provence" }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Local storage key for remembering selected letter
const STORAGE_KEY = 'artistsAZSelectedLetter';

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

// Helper function to get artist dates
const getArtistDates = (artistName: string): { birth?: number; death?: number } => {
  const artistData = COLLECTION_DATA.find(item => item.artist === artistName);
  return {
    birth: artistData?.birth,
    death: artistData?.death
  };
};

export default function ArtistsAZPage() {
  // Keep initial render deterministic to avoid hydration mismatch
  const [selectedLetter, setSelectedLetter] = useState<string>('A');

  // On mount, restore selection from history.state (preferred) or localStorage
  useEffect(() => {
    try {
      const fromHistory = typeof window !== 'undefined' && (window.history.state && window.history.state.selectedLetter);
      if (fromHistory && ALPHABET.includes(fromHistory)) {
        setTimeout(() => setSelectedLetter(fromHistory), 0);
        return;
      }

      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored && ALPHABET.includes(stored)) {
        setTimeout(() => setSelectedLetter(stored), 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist selected letter when it changes (keep localStorage in sync)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && selectedLetter) {
        localStorage.setItem(STORAGE_KEY, selectedLetter);
      }
    } catch {
      // ignore localStorage errors
    }
  }, [selectedLetter]);

  // Helper to select a letter and record it in history and localStorage
  const selectLetter = (letter: string) => {
    setSelectedLetter(letter);
    try {
      if (typeof window !== 'undefined') {
        // store in history state so back/forward navigations restore it
        const state = Object.assign({}, window.history.state, { selectedLetter: letter });
        window.history.replaceState(state, document.title);
        localStorage.setItem(STORAGE_KEY, letter);
      }
    } catch {
      // ignore
    }
  };

  // Track which artist dropdown is open (null = none)
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Track whether the currently open menu should open upward
  const [openUp, setOpenUp] = useState(false);

  // Reference to the artists results container so we can detect outside clicks
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Close any open dropdown when clicking outside the results area
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      if (resultsRef.current && target && !resultsRef.current.contains(target)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Toggle menu open/close and compute whether to open upward based on available space
  const toggleMenu = (idx: number, extraCount: number) => {
    if (openIndex === idx) {
      setOpenIndex(null);
      return;
    }

    // find the button element inside the resultsRef for this menu
    const container = resultsRef.current;
    const button = container?.querySelector(`[data-menu="${idx}"] button`) as HTMLElement | null;

    // default to opening downward
    let shouldOpenUp = false;

    if (button && typeof window !== 'undefined') {
      const rect = button.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // estimate menu content height: each item ~40px (padding + text)
      const estimatedItemH = 40;
      const items = Math.max(0, extraCount);
      const estimatedHeight = Math.min(viewportH * 0.6, items * estimatedItemH);

      const spaceBelow = viewportH - rect.bottom;
      const spaceAbove = rect.top;

      // open upward if there isn't enough space below but there is above
      if (spaceBelow < Math.min(160, estimatedHeight) && spaceAbove > spaceBelow) {
        shouldOpenUp = true;
      }
    }

    setOpenUp(shouldOpenUp);
    setOpenIndex(idx);
  };

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
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Artists A-Z', href: '/artists-a-z' }]} />
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
              const isSelected = selectedLetter === letter;
              
              return (
                <button
                  key={letter}
                  onClick={() => hasArtists && selectLetter(letter)}
                  disabled={!hasArtists}
                  className={`
                    relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-200 rounded font-serif text-lg font-bold
                    ${!hasArtists 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : isSelected 
                        ? 'bg-[#800000] text-white shadow-lg scale-110' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#800000] hover:text-[#800000] hover:scale-105 shadow-sm'
                    }
                  `}
                >
                  {letter}
                  {hasArtists && count > 0 && (
                    <span className={`
                      absolute -top-1 -right-1 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200
                      ${isSelected 
                        ? 'bg-[#800000] text-white' 
                        : 'bg-transparent text-black border border-gray-300'
                      }
                    `}>
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
                  <span className="text-4xl font-bold text-[#800000]">{filteredArtists.length}</span> {filteredArtists.length === 1 ? 'Artist' : 'Artists'} starting with “{selectedLetter}”
                </h2>
              </div>
              
              <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtists.map((artist, idx) => {
                  const artworks = getArtworksByArtist(artist);
                  const dates = getArtistDates(artist);
                  
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
                          <h3 className="font-serif text-2xl font-bold text-[#800000] leading-tight mb-1">
                            {artist}
                          </h3>
                          {(dates.birth || dates.death) && (
                            <p className="font-serif text-sm text-gray-500">
                              ({dates.birth || '?'} - {dates.death || '?'})
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-serif text-base font-semibold text-gray-600">
                          <span className="text-2xl font-bold text-[#800000]">{artworks.length}</span> {artworks.length === 1 ? 'Artwork' : 'Artworks'}
                        </p>
                        <ul className="space-y-2">
                          {artworks.slice(0, 4).map((artwork, artIdx) => {
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

                        {artworks.length > 4 && (
                          <div className="mt-3 relative" onClick={(e) => e.stopPropagation()} data-menu={idx}>
                            <button
                              type="button"
                              onClick={() => toggleMenu(idx, artworks.length - 4)}
                              aria-haspopup="menu"
                              aria-expanded={openIndex === idx}
                              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50"
                            >
                              <span>View other artworks ({artworks.length - 4})</span>
                              <svg
                                className={`w-3 h-3 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                              >
                                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>

                            {openIndex === idx && (
                              <ul className={`absolute z-50 ${openUp ? 'bottom-full mb-2' : 'mt-2'} left-0 w-64 bg-white border border-gray-200 rounded shadow-lg overflow-hidden max-h-[56vh] md:max-h-[60vh] overflow-y-auto`}>
                                {artworks.slice(4).map((other, oIdx) => (
                                  <li key={oIdx} className="last:rounded-b">
                                    <Link
                                      href={`/artworks/${generateSlug(other)}`}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      onClick={() => setOpenIndex(null)}
                                    >
                                      {other}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
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
              <p className="text-xl font-serif text-gray-400 mb-2">No artists found for letter “{selectedLetter}”</p>
              <p className="font-serif text-sm text-gray-500">Try selecting a different letter above</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}