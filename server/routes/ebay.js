const express = require('express');
const router = express.Router();
const ebayService = require('../services/ebayService');
const metricsEngine = require('../services/metricsEngine');
const aiService = require('../services/aiService');

router.get('/search', async (req, res) => {
  try {
    const { q, filter, market } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    // Handle URLs
    let searchQuery = q;
    if (q.includes('http')) {
      searchQuery = ebayService.extractKeywordFromUrl(q);
    }

    // 1. Fetch data from eBay
    const searchData = await ebayService.searchItems(searchQuery, { filter, market });
    
    // 2. Process data to get metrics
    const metrics = metricsEngine.processEbayData(searchData);
    
    if (!metrics) {
      return res.json({ 
        success: true, 
        message: 'No items found', 
        data: null 
      });
    }

    // 3. (Optional) Get AI insights if requested
    let aiInsights = null;
    if (req.query.insights === 'true') {
      const prompt = `Analyze this eBay data for the keyword "${q}": 
      Average Price: $${metrics.averagePrice}
      Total Sellers: ${metrics.totalSellers}
      Items Scanned: ${metrics.totalItemsScanned}
      Opportunity Score: ${metrics.opportunityScore}/100
      
      Provide:
      1. Market Summary (short narrative)
      2. Entry Barrier assessment
      3. 3 Actionable Strategies
      4. Optimal Listing Price recommendation`;
      
      try {
        aiInsights = await aiService.getDeepSeekInsights(prompt);
      } catch (e) {
        console.error('Failed to get AI insights:', e.message);
        // Continue without AI insights if it fails
      }
    }

    res.json({
      success: true,
      data: {
        keyword: q,
        metrics,
        aiInsights,
        rawData: req.query.raw === 'true' ? searchData : undefined
      }
    });

  } catch (error) {
    console.error('Search Route Error:', error);
    res.status(500).json({ error: 'Failed to process search request' });
  }
});

// POST /api/ebay/update-rules
router.post('/update-rules', async (req, res) => {
  try {
    const { autoAccept, autoDecline } = req.body;
    
    if (autoAccept === undefined || autoDecline === undefined) {
      return res.status(400).json({ error: 'autoAccept and autoDecline are required' });
    }

    const result = await ebayService.updateOfferRules({ autoAccept, autoDecline });
    res.json(result);
  } catch (error) {
    console.error('Update Rules Route Error:', error);
    res.status(500).json({ error: 'Failed to update rules' });
  }
});

// POST /api/ebay/enable-automation
router.post('/enable-automation', async (req, res) => {
  try {
    const { actionType, data } = req.body;
    
    if (!actionType) {
      return res.status(400).json({ error: 'actionType is required' });
    }

    const result = await ebayService.triggerAutomationAction(actionType, data);
    res.json(result);
  } catch (error) {
    console.error('Enable Automation Route Error:', error);
    res.status(500).json({ error: 'Failed to enable automation' });
  }
});

module.exports = router;
