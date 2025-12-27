module.exports = class Customer {
  constructor({
    customer_id,
    full_name,
    email,
    total_spent,
    loyalty_points,
    newsletter_subscribed,
    registration_date,
    recent_order_ids
  }) {
    this.customer_id = customer_id ?? `CUST-${Date.now()}`;
    this.full_name = full_name;
    this.email = email;
    this.total_spent = total_spent ?? 0;
    this.loyalty_points = loyalty_points ?? 0;
    this.newsletter_subscribed = newsletter_subscribed ?? false;
    this.registration_date = registration_date ?? new Date().toISOString();
    this.recent_order_ids = recent_order_ids ?? [];
  }

  static create(data) {
    return new Customer({
      ...data,
      registration_date: new Date().toISOString()
    });
  }

  update(data) {
    this.full_name = data.full_name ?? this.full_name;
    this.email = data.email ?? this.email;
    this.total_spent = data.total_spent ?? this.total_spent;
    this.loyalty_points = data.loyalty_points ?? this.loyalty_points;
    this.newsletter_subscribed = data.newsletter_subscribed ?? this.newsletter_subscribed;
    this.recent_order_ids = data.recent_order_ids ?? this.recent_order_ids;
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