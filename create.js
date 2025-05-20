document.getElementById("startDrawing").addEventListener("click", async () => {
  const overlay = document.getElementById("loadingOverlay");
  overlay.classList.remove("hidden");

  const fileInput = document.getElementById("imageUpload");
  let imageBase64 = null;
  if (fileInput.files[0]) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    imageBase64 = await new Promise(resolve => {
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
  }

  const payload = {
    model: localStorage.getItem("selectedModel") || "Realistic Vision",
    prompt: document.getElementById("prompt").value,
    negative_prompt: document.getElementById("negative_prompt").value,
    steps: parseInt(document.getElementById("steps").value),
    cfg: parseFloat(document.getElementById("cfg").value),
    sampler: document.getElementById("sampler").value,
    seed: document.getElementById("seed").value || null,
    restore_faces: document.getElementById("restore_faces").checked,
    hires_fix: document.getElementById("hires_fix").checked,
    image: imageBase64
  };

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Bad JSON:\n" + text);
    }

    if (data.image_url) {
      window.location.href = "/viewer.html?url=" + encodeURIComponent(data.image_url);
    } else {
      alert("Error: " + (data.error || "Unknown"));
    }
  } catch (err) {
    console.error("API error:", err);
    alert("Failed to generate.");
  }

  overlay.classList.add("hidden");
});