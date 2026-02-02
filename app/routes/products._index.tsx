import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/products");
}

export default function ProductsIndex() {
  return null;
}
