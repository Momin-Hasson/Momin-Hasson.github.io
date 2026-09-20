// Only projects with a real repo are listed. Notes come from the résumé.
const projects = [
  {
    title: "Biometric Panic Box",
    note: "Arduino and Raspberry Pi security device with biometric scanning and automated emergency alerts by email and Twitter. Python, C++.",
    cardImage: "assets/images/project-page/panic_box_image.PNG",
    Previewlink: "https://www.youtube.com/watch?v=XGO43ttiWr4&ab_channel=16Mega",
    Githublink: "https://github.com/Momin-Hasson/Biometrick-Panic-Box-Project",
  },
  {
    title: "Candy Crush",
    note: "",
    cardImage: "assets/images/project-page/CandyCrushLogo.png",
    Previewlink: "",
    Githublink: "https://github.com/Momin-Hasson/Candy-Crush-Game",
  },
  {
    title: "Chicago Tourism Website",
    note: "",
    cardImage: "assets/images/project-page/ChicagoLogo.jpg",
    Previewlink: "",
    Githublink: "https://github.com/Momin-Hasson/Chicago-Tourism-Website",
  },
];

function renderProjectGrid() {
  const container = document.querySelector(".project-grid");
  if (!container) return;
  container.innerHTML = projects
    .map(({ title, note, cardImage, Previewlink, Githublink }) => {
      const preview = Previewlink
        ? `<a class="btn btn--ghost" href="${Previewlink}" target="_blank" rel="noopener">Watch demo</a>`
        : "";
      const github = Githublink
        ? `<a class="btn btn--ghost" href="${Githublink}" target="_blank" rel="noopener">View code</a>`
        : "";
      return `
      <article class="project-card">
        <div class="project-card__frame"><img class="project-card__image" src="${cardImage}" alt="${title}" loading="lazy"></div>
        <div class="project-card__body">
          <h3 class="project-card__title">${title}</h3>
          ${note ? `<p class="project-card__note">${note}</p>` : ""}
          <div class="project-card__links">${preview}${github}</div>
        </div>
      </article>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", renderProjectGrid);
