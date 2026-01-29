import type { Product } from "~/models/product.schema";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

const SEED_DATA: Product[] = [
  {
    id: "1",
    name: "Red Roses Bouquet",
    price: 45.0,
    stock_quantity: 10,
    description: "A beautiful bouquet of red roses.",
    category: "roses",
    images: ["https://placehold.co/150"],
  },
];

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadFromFile(): Product[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Product[];
      return parsed;
    }
  } catch (err) {
    console.error("Failed to load products from file:", err);
  }
  return [...SEED_DATA];
}

function saveToFile(products: Product[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save products to file:", err);
  }
}

class MockDB {
  private products: Product[];

  constructor() {
    this.products = loadFromFile();
  }

  getAll() {
    console.log("db.getAll -> returning", this.products.length, "products");
    return this.products;
  }

  getById(id: string) {
    return this.products.find((p) => p.id === id);
  }

  create(data: Omit<Product, "id">) {
    const newProduct = { ...data, id: randomUUID() } as Product;
    this.products.push(newProduct);
    console.log("db.create -> created product", newProduct.id, newProduct.name);
    saveToFile(this.products);
    return newProduct;
  }

  update(id: string, data: Partial<Product>) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    this.products[index] = { ...this.products[index], ...data };
    saveToFile(this.products);
    return this.products[index];
  }

  delete(id: string) {
    this.products = this.products.filter((p) => p.id !== id);
    saveToFile(this.products);
  }
}

export const db = (global as any).__db || new MockDB();
if (process.env.NODE_ENV === "development") (global as any).__db = db;
