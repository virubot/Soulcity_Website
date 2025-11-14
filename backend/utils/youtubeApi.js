const axios = require('axios');

/**
 * Fetches live YouTube streams based on hashtags
 * @param {string} apiKey - YouTube Data API v3 key
 * @param {string[]} hashtags - Array of hashtags to search for
 * @returns {Promise<Array>} Array of normalized stream objects
 */
async function fetchLiveStreams(apiKey, hashtags) {
  const allStreams = [];
  const seenVideoIds = new Set();

  try {
    // Search for each hashtag
    for (const hashtag of hashtags) {
      try {
        const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
        const searchParams = {
          part: 'snippet',
          q: hashtag,
          type: 'video',
          eventType: 'live',
          order: 'date',
          maxResults: 50,
          key: apiKey
        };

        const searchResponse = await axios.get(searchUrl, { params: searchParams });
        
        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          // Get video IDs
          const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
          
          // Get detailed video information including live streaming details
          const videoDetailsUrl = 'https://www.googleapis.com/youtube/v3/videos';
          const videoDetailsParams = {
            part: 'snippet,liveStreamingDetails,statistics',
            id: videoIds,
            key: apiKey
          };

          const videoDetailsResponse = await axios.get(videoDetailsUrl, { params: videoDetailsParams });
          
          if (videoDetailsResponse.data.items) {
            for (const video of videoDetailsResponse.data.items) {
              // Only include if it's actually live and not already seen
              if (video.liveStreamingDetails && !seenVideoIds.has(video.id)) {
                seenVideoIds.add(video.id);
                allStreams.push(normalizeStreamData(video));
              }
            }
          }
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching streams for hashtag ${hashtag}:`, error.message);
        // Continue with next hashtag
      }
    }

    return allStreams;
  } catch (error) {
    console.error('Error in fetchLiveStreams:', error.message);
    throw error;
  }
}

/**
 * Normalizes YouTube API response to our standard format
 * @param {Object} video - Video object from YouTube API
 * @returns {Object} Normalized stream object
 */
function normalizeStreamData(video) {
  const liveDetails = video.liveStreamingDetails || {};
  const snippet = video.snippet || {};
  const stats = video.statistics || {};

  return {
    videoId: video.id,
    title: snippet.title || 'Untitled',
    channelName: snippet.channelTitle || 'Unknown Channel',
    channelId: snippet.channelId || '',
    thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
    viewerCount: parseInt(liveDetails.concurrentViewers || stats.viewCount || '0', 10),
    publishedAt: snippet.publishedAt || new Date().toISOString(),
    streamUrl: `https://www.youtube.com/watch?v=${video.id}`,
    tags: snippet.tags || [],
    description: snippet.description || ''
  };
}

/**
 * Handles YouTube API errors gracefully
 * @param {Error} error - Error object
 * @returns {Object} Error response object
 */
function handleApiError(error) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 403) {
      return {
        error: 'API quota exceeded or invalid API key',
        message: 'Please check your YouTube API key and quota limits',
        status: 403
      };
    } else if (status === 400) {
      return {
        error: 'Invalid request',
        message: data.error?.message || 'Bad request to YouTube API',
        status: 400
      };
    }
  }

  return {
    error: 'Unknown error',
    message: error.message || 'An unexpected error occurred',
    status: 500
  };
}

module.exports = {
  fetchLiveStreams,
  normalizeStreamData,
  handleApiError
};

