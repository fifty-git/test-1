import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { useNavigation, useActionData, Form } from "@remix-run/react";
import { ProductForm } from "~/components/product-form";
import { db } from "~/services/db.server";
import { ProductSchema } from "~/models/product.schema";
import type { Product } from "~/models/product.schema";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const raw = formData.get("json");
  let data: unknown = {};

  if (raw) {
    data = raw ? JSON.parse(raw as string) : {};
  } else {
    // build from individual fields (native form submit)
    data = {
      name: formData.get("name"),
      price: formData.get("price"),
      stock_quantity: formData.get("stock_quantity"),
      description: formData.get("description"),
      category: formData.get("category"),
      images: formData.getAll("images") || [],
    } as Record<string, unknown>;
  }

  const result = ProductSchema.omit({ id: true }).safeParse(data);
  if (!result.success) {
    // return validation errors to the client
    return json({ errors: result.error.flatten(), values: data }, { status: 400 });
  }

  try {
    const created = db.create(result.data as Omit<Product, "id">);
    return redirect("/products");
  } catch (err) {
    console.error("Error creating product:", err);
    return json({ error: "Unable to create product" }, { status: 500 });
  }
}

export default function CreateProduct() {
  const navigation = useNavigation();
  const actionData = useActionData();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      {actionData?.errors ? (
        <div className="card" style={{ marginBottom: 12, borderLeft: "4px solid var(--pink-500)" }}>
          <div style={{ color: "var(--pink-700)", fontWeight: 700 }}>Por favor corrige los siguientes errores:</div>
          <div style={{ marginTop: 8 }}>
            {actionData.errors.formErrors && actionData.errors.formErrors.length > 0 && (
              <ul className="stack">
                {actionData.errors.formErrors.map((f: string, i: number) => (
                  <li key={i} className="muted">{f}</li>
                ))}
              </ul>
            )}

            {actionData.errors.fieldErrors && Object.keys(actionData.errors.fieldErrors).length > 0 && (
              <div style={{ marginTop: 8 }}>
                {Object.entries(actionData.errors.fieldErrors).map(([field, messages]: any) => (
                  <div key={field} style={{ marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, color: "var(--pink-700)" }}>{field.replace("_", " ")}</div>
                    <ul>
                      {messages.map((m: string, idx: number) => (
                        <li key={idx} className="muted">{m}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
      <Form method="post">
        <div className="card">
          <ProductForm
            defaultValues={actionData?.values}
            isSubmitting={navigation.state === "submitting"}
            useFormTag={false}
          />
        </div>
      </Form>
    </div>
  );
}
