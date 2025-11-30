import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Product data matching local PNG image names
 * Names and descriptions match the actual image files
 */
const productsData = [
  { 
    id: "prd-001", 
    name: "Mango", 
    description: "Fresh tropical mango with sweet, juicy flesh. Perfect for smoothies and desserts.", 
    price: 5.99, 
    stock: 32,
    imageKey: "mango",
  }, 
  { 
    id: "prd-002", 
    name: "Orange", 
    description: "Juicy, sweet oranges bursting with vitamin C. Fresh and refreshing.", 
    price: 4.99, 
    stock: 28,
    imageKey: "orange",
  }, 
  { 
    id: "prd-003", 
    name: "Pomegranate", 
    description: "Ruby red pomegranate seeds, sweet and tangy. Packed with antioxidants and flavor.", 
    price: 7.49, 
    stock: 23,
    imageKey: "pomegranate",
  }, 
  { 
    id: "prd-004", 
    name: "Grapes", 
    description: "Crisp, sweet grapes in red and purple varieties. Refreshing and perfect for snacking.", 
    price: 5.99, 
    stock: 41,
    imageKey: "grapes",
  }, 
  { 
    id: "prd-005", 
    name: "Strawberry", 
    description: "Sweet and juicy strawberries, hand-picked at peak ripeness. Ideal for snacking and baking.", 
    price: 5.49, 
    stock: 17,
    imageKey: "strawberry",
  }, 
  { 
    id: "prd-006", 
    name: "Banana", 
    description: "Ripe yellow bananas, naturally sweet and nutritious. Great for breakfast and snacks.", 
    price: 2.99, 
    stock: 35,
    imageKey: "banana",
  }, 
  { 
    id: "prd-007", 
    name: "Blueberries", 
    description: "Fresh blueberries packed with antioxidants. Sweet and tangy, perfect for smoothies.", 
    price: 4.99, 
    stock: 20,
    imageKey: "blueberries",
  }, 
  { 
    id: "prd-008", 
    name: "Durian", 
    description: "Exotic durian fruit with unique flavor and creamy texture. Known as the king of fruits.", 
    price: 12.99, 
    stock: 14,
    imageKey: "durian",
  }, 
  { 
    id: "prd-009", 
    name: "Fig", 
    description: "Fresh, sweet figs with soft, jammy interior. Perfect for desserts and cheese pairings.", 
    price: 6.49, 
    stock: 26,
    imageKey: "fig",
  }, 
  { 
    id: "prd-010", 
    name: "Avocado", 
    description: "Ripe, creamy avocado perfect for salads, toast, and guacamole. Rich in healthy fats.", 
    price: 3.99,
    stock: 33,
    imageKey: "avocado",
  },
  { 
    id: "prd-011", 
    name: "Chicken", 
    description: "Premium organic chicken, tender and juicy. Perfect for healthy meals and grilling.", 
    price: 8.99,
    stock: 25,
    imageKey: "chicken",
  },
  { 
    id: "prd-012", 
    name: "Bread", 
    description: "Fresh artisan bread with crispy crust and soft interior. Baked daily for maximum freshness.", 
    price: 3.49,
    stock: 30,
    imageKey: "bread",
  },
  { 
    id: "prd-013", 
    name: "Avocado Premium", 
    description: "Premium organic avocado with exceptional flavor and texture. Perfect for gourmet dishes.", 
    price: 6.99,
    stock: 22,
    imageKey: "avocadoPremium",
  },
];

/**
 * Seed inventory collection with products from firebasedata.md
 * Uses local imageKey instead of imageUrl
 */
export async function seedInventory() {
  try {
    console.log('🌱 Starting to seed inventory collection...');

    const inventoryCollection = collection(db, 'inventory');
    const results = [];

    for (const product of productsData) {
      try {
        // Check if product already exists
        const productDoc = doc(inventoryCollection, product.id);
        const existingDoc = await getDoc(productDoc);

        if (!existingDoc.exists()) {
          // Prepare product data - same structure as firebasedata.md but with imageKey
          const productData = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageKey: product.imageKey, // Use local image key instead of imageUrl
          };

          // Add product to Firestore
          await setDoc(productDoc, productData);

          results.push({
            id: product.id,
            name: product.name,
            action: 'added',
            status: 'success',
          });
          console.log(`✅ Added ${product.name} (${product.id}) - Stock: ${product.stock}, Price: $${product.price}`);
        } else {
          results.push({
            id: product.id,
            name: product.name,
            action: 'exists',
            status: 'skipped',
          });
          console.log(`ℹ️  ${product.name} (${product.id}) already exists, skipped`);
        }
      } catch (productError: any) {
        results.push({
          id: product.id,
          name: product.name,
          action: 'error',
          status: 'failed',
          error: productError.message,
        });
        console.error(`❌ Failed to add ${product.name}:`, productError);
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const skippedCount = results.filter(r => r.status === 'skipped').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    console.log(`\n📊 Inventory Seeding Summary:`);
    console.log(`   ✅ Added: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    console.log(`   📦 Total: ${results.length}`);

    return {
      success: failedCount === 0,
      results,
      summary: {
        total: results.length,
        added: successCount,
        skipped: skippedCount,
        failed: failedCount,
      },
      message: `Seeded ${successCount} products, ${skippedCount} already existed, ${failedCount} failed`,
    };
  } catch (error: any) {
    console.error('❌ Error seeding inventory:', error);

    if (error.code === 'permission-denied') {
      throw new Error('Firestore permission denied. Please update Firestore security rules to allow writes to the inventory collection:\n\nmatch /inventory/{productId} {\n  allow read, write: if true;  // Temporary for seeding\n}');
    }

    if (error.code === 'unavailable' || error.message?.includes('offline')) {
      throw new Error('Cannot connect to Firestore. Please check:\n1. Internet connection\n2. Firebase project configuration\n3. Firestore is enabled in Firebase Console\n4. Firestore security rules allow write access');
    }

    throw error;
  }
}

/**
 * Check if inventory collection exists and has data
 */
export async function checkInventoryCollection() {
  try {
    const inventoryCollection = collection(db, 'inventory');
    const snapshot = await getDocs(inventoryCollection);

    return {
      exists: true,
      count: snapshot.size,
      products: snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  } catch (error: any) {
    // If permission denied, return empty but don't throw
    if (error.code === 'permission-denied') {
      return {
        exists: false,
        count: 0,
        products: [],
        error: 'Permission denied. Please update Firestore security rules.',
      };
    }
    return {
      exists: false,
      count: 0,
      products: [],
      error: error.message,
    };
  }
}
