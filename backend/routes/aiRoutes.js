const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Escape regex special characters
const escapeRegex = (str) => {
  if (!str) return '';
  return str.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Clean and extract potential product/salt keywords from natural user prompt
const extractSearchKeywords = (text) => {
  if (!text) return [];
  const stopwords = new Set([
    'what', 'is', 'the', 'price', 'of', 'do', 'you', 'have', 'in', 'stock',
    'for', 'and', 'a', 'an', 'available', 'give', 'me', 'show', 'tell', 'about',
    'please', 'how', 'much', 'cost', 'rate', 'bhav', 'che', 'nathi', 'karo',
    'aapo', 'batavo', 'dava', 'medicine', 'tablet', 'syrup', 'capsule', 'injection',
    'any', 'who', 'where', 'can', 'i', 'get', 'need', 'want', 'buy', 'order'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopwords.has(w));

  return words;
};

// Fetch candidate products from MongoDB matching the user query
const findRelevantProducts = async (queryText) => {
  try {
    const keywords = extractSearchKeywords(queryText);
    const trimmed = queryText.trim();

    const conditions = [];

    // 1. Direct phrase match on name, brand, or composition
    if (trimmed.length >= 2) {
      const escaped = escapeRegex(trimmed);
      conditions.push(
        { name: { $regex: escaped, $options: 'i' } },
        { brand: { $regex: escaped, $options: 'i' } },
        { composition: { $regex: escaped, $options: 'i' } },
        { category: { $regex: escaped, $options: 'i' } }
      );
    }

    // 2. Keyword matches
    keywords.forEach((kw) => {
      const esc = escapeRegex(kw);
      conditions.push(
        { name: { $regex: esc, $options: 'i' } },
        { brand: { $regex: esc, $options: 'i' } },
        { composition: { $regex: esc, $options: 'i' } }
      );
    });

    if (conditions.length === 0) {
      // Fallback: return top 5 featured or active products
      return await Product.find({ inStock: true })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('name brand company category form packing composition price mrp inStock stockQuantity scheme imageUrl')
        .lean();
    }

    const products = await Product.find({ $or: conditions })
      .limit(8)
      .select('name brand company category form packing composition price mrp inStock stockQuantity scheme imageUrl')
      .lean();

    return products;
  } catch (err) {
    console.error('AI Product search error:', err.message);
    return [];
  }
};

// Call Gemini API using native fetch
const callGemini = async (prompt, systemInstruction) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  // Try gemini-2.5-flash first, fallback to gemini-1.5-flash
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 600,
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      } else {
        const errorText = await res.text();
        console.warn(`Gemini API (${model}) returned status ${res.status}:`, errorText);
      }
    } catch (err) {
      console.warn(`Gemini call error on ${model}:`, err.message);
    }
  }

  return null;
};

// Intelligent Rule-Based Fallback when Gemini API is unconfigured or unavailable
const generateFallbackReply = (query, products) => {
  const qLower = query.toLowerCase();

  if (products && products.length > 0) {
    const list = products.slice(0, 3).map((p) => {
      const stock = p.inStock ? 'In Stock' : 'Out of Stock';
      const priceStr = p.price ? `₹${p.price}` : 'Price on enquiry';
      return `• **${p.name}** (${p.brand || p.company}) - ${p.form || 'Medicine'} [${p.packing || 'Std'}]: ${priceStr} (${stock})`;
    }).join('\n');

    return `I found the following matching items in the **Niyansh Pharma** catalog:\n\n${list}\n\nYou can add them directly to your enquiry cart below! Need another brand, packing, or salt composition? Let me know.`;
  }

  if (qLower.includes('hello') || qLower.includes('hi') || qLower.includes('kem cho')) {
    return `Hello! Welcome to **Niyansh Pharma AI Assistant**.\n\nI can help you search our medicine catalog, check wholesale availability, find alternative generic compositions (salts), and guide your bulk orders. What medicine or product are you looking for today?`;
  }

  if (qLower.includes('order') || qLower.includes('buy') || qLower.includes('enquiry')) {
    return `To place an order or enquiry with Niyansh Pharma:\n1. Search for your required medicines.\n2. Add them to your **Enquiry Cart** with desired quantities.\n3. Submit your enquiry with your pharmacy/chemist license details, and our sales team will confirm your invoice and delivery!`;
  }

  return `I couldn't find an exact match for "${query}" in our instant catalog, but Niyansh Pharma distributes thousands of formulations across Gujarat. You can try searching by the salt name (e.g., Amoxicillin, Paracetamol) or contact our sales desk directly!`;
};

// @desc    Chat with AI Assistant (Medicine, Stock, Composition, Order assistance)
// @route   POST /api/ai/chat
// @access  Public
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const userQuery = message.trim();

    // 1. Find matching catalog products from MongoDB
    const candidateProducts = await findRelevantProducts(userQuery);

    // 2. Prepare Product Context Summary for AI
    const productContext = candidateProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      brand: p.brand || p.company,
      company: p.company,
      category: p.category,
      form: p.form,
      packing: p.packing,
      composition: p.composition,
      price: p.price,
      mrp: p.mrp,
      inStock: p.inStock,
      scheme: p.scheme,
    }));

    const catalogSnippet = productContext.length > 0
      ? JSON.stringify(productContext, null, 2)
      : 'No exact catalog matches found in instant search.';

    const systemInstruction = `You are "Niyansh AI", the official smart AI assistant for Niyansh Pharma — a leading wholesale pharmaceutical distributor in Gujarat, India.
Your mission is to assist retail chemists, pharmacists, stockists, doctors, and hospitals.

Your capabilities:
1. Explain medicines, formulations (tablets, syrups, drops, injections, ointments), active compositions, and packings.
2. Check product availability and wholesale pricing based STRICTLY on the catalog data provided below.
3. If an item is out of stock or unavailable, suggest an alternative brand or product with the matching chemical composition/salt from the catalog if available.
4. Guide users on wholesale ordering, schemes, and enquiries.

Rules:
- Speak courteously, clearly, and concisely.
- You can communicate fluently in English, Gujarati, and Hindi. Respond in the primary language used by the user in their prompt.
- Format responses nicely with bullet points and bold product names where helpful.
- Do NOT provide clinical diagnoses or prescribe medicines directly to consumers. If asked for medical advice, advise consulting a registered medical practitioner.
- Mention wholesale rates (₹) and stock status when relevant.

Relevant Niyansh Pharma Catalog Items:
${catalogSnippet}`;

    const prompt = `User conversation history:\n${history.slice(-4).map(h => `${h.role}: ${h.text}`).join('\n')}\n\nUser Question: ${userQuery}`;

    // 3. Attempt Gemini API Call
    let aiReply = null;
    let hasApiKey = Boolean(process.env.GEMINI_API_KEY);

    if (hasApiKey) {
      aiReply = await callGemini(prompt, systemInstruction);
    }

    // 4. Fallback if Gemini is not set or did not respond
    if (!aiReply) {
      aiReply = generateFallbackReply(userQuery, candidateProducts);
    }

    return res.json({
      success: true,
      reply: aiReply,
      suggestedProducts: candidateProducts.slice(0, 4),
      hasApiKey,
    });
  } catch (error) {
    console.error('AI chat endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat request',
      reply: 'Sorry, I encountered a temporary error while processing your request. Please try again in a moment.',
      suggestedProducts: [],
    });
  }
});

// @desc    Check AI service status
// @route   GET /api/ai/status
// @access  Public
router.get('/status', (req, res) => {
  res.json({
    active: true,
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    provider: process.env.GEMINI_API_KEY ? 'Google Gemini AI' : 'Catalog Smart Assistant',
    service: 'Niyansh Pharma AI Engine',
  });
});

module.exports = router;
