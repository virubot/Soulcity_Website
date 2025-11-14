const express = require('express');
const router = express.Router();
const { fetchLiveStreams, handleApiError } = require('../utils/youtubeApi');
const cache = require('../utils/cache');

/**
 * GET /api/live
 * Fetches live YouTube streams based on configured hashtags
 * Returns cached data if available and not expired
 */
router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    // Get hashtags from query parameter or fall back to .env or defaults
    let hashtags;
    if (req.query.hashtags) {
      // Parse hashtags from query parameter (comma-separated)
      hashtags = req.query.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else {
      // Use .env configuration or defaults
      hashtags = process.env.HASHTAGS 
        ? process.env.HASHTAGS.split(',').map(tag => tag.trim())
        : ['#gtarp', '#gta', '#roleplay', '#rp'];
    }
    
    // Create cache key based on hashtags to avoid cache conflicts
    // Sanitize hashtags for cache key (remove # and special chars)
    const sanitizedHashtags = hashtags.sort().map(tag => tag.replace(/[#\s]/g, '')).join('_');
    const cacheKey = `live_streams_${sanitizedHashtags}`;
    const cacheDuration = parseInt(process.env.CACHE_DURATION || '30000', 10);

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Validate API key
    if (!apiKey || apiKey === 'your_youtube_api_key_here') {
      return res.status(500).json({
        success: false,
        error: 'YouTube API key not configured',
        message: 'Please set YOUTUBE_API_KEY in your .env file'
      });
    }

    // Fetch live streams
    const streams = await fetchLiveStreams(apiKey, hashtags);

    // Cache the results
    cache.set(cacheKey, streams, cacheDuration);

    // Return response
    res.json({
      success: true,
      data: streams,
      cached: false,
      count: streams.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/live:', error);

    const apiError = handleApiError(error);
    
    res.status(apiError.status || 500).json({
      success: false,
      error: apiError.error,
      message: apiError.message
    });
  }
});

module.exports = router;

