const appName = "EventHorizon";

let events = [
  { title: "Buy groceries", location: "Supermarket", date: new Date("2023-10-15"), category: "home", completed: false, status: "pending" },
  { title: "Friend's birthday party", location: "Home", date: new Date("2026-10-20"), category: "social", completed: false, status: "pending" },
  { title: "Team meeting", location: "Office", date: new Date("2026-9-5"), category: "work", completed: true, status: "pending" }
];

let stats = calculateStats(events);
let currentFilter = "date-all";

const addEventBtn = document.querySelector(".add-event-btn");
const formSection = document.querySelector(".form-section");
const closeFormBtn = document.querySelector(".close-form-btn");
const submitEventBtn = document.querySelector("#eventForm button[type='submit']");

addEventBtn.addEventListener("click", function () {
  formSection.classList.remove("display-none");
});

closeFormBtn.addEventListener("click", function () {
  formSection.classList.add("display-none");
});

submitEventBtn.addEventListener("click", function (event) {
  event.preventDefault();

  const titleInput = document.getElementById("eventTitle");
  const locationInput = document.getElementById("eventLocation");
  const dateInput = document.getElementById("eventDate");
  const categoryInput = document.getElementById("eventCategory");

  const title = titleInput.value.trim();
  const location = locationInput.value.trim();
  const date = dateInput.value;
  const category = categoryInput.value;

  if (title === "" || location === "" || date === "") {
    alert("Please fill in all required fields.");
    return;
  }

  if (date < new Date().toISOString().split("T")[0]) {
    alert("Please select a valid date.");
    return;
  }

  events.push({ title, location, date, category, completed: false });
  titleInput.value = "";
  locationInput.value = "";
  dateInput.value = "";
  categoryInput.value = "Other";

  formSection.classList.add("display-none");
  refreshApp();
});

function getDateClass(eventDate) {
  const selectedDate = new Date(eventDate);
  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate.getTime() === today.getTime()) {
    return "date-today";
  } else if (selectedDate < today) {
    return "date-past";
  } else {
    return "date-upcoming";
  }
}

function renderEvents(eventsToRender = events) {
  const eventListContainer = document.querySelector("#eventList");
  eventListContainer.innerHTML = "";

  if (eventsToRender.length === 0) {
    eventListContainer.innerHTML = "<p class='empty-state'>No events found.</p>";
    return;
  }

  eventsToRender.forEach((event) => {
    const index = events.indexOf(event);
    const eventCard = document.createElement("div");

    const dateClass = getDateClass(event.date);

    eventCard.className = `event-card ${dateClass}`;
    eventCard.innerHTML = `
      <h3>${event.title}</h3>
      <p>Location: ${event.location}</p>
      <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
      <p>Category: ${event.category}</p>
      <p class="event-status">Status: ${event.status || "Pending"}</p>
      <div class="event-actions">
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;

    eventListContainer.appendChild(eventCard);

    if (dateClass === "date-past") {
      eventCard.querySelector(".event-actions").insertAdjacentHTML("afterbegin", `
        <button class="attended-btn" data-index="${index}">Attended</button>
        <button class="cancelled-btn" data-index="${index}">Cancelled</button>
      `);
    }
  });

  updateStatsDisplay(stats);

  attachEventButtonListeners();
}

function attachEventButtonListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const attendedButtons = document.querySelectorAll(".attended-btn");
  const cancelledButtons = document.querySelectorAll(".cancelled-btn");

  deleteButtons.forEach(button => {
    button.addEventListener("click", handleDelete);
  });

  attendedButtons.forEach(button => {
    button.addEventListener("click", handleAttended);
  });

  cancelledButtons.forEach(button => {
    button.addEventListener("click", handleCancelled);
  });
}

function handleDelete(event) {
  const index = Number(event.target.getAttribute("data-index"));
  events.splice(index, 1);
  refreshApp();
}

function handleAttended(event) {
  const index = Number(event.target.getAttribute("data-index"));
  events[index].completed = true;
  events[index].status = "attended";
  refreshApp();
}

function handleCancelled(event) {
  const index = Number(event.target.getAttribute("data-index"));
  events[index].completed = false;
  events[index].status = "cancelled";
  refreshApp();
}

function calculateStats(events) {
  let total = events.length;
  let attended = 0;
  let cancelled = 0;
  
  for (let event of events) {
    if (event.status === "attended") {
      attended = attended + 1;
    } else if (event.status === "cancelled") {
      cancelled = cancelled + 1;
    }
  }
  let pending = total - attended - cancelled;
  
  return {
    total: total,
    attended: attended,
    cancelled: cancelled,
    pending: pending
  };
}

function updateStatsDisplay(stats) {
  document.getElementById("totalTasks").textContent = stats.total;
  document.getElementById("attendedEvents").textContent = stats.attended;
  document.getElementById("cancelledEvents").textContent = stats.cancelled;
  document.getElementById("pendingEvents").textContent = stats.pending;
}

function refreshApp() {
  stats = calculateStats(events);
  updateStatsDisplay(stats);
  renderEvents(getFilteredEvents(currentFilter));
}

function getFilteredEvents(filterType) {
  let filteredEvents;

  if (filterType === "date-all") {
    filteredEvents = events;
  }
  else{
    filteredEvents = events.filter(function (event) {
      return getDateClass(event.date) === filterType;
    });
  }

  return sortEventsByDate(filteredEvents);
  console.log(`Filtered events for ${filterType}:`, filteredEvents);
}

function updateFilterButtons(activeFilter) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(button => {
    if (button.getAttribute("data-filter") === activeFilter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach(button => {
  button.addEventListener("click", function () {
    currentFilter = button.getAttribute("data-filter");
    const filteredEvents = getFilteredEvents(currentFilter);
    renderEvents(filteredEvents);
    updateFilterButtons(currentFilter);
  });
});

function sortEventsByDate(eventsList) {
  return [...eventsList].sort((a, b) => new Date(a.date) - new Date(b.date));
}

renderEvents(getFilteredEvents(currentFilter));

console.log(`${appName} loaded with ${events.length} events.`);