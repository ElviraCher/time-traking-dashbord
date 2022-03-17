import "./style.scss";
import photo from "./images/image-jeremy.png";
import ellipsis from "./images/icon-ellipsis.svg";

async function getDashboardData(url = "../data.json") {
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

function drawPersonCard() {
  const person = document.querySelector(".dashboard__content");
  person.insertAdjacentHTML(
    "beforeend",
    `<div class = "dashboard__person">
          <div class = "info-card">
            <img src=${photo} class = info-card__photo>
            <div class="info-card__text">
              <p class="info-card__subtitle">Report for</p>
              <h1 class="info-card__title">Jeremy Robson</h1>
            </div>
          </div>
          <div class  = "view__selector">
            <div class = "view-selector__item ">Daily</div>
            <div class = "view-selector__item  view-selector__item--active">Weekly</div>
            <div class = "view-selector__item ">Monthly</div>
          </div>
        </div>`
  );
}

class DashboardItem {
  static periods = {
    daily: "day",
    weekly: "week",
    monthly: "month",
  };

  constructor(data, container = ".dashboard__content", view = "weekly") {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;
    this.createMarkup();
  }

  createMarkup() {
    const { title, timeframes } = this.data;
    const id = title.toLowerCase().replace(/ /g, "-");
    const { current, previous } = timeframes[this.view];

    this.container.insertAdjacentHTML(
      "beforeend",
      `
        <div class = "dashboard__item dashboard__item--${id}">
          <article class="tracking-card">
            <header class="tracking-card__header">
              <h4 class="tracking-card__title">${title}</h4>
              <img class="tracking-card__menu" src=${ellipsis} alt="menu"/>
            </header>
            <div class="tracking-card__body">
              <div class="tracking-card__time">${current}hrs</div>
              <div class="tracking-card__prev-period">Last ${
                DashboardItem.periods[this.view]
              } - ${previous}hrs</div>

            </div>
       `
    );

    this.time = this.container.querySelector(
      `.dashboard__item--${id} .tracking-card__time`
    );
    this.prev = this.container.querySelector(
      `.dashboard__item--${id} .tracking-card__prev-period`
    );
  }

  changeView(view) {
    this.view = view.toLowerCase();
    const { timeframes } = this.data;
    const { current, previous } = timeframes[this.view];

    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${
      DashboardItem.periods[this.view]
    } - ${previous}hrs`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getDashboardData().then((data) => {
    drawPersonCard();
    const activities = data.map((activity) => new DashboardItem(activity));
    const selectors = document.querySelectorAll(".view-selector__item");
    selectors.forEach((selector) =>
      selector.addEventListener("click", () => {
        selectors.forEach((sel) =>
          sel.classList.remove("view-selector__item--active")
        );
        selector.classList.add("view-selector__item--active");

        const currentView = selector.innerText.trim();
        activities.forEach((activity) => activity.changeView(currentView));
      })
    );
  });
});
