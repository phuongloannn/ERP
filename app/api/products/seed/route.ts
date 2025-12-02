// Seed initial products into database
import { productsAPI } from '@/lib/api-handlers'

export async function GET() {
  try {
    const initialProducts = [
      {
        name: 'Crispy Chicken Wings',
        description: 'Golden fried chicken wings',
        category: 'Wings',
        price: 45000,
      },
      {
        name: 'Spicy Wings',
        description: 'Spicy fried chicken wings',
        category: 'Wings',
        price: 48000,
      },
      {
        name: 'Chicken Legs',
        description: 'Tender fried chicken legs',
        category: 'Legs',
        price: 55000,
      },
      {
        name: 'Chicken Breast',
        description: 'Crispy fried chicken breast',
        category: 'Breast',
        price: 60000,
      },
      {
        name: 'Whole Chicken',
        description: 'Whole fried chicken',
        category: 'Whole',
        price: 150000,
      },
      {
        name: 'Chicken Combo',
        description: 'Mixed chicken combo pack',
        category: 'Combos',
        price: 120000,
      },
      {
        name: 'Fries',
        description: 'Golden crispy fries',
        category: 'Sides',
        price: 25000,
      },
      {
        name: 'Coleslaw',
        description: 'Fresh coleslaw side',
        category: 'Sides',
        price: 20000,
      },
    ]

    // Check if products already exist
    const existingProducts = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`
    ).then(r => r.json())

    if (existingProducts.data && existingProducts.data.length > 0) {
      return Response.json({
        success: true,
        message: 'Products already seeded',
        count: existingProducts.data.length,
      })
    }

    // Seed products
    const createdProducts = []
    for (const product of initialProducts) {
      const created = await productsAPI.create(product)
      createdProducts.push(created)
    }

    return Response.json({
      success: true,
      message: 'Products seeded successfully',
      count: createdProducts.length,
    })
  } catch (error) {
    console.error('[v0] Seed error:', error)
    return Response.json(
      { success: false, error: 'Failed to seed products' },
      { status: 500 }
    )
  }
}
