document.addEventListener("DOMContentLoaded", () => {
  const modelGrid = document.getElementById("modelGrid");
  const modelPopup = document.getElementById("modelPopup");
  const closeBtn = document.querySelector(".close-popup");

  const models = [
    { name: "Realistic Vision", thumbnail: "realistic.jpg", category: "sd15" },
    { name: "DreamShaper", thumbnail: "dreamshaper.jpg", category: "sd15" },
    { name: "MeinaMix", thumbnail: "meina.jpg", category: "sdxl" }
  ];

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modelGrid.innerHTML = "";
      const category = btn.dataset.category;
      models.filter(m => m.category === category).forEach(model => {
        const card = document.createElement("div");
        card.className = "model-card";
        card.innerHTML = `
          <img src="${model.thumbnail}" />
          <span>${model.name}</span>
        `;
        card.onclick = () => {
          localStorage.setItem("selectedModel", model.name);
          localStorage.setItem("selectedImage", model.thumbnail);
          document.getElementById("selectedModelThumb").src = model.thumbnail;
          document.getElementById("selectedModelName").textContent = model.name;
          modelPopup.classList.add("hidden");
        };
        modelGrid.appendChild(card);
      });
      modelPopup.classList.remove("hidden");
    });
  });

  closeBtn.onclick = () => modelPopup.classList.add("hidden");

  const savedModel = localStorage.getItem("selectedModel");
  const savedThumb = localStorage.getItem("selectedImage");
  if (savedModel && savedThumb) {
    document.getElementById("selectedModelThumb").src = savedThumb;
    document.getElementById("selectedModelName").textContent = savedModel;
  }
});