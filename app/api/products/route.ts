// API route for products management
import { productsAPI } from '@/lib/api-handlers';

export async function GET() {
  try {
    const products = await productsAPI.getAll();
    return Response.json({ success: true, data: products });
  } catch (error) {
    console.error('[v0] GET /api/products error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const product = await productsAPI.create(data);
    return Response.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('[v0] POST /api/products error:', error);
    return Response.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
