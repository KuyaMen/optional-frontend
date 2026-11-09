import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

const getFormValues = (product) => ({
  name: product?.name ?? "",
  price: String(product?.price ?? ""),
  stock: String(product?.stock ?? "10"),
  category_id: String(product?.category_id ?? ""),
  image: product?.image ?? "",
  description: product?.description ?? "",
});

export default function ProductFormDialog({ open, product, categories, onClose, onSave }) {
  const [form, setForm] = useState(() => getFormValues(product));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      nextErrors.price = "Enter a valid price of zero or more.";
    }
    if (form.stock === "" || !Number.isFinite(stock) || stock < 0) {
      nextErrors.stock = "Enter a valid stock quantity.";
    }
    if (!form.category_id) nextErrors.category_id = "Select a category.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      name: form.name.trim(),
      price,
      stock,
      category_id: Number(form.category_id),
      image: form.image.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          {categories.length === 0 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Add a category in OPTIONAL before creating products.
            </Alert>
          )}
          <TextField
            autoFocus
            margin="normal"
            fullWidth
            label="Product name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Price (PHP)"
            name="price"
            type="number"
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
            value={form.price}
            onChange={handleChange}
            error={Boolean(errors.price)}
            helperText={errors.price}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
            value={form.stock}
            onChange={handleChange}
            error={Boolean(errors.stock)}
            helperText={errors.stock}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            select
            label="Category"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            error={Boolean(errors.category_id)}
            helperText={errors.category_id}
            required
            disabled={categories.length === 0}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={String(category.id)}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            label="Image URL"
            name="image"
            value={form.image}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={categories.length === 0}>
            {product ? "Save Changes" : "Add Product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}