const mongoose = require('mongoose');
require('dotenv').config();

// Local MongoDB URI
const LOCAL_DB = 'mongodb://localhost:27017/wombly';

// Atlas MongoDB URI (from .env)
const ATLAS_DB = process.env.MONGODB_URI;

// Import models
const User = require('./models/User');
const Video = require('./models/Video');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const models = [
  { name: 'User', model: User },
  { name: 'Video', model: Video },
  { name: 'Conversation', model: Conversation },
  { name: 'Message', model: Message },
];

async function migrateData() {
  let localConnection;
  let atlasConnection;

  try {
    console.log('🔄 Starting migration...\n');

    // Connect to local database
    console.log('📍 Connecting to local MongoDB:', LOCAL_DB);
    localConnection = await mongoose.createConnection(LOCAL_DB).asPromise();
    console.log('✅ Connected to local MongoDB\n');

    // Connect to Atlas database
    console.log('🌐 Connecting to MongoDB Atlas:', ATLAS_DB.replace(/:[^:]*@/, ':****@'));
    atlasConnection = await mongoose.createConnection(ATLAS_DB).asPromise();
    console.log('✅ Connected to MongoDB Atlas\n');

    // Migrate each collection
    for (const { name, model } of models) {
      try {
        console.log(`📦 Migrating ${name}...`);

        // Get model from local connection
        const LocalModel = localConnection.model(name, model.schema);
        const localData = await LocalModel.find({});

        if (localData.length === 0) {
          console.log(`   ⚠️  No ${name} records found in local database`);
          continue;
        }

        // Get model from Atlas connection
        const AtlasModel = atlasConnection.model(name, model.schema);

        // Clear existing data (optional - comment out to keep existing data)
        // await AtlasModel.deleteMany({});
        // console.log(`   Cleared existing ${name} records`);

        // Insert data
        const result = await AtlasModel.insertMany(localData, { ordered: false });
        console.log(`   ✅ Migrated ${result.length} ${name} records\n`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`   ℹ️  ${name} records already exist in Atlas (duplicate key error - skipping)\n`);
        } else {
          console.log(`   ❌ Error migrating ${name}:`, error.message, '\n');
        }
      }
    }

    console.log('✨ Migration complete!');
    console.log('\n📌 Next steps:');
    console.log('1. Verify data in MongoDB Atlas dashboard');
    console.log('2. Restart your backend server');
    console.log('3. Test the app - it now uses cloud data!\n');
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
migrateData();
