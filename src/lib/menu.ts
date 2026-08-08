import bucketImg from "@/assets/hero-chicken.jpg";
import burgerImg from "@/assets/burger.jpg";
import sidesImg from "@/assets/sides.jpg";
import drinksImg from "@/assets/drinks.jpg";

export type CategoryId = "bucket" | "burgers" | "accompagnements" | "boissons" | "menus";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "bucket", label: "Bucket Poulet" },
  { id: "burgers", label: "Burgers" },
  { id: "accompagnements", label: "Accompagnements" },
  { id: "boissons", label: "Boissons" },
  { id: "menus", label: "Menus Combo" },
];

export type OptionChoice = { id: string; label: string; price: number };

export type OptionGroup = {
  id: string;
  label: string;
  type: "single" | "multi";
  required?: boolean;
  choices: OptionChoice[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  tag?: string;
  options: OptionGroup[];
};

const SPICE: OptionGroup = {
  id: "spice",
  label: "Niveau de piment",
  type: "single",
  required: true,
  choices: [
    { id: "doux", label: "Doux", price: 0 },
    { id: "epice", label: "Épicé", price: 0 },
    { id: "extra", label: "Extra Hot 🔥", price: 250 },
  ],
};

const SAUCES: OptionGroup = {
  id: "sauces",
  label: "Sauces (250 FCFA / sauce supplémentaire)",
  type: "multi",
  choices: [
    { id: "mayo", label: "Mayonnaise maison", price: 250 },
    { id: "bbq", label: "BBQ fumée", price: 250 },
    { id: "yassa", label: "Sauce Yassa", price: 300 },
    { id: "pili", label: "Pili-pili Belchiken", price: 250 },
  ],
};

const DRINK_SIZE: OptionGroup = {
  id: "size",
  label: "Taille",
  type: "single",
  required: true,
  choices: [
    { id: "33", label: "33 cl", price: 0 },
    { id: "50", label: "50 cl", price: 300 },
    { id: "1l", label: "1 litre", price: 700 },
  ],
};

export const PRODUCTS: Product[] = [
  {
    id: "bucket-6",
    name: "Bucket 6 pièces",
    description: "6 morceaux de poulet frit croustillant, panure signature Belchiken.",
    price: 5000,
    category: "bucket",
    image: bucketImg,
    tag: "Best-seller",
    options: [SPICE, SAUCES],
  },
  {
    id: "bucket-9",
    name: "Bucket 9 pièces",
    description: "9 morceaux dorés, parfaits à partager entre amis.",
    price: 7000,
    category: "bucket",
    image: bucketImg,
    options: [SPICE, SAUCES],
  },
  {
    id: "bucket-family",
    name: "Bucket Famille 15 pièces",
    description: "15 morceaux + 2 grandes frites. Le format tribu.",
    price: 13500,
    category: "bucket",
    image: bucketImg,
    tag: "Famille",
    options: [SPICE, SAUCES],
  },
  {
    id: "wings-8",
    name: "Ailes de poulet x8",
    description: "Ailes marinées 12h, frites minute.",
    price: 3500,
    category: "bucket",
    image: bucketImg,
    options: [SPICE, SAUCES],
  },
  {
    id: "burger-classic",
    name: "Belchiken Classic",
    description: "Filet de poulet pané, salade, tomate, sauce maison.",
    price: 2500,
    category: "burgers",
    image: burgerImg,
    options: [SPICE, SAUCES],
  },
  {
    id: "burger-double",
    name: "Double Crunch",
    description: "Deux filets croustillants, cheddar fondu, oignons croustillants.",
    price: 3500,
    category: "burgers",
    image: burgerImg,
    tag: "XXL",
    options: [SPICE, SAUCES],
  },
  {
    id: "burger-fire",
    name: "Fire Burger",
    description: "Poulet mariné pili-pili, jalapeños, sauce flamme.",
    price: 3200,
    category: "burgers",
    image: burgerImg,
    options: [SPICE, SAUCES],
  },
  {
    id: "frites",
    name: "Frites croustillantes",
    description: "Coupe fraîche, sel épicé Belchiken.",
    price: 1000,
    category: "accompagnements",
    image: sidesImg,
    options: [
      {
        id: "portion",
        label: "Portion",
        type: "single",
        required: true,
        choices: [
          { id: "petite", label: "Petite", price: 0 },
          { id: "grande", label: "Grande", price: 500 },
        ],
      },
      SAUCES,
    ],
  },
  {
    id: "attieke",
    name: "Attiéké poulet",
    description: "Attiéké frais, oignons, tomates et poulet grillé.",
    price: 2000,
    category: "accompagnements",
    image: sidesImg,
    options: [SAUCES],
  },
  {
    id: "coleslaw",
    name: "Coleslaw maison",
    description: "Chou croquant, carotte, sauce crémeuse.",
    price: 800,
    category: "accompagnements",
    image: sidesImg,
    options: [],
  },
  {
    id: "soda",
    name: "Soda glacé",
    description: "Coca, Fanta, Sprite — servi bien frais.",
    price: 500,
    category: "boissons",
    image: drinksImg,
    options: [
      {
        id: "parfum",
        label: "Parfum",
        type: "single",
        required: true,
        choices: [
          { id: "coca", label: "Coca-Cola", price: 0 },
          { id: "fanta", label: "Fanta", price: 0 },
          { id: "sprite", label: "Sprite", price: 0 },
        ],
      },
      DRINK_SIZE,
    ],
  },
  {
    id: "bissap",
    name: "Bissap maison",
    description: "Hibiscus infusé, menthe fraîche, peu sucré.",
    price: 700,
    category: "boissons",
    image: drinksImg,
    tag: "Maison",
    options: [DRINK_SIZE],
  },
  {
    id: "eau",
    name: "Eau minérale",
    description: "Bouteille 50 cl bien fraîche.",
    price: 300,
    category: "boissons",
    image: drinksImg,
    options: [],
  },
  {
    id: "combo-solo",
    name: "Menu Solo",
    description: "3 pièces de poulet + frites + boisson 33 cl.",
    price: 4000,
    category: "menus",
    image: bucketImg,
    tag: "Populaire",
    options: [SPICE, SAUCES],
  },
  {
    id: "combo-duo",
    name: "Menu Duo",
    description: "2 burgers + 2 frites + 2 boissons.",
    price: 7500,
    category: "menus",
    image: burgerImg,
    options: [SPICE, SAUCES],
  },
  {
    id: "combo-family",
    name: "Menu Famille",
    description: "Bucket 9 pièces + 3 frites + 1,5 L de boisson.",
    price: 12000,
    category: "menus",
    image: bucketImg,
    options: [SPICE, SAUCES],
  },
];

export type Zone = { id: string; name: string; fee: number };

export const ZONES: Zone[] = [
  { id: "retrait", name: "Retrait sur place (Click & Collect)", fee: 0 },
  { id: "kamboinse", name: "Kamboinsé", fee: 1500 },
  { id: "zogona", name: "Zogona", fee: 1000 },
  { id: "ouaga2000", name: "Ouaga 2000", fee: 2000 },
  { id: "dassasgho", name: "Dassasgho", fee: 1000 },
  { id: "koulouba", name: "Koulouba", fee: 800 },
  { id: "gounghin", name: "Gounghin", fee: 1000 },
  { id: "tanghin", name: "Tanghin", fee: 1200 },
  { id: "pissy", name: "Pissy", fee: 1500 },
  { id: "saaba", name: "Saaba", fee: 2500 },
];

export const WHATSAPP_NUMBER = "22670000000";

export function formatFCFA(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}
