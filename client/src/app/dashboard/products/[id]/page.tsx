import endpoints from "@/api/endpoints";
import Product from "@/components/Product";
import { cookies } from "next/headers";
import React from "react";

interface Props {
  params: Promise<{ id: number }>;
}

const getProduct = async (id: number) => {
  const token = (await cookies()).get("token")?.value;
  const response = await fetch(
    `${process.env.BASE_URL}${endpoints.products.list}/${id}`,
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
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
};

const page = async ({ params }: Props) => {
  const id = (await params).id;
  const product = await getProduct(id);
  return <Product product={product} />;
};

export default page;
