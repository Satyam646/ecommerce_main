const Product = require('../Models/product');
const Category = require('../Models/category');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

exports.Bot = async (req, res) => {
  const { message } = req.body;

  try {
    const prompt = `
You are a smart assistant for an e-commerce platform. A user will send a natural language message.
Convert it to a MongoDB query object for a Product model with fields: name (string), category (ObjectId reference), price (number).
If category is not a valid ObjectId, assume it's a category name and leave it as a string.

ONLY return a JSON Mongo query object. For example:
{"name": "Shoes", "price": {"$lt": 50}, "category": "electronics"}

User message: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const cleanedText = response.text().replace(/```json|```/g, '').trim();
    const mongoQuery = JSON.parse(cleanedText);
    console.log(mongoQuery);
    // 🧠 Handle category as string: resolve to ObjectId
    if (mongoQuery.category && typeof mongoQuery.category === 'string') {
      const cat = await Category.findOne({ name: new RegExp('^' + mongoQuery.category + '$', 'i') });
      if (cat) {
        mongoQuery.category = cat._id;
      } else {
        delete mongoQuery.category;
      }
    }

    const products = await Product.find(mongoQuery).limit(10);
    const results = products.map(p => ({
      name: p.name,
      price: p.price,
      image: p.image || "https://via.placeholder.com/150",
      link: `/product/${p.slug || p._id}`,
    }));

    return res.status(200).send(results);
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).send({ error: 'Gemini API Error', details: err.message });
  }
};
