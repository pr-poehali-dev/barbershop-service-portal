export interface ProductType {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  tags: string[];
}

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const productCategories: CategoryType[] = [
  {
    id: "shampoo",
    name: "Шампуни",
    description: "Профессиональные шампуни для всех типов волос",
    image: "https://images.unsplash.com/photo-1604251405903-b8c0b383d5b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "conditioner",
    name: "Кондиционеры",
    description: "Питательные кондиционеры для восстановления и защиты волос",
    image: "https://images.unsplash.com/photo-1585232352607-5b06af87cec9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "masks",
    name: "Маски",
    description: "Восстанавливающие и питательные маски для глубокого ухода",
    image: "https://images.unsplash.com/photo-1597354984706-fac992d9306f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "styling",
    name: "Стайлинг",
    description: "Средства для стайлинга и укладки волос",
    image: "https://images.unsplash.com/photo-1616170687881-32517368cb32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "tools",
    name: "Инструменты",
    description: "Профессиональные инструменты для укладки и ухода",
    image: "https://images.unsplash.com/photo-1592136957897-b2b6ca21e10d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
];

export const products: ProductType[] = [
  {
    id: 1,
    title: "Шампунь для объема",
    description: "Профессиональный шампунь для тонких волос, придающий объем от корней. Содержит протеины пшеницы и витамин B5.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1626766632648-f4ed492cf6c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "shampoo",
    brand: "LuxHair",
    tags: ["объем", "тонкие волосы", "профессиональный"]
  },
  {
    id: 2,
    title: "Кондиционер питательный",
    description: "Насыщенный кондиционер с маслами арганы и ши для интенсивного увлажнения и питания сухих волос.",
    price: 950,
    image: "https://images.unsplash.com/photo-1617391258031-f8d80b22fb25?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "conditioner",
    brand: "LuxHair",
    tags: ["питание", "сухие волосы", "увлажнение"]
  },
  {
    id: 3,
    title: "Маска восстанавливающая",
    description: "Интенсивная восстанавливающая маска для поврежденных волос с кератином и гиалуроновой кислотой.",
    price: 1450,
    image: "https://images.unsplash.com/photo-1522338564554-8a472966bc8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "masks",
    brand: "ProStyle",
    tags: ["восстановление", "поврежденные волосы", "интенсивный уход"]
  },
  {
    id: 4,
    title: "Шампунь против перхоти",
    description: "Противопиритный шампунь с цинком, эффективно удаляет перхоть и предотвращает ее появление.",
    price: 980,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "shampoo",
    brand: "MediHair",
    tags: ["перхоть", "лечебный", "чувствительная кожа"]
  },
  {
    id: 5,
    title: "Гель для укладки сильной фиксации",
    description: "Гель для создания креативных причесок с экстрасильной фиксацией и UV-защитой.",
    price: 850,
    image: "https://images.unsplash.com/photo-1635212535080-b0ec164df9e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "styling",
    brand: "StylePro",
    tags: ["укладка", "сильная фиксация", "укладка волос"]
  },
  {
    id: 6,
    title: "Кондиционер для окрашенных волос",
    description: "Защитный кондиционер для сохранения цвета и блеска окрашенных волос.",
    price: 1050,
    image: "https://images.unsplash.com/photo-1631214524020-9a6a82286f0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "conditioner",
    brand: "ColorLock",
    tags: ["окрашенные волосы", "защита цвета", "блеск"]
  },
  {
    id: 7,
    title: "Маска для кудрявых волос",
    description: "Увлажняющая маска для определения кудрей и защиты от ломкости.",
    price: 1350,
    image: "https://images.unsplash.com/photo-1638950958174-5401c6840655?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "masks",
    brand: "CurlySecret",
    tags: ["кудрявые волосы", "увлажнение", "определение кудрей"]
  },
  {
    id: 8,
    title: "Спрей термозащитный",
    description: "Спрей с термозащитными свойствами для укладки феном, утюжком или плойкой.",
    price: 790,
    image: "https://images.unsplash.com/photo-1575380591643-b2c92368dc6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "styling",
    brand: "HeatGuard",
    tags: ["термозащита", "укладка", "защита волос"]
  },
  {
    id: 9,
    title: "Фен профессиональный",
    description: "Мощный профессиональный фен с ионизацией и несколькими режимами работы.",
    price: 5900,
    image: "https://images.unsplash.com/photo-1608533372537-811b1d0a69d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "tools",
    brand: "ProStyle",
    tags: ["фен", "профессиональный", "инструменты"]
  },
  {
    id: 10,
    title: "Щипцы для завивки",
    description: "Профессиональные щипцы для создания локонов с керамическим покрытием и регулируемой температурой.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "tools",
    brand: "CurlMaster",
    tags: ["щипцы", "завивка", "локоны"]
  },
  {
    id: 11,
    title: "Сыворотка для секущихся кончиков",
    description: "Восстанавливающая сыворотка с аргановым маслом для запечатывания секущихся кончиков.",
    price: 1100,
    image: "https://images.unsplash.com/photo-1614859075184-56bc3157b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "styling",
    brand: "RepairElixir",
    tags: ["секущиеся кончики", "восстановление", "аргановое масло"]
  },
  {
    id: 12,
    title: "Расческа массажная",
    description: "Профессиональная массажная расческа с натуральной щетиной и антистатическим эффектом.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1590159763019-742cd4108a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "tools",
    brand: "BrushPro",
    tags: ["расческа", "массаж", "натуральная щетина"]
  }
];