import { useState, useEffect, useCallback } from "react";
import {
  Alert, Button, CircularProgress, Snackbar, Stack, TextField, Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ProductCard from "../components/ProductCard";
import ProductFormDialog from "../components/ProductFormDialog";
import DeleteProductDialog from "../components/DeleteProductDialog";
import api, { getApiErrorMessage } from "../api/axios";

const fetchProducts = async () => {
  const response = await api.get("/products");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : [];
};

const fetchCategories = async () => {
  const response = await api.get("/categories");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : [];
};

export default function ProductListPage({ isAdmin }) {
  const [formOpen, setFormOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [search, setSearch] = useState("");

  const loadProducts = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      setProducts(await fetchProducts());
      setError("");
    } catch {
      setError("Unable to load products. Check the API connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function loadInitialProducts() {
      try {
        const data = await fetchProducts();
        if (active) setProducts(data);
      } catch {
        if (active) setError("Unable to load products. Check the API connection and try again.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInitialProducts();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        if (active) setCategories(data);
      } catch {
        if (active) setCategoryError("Unable to load categories from OPTIONAL.");
      }
    }
    loadCategories();
    return () => { active = false; };
  }, []);

  async function saveProductImage(product, image) {
    if (product.image_id) {
      if (image) {
        await api.patch(`/product-photos/${product.image_id}`, {
          product_id: product.id,
          photo: image,
        });
      } else {
        await api.delete(`/product-photos/${product.image_id}`);
      }
    } else if (image) {
      await api.post("/product-photos", { product_id: product.id, photo: image });
    }
  }

  async function createProduct(values) {
    setError("");
    const { image, ...productValues } = values;
    try {
      const response = await api.post("/products", productValues);
      const created = response.data?.data ?? response.data;
      let successMessage = "Product created successfully.";
      if (image) {
        try {
          await api.post("/product-photos", { product_id: created.id, photo: image });
        } catch {
          successMessage = "Product created, but its image could not be saved.";
        }
      }
      await loadProducts();
      setNotice(successMessage);
      setFormOpen(false);
      setEditingProduct(null);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to create product."));
    }
  }

  async function updateProduct(id, values) {
    setError("");
    const { image, ...productValues } = values;
    try {
      const response = await api.patch(`/products/${id}`, productValues);
      const updated = response.data?.data ?? response.data;
      let successMessage = "Product updated successfully.";
      if (image !== (editingProduct.image ?? "")) {
        try {
          await saveProductImage({ ...editingProduct, ...updated }, image);
        } catch {
          successMessage = "Product updated, but its image could not be saved.";
        }
      }
      await loadProducts();
      setNotice(successMessage);
      setFormOpen(false);
      setEditingProduct(null);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to update product."));
    }
  }

  async function deleteProduct() {
    if (!deletingProduct) return;
    setError("");
    try {
      await api.delete(`/products/${deletingProduct.id}`);
      setProducts((current) => current.filter((product) => product.id !== deletingProduct.id));
      setNotice("Product deleted successfully.");
      setDeletingProduct(null);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to delete product."));
    }
  }

  const handleSave = (values) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values);
    } else {
      createProduct(values);
    }
  };

  const visibleProducts = products.filter((product) =>
    String(product.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="page-container">
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <Typography variant="h4" component="h1">Product Catalog</Typography>
            <Typography color="text.secondary">Browse and manage the store's products.</Typography>
          </div>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => loadProducts(true)}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => { setEditingProduct(null); setFormOpen(true); }}
              disabled={!isAdmin || categories.length === 0}
            >
              Add Product
            </Button>
          </Stack>
        </Stack>

        <TextField
          label="Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Sign in with an admin account to create, edit, or delete products.
        </Alert>
      )}
      {categoryError && <Alert severity="warning" sx={{ mb: 2 }}>{categoryError}</Alert>}
      {loading && <CircularProgress />}

      {!loading && !error && visibleProducts.length === 0 && (
        <Alert severity="info">No products found.</Alert>
      )}
      {!loading && !error && visibleProducts.length > 0 && (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin={isAdmin}
              onEdit={(prod) => { setEditingProduct(prod); setFormOpen(true); }}
              onDelete={setDeletingProduct}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <ProductFormDialog
          open={formOpen}
          product={editingProduct}
          categories={categories}
          onClose={() => { setFormOpen(false); setEditingProduct(null); }}
          onSave={handleSave}
        />
      )}

      <DeleteProductDialog
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={deleteProduct}
      />

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice("")}
        message={notice}
      />
    </main>
  );
}