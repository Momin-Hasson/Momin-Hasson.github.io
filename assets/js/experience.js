const M = (t) => `<mark class="metric">${t}</mark>`;

const exp = [
  {
    title: "Software Engineer",
    org: "Ace Hardware Corporation, Oak Brook, IL",
    time: "Feb 2023 to present",
    current: true,
    bullets: [
      `Won ${M("first place")} in Ace Hardware's IT hackathon for an AI coaching assistant that gave HVAC service representatives in-call guidance and live translation, then analyzed recordings to surface upsell opportunities. Presented to the CEO and now an active company project.`,
      `Led the performance and caching architecture for Ace's franchise and corporate storefronts, implementing multi-instance Redis, Azure Blob image caching, and middleware optimization that cut page load times by ${M("98%")}.`,
      "Integrated ServiceTitan authentication and the Google Reviews API to deliver real-time service data to franchise storefronts nationwide under third-party auth and rate-limit constraints.",
      `Architected and delivered ${M("30+")} RESTful APIs for the Paint Redesign and Home Services platforms, defining service contracts and integration patterns now used across franchise and corporate systems.`,
      "Led security hardening across Ace online applications: migrated service account credentials to Azure Key Vault, modernized authentication to Entra ID managed identities, and set secret-handling standards adopted on every web property.",
      "Built a reusable React component library adopted across Ace web properties, eliminating duplicated front-end work and enforcing brand consistency.",
      "Containerized applications with Docker and built GitHub Actions CI/CD pipelines to standardize releases across environments. Configured Azure Monitor alerting to on-call mobile notifications and led Azure cost optimization.",
    ],
  },
  {
    title: "AI Solutions Engineer",
    org: "Momento Automation LLC, Remote",
    time: "Dec 2025 to present",
    current: true,
    bullets: [
      "Build custom AI agents and MCP server integrations that automate client intake, document handling, and notification workflows for paying small business clients.",
      "Gather requirements directly from business owners, scope the work, and deliver each build end to end through architecture, implementation, and rollout.",
      "Operate webhook-driven pipelines integrating Square, Supabase, and email notification, and own production infrastructure and incident response for live client systems including OAuth 2.0, hosted PostgreSQL, and DNS/SSL.",
    ],
  },
  {
    title: "Software Engineer (Contract)",
    org: "NetCashPro, Chicago, IL",
    time: "Jun 2022 to Jan 2023",
    bullets: [
      "Replaced a manual financial reporting process by scoping and delivering a CFO Analysis application (ASP.NET MVC, C#) that automated profit/loss, cash flow, and revenue calculations from Excel and ERP sources.",
      "Built the REST API layer and React reporting front end with real-time data visualizations used directly in client financial decisions.",
      "Owned AWS deployment with testing and code-review gates to ensure performance and reliability.",
    ],
  },
  {
    title: "Software Engineering Intern",
    org: "Orblogic (HRMatrix), Upper Saddle River, NJ",
    time: "May to Aug 2021",
    bullets: [
      `Delivered ${M("20+")} RESTful APIs serving ${M("50+")} client websites, improving performance and scalability.`,
      `Reduced API response times ${M("30%")} through endpoint and query optimization across major client projects.`,
      "Contributed to microservices architecture design in an agile Scrum team, working directly with clients to align technical decisions with business goals.",
    ],
  },
];

function renderTimeline() {
  const container = document.querySelector(".timeline");
  if (!container) return;
  container.innerHTML = `<div class="timeline__line"></div>` + exp
    .map(
      ({ title, org, time, bullets, current }) => `
      <div class="timeline__item${current ? " timeline__item--now" : ""}">
        <span class="timeline__marker"></span>
        <p class="timeline__meta">${time}</p>
        <div>
          <h3 class="timeline__title">${title}</h3>
          <p class="timeline__org">${org}</p>
          <ul class="timeline__desc">${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
        </div>
      </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderTimeline);
