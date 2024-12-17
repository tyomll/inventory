import endpoints from "@/api/endpoints";
import Products from "@/components/Products";
import { cookies } from "next/headers";
import React from "react";

const getProducts = async () => {
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(
    `${process.env.BASE_URL}${endpoints.products.list}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
};

const page = async () => {
  const products = await getProducts();
  return <Products products={products.data} rowsCount={products.total} />;
};

export default page;
