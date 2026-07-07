const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

/* ── Generic chat ──────────────────────────────────────────── */
router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const response = await aiService.getDeepSeekInsights(prompt);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

/* ── Module-specific insights ─────────────────────────────── */
router.post('/module-insights', async (req, res) => {
  try {
    const { module, keyword, metrics } = req.body;
    if (!module || !keyword) {
      return res.status(400).json({ error: 'module and keyword are required' });
    }

    const prompt = buildPrompt(module, keyword, metrics || {});
    const insight = await aiService.getDeepSeekInsights(prompt);
    res.json({ success: true, data: insight });
  } catch (error) {
    console.error('AI Module Insights Error:', error);
    res.status(500).json({ error: 'Failed to generate module insights' });
  }
});

/* ── Prompt builder per module ───────────────────────────── */
function buildPrompt(module, keyword, m) {
  const base = `You are an expert eBay e-commerce analyst. Product keyword: "${keyword}".`;
  const dataCtx = m.averagePrice
    ? `Market data: avg price $${m.averagePrice}, ${m.totalSellers} sellers, ${m.totalItemsScanned} listings, opportunity score ${m.opportunityScore}/100, free shipping ${m.freeShippingPct}%, entry barrier: ${m.entryBarrier}.`
    : 'No live market data available; use industry estimates.';

  const prompts = {
    overview: `${base} ${dataCtx}
Provide a concise AI market summary (3-4 sentences) covering: market health, competition level, and your top recommendation for entering this niche. Be direct and actionable.`,

    research: `${base} ${dataCtx}
Analyze product research opportunities. Cover: 1) Top 3 product variants worth listing, 2) Best keywords to include in listing title, 3) One bundle idea to increase AOV. Keep it brief and specific.`,

    pricing: `${base} ${dataCtx}
Provide an optimal pricing strategy: 1) Exact recommended listing price with justification, 2) Minimum price floor to stay profitable, 3) Premium price ceiling for high-value variants, 4) One psychological pricing tactic (e.g., charm pricing). Be precise with dollar amounts.`,

    demand: `${base} ${dataCtx}
Forecast demand and seasonality: 1) Current demand trend (rising/falling/stable) with reason, 2) Best months to sell this product (peak vs off-peak), 3) Expected demand shift in next 3 months. Include estimated % change where possible.`,

    competitive: `${base} ${dataCtx}
Competitive intelligence analysis: 1) Assess how hard it is to dethrone current top sellers, 2) One specific listing tactic to outrank them in search, 3) One pricing or shipping move to steal market share. Be specific, not generic.`,

    customer: `${base} ${dataCtx}
Build a buyer persona: 1) Who is the typical buyer (age, intent, budget)? 2) Top 3 pain points they have when buying this product, 3) Top 3 features they value most. Format clearly with labels.`,

    segmentation: `${base} ${dataCtx}
Identify market segments: 1) Name 3 profitable sub-niches within "${keyword}", 2) Which price tier has the least competition (budget/mid/premium)? 3) One underserved customer group to target. Be specific.`,

    behavior: `${base} ${dataCtx}
Analyze buyer behavior & conversion: 1) Top 3 trust signals that convert browsers into buyers for this product, 2) Main reason buyers abandon the cart, 3) One listing element (title/photos/description) that has the highest impact on conversion. Keep it actionable.`,

    estimator: `${base} ${dataCtx}
Profit optimization advice: Given an average market price of $${m.averagePrice || 'N/A'}, 1) What is the realistic profit margin range a new seller should expect? 2) What is the minimum order quantity to make this worthwhile? 3) One cost-cutting suggestion to improve margins. Be practical.`,
  };

  return prompts[module] || `${base} ${dataCtx}\nProvide 3 actionable insights for the "${module}" module.`;
}

module.exports = router;
