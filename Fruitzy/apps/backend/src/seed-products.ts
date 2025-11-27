import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Product data from firebasedata.md
const products = [
  {
    id: 'prd-001',
    name: 'Dragon Pearl Lychee',
    description:
      'Premium tropical lychee with floral aroma and soft juicy flesh. Sweet and refreshing.',
    price: 5.99,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130843697.jpg',
    stock: 32,
  },
  {
    id: 'prd-002',
    name: 'Golden Starfruit',
    description:
      'Exotic carambola with crisp texture and tropical sweetness. Ideal for juices and desserts.',
    price: 6.49,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130954509.jpg',
    stock: 28,
  },
  {
    id: 'prd-003',
    name: 'Ruby Red Rambutan',
    description:
      'Rare rambutans with vibrant red hair-like skin. Soft, grape-like interior and floral notes.',
    price: 7.89,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130969204.jpg',
    stock: 23,
  },
  {
    id: 'prd-004',
    name: 'Snow Lotus Pear',
    description:
      'Crisp white Asian pear with honey sweetness. Excellent for hydration and snacking.',
    price: 4.99,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130895111.jpg',
    stock: 41,
  },
  {
    id: 'prd-005',
    name: 'Crimson Cloudberry',
    description:
      'Northern European delicacy with tangy tropical taste. Ideal for cocktails and gourmet desserts.',
    price: 8.49,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130905796.jpg',
    stock: 17,
  },
  {
    id: 'prd-006',
    name: 'Fire Nectar Pluot',
    description:
      'Hybrid plum-apricot blend with bright orange flesh and intense sweet-tart flavor.',
    price: 6.99,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130917708.jpg',
    stock: 35,
  },
  {
    id: 'prd-007',
    name: 'Moonstone Mangosteen',
    description:
      'Rare white mangosteen. Soft, citrus-vanilla flavor profile. Known as the queen of fruits.',
    price: 9.99,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130945308.jpg',
    stock: 20,
  },
  {
    id: 'prd-008',
    name: 'Velvet Black Sapote',
    description:
      'Silky chocolate pudding fruit with velvety sweet texture. Ideal for smoothies and desserts.',
    price: 7.49,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130877697.jpg',
    stock: 14,
  },
  {
    id: 'prd-009',
    name: 'Amber Honey Pomelo',
    description:
      'Large citrus pomelo with mild honey sweetness and floral fragrance. Low acidity.',
    price: 5.59,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130866600.jpg',
    stock: 26,
  },
  {
    id: 'prd-010',
    name: 'Jade Kiwi Berry',
    description:
      'Mini kiwi fruit with edible skin. Soft, candy-sweet flesh and vibrant green color.',
    price: 6.79,
    imageUrl:
      'https://fe1b8e17bc5bdd46e8a69af12e0b8a67.r2.cloudflarestorage.com/chromastudio/internalusenano/auto_test/generated_image_1_1764130855997.jpg',
    stock: 33,
  },
];

async function seedProducts() {
  try {
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'your-firebase-project-id',
      });
    }

    const db = admin.firestore();
    const productsCollection = db.collection('products');

    console.log('Starting to seed products...');

    // Add each product to Firestore
    for (const product of products) {
      await productsCollection.doc(product.id).set(product);
      console.log(`✓ Added ${product.name} (${product.id})`);
    }

    console.log('\n✅ Successfully seeded all 10 products!');
    console.log('Products can be viewed in Firebase Console.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
