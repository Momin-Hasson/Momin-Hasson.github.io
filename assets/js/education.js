const formalEducation = [
  {
    title: "M.S. in Computer Science",
    subtitle: "Georgia Institute of Technology, Atlanta, GA. In progress.",
    time: "Expected 2028",
    current: true,
  },
  {
    title: "B.S. in Computer Science",
    subtitle: "University of Illinois Chicago, Chicago, IL",
    time: "Aug 2019 to May 2022",
  },
  {
    title: "College of DuPage",
    subtitle: "Glen Ellyn, IL",
    time: "Aug 2017 to Jun 2019",
  },
];

function renderTimeline() {
  const container = document.querySelector(".timeline");
  if (!container) return;
  container.innerHTML = `<div class="timeline__line"></div>` + formalEducation
    .map(
      ({ title, subtitle, time, current }) => `
      <div class="timeline__item${current ? " timeline__item--now" : ""}">
        <span class="timeline__marker"></span>
        <p class="timeline__meta">${time}</p>
        <div>
          <h3 class="timeline__title">${title}</h3>
          <p class="timeline__subtitle">${subtitle}</p>
        </div>
      </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderTimeline);
