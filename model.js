document.addEventListener("DOMContentLoaded", () => {
  const models = [
    { name: "DreamShaper", thumbnail: "dreamshaper.jpg" },
    { name: "Deliberate", thumbnail: "deliberate.jpg" },
    { name: "Juggernaut", thumbnail: "juggernaut.jpg" },
    { name: "Realistic Vision", thumbnail: "realistic.jpg" },
    { name: "EpicRealism", thumbnail: "epicrealism.jpg" },
    { name: "Absolute Reality", thumbnail: "absolute.jpg" },
    { name: "CyberRealistic", thumbnail: "cyberrealistic.jpg" },
    { name: "A-Zovya Photoreal", thumbnail: "zovya.jpg" },
    { name: "majicMIX realistic", thumbnail: "majicmix.jpg" },
    { name: "Anything V3", thumbnail: "anythingv3.jpg" },
    { name: "Counterfeit", thumbnail: "counterfeit.jpg" },
    { name: "PastelMix", thumbnail: "pastelmix.jpg" },
    { name: "ReV Animated", thumbnail: "rev.jpg" },
    { name: "Analog Madness", thumbnail: "analog.jpg" },
    { name: "Protogen", thumbnail: "protogen.jpg" },
    { name: "MeinaMix", thumbnail: "meina.jpg" },
    { name: "ChilloutMix", thumbnail: "chilloutmix.jpg" },
    { name: "AbyssOrangeMix3 (AOM3)", thumbnail: "aom3.jpg" }
  ];

  const modelCards = document.getElementById("modelCards");
  const modal = document.getElementById("modelModal");
  const openBtn = document.getElementById("selectModelBtn");
  const closeBtn = document.getElementById("closeModelModal");

  function renderModels() {
    const selected = localStorage.getItem("selectedModel");
    const selectedImage = localStorage.getItem("selectedImage");
    modelCards.innerHTML = "";
    models.forEach(model => {
      const card = document.createElement("div");
      card.className = "model-card";
      if (model.name === selected) card.classList.add("selected");

      card.innerHTML = \`
        <img src="\${model.thumbnail}" />
        <div class="model-name">\${model.name}</div>
      \`;

      card.onclick = () => {
        localStorage.setItem("selectedModel", model.name);
        localStorage.setItem("selectedImage", model.thumbnail);
        document.getElementById("selectedModelThumb").src = model.thumbnail;
        document.getElementById("selectedModelName").textContent = model.name;
        renderModels();
        modal.classList.add("hidden");
      };

      modelCards.appendChild(card);
    });
  }

  openBtn.onclick = () => {
    renderModels();
    modal.classList.remove("hidden");
  };

  closeBtn.onclick = () => modal.classList.add("hidden");

  // Restore previous selection
  const saved = localStorage.getItem("selectedModel");
  const savedThumb = localStorage.getItem("selectedImage");
  if (saved && savedThumb) {
    document.getElementById("selectedModelThumb").src = savedThumb;
    document.getElementById("selectedModelName").textContent = saved;
  }
});