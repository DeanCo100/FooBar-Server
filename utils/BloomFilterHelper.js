// The function to extract the urls from the postText and snd them to check in the bloomfilter.
// It looks like this function works fine finding a matching blacklisted url.
const checkBlacklistedURL = async (postText) => {
  try {
    // The Regex for URL
    const urlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?\b/g;
    const urls = postText.match(urlRegex) || []; // Extract all URLs from postText

    // Sends the URLs to checkInBloom function
    const isBlacklisted = await checkInBloom(urls);

    return isBlacklisted;
  } catch (error) {
    throw error;
  }
};

const checkInBloom = async (urls) => {
  try {
    // Connect to the TCP server
    const client = net.createConnection({ host: process.env.TCP_IP_ADDRESS, port: process.env.TCP_PORT });

    // Define a promise to handle TCP events
    const checkPromise = new Promise((resolve, reject) => {
      client.on('connect', () => {
        const results = [];

        // Send each URL to the TCP server for checking
        urls.forEach((url) => {
          client.write(`2 ${url}\n`); // Use "2" for checking in the Bloom filter
        });

        // Listen for data from the server
        client.on('data', (data) => {
          const response = data.toString().trim();
          results.push(response === 'true');
          if (results.some((result) => result === true)) {
            resolve(true); // At least one URL is blacklisted
          } else if (results.length === urls.length) {
            resolve(false); // None of the URLs are blacklisted
          }
        });

        // Handle errors
        client.on('error', (err) => {
          reject(err);
        });

        // Handle disconnection
        client.on('end', () => {
          console.log('Disconnected from server');
          client.destroy();
        });
      });
    });

    return checkPromise;
  } catch (error) {
    throw error;
  }
};



module.exports = {checkBlacklistedURL, checkInBloom};


