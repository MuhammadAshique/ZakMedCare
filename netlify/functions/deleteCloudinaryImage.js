const fetch = require('node-fetch');
const crypto = require('crypto');
const qs = require('querystring');

exports.handler = async (event) => {
  const { publicId } = JSON.parse(event.body);

  if (!publicId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing public_id' }),
    };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  const formData = qs.stringify({
    public_id: publicId,
    api_key: apiKey,
    timestamp,
    signature,
  });

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const result = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete image', error }),
    };
  }
};
