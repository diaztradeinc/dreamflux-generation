document.getElementById("startDrawing").addEventListener("click", async () => {
  const btn = document.getElementById("startDrawing");
  btn.disabled = true;
  btn.textContent = "Generating...";

  const body = {
    model: localStorage.getItem("selectedModel") || "Realistic Vision",
    prompt: document.getElementById("prompt").value,
    negative_prompt: document.getElementById("negative_prompt").value,
    steps: parseInt(document.getElementById("steps").value),
    cfg: parseFloat(document.getElementById("cfg").value),
    sampler: document.getElementById("sampler").value,
    seed: document.getElementById("seed").value || null,
    restore_faces: document.getElementById("restore_faces").checked,
    hires_fix: document.getElementById("hires_fix").checked
  };

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Response was not valid JSON:\n" + text);
    }

    if (data.image_url) {
      window.location.href = "/viewer.html?url=" + encodeURIComponent(data.image_url);
    } else {
      alert("Error: " + (data.error || "Unknown"));
      console.error("Details:", data.details || text);
    }
  } catch (err) {
    alert("Failed to generate image. Check console.");
    console.error("API error:", err);
  }

  btn.disabled = false;
  btn.textContent = "Start Drawing";
});