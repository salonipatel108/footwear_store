const mongoose = require('mongoose');
const mongooseUri = 'mongodb://localhost:27017/footwear_store';

const schema = new mongoose.Schema({ title: String, description: String, image: String });
const Model = mongoose.model('TestProd', schema);

async function test() {
    await mongoose.connect(mongooseUri);
    // clean
    await Model.deleteMany({});
    const doc = await Model.create({ title: 'A', description: 'B', image: 'C.jpg' });
    console.log('Original image:', doc.image);

    const updateData = { title: 'D', description: 'E' };
    await Model.findByIdAndUpdate(doc._id, updateData);

    const updated = await Model.findById(doc._id);
    console.log('Updated image:', updated.image);
    process.exit(0);
}
test();
