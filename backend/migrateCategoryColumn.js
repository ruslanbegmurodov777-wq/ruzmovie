const { sequelize } = require('./src/sequelize');

const addCategoryColumn = async () => {
  try {
    console.log('🔧 Adding category column to Videos table...');
    
    // Add category column with default value
    await sequelize.query(`
      ALTER TABLE Videos 
      ADD COLUMN category ENUM('movies', 'music', 'dramas', 'cartoons') 
      DEFAULT 'movies'
    `);
    
    console.log('✅ Category column added successfully');
    
    // Update existing videos to have default category
    await sequelize.query(`
      UPDATE Videos 
      SET category = 'movies' 
      WHERE category IS NULL
    `);
    
    console.log('✅ Existing videos updated with default category');
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('⚠️ Category column already exists');
      
      // Just update existing videos with null category
      await sequelize.query(`
        UPDATE Videos 
        SET category = 'movies' 
        WHERE category IS NULL
      `);
      
      console.log('✅ Updated NULL categories to default value');
    } else {
      console.error('❌ Migration failed:', error.message);
    }
  } finally {
    await sequelize.close();
  }
};

addCategoryColumn();