module.exports = class Product {
  constructor({
    product_id,
    name,
    brand,
    price,
    rating,
    is_in_stock,
    added_to_catalog_date,
    expiration_date,
    ingredients
  }) {

    this.product_id = product_id ?? `PROD-${Date.now()}`;
    this.name = name;
    this.brand = brand;
    this.price = price ?? 0;
    this.rating = rating ?? 0;
    this.is_in_stock = is_in_stock ?? true;
    this.added_to_catalog_date = added_to_catalog_date ?? new Date().toISOString();
    this.expiration_date = expiration_date ?? null;
    this.ingredients = ingredients ?? [];
  }


  static create(data) {
    return new Product({
      ...data,
      added_to_catalog_date: new Date().toISOString()
    });
  }


  update(data) {
    this.name = data.name ?? this.name;
    this.brand = data.brand ?? this.brand;
    this.price = data.price ?? this.price;
    this.rating = data.rating ?? this.rating;
    this.is_in_stock = data.is_in_stock ?? this.is_in_stock;
    this.expiration_date = data.expiration_date ?? this.expiration_date;
    this.ingredients = data.ingredients ?? this.ingredients;
  }


  patch(data) {
    Object.keys(data).forEach((key) => {
      if (key in this) {
        this[key] = data[key];
      }
    });

    this.updatedAt = new Date().toISOString();
  }
}