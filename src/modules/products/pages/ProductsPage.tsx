import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Package, Search, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/product-service';
import { type Product } from '../types';
import ProductForm from '../components/ProductForm';
import { useNotification } from '../../notifications/useNotification';
import { useToast } from '../../../hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { CardSkeleton } from '../../../components/ui/table-skeleton';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setFormOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const { showNotification } = useNotification();
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      showNotification('Error fetching products', 'error');
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFormOpen = useCallback((product: Product | null = null) => {
    setSelectedProduct(product);
    setFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setSelectedProduct(null);
    setFormOpen(false);
  }, []);

  const handleFormSubmit = useCallback(async (productData: Product | Omit<Product, 'id'>) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData as Product);
        showNotification('Product updated successfully', 'success');
        toast({
          title: "Product Updated",
          description: "The product information has been successfully updated.",
          variant: "default",
        });
      } else {
        await addProduct(productData as Omit<Product, 'id'>);
        showNotification('Product added successfully', 'success');
        toast({
          title: "Product Added",
          description: "The new product has been successfully created.",
          variant: "default",
        });
      }
      fetchProducts();
      handleFormClose();
    } catch (err) {
      console.error('Failed to save product:', err);
      showNotification('Error saving product', 'error');
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchProducts, handleFormClose, selectedProduct, showNotification, toast]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts();
      showNotification('Product deleted successfully', 'success');
      toast({
        title: "Product Deleted",
        description: "The product has been successfully removed.",
        variant: "default",
      });
      setDeleteConfirmation({ isOpen: false, product: null });
    } catch (err) {
      console.error('Failed to delete product:', err);
      showNotification('Error deleting product', 'error');
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchProducts, showNotification, toast]);

  const handleDeleteConfirmation = (product: Product) => {
    setDeleteConfirmation({ isOpen: true, product });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.product) {
      handleDelete(deleteConfirmation.product.id);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, product: null });
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      return !searchTerm ||
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower));
    });

    return filtered;
  }, [products, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);


  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-4 w-96 bg-muted rounded" />
          </div>
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-8 w-16 bg-muted rounded" />
                  </div>
                  <div className="h-8 w-8 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-muted rounded" />
                  <div className="h-4 w-64 bg-muted rounded" />
                </div>
                <div className="h-6 w-32 bg-muted rounded" />
              </div>
              <div className="h-10 w-full max-w-sm bg-muted rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Products
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog and pricing information
          </p>
        </div>
        <Button onClick={() => handleFormOpen(null)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-2xl font-bold">
                  ${products.length > 0 
                    ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length).toFixed(2)
                    : '0.00'
                  }
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold">{filteredAndSortedProducts.length}</p>
              </div>
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Catalog
                </CardTitle>
                <CardDescription>
                  Manage your product inventory and pricing
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredAndSortedProducts.length} of {products.length} products
              </Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                {products.length === 0 
                  ? "Get started by adding your first product."
                  : "Try adjusting your search criteria."
                }
              </p>
              {products.length === 0 && (
                <Button onClick={() => handleFormOpen(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary/20 relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
                            <Package className="h-7 w-7 text-primary" />
                          </div>
                          <Badge variant="outline" className="text-xs transition-all duration-200 group-hover:border-primary group-hover:text-primary">
                            {product.category || 'Uncategorized'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-200">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 transition-colors duration-200">
                            {product.description || 'No description available'}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="space-y-1">
                            <span className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform duration-200">
                              ${product.price?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0">
                            <Button asChild variant="ghost" size="sm" className="h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110">
                              <Link to={`/products/${product.id}`} title="View Details">
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFormOpen(product)}
                              className="h-9 w-9 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConfirmation(product)}
                              className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} results
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(parseInt(e.target.value));
                        setPage(1);
                      }}
                      className="px-3 py-1 border rounded-md text-sm"
                      title="Number of products per page"
                    >
                      <option value={6}>6 per page</option>
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={48}>48 per page</option>
                    </select>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="px-2 text-sm">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Form */}
      <ProductForm 
        open={isFormOpen} 
        onClose={handleFormClose} 
        onSubmit={handleFormSubmit} 
        product={selectedProduct} 
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirmation.product?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
