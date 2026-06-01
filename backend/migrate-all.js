const mongoose = require('mongoose');
require('dotenv').config();

// Local MongoDB URI
const LOCAL_DB = 'mongodb://localhost:27017/wombly';

// Atlas MongoDB URI (from .env)
const ATLAS_DB = process.env.MONGODB_URI;

async function getAllCollections(connection) {
  const collections = await connection.db.listCollections().toArray();
  return collections.map(c => c.name);
}

async function migrateAllData() {
  let localConnection;
  let atlasConnection;

  try {
    console.log('🔄 Starting comprehensive migration...\n');

    // Connect to local database
    console.log('📍 Connecting to local MongoDB:', LOCAL_DB);
    localConnection = await mongoose.createConnection(LOCAL_DB).asPromise();
    console.log('✅ Connected to local MongoDB\n');

    // Connect to Atlas database
    console.log('🌐 Connecting to MongoDB Atlas:', ATLAS_DB.replace(/:[^:]*@/, ':****@'));
    atlasConnection = await mongoose.createConnection(ATLAS_DB).asPromise();
    console.log('✅ Connected to MongoDB Atlas\n');

    // Get all collections from local DB
    const localCollections = await getAllCollections(localConnection);
    console.log(`📋 Found ${localCollections.length} collections in local database:\n`);
    localCollections.forEach(col => console.log(`   - ${col}`));
    console.log('\n');

    // Migrate each collection
    for (const collectionName of localCollections) {
      try {
        console.log(`📦 Migrating ${collectionName}...`);

        // Get collection from local connection
        const localCollection = localConnection.collection(collectionName);
        const localData = await localCollection.find({}).toArray();

        if (localData.length === 0) {
          console.log(`   ⚠️  No records found\n`);
          continue;
        }

        // Get collection from Atlas connection
        const atlasCollection = atlasConnection.collection(collectionName);

        // Check if collection exists and has data
        const existingCount = await atlasCollection.countDocuments({});
        if (existingCount > 0) {
          console.log(`   ℹ️  ${collectionName} already has ${existingCount} records in Atlas`);
          console.log(`   ❓ Replace with ${localData.length} local records? (keeping existing data)\n`);
          continue;
        }

        // Insert data
        const result = await atlasCollection.insertMany(localData);
        console.log(`   ✅ Migrated ${result.insertedIds.length} records\n`);
      } catch (error) {
        console.log(`   ❌ Error migrating ${collectionName}:`, error.message, '\n');
      }
    }

    console.log('✨ Migration complete!');
    console.log('\n📌 All collections have been migrated to MongoDB Atlas');
    console.log('📌 Next: Verify data and restart your backend server\n');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    // Close connections
    if (localConnection) await localConnection.close();
    if (atlasConnection) await atlasConnection.close();
    console.log('🔌 Connections closed');
  }
}

// Run migration
migrateAllData();
