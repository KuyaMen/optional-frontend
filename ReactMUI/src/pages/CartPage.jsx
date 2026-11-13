import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link as RouterLink } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(price));

const getUnitPrice = (product) => Number(product.price);

export default function CartPage({ onCartChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    try {
      const response = await api.get("/carts");
      const data = response.data?.data ?? response.data;
      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load your cart."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    api.get("/carts")
      .then((response) => {
        const data = response.data?.data ?? response.data;
        if (active) {
          setItems(Array.isArray(data) ? data : []);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError, "Unable to load your cart."));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + getUnitPrice(item.product) * Number(item.quantity),
        0
      ),
    [items]
  );

  async function updateQuantity(item, quantity) {
    setError("");
    setUpdatingItemId(item.id);

    try {
      const response = await api.patch(`/carts/${item.id}`, { quantity });
      const updatedItem = response.data?.data ?? response.data;
      setItems((current) =>
        current.map((cartItem) => (cartItem.id === item.id ? updatedItem : cartItem))
      );
      onCartChange();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to update this cart item."));
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function removeItem(item) {
    setError("");
    setUpdatingItemId(item.id);

    try {
      await api.delete(`/carts/${item.id}`);
      setItems((current) => current.filter((cartItem) => cartItem.id !== item.id));
      onCartChange();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to remove this cart item."));
    } finally {
      setUpdatingItemId(null);
    }
  }

  return (
    <main className="page-container">
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Your cart
        </Typography>
        <Typography color="text.secondary">
          Review your items and quantities before placing an order.
        </Typography>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            items.length === 0 ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setLoading(true);
                  loadCart();
                }}
              >
                Retry
              </Button>
            ) : undefined
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : items.length === 0 ? (
        <Stack spacing={2} alignItems="flex-start">
          {!error && <Alert severity="info">Your cart is empty.</Alert>}
          <Button component={RouterLink} to="/" variant="contained">
            Browse products
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => {
            const product = item.product;
            const itemBusy = updatingItemId === item.id;

            return (
              <Card key={item.id} sx={{ p: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ sm: "center" }}
                >
                  <CardMedia
                    component="img"
                    image={product.image || "https://placehold.co/160x120?text=Product"}
                    alt={product.name}
                    sx={{ width: { xs: "100%", sm: 128 }, height: 100, objectFit: "cover" }}
                  />
                  <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">
                      {formatPrice(getUnitPrice(product))} each
                    </Typography>
                    <Typography fontWeight={600}>
                      Item total: {formatPrice(getUnitPrice(product) * item.quantity)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      aria-label={`Decrease quantity of ${product.name}`}
                      onClick={() => updateQuantity(item, Number(item.quantity) - 1)}
                      disabled={itemBusy || Number(item.quantity) <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography aria-label="Quantity" sx={{ minWidth: 24, textAlign: "center" }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      aria-label={`Increase quantity of ${product.name}`}
                      onClick={() => updateQuantity(item, Number(item.quantity) + 1)}
                      disabled={itemBusy || Number(item.quantity) >= Number(product.stock)}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      aria-label={`Remove ${product.name} from cart`}
                      color="error"
                      onClick={() => removeItem(item)}
                      disabled={itemBusy}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Card>
            );
          })}

          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Typography variant="h6">Subtotal</Typography>
            <Typography variant="h5" color="primary" fontWeight={700}>
              {formatPrice(total)}
            </Typography>
          </Stack>
        </Stack>
      )}
    </main>
  );
}
