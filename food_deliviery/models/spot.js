module.exports = class Spot {
  constructor({
    id,
    name,
    location,
    rating,
    isActive,
    deliveryZones,
    openingDate,
  }) 
  
  {
    this.id = id ?? Date.now();
    this.name = name;
    this.location = location ?? "Not specified";
    this.rating = rating ?? 0;
    this.isActive = isActive ?? true;
    this.deliveryZones = deliveryZones ?? [];
    this.openingDate = openingDate ?? new Date().toISOString().split('T')[0];
  }

  static create(data) {
    return new Spot({
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
  }

  update(data) {
    this.name = data.name ?? this.name;
    this.location = data.location ?? this.location;
    this.rating = data.rating ?? this.rating;
    this.isActive = data.isActive ?? this.isActive;
    this.deliveryZones = data.deliveryZones ?? this.deliveryZones;
    this.openingDate = data.openingDate ?? this.openingDate;
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
