console.log("uploadImageToCloudinary.js ran successfully!");
const fetch = require('node-fetch');
console.log(`fetch:${fetch}`);

const FormData = require('form-data');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" })
      };
    }

    const { fileBase64, fileName, uniqueID } = JSON.parse(event.body);

    if (!fileBase64 || !fileName || !uniqueID) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" })
      };
    }

    console.log("Uploading to Cloudinary:", uniqueID);

    const form = new FormData();
    form.append("file", `data:image/jpeg;base64,${fileBase64}`);
    form.append("upload_preset", "job_images");

    // Set the full public_id with folder
    form.append("uniqueID", `jobs/${uniqueID}`);

    const response = await fetch("https://api.cloudinary.com/v1_1/dsubuknl7/image/upload", {
      method: "POST",
      body: form
    });

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error(data.error?.message || "Upload failed");
    }

    console.log("✅ Cloudinary upload success:", data.secure_url);

    return {
      statusCode: 200,
      body: JSON.stringify({
        imageUrl: data.secure_url,
        public_id: data.public_id
      })
    };
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Upload failed", error: err.message })
    };
  }
};
