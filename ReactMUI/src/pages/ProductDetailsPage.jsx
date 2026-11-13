import { useEffect, useState } from "react";
import { Alert, Button, Card, CardMedia, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Link as RouterLink, useParams } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(price));

export default function ProductDetailsPage({ onCartChange }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartError, setCartError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/products/${id}`);
        const data = response.data?.data ?? response.data;
        if (active) setProduct(data);
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.status === 403
              ? getApiErrorMessage(requestError, "You are not allowed to view this product.")
              : "Unable to find this product."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="page-container" style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <CircularProgress />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page-container">
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error || "Product not found."}
        </Alert>
        <Button component={RouterLink} to="/" variant="outlined">
          ← Back to products
        </Button>
      </main>
    );
  }

  async function addToCart() {
    setCartError("");
    setAddingToCart(true);

    try {
      await api.post("/carts", { product_id: product.id, quantity: 1 });
      onCartChange();
      setNotice(`${product.name} added to your cart.`);
    } catch (requestError) {
      setCartError(getApiErrorMessage(requestError, "Unable to add this product to your cart."));
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <main className="page-container">
      <Button component={RouterLink} to="/" sx={{ mb: 2 }}>
        ← Back to products
      </Button>

      <Card sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={product.image || "https://placehold.co/600x400?text=Product"}
          alt={product.name}
          sx={{ height: { xs: 260, md: "100%" }, minHeight: 320, objectFit: "cover" }}
        />
        <Stack spacing={2} sx={{ p: { xs: 2.5, md: 4 }, alignItems: "flex-start" }}>
          <Typography color="text.secondary">{product.category}</Typography>
          <Typography variant="h4" component="h1">
            {product.name}
          </Typography>
          <Typography variant="h5" color="primary">
            {formatPrice(product.price)}
          </Typography>
          <Typography>{product.description || "No description provided."}</Typography>
          {cartError && <Alert severity="error">{cartError}</Alert>}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              onClick={addToCart}
              disabled={addingToCart || Number(product.stock) < 1}
            >
              {addingToCart ? "Adding..." : "Add to cart"}
            </Button>
            <Button component={RouterLink} to="/" variant="outlined">
              Return to catalog
            </Button>
          </Stack>
        </Stack>
      </Card>
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice("")}
        message={notice}
      />
    </main>
  );
}