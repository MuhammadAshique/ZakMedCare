const fileInput = document.querySelector("#upload");
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("file", file);

  // 🔁 Replace with your actual upload_preset name
  formData.append("upload_preset", "job_images"); 
  // Optional: upload into folder
  // formData.append("public_id", "jobs/" + file.name);

  const response = await fetch("https://api.cloudinary.com/v1_1/dsubuknl7/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("Image uploaded:", data.secure_url);
});
