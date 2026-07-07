const axios = require('axios');

async function getDeepSeekInsights(prompt) {
  try {
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert e-commerce data analyst for eBay.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('AI Service error:', err.response?.data || err.message);
    
    // Check if it's an insufficient balance error
    if (err.response?.status === 402 || err.response?.data?.error?.message?.includes('Insufficient Balance')) {
      console.warn('DeepSeek API Insufficient Balance. Returning fallback mock data.');
      return getFallbackInsight(prompt);
    }
    
    // Fallback for any other API errors (network, timeout, etc.)
    console.warn('DeepSeek API Failed. Returning fallback mock data.');
    return getFallbackInsight(prompt);
  }
}

// Generates context-aware mock insights based on the prompt content
function getFallbackInsight(prompt) {
  const p = prompt.toLowerCase();
  
  if (p.includes('overview') || p.includes('summary')) {
    return `**Market Health:** The market is currently stable with consistent demand and moderate competition. 
**Competition Level:** With a moderate entry barrier, there is room for new sellers who differentiate their offerings.
**Recommendation:** Focus on creating high-quality listings with clear photos and competitive pricing. Offering free shipping can significantly boost visibility.`;
  }
  
  if (p.includes('research') || p.includes('variant')) {
    return `1. **Top Variants:** Consider listing multi-packs or bundle kits, as they offer higher perceived value.
2. **Keywords:** Include terms like "Premium", "Durable", and "Free Shipping" in your titles.
3. **Bundle Idea:** Pair the main item with a complementary accessory (e.g., carrying case or maintenance kit) to increase AOV.`;
  }
  
  if (p.includes('pricing') || p.includes('optimal')) {
    return `1. **Recommended Price:** Aim for around 5% below the market average to quickly build sales history.
2. **Minimum Floor:** Do not drop below a 15% profit margin; compete on value rather than a race to the bottom.
3. **Premium Ceiling:** High-quality variants can be priced 15-20% higher if accompanied by premium branding.
4. **Tactic:** Use charm pricing (e.g., ending prices in .95 or .99) to increase conversion rates.`;
  }
  
  if (p.includes('demand') || p.includes('forecast')) {
    return `1. **Current Trend:** Demand is steadily rising as we approach peak seasonal periods.
2. **Best Months:** Q4 (Nov-Dec) typically sees the highest sales velocity for this category.
3. **Expected Shift:** Expect a 10-15% increase in demand over the next 3 months due to seasonal buying patterns.`;
  }
  
  if (p.includes('competitive') || p.includes('intelligence')) {
    return `1. **Assessment:** The top sellers hold a significant share, but they lack variety in bundle offerings.
2. **Listing Tactic:** Optimize your item specifics and use high-resolution images to outrank older, stale listings.
3. **Market Share Move:** Offer 1-day handling and free shipping to immediately stand out from competitors offering slower fulfillment.`;
  }
  
  if (p.includes('customer') || p.includes('persona')) {
    return `1. **Buyer Persona:** Typically value-conscious consumers looking for reliability and quick delivery.
2. **Pain Points:** High shipping costs, inaccurate product descriptions, and slow delivery.
3. **Valued Features:** Free shipping, high seller feedback, and easy returns.`;
  }
  
  if (p.includes('segmentation') || p.includes('niches')) {
    return `1. **Sub-niches:** Eco-friendly versions, professional-grade variants, and beginner kits.
2. **Price Tier:** The mid-tier ($15-$30) has the highest demand but the most competition. The premium tier has lower volume but better margins.
3. **Underserved Group:** Professional users looking for high-durability options are often overlooked.`;
  }
  
  if (p.includes('behavior') || p.includes('conversion')) {
    return `1. **Trust Signals:** High seller feedback (99%+), detailed return policies, and clear, authentic photos.
2. **Abandonment Reason:** Unexpected shipping costs added at checkout.
3. **Highest Impact:** The primary photo has the single largest impact on click-through and conversion rates.`;
  }
  
  if (p.includes('estimator') || p.includes('profit')) {
    return `1. **Profit Margin Range:** A realistic net margin for new sellers in this category is between 15% and 25%.
2. **Minimum Order Quantity:** Consider sourcing at least 50 units per order to achieve viable wholesale pricing.
3. **Cost-Cutting:** Negotiate with suppliers for free or discounted shipping to your warehouse to improve margins.`;
  }

  // Generic fallback for chat panel
  return `I am currently operating in **Offline Simulation Mode** due to an API balance limit. However, based on the market data provided:
- Ensure your pricing is competitive with the market average.
- Focus on high-quality photos and detailed descriptions.
- Monitor your top competitors for bundle and shipping strategies.`;
}

module.exports = {
  getDeepSeekInsights
};
