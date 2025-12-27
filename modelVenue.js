module.exports = class Venue {
  constructor({ id, name, address }) {
    this.id = id ?? null;
    this.name = name ?? "Unnamed Venue";
    this.address = address ?? "Address not specified";

    this.createdAt = new Date().toISOString();
  }

  static create(data) {
    return new Venue(data);
  }

  update(data) {
    this.name = data.name ?? this.name;
    this.address = data.address ?? this.address;
  }

  patch(data) {
    Object.keys(data).forEach((key) => {
      if (key in this && key !== "id") {
        this[key] = data[key];
      }
    });
  }
};
