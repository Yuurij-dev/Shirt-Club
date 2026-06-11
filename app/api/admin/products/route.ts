import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import {
  deleteProduct,
  listProducts,
  toggleProductStatus,
  updateProductPricesByGroup,
  upsertProduct,
} from "@/app/lib/productStore";
import type { ProductPriceGroup } from "@/app/lib/productStore";
import type { Product } from "@/app/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async () => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const products = await listProducts();

  return NextResponse.json({ products });
};

export const POST = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as
      | Product
      | { product?: Product; originalId?: string };
    const isWrappedPayload = "product" in body;
    const product = isWrappedPayload ? body.product : (body as Product);

    if (!product) {
      return NextResponse.json(
        { error: "Informe os dados do produto" },
        { status: 400 }
      );
    }

    const savedProduct = await upsertProduct(
      product,
      isWrappedPayload ? body.originalId : undefined
    );

    return NextResponse.json({ product: savedProduct });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível salvar o produto";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};

export const PATCH = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      action?: "bulk-price";
      group?: ProductPriceGroup;
      price?: string;
      id?: string;
      active?: boolean;
    };

    if (body.action === "bulk-price") {
      if (!body.group || !body.price) {
        return NextResponse.json(
          { error: "Informe o grupo e o novo preÃ§o" },
          { status: 400 }
        );
      }

      const result = await updateProductPricesByGroup({
        group: body.group,
        price: body.price,
      });

      return NextResponse.json(result);
    }

    if (!body.id) {
      return NextResponse.json(
        { error: "Informe o produto que será alterado" },
        { status: 400 }
      );
    }

    const product = await toggleProductStatus(body.id, Boolean(body.active));

    return NextResponse.json({ product });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível alterar o status do produto";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};

export const DELETE = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "NÃ£o autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: string };

    if (!body.id) {
      return NextResponse.json(
        { error: "Informe o produto que serÃ¡ excluÃ­do" },
        { status: 400 }
      );
    }

    const result = await deleteProduct(body.id);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "NÃ£o foi possÃ­vel excluir o produto";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};
