
export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    deposit: number;
    image: string;
    isBundle?: boolean;
};

export const PRODUCTS: Product[] = [
    {
        id: "5G",
        name: "5-Gallon Glass Refill",
        description: "Pure hydration, refined for the daily ritual. Sustainable glass, delivered to your door.",
        price: 25,
        deposit: 75,
        image: "/assets/velah_bottle_5g.png",
    },
    {
        id: "1L_single",
        name: "1L Table Water (Single)",
        description: "Perfect for dining and entertaining. The purity of Velah in a shareable size.",
        price: 7,
        deposit: 20,
        image: "/assets/velah_bottle_1l.png",
    },
    {
        id: "500ml_case",
        name: "500mL On-the-Go (Case of 6)",
        description: "Lightweight and portable. Sustainability that moves with you.",
        price: 24,
        deposit: 60,
        image: "/assets/velah_bottle_500ml.png",
    },
];

export const BUNDLES: Product[] = [
    {
        id: "weekender",
        name: "The Weekender",
        description: "2x 5-Gallon Refills + 1x Case of 1L bottles. Ideal for hosts.",
        price: 92,
        deposit: 270,
        image: "/assets/bundle_weekender_1769445820686.png",
        isBundle: true,
    },
    {
        id: "office",
        name: "The Office Stock",
        description: "4x 5-Gallon Refills. Keep the team hydrated and focused.",
        price: 100,
        deposit: 300,
        image: "/assets/bundle_office_stock_1769445834674.png",
        isBundle: true,
    },
    {
        id: "variety",
        name: "The Variety Pack",
        description: "1x 5-Gallon + 2x Case of 1L. balanced for home and table.",
        price: 109,
        deposit: 315,
        image: "/assets/bundle_variety_pack_1769445849306.png",
        isBundle: true,
    },
];
