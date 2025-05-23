
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DreamFlux Create</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { background: #000; color: #fff; font-family: sans-serif; padding: 2rem; }
    label { display: block; margin: 1rem 0 0.2rem; color: #0ff; }
    input, textarea, select {
      width: 100%; padding: 8px; border-radius: 8px;
      background: #111; color: #fff; border: 1px solid #333;
    }
    .pill-button {
      margin-top: 1.5rem;
      padding: 12px 20px;
      background: #0ff; color: #000; font-weight: bold;
      border: none; border-radius: 10px; cursor: pointer;
    }
    .pill-button:hover { background: #0cc; }

    .tabs { display: flex; gap: 10px; margin-bottom: 1rem; }
    .tabs button {
      background: #111; color: #0ff; border: 1px solid #0ff;
      padding: 8px 12px; border-radius: 10px; cursor: pointer;
    }
    .tabs button.active { background: #0ff; color: #000; }

    .advanced { margin-top: 2rem; }
    details summary { cursor: pointer; font-weight: bold; color: #0ff; }
  </style>
</head>
<body>

<h2>Generate Your Dream Image</h2>

<div class="tabs">
  <button class="tab active" data-cat="sd15">SD 1.5</button>
  <button class="tab" data-cat="sdxl">SDXL</button>
  <button class="tab" data-cat="flux">Flux</button>
  <button class="tab" data-cat="sd3">SD 3.5</button>
</div>

<label>Prompt</label>
<textarea id="prompt" placeholder="What do you dream of?" rows="2"></textarea>

<label>Negative Prompt</label>
<textarea id="negative_prompt" placeholder="What do you want to exclude?" rows="2"></textarea>

<label>Upload Image (optional)</label>
<input type="file" id="imageUpload" accept="image/*" />

<label>Model</label>
<a href="models.html" style="display:flex; align-items:center; background:#111; border:1px solid #444; padding:10px 14px; border-radius:12px; gap:10px;">
  <img id="modelThumb" src="https://modelfiles.ai-models.org/realistic/realistic-vision-v51-thumb.jpg" style="width:48px; height:48px; border-radius:8px;" />
  <span id="modelName">Realistic Vision</span>
</a>

<details class="advanced" open>
  <summary>Advanced Options</summary>

  <label>Steps</label>
  <input type="number" id="steps" value="40" min="1" max="100" />

  <label>Sampler</label>
  <select id="sampler">
    <option>Euler A</option>
    <option>DDIM</option>
    <option>Heun</option>
    <option>DPM++ 2M</option>
  </select>

  <label>CFG Scale</label>
  <input type="number" id="cfg" step="0.5" min="1" max="20" value="5.0" />

  <label>Seed (optional)</label>
  <input id="seed" placeholder="Random" />

  <label><input type="checkbox" id="restore_faces" /> Restore Faces</label>
  <label><input type="checkbox" id="hires_fix" /> High-Res Fix</label>
</details>

<button id="startDrawing" class="pill-button">Start Drawing</button>

<script>
  async function startDrawing() {
    const model = localStorage.getItem("selectedModel") || "Realistic Vision";
    const prompt = document.getElementById("prompt").value;
    const negative_prompt = document.getElementById("negative_prompt").value;
    const steps = parseInt(document.getElementById("steps").value);
    const sampler = document.getElementById("sampler").value;
    const cfg = parseFloat(document.getElementById("cfg").value);
    const seed = document.getElementById("seed").value || null;
    const restore_faces = document.getElementById("restore_faces").checked;
    const hires_fix = document.getElementById("hires_fix").checked;

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

    const body = {
      model,
      prompt,
      negative_prompt,
      steps,
      sampler,
      cfg,
      seed,
      restore_faces,
      hires_fix,
      image: imageBase64
    };

    const btn = document.getElementById("startDrawing");
    btn.disabled = true;
    btn.innerText = "Generating...";

    try {
  const res = await fetch("https://9b2a93e6-da3f-42b5-9053-f9864940ba91-00-37msjjz3jpvpc.kirk.replit.dev/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

      const data = await res.json();
      if (data.image_url) {
        window.location.href = "/viewer.html?url=" + encodeURIComponent(data.image_url);
      } else {
        alert("No image returned.");
      }
    } catch (err) {
      console.error("API error:", err);
      alert("Failed to generate image.");
    }

    btn.disabled = false;
    btn.innerText = "Start Drawing";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const model = localStorage.getItem("selectedModel");
    const thumb = localStorage.getItem("selectedImage");
    if (model) document.getElementById("modelName").innerText = model;
    if (thumb) document.getElementById("modelThumb").src = thumb;

    document.getElementById("startDrawing").addEventListener("click", startDrawing);
  });
</script>

</body>
</html>
});