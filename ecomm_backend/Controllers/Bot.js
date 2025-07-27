const Product = require('../Models/product');
const Category = require('../Models/category');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const isValidObjectId = (id) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);

exports.Bot = async (req, res) => {
  const { message } = req.body;

  try {
    const prompt = `
You are a smart assistant for an e-commerce platform.

The user will ask for products using natural language. Your job is to convert the request into a valid MongoDB query for Mongoose.

Return ONLY a valid JSON object. Use:
- "name" as a string or regex (e.g., { "name": { "$regex": "shoes", "$options": "i" } })
- "price" using operators like $lt, $gt, $lte, $gte
- "category" as plain string (e.g., "electronics") — do NOT use $ref, $id, or DBRef

If the query is unclear, just return: { "category": "books" }

User message: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanedText = response.text().replace(/```json|```/g, '').trim();

    let mongoQuery;
    try {
      mongoQuery = JSON.parse(cleanedText);
    } catch (e) {
      console.error("❌ Gemini returned invalid JSON:", cleanedText);
      mongoQuery = { category: "books" }; // fallback
    }

    console.log("🧠 Parsed Query:", mongoQuery);

    // 🧼 Sanitize category if Gemini returns invalid object
    if (
      mongoQuery.category &&
      typeof mongoQuery.category === 'object' &&
      ('$ref' in mongoQuery.category || '$id' in mongoQuery.category)
    ) {
      console.warn("⚠️ Invalid category format detected. Removing...");
      delete mongoQuery.category;
    }

    // 🧠 Resolve category string to ObjectId
    if (mongoQuery.category && typeof mongoQuery.category === 'string') {
      const cat = await Category.findOne({ name: new RegExp('^' + mongoQuery.category + '$', 'i') });
      if (cat) {
        mongoQuery.category = cat._id;
      } else {
        console.warn(`⚠️ Category "${mongoQuery.category}" not found. Removing...`);
        delete mongoQuery.category;
      }
    }

    // Final check before query
    if (mongoQuery.category && !isValidObjectId(mongoQuery.category)) {
      console.warn("⚠️ Invalid category ObjectId. Removing...");
      delete mongoQuery.category;
    }

    const products = await Product.find(mongoQuery).limit(10);
    const results = products.map(p => ({
      name: p.name,
      price: p.price,
      link: `/product/${p._id}`,
    }));

    return res.status(200).send(results);
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).send({ error: 'Gemini API Error', details: err.message });
  }
};
