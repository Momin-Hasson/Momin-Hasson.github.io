const exp = [
  {
    title: "Software Developer Intern",
    cardImage: "assets/images/experience-page/orblogic_logo.jpg",
    place: "Upper Saddle River, NJ",
    time: "(May, 2021 to August, 2021)",
    desp: "<li>Revamped one of the company’s major projects by deploying responsive APIs & facilitated an increase in faster response by 30%.</li> <li>Exposed to the Microservices architecture, Scrum, SDLC, and participated in a case study with across-functional team and presented workable solutions in promoting the company’s advertisements.</li> <li>Rendered assistance in designing 20+ APIs covering more than 100 websites for the company’s major clients to ensure the best possible fastest processing of data.</li> <li> Interacted with the clients & understood their needs to finalize the code as per their requirements</li>",
  },
  {
    title: "Tax Associate",
    cardImage: "assets/images/experience-page/Zahoor_logo.png",
    place: "Carol Stream, IL",
    time: "(January, 2017 to December, 2021)",
    desp: "<li>Performed various clerical duties with respect to the preparation of letters and other documents.</li> <li>Provided excellent customer service with a positive and professional attitude.</li> <li>Responsible for general hardware and software-related issues.</li>",
  },
  {
    title: "Associate Software Engineer",
    cardImage: "assets/images/experience-page/Ace_Hardware_Logo.jpg",
    place: "Oak Brook, IL",
    time: "(February, 2023 to Present)",
    desp: "<li>.</li>",
  },
];

function renderTimeline() {
  const container = document.querySelector(".timeline");
  if (!container) return;
  container.innerHTML = `<div class="timeline__line"></div>` + exp
    .map(
      ({ title, place, time, desp }) => `
      <div class="timeline__item" data-reveal>
        <span class="timeline__marker"></span>
        <h3 class="timeline__title">${title}</h3>
        <p class="timeline__meta">${place} &middot; ${time}</p>
        <ol class="timeline__desc">${desp}</ol>
      </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderTimeline);
