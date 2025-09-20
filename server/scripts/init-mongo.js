// MongoDB initialization script for development
db = db.getSiblingDB('sweetshop');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password', 'role'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 50
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        },
        role: {
          bsonType: 'string',
          enum: ['user', 'admin']
        }
      }
    }
  }
});

db.createCollection('sweets', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'category', 'price', 'quantity', 'description'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100
        },
        category: {
          bsonType: 'string',
          enum: ['Cakes', 'Candy', 'Cookies', 'Chocolates', 'Ice Cream', 'Pastries', 'Other']
        },
        price: {
          bsonType: 'number',
          minimum: 0
        },
        quantity: {
          bsonType: 'number',
          minimum: 0
        },
        description: {
          bsonType: 'string',
          minLength: 10,
          maxLength: 500
        }
      }
    }
  }
});

db.createCollection('orders');
db.createCollection('inventorylogs');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.sweets.createIndex({ name: 'text', description: 'text' });
db.sweets.createIndex({ category: 1 });
db.sweets.createIndex({ price: 1 });
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.createIndex({ sweetId: 1 });
db.inventorylogs.createIndex({ sweetId: 1, createdAt: -1 });

print('Database initialization completed successfully!');
