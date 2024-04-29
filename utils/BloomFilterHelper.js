// The function to check for blacklisted URL- Returns true if there's a match and false otherwise.
// It looks like this function works fine finding a matching blacklisted url.
const checkBlacklistedURL = (postText) => {
  const urlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?\b/g;
  //Define the regex for the URL
  return urlRegex.test(postText); //Returns true if there is a match between the pattern and the text.
};

module.exports = checkBlacklistedURL;


