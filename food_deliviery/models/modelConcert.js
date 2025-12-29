module.exports = class Concert {
  constructor({
    id,
    artist,
    date,
    price
  }) 
  {
    this.id = id ?? Date.now();
    this.artist = artist ?? "Unknown Artist";
    this.date = date ?? new Date().toISOString().split('T')[0];
    this.price = price ?? 0;

    this.updatedAt = new Date().toISOString();
  }

  static create(data) {
    return new Concert({
      ...data,
      id: data.id ?? Date.now()
    });
  }

  update(data) {
    this.artist = data.artist ?? this.artist;
    this.date = data.date ?? this.date;
    this.price = data.price ?? this.price;
    this.updatedAt = new Date().toISOString();
  }

  patch(data) {
    Object.keys(data).forEach((key) => {
      if (key in this && key !== 'id') {
        this[key] = data[key];
      }
    });
    this.updatedAt = new Date().toISOString();
  }
}