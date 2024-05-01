const net = require('net');
const { search } = require('../routes/user');


const serverAddress = process.env.TCP_IP_ADDRESS;
const serverPort = process.env.TCP_PORT;
// The function to extract the urls from the postText and send them to check in the bloomfilter.
const checkBlacklistedURL = async (postText) => {
  try {
    // The Regex for URL
    const urlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?\b/g;
    const urls = postText.match(urlRegex) || []; // Extract all URLs from postText

    // Return false immediately when the urls list is empty
    if (urls.length === 0) {
      return false;
    }

    else if (urls && urls.length > 0) {

       // Iterate over each URL and check if it's blacklisted
      const responses = await Promise.all(urls.map(url => callSearch(url)));

      return responses.some(response => response === true);

    // // Iterate over each URL and check if it's blacklisted
    // for (const url of urls) {
    //   const isBlacklisted = await checkInBloom(url);
    //   console.log(isBlacklisted);
    //   if (isBlacklisted) {
    //     return true; // Return true if any URL is blacklisted
    //   }
    // }
    }
  } catch (error) {
    throw error;
  }
};

const callSearch = async (urlToCheck) => {
  return await checkInBloom(urlToCheck);
}

const checkInBloom = async (url) => {
  try {
    return new Promise((resolve, reject) => {
      // Create a new TCP client connection
      const client = net.createConnection({ host: serverAddress, port: serverPort }, () => {
        console.log('Connected successfully to the TCP server');
        client.write(`2 ${url.trim()}`); 
      });

      client.on('data', (data) => {
        const dataResponse = data.toString().trim();
        console.log('received data from TCP: ', dataResponse);
        client.destroy();
        resolve(dataResponse === "true");

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

  } catch (error) {
    throw error;
    }
};



    // // Create a new TCP client connection
    // const client = net.createConnection({ host: process.env.TCP_IP_ADDRESS, port: process.env.TCP_PORT });

    // // Define a promise to handle TCP events
    // const checkPromise = new Promise((resolve, reject) => {
    //   let responseData = ''; // Accumulate response data from the server

    //   client.on('connect', () => {
    //     // Send the URL to the TCP server for checking
    //     client.write(`2 ${url}\n`); // Use "2" for checking in the Bloom filter
    //   });

    //   // Listen for data from the server
    //   client.on('data', (data) => {
    //     responseData += data.toString(); // Accumulate response data
    //     console.log(responseData);

    //   });

    //     // Process the received data and resolve the promise
    //     const isBlacklisted = responseData.trim() === 'true';
    //     resolve(isBlacklisted);

      // // Handle errors
      // client.on('error', (err) => {
      //   reject(err);
      // });

      // // Handle disconnection
      // client.on('end', () => {
      //   console.log('Disconnected from server');
      //   client.destroy();
      //   // // Process the received data and resolve the promise
      //   // const isBlacklisted = responseData.trim() === 'true';
      //   // resolve(isBlacklisted);
      // });
    // });
    // // Resolve the promise after receiving all data and processing it
    // // checkPromise.then(() => {
    // //   // Process the received data and resolve the promise
    // //   const isBlacklisted = responseData.trim() === 'true';
    // //   resolve(isBlacklisted);
    // // });

    // return checkPromise;
//     } catch (error) {
//     throw error;
//     }
// };


// const checkInBloom = async (url) => {
//   try {
//     // Create a new TCP client connection
//     const client = net.createConnection({ host: process.env.TCP_IP_ADDRESS, port: process.env.TCP_PORT });

//     // Define a promise to handle TCP events
//     const checkPromise = new Promise((resolve, reject) => {
//       client.on('connect', () => {
//         // Send the URL to the TCP server for checking
//         client.write(`2 ${url}\n`); // Use "2" for checking in the Bloom filter

//         // Listen for data from the server
//         client.once('data', (data) => {
//           const response = data.toString().trim();
//           const isBlacklisted = response === 'true';
//           resolve(isBlacklisted);
//         });

//         // Handle errors
//         client.on('error', (err) => {
//           reject(err);
//         });

//         // Handle disconnection
//         client.on('end', () => {
//           console.log('Disconnected from server');
//           client.destroy();
//         });
//       });
//     });

//     return checkPromise;
//   } catch (error) {
//     throw error;
//   }
// };


module.exports = {checkBlacklistedURL, checkInBloom};


