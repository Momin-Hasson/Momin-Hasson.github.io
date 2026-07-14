const formalEducation = [
  {
    title: "College of DuPage",
    time: "August 2017 - June 2019",
  },
  {
    title: "University of Illinois Chicago",
    subtitle: "Bachelor's in Computer Science",
    time: "August 2019 - May 2022",
  },
];

function renderTimeline() {
  const container = document.querySelector(".timeline");
  if (!container) return;
  container.innerHTML = `<div class="timeline__line"></div>` + formalEducation
    .map(
      ({ title, subtitle, time }) => `
      <div class="timeline__item" data-reveal>
        <span class="timeline__marker"></span>
        <h3 class="timeline__title">${title}</h3>
        ${subtitle ? `<p class="timeline__subtitle">${subtitle}</p>` : ""}
        <p class="timeline__meta">${time}</p>
      </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderTimeline);
