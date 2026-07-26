import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Product, ProductSize } from '@/types';
import { db } from './db';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function listProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: productsData, error } = await supabase
        .from('products')
        .select(`
          *,
          rental_sizes (*)
        `);

      if (error) throw error;

      return (productsData || []).map((prod: any) => ({
        ...prod,
        sizes: prod.rental_sizes || []
      }));
    } catch (err) {
      console.error('Error fetching products from Supabase:', err);
      return db.products.get();
    }
  } else {
    return db.products.get();
  }
}

export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'sizes'>,
  sizes: Omit<ProductSize, 'id' | 'product_id'>[]
): Promise<Product> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          photo_url: productData.photo_url,
          status: productData.status
        })
        .select()
        .single();

      if (error) throw error;

      let createdSizes: ProductSize[] = [];
      if (sizes && sizes.length > 0) {
        const sizeInserts = sizes.map(s => ({
          product_id: product.id,
          size: s.size,
          stock: s.stock
        }));

        const { data: sizeData, error: sizesError } = await supabase
          .from('rental_sizes')
          .insert(sizeInserts)
          .select();

        if (sizesError) throw sizesError;
        createdSizes = sizeData || [];
      }

      return {
        ...product,
        sizes: createdSizes
      };
    } catch (err) {
      console.error('Error creating product in Supabase:', err);
      return createProductMock(productData, sizes);
    }
  } else {
    return createProductMock(productData, sizes);
  }
}

function createProductMock(
  productData: Omit<Product, 'id' | 'created_at' | 'sizes'>,
  sizes: Omit<ProductSize, 'id' | 'product_id'>[]
): Product {
  const products = db.products.get();
  const newId = `prod-${Date.now()}`;

  const createdSizes: ProductSize[] = sizes.map((s, i) => ({
    id: `size-${newId}-${i}`,
    product_id: newId,
    size: s.size,
    stock: s.stock
  }));

  const newProduct: Product = {
    ...productData,
    id: newId,
    created_at: new Date().toISOString(),
    sizes: createdSizes
  };

  products.push(newProduct);
  db.products.set(products);
  return newProduct;
}

export async function updateProduct(
  id: string,
  productData: Partial<Product>,
  sizes?: Omit<ProductSize, 'id' | 'product_id'>[]
): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          photo_url: productData.photo_url,
          status: productData.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!product) return null;

      let updatedSizes: ProductSize[] = [];
      if (sizes) {
        // Delete old sizes
        await supabase.from('rental_sizes').delete().eq('product_id', id);

        // Insert new sizes
        if (sizes.length > 0) {
          const sizeInserts = sizes.map(s => ({
            product_id: id,
            size: s.size,
            stock: s.stock
          }));
          const { data: sizeData } = await supabase
            .from('rental_sizes')
            .insert(sizeInserts)
            .select();
          updatedSizes = sizeData || [];
        }
      }

      return {
        ...product,
        sizes: updatedSizes
      };
    } catch (err) {
      console.error(`Error updating product ${id} in Supabase:`, err);
      return updateProductMock(id, productData, sizes);
    }
  } else {
    return updateProductMock(id, productData, sizes);
  }
}

function updateProductMock(
  id: string,
  productData: Partial<Product>,
  sizes?: Omit<ProductSize, 'id' | 'product_id'>[]
): Product | null {
  const products = db.products.get();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const product = products[index];
  const updatedSizes: ProductSize[] = sizes
    ? sizes.map((s, i) => ({
      id: `size-${id}-${i}`,
      product_id: id,
      size: s.size,
      stock: s.stock
    }))
    : product.sizes || [];

  const updatedProduct: Product = {
    ...product,
    ...productData,
    sizes: updatedSizes
  };

  products[index] = updatedProduct;
  db.products.set(products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error deleting product ${id} from Supabase:`, err);
      return deleteProductMock(id);
    }
  } else {
    return deleteProductMock(id);
  }
}

function deleteProductMock(id: string): boolean {
  const products = db.products.get();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  db.products.set(filtered);
  return true;
}

export async function uploadProductImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading product image:', err);
      return fileToDataUrl(file);
    }
  } else {
    return fileToDataUrl(file);
  }
}
