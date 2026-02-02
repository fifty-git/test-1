import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type Product, CategoryEnum } from "~/models/product.schema";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";

interface ProductFormProps {
  defaultValues?: Partial<Product>;
  onSubmit?: (data: Product) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  useFormTag?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, onDelete, isSubmitting, useFormTag = false }: ProductFormProps) {
  const form = useForm<Product>({
    resolver: zodResolver(ProductSchema),
    defaultValues: defaultValues || {
      name: "",
      price: 0,
      stock_quantity: 0,
      description: "",
      category: "mixed",
      images: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [thumbs, setThumbs] = React.useState<string[]>(() => (form.getValues("images") || []).map((u: string) => u));

  const handleFakeUpload = () => {
    // open native file picker
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data.url) {
        append(data.url);
        setThumbs((p) => [...p, data.thumb || data.url]);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const Wrapper: React.ElementType = useFormTag ? "form" : "div";
  const submitHandler = onSubmit ? form.handleSubmit(onSubmit) : undefined;
  const buttonOnClick: React.MouseEventHandler<HTMLButtonElement> | undefined =
    !useFormTag && submitHandler ? (submitHandler as unknown as React.MouseEventHandler<HTMLButtonElement>) : undefined;

  return (
    <Wrapper
      {...(useFormTag && { onSubmit: submitHandler })}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name" as const)} />
          {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name={"category"} value={form.watch("category")} onValueChange={(val) => form.setValue("category", val as Product["category"])}>
            <option value="" hidden>
              Select category
            </option>
            {CategoryEnum.options.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>
          {form.formState.errors.category && <p className="text-red-500 text-xs">{form.formState.errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" min="0.01" placeholder="e.g. 19.99" {...form.register("price" as const)} />
          {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            inputMode="numeric"
            step={1}
            min={0}
            pattern="\d*"
            onInput={(e) => {
              const input = e.currentTarget as HTMLInputElement;
              // remove non-digits to prevent decimals and non-numeric chars
              input.value = input.value.replace(/\D/g, "");
            }}
            {...form.register("stock_quantity" as const, { valueAsNumber: true })}
          />
          {form.formState.errors.stock_quantity && <p className="text-red-500 text-xs">{form.formState.errors.stock_quantity.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" minLength={10} placeholder="Describe the product (min 10 characters)" {...form.register("description" as const)} />
        {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
      </div>

      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-center">
          <Label>Media Gallery</Label>
          <>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            <Button type="button" variant="outline" size="sm" onClick={handleFakeUpload}>
              {uploading ? "Uploading..." : "+ Upload Image"}
            </Button>
          </>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative group border rounded p-2">
              <img src={(thumbs[index] || form.getValues("images")[index]) as string} alt="Product" className="thumb-lg" />
              <div className="absolute top-1 right-1 flex gap-1">
                {index > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6"
                    onClick={() => {
                      move(index, index - 1);
                      setThumbs((prev) => {
                        const arr = [...prev];
                        const [item] = arr.splice(index, 1);
                        arr.splice(index - 1, 0, item);
                        return arr;
                      });
                    }}
                  >
                    ↑
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-6 w-6"
                  onClick={() => {
                    remove(index);
                    setThumbs((prev) => {
                      const arr = [...prev];
                      arr.splice(index, 1);
                      return arr;
                    });
                  }}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* If rendered inside a parent <Form>, include hidden inputs for images so parent submission includes them */}
      {!useFormTag && (
        <div>
          {form.getValues("images")?.map((url: string, i: number) => (
            <input key={`hidden-image-${i}`} type="hidden" name="images" value={url} />
          ))}
        </div>
      )}

        <div className="flex justify-end items-center gap-3 pt-4">
        {onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button
            type={!useFormTag && submitHandler ? "button" : "submit"}
            disabled={isSubmitting}
            onClick={buttonOnClick}
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </Wrapper>
  );
}

export default ProductForm;
