import { json, redirect } from "@remix-run/node";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { ProductForm } from "~/components/product-form";
import { db } from "~/services/db.server";
import { ProductSchema } from "~/models/product.schema";
import { Button } from "~/components/ui/button";
import type { Product } from "~/models/product.schema";

export async function loader({ params }: LoaderArgs) {
  const product = db.getById(params.productId as string);
  if (!product) throw new Response("Not Found", { status: 404 });
  return json({ product });
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    db.delete(params.productId as string);
    return redirect("/products");
  }

  const raw = formData.get("json");
  const data = raw ? JSON.parse(raw as string) : {};
  const parsed = ProductSchema.partial().parse(data) as Partial<Product>;

  db.update(params.productId as string, parsed);
  return redirect("/products");
}

export default function EditProduct() {
  const { product } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      submit(formData, { method: "post" });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product: {product.name}</h1>
      </div>

      <div className="card">
        <ProductForm
          defaultValues={product}
          onSubmit={(data) => {
            const formData = new FormData();
            formData.append("json", JSON.stringify(data));
            formData.append("intent", "update");
            submit(formData, { method: "post" });
          }}
          onDelete={handleDelete}
          isSubmitting={navigation.state === "submitting"}
        />
      </div>
    </div>
  );
}
