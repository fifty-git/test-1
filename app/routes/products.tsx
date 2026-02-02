import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/services/db.server";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

export async function loader() {
  const products = db.getAll();
  console.log("products.loader -> found", products.length, "products");
  return json({ products });
}

export default function ProductsIndex() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link to="/products/new">Create Product</Link>
        </Button>
      </div>

      <div className="card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">No products found.</TableCell>
              </TableRow>
            ) : (
              products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="thumb-lg" />}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock_quantity}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/products/${product.id}/edit`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
