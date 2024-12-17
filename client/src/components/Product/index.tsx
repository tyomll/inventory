"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createProduct, deleteProduct, editProduct } from "@/api/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Product as ProductType } from "@/types/entities.types";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface Props {
  product?: ProductType;
}

type Action = "create" | "edit" | "view";

const formSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  sku: z.string().min(3, {
    message: "SKU must be at least 3 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce
    .number()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number.",
    }),
  stock: z.coerce
    .number()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Initial stock must be a non-negative number.",
    }),
});

const handleError = (error: AxiosError) => {
  switch (error.response?.status) {
    case 409:
      return "Product already exists.";
    default:
      return "Something went wrong. Please try again.";
  }
};

const Product = ({ product }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? product
      : {
          id: 0,
          name: "",
          sku: "",
          category: "",
          description: "",
          price: 0,
          stock: 0,
        },
  });
  const { toast } = useToast();
  const router = useRouter();
  const [action, setAction] = useState<Action>(product ? "view" : "create");
  const isDisabled = action === "view";

  const onSubmit = async (product: z.infer<typeof formSchema>) => {
    const fn = action === "create" ? createProduct : editProduct;

    try {
      await fn(product);
      toast({
        title: action === "create" ? "Product created" : "Product updated",
        description: `Your new product has been ${action === "create" ? "created" : "updated"} successfully.`,
      });

      router.push("/dashboard/products");
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = handleError(axiosError);
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">
          {action === "create"
            ? "Create New Product"
            : action === "view"
              ? `Product - ${product?.name}`
              : "Edit Product"}
        </h1>
        <div className="flex items-center space-x-4">
          {product && (
            <Button
              onClick={() => {
                setAction(action === "view" ? "edit" : "view");
                form.reset();
              }}
            >
              {action === "view" ? "Edit Product" : "Reset changes"}
            </Button>
          )}
          {product && (action === "edit" || action === "view") && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the product and remove the data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteProduct(product.id);

                      toast({
                        title: "Product deleted",
                        description:
                          "Your product has been deleted successfully.",
                      });
                      router.push("/dashboard/products");
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            disabled={isDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed to customers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            disabled={isDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Enter SKU" {...field} />
                </FormControl>
                <FormDescription>
                  Stock Keeping Unit - a unique identifier for this product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            disabled={isDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  disabled={isDisabled}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="toys">Toys</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the category that best fits this product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            disabled={isDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            disabled={isDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the price in your local currency.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            disabled={isDisabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the initial quantity of this product in stock.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage>
            {form.formState.errors.root?.message && (
              <p className="text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
          </FormMessage>
          {action !== "view" && (
            <Button type="submit" disabled={isDisabled}>
              {action === "create" ? "Create" : "Update"} Product
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Product;
