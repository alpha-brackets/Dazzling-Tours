// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the dazzling-tours database
db = db.getSiblingDB("dazzling-tours");

// Create a user for the application
db.createUser({
  user: "dazzling-user",
  pwd: "dazzling-password",
  roles: [
    {
      role: "readWrite",
      db: "dazzling-tours",
    },
  ],
});

// Create initial collections
db.createCollection("users");
db.createCollection("tours");
db.createCollection("blogs");
db.createCollection("testimonials");
db.createCollection("comments");
db.createCollection("contacts");
db.createCollection("newsletters");
db.createCollection("bookings");
db.createCollection("otps");

print("✅ MongoDB initialization completed successfully!");
print("📊 Database: dazzling-tours");
print("👤 User: dazzling-user");
print("🔑 Password: dazzling-password");
