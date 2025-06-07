import { JSX } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductCard } from '@/components/product-card';
import { httpServer } from '@/lib/http/http-server';

interface Product {
    id: string;
    name: string;
    price: number;
}

export default async function ProductsPage(): Promise<JSX.Element> {
    let products: Product[] = [];
    let error: string | null = null;

    try {
        products = await httpServer.get<Product[]>('/products');
    } catch (err) {
        error = err instanceof Error ? err.message : 'An error occurred while fetching products';
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
} 