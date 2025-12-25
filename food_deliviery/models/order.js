module.exports = class Order {
  constructor({
    id,
    restaurantId,
    customerName,
    totalAmount,
    isDelivered,
    items,
    createdAt
  }) 
  
  {
    this.id = id ?? Date.now();
    this.restaurantId = restaurantId;
    this.customerName = customerName;
    this.totalAmount = totalAmount;
    this.isDelivered = isDelivered ?? false;
    this.items = items ?? [];
    this.createdAt = createdAt ?? new Date().toISOString();
  }

  static create(data) {
    return new Order({
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
  }

  update(data) {
    this.restaurantId = data.restaurantId ?? this.restaurantId;
    this.customerName = data.customerName ?? this.customerName;
    this.totalAmount = data.totalAmount ?? this.totalAmount;
    this.isDelivered = data.isDelivered ?? this.isDelivered;
    this.items = data.items ?? this.items;
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