export type ProductCategory = "nuts" | "oil" | "gift" | "snacks";

export interface ProductOption {
  label: string;
  price: number;
  originalPrice: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  badge?: string;
  rating: number;
  tags: string;
  image: string;
  description: string;
  shortDesc: string;
  options: ProductOption[];
  details: { label: string; value: string }[];
  popular?: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "roasted",
    slug: "roasted",
    name: "Шарсан хушны самар",
    category: "nuts",
    badge: "Бестселлер",
    rating: 4.9,
    tags: "250г · Омега-3 · Vegan",
    image: "/assets/products/roasted.jpg",
    description:
      "Уламжлалт аргаар удаан хугацаанд шарсан хушны самар. Хальс нь хөгтэй, дотор нь зөөлөн, өтгөн амттай. Хүүхдэд ээлтэй, эрүүл зууш.",
    shortDesc: "Уламжлалт аргаар шарсан, хөгтэй амттай хушны самар.",
    options: [
      { label: "250 гр", price: 45000, originalPrice: 52000 },
      { label: "500 гр", price: 82000, originalPrice: 95000 },
      { label: "1 кг", price: 149000, originalPrice: 170000 },
    ],
    details: [
      { label: "Найрлага", value: "100% шарсан хушны самар, бага хэмжээний давс" },
      { label: "Хадгалах", value: "Хуурай, хүйтэн газар, +18°C-аас бага" },
      { label: "Хугацаа", value: "12 сар" },
      { label: "Үйлдвэрлэгч", value: "HushKhan Co., Ltd., Улаанбаатар, Монгол" },
    ],
    popular: 1,
  },
  {
    id: "raw",
    slug: "raw",
    name: "Цэвэр хушны самар",
    category: "nuts",
    badge: "Байгалийн",
    rating: 4.8,
    tags: "250г · Гараар хураасан · Vegan",
    image: "/assets/products/raw.jpg",
    description:
      "Боловсруулаагүй, бүрэн байгалийн хушны самар. Энзим, витамин, хүчил тос хадгалагдсан. Эрүүл хүнсний хамгийн шилдэг сонголт.",
    shortDesc: "Боловсруулаагүй, бүрэн байгалийн хушны самар.",
    options: [
      { label: "250 гр", price: 52000, originalPrice: 60000 },
      { label: "500 гр", price: 89000, originalPrice: 100000 },
      { label: "1 кг", price: 149000, originalPrice: 170000 },
    ],
    details: [
      { label: "Найрлага", value: "100% цэвэр хушны самар" },
      { label: "Хадгалах", value: "Хуурай, хүйтэн газар, +18°C-аас бага" },
      { label: "Хугацаа", value: "18 сар" },
      { label: "Үйлдвэрлэгч", value: "HushKhan Co., Ltd., Улаанбаатар, Монгол" },
    ],
    popular: 2,
  },
  {
    id: "honey",
    slug: "honey",
    name: "Зөгийн балтай самар",
    category: "snacks",
    badge: "Шинэ",
    rating: 4.7,
    tags: "250г · Антиоксидант · Амттан",
    image: "/assets/products/honey.jpg",
    description:
      "Монголын нэгэн үеийн зөгийн балтай холин бэлтгэсэн амттан. Иммун системийг дэмжих, эрч хүч нэмэгдүүлэх шилдэг сонголт.",
    shortDesc: "Зөгийн балтай холин бэлтгэсэн амттай самрын амттан.",
    options: [
      { label: "250 гр", price: 58500, originalPrice: 68000 },
      { label: "500 гр", price: 99000, originalPrice: 115000 },
    ],
    details: [
      { label: "Найрлага", value: "Хушны самар, байгалийн зөгийн бал" },
      { label: "Хадгалах", value: "Хуурай, сэрүүн газар" },
      { label: "Хугацаа", value: "9 сар" },
      { label: "Үйлдвэрлэгч", value: "HushKhan Co., Ltd., Улаанбаатар, Монгол" },
    ],
    popular: 3,
  },
  {
    id: "oil",
    slug: "oil",
    name: "Хушны самрын тос",
    category: "oil",
    badge: "Premium",
    rating: 4.9,
    tags: "100мл · Гоо сайхан · Витамин Е",
    image: "/assets/products/oil.jpg",
    description:
      "Монголын тайгын хушны самраар гаргаж авсан цэвэр тос. Арьс, үсний эрүүл мэнд, гоо сайханд өргөн хэрэглэнэ. Хүнсний болон гоо сайхны зориулалтаар ашиглаж болно.",
    shortDesc: "Цэвэр хушны самрын тос — арьс, үс, хоолны дэмжлэг.",
    options: [
      { label: "100 мл", price: 78000, originalPrice: 90000 },
      { label: "250 мл", price: 149000, originalPrice: 170000 },
    ],
    details: [
      { label: "Найрлага", value: "100% цэвэр хушны самрын тос" },
      { label: "Хадгалах", value: "Хуурай, хүйтэн, нарнаас хол" },
      { label: "Хугацаа", value: "24 сар" },
      { label: "Үйлдвэрлэгч", value: "HushKhan Co., Ltd., Улаанбаатар, Монгол" },
    ],
    popular: 4,
  },
  {
    id: "gift",
    slug: "gift",
    name: "HushKhan бэлэг багц",
    category: "gift",
    badge: "Бэлэг",
    rating: 5.0,
    tags: "Бэлэг · Хүргэлт",
    image: "/assets/products/gift.jpg",
    description:
      "Хайртай хүндээ зориулсан HushKhan бэлэг багц. Самар, тос, шоколадын сонголтуудыг гоёмсог савлагаанд багцалсан. Онцлох баярын бэлэг.",
    shortDesc: "Самар, тос, шоколад багтсан гоёмсог бэлэг багц.",
    options: [
      { label: "Mini багц", price: 158000, originalPrice: 185000 },
      { label: "Premium багц", price: 258000, originalPrice: 300000 },
    ],
    details: [
      { label: "Агуулга", value: "Самар, тос, шоколад — Premium сонголт" },
      { label: "Савлагаа", value: "Байгалийн материал, бэлэгний хайрцаг" },
      { label: "Хүргэлт", value: "Улаанбаатар хотод 24 цагт" },
      { label: "Үйлдвэрлэгч", value: "HushKhan Co., Ltd., Улаанбаатар, Монгол" },
    ],
    popular: 5,
  },
  {
    id: "chocolate",
    slug: "chocolate",
    name: "Самрын шоколад",
    category: "snacks",
    badge: "Амттан",
    rating: 4.6,
    tags: "Какао · Энерги",
    image: "/assets/products/chocolate.jpg",
    description:
      "Белги какаотай холин бэлтгэсэн самрын шоколад. Энерги нэмэгдүүлж, эрүүл амттан болгох шилдэг сонголт.",
    shortDesc: "Белги какаотай самрын эрүүл шоколад.",
    options: [
      { label: "100 гр", price: 43200, originalPrice: 50000 },
      { label: "250 гр", price: 89000, originalPrice: 100000 },
    ],
    details: [
      { label: "Найрлага", value: "Какао, хушны самар, байгалийн чихэрлэг" },
      { label: "Хадгалах", value: "Хуурай, сэрүүн газар" },
      { label: "Хугацаа", value: "12 сар" },
      { label: "Үйлдвэрлэгч", value: "HushKhan Co., Ltd., Улаанбаатар, Монгол" },
    ],
    popular: 6,
  },
];

export const productBySlug = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug) || null;
