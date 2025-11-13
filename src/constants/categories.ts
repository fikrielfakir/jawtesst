const CafeImg = require("@assets/home/coffee_cup_cafe_latt_38a3b15f.jpg");
const MoroccoWayImg = require("@assets/home/moroccan_tagine_food_784bfa11.jpg");
const FineDiningImg = require("@assets/home/fine_dining_elegant__246bdcc1.jpg");
const DanceImg = require("@assets/home/nightclub_dance_floo_110473b2.jpg");
const LoungePubImg = require("@assets/home/bar_pub_beer_taps_lo_b72fe35e.jpg");
const ChiringuitoImg = require("@assets/home/beach_bar_chiringuit_9200470e.jpg");

export const categories = [
  {
    id: "cafe",
    name: "Cafe",
    angle: 270,
    image: CafeImg,
  },
  {
    id: "morocco-way",
    name: "Morocco Way",
    angle: 210,
    image: MoroccoWayImg,
  },
  {
    id: "fine-dining",
    name: "Fine Dining",
    angle: 330,
    image: FineDiningImg,
  },
  {
    id: "dance",
    name: "Dance",
    angle: 150,
    image: DanceImg,
  },
  {
    id: "lounge-pub",
    name: "Lounge & Pub",
    angle: 30,
    image: LoungePubImg,
  },
  {
    id: "chiringuito",
    name: "Chiringuito",
    angle: 90,
    image: ChiringuitoImg,
  },
];

export type Category = (typeof categories)[number];

export const priceRanges = [
  { id: '$', name: 'Budget', description: 'Under $15 per person' },
  { id: '$$', name: 'Moderate', description: '$15-30 per person' },
  { id: '$$$', name: 'Expensive', description: '$30-60 per person' },
  { id: '$$$$', name: 'Fine Dining', description: 'Over $60 per person' },
] as const;
