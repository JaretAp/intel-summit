// Get all needed DOM elements

const attendeeCountEl = document.getElementById("attendeeCount");

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// team colors
const teamColors = {
  water: "#e8f7fc",
  zero: "#ecfdf3",
  power: "#fff7ed"
};

const teamIcons = {
  water: '🌊',
  zero: '🌿',
  power: '⚡'
};

// Track attendence
const maxCount = 50;
let count = parseInt(localStorage.getItem("count") || "0", 10);


// Message function
function showGreeting(message, isGoalReached = false, team = null) {
  const greeting = document.getElementById("greeting");
  greeting.textContent = message;
  greeting.style.whiteSpace = "pre-line";
  greeting.style.display = "block";

  // If a team was passed, apply the background color
  if (team && teamColors[team]) {
    greeting.style.backgroundColor = teamColors[team];
  }

  // Allow browser to register "display:block: before changing opacity
  setTimeout(() => {
    greeting.style.opacity = 1;
  }, 10);

  if (isGoalReached) {

    setTimeout(() => {
      greeting.style.opacity = 0;

      setTimeout(() => {
        greeting.style.display = 'none';
      }, 8000);
    }, 12000);
  } else {
    setTimeout(() => {
      greeting.style.opacity = 0;

      setTimeout(() => {
        greeting.style.display = 'none';
      }, 800);
    }, 3000);
  }
}

function renderAttendees() {
  const attendeeItems = document.getElementById("attendeeItems");
  attendeeItems.innerHTML = ""; // clear old list

  let attendees = JSON.parse(localStorage.getItem("attendees") || "[]");

  attendees.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.name}  —  ${a.teamIcon} ${a.teamName} ${a.teamIcon}`;
    li.style.backgroundColor = a.teamBackground;
    attendeeItems.appendChild(li);
  });
}


// increment teams persistently
function incrementTeam(team) {
  const teamCounter = document.getElementById(team + "Count");

  //load team count from storage (fall back to DOM if missing)
  let teamCount = parseInt(localStorage.getItem(team) || teamCounter.textContent, 10);

  // increment
  teamCount++;

  // Save back to DOM and localStorage
  teamCounter.textContent = teamCount;
  localStorage.setItem(team, teamCount);

  // Handle the global attendee count
  count = parseInt(localStorage.getItem("count") || "0", 10);
  count++;
  attendeeCountEl.textContent = count;
  localStorage.setItem("count", count);
}

// page loads
window.addEventListener("load", () => {
  ["water", "power", "zero"].forEach(team => {
    const saved = localStorage.getItem(team);
    if (saved !== null) {
      document.getElementById(team + "Count").textContent = saved;
    }
  });

  renderAttendees();


  const savedTotal = localStorage.getItem("count");
  if (savedTotal !== null) {
    attendeeCountEl.textContent = savedTotal;
    count = parseInt(savedTotal, 10);
  } else {
    count = 0;
  }
});



// Handle form submission

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  incrementTeam(team);
  count = parseInt(localStorage.getItem("count"), 10);




  console.log(name, teamName);

  console.log("Total check-ins: ", count);

  // Update Progress Bar
  const percentage = Math.round((count / maxCount) * 100);
  console.log(`Progress: ${percentage}%`);

  // Update the progress bar element
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage + "%";;

  // Update team counter
  let teamWaterScore = parseInt(document.getElementById("waterCount").textContent);
  let teamZeroScore = parseInt(document.getElementById("zeroCount").textContent);
  let teamPowerScore = parseInt(document.getElementById("powerCount").textContent);


  // Show welcome message
  let message = "";


  if (count === maxCount) {
    if (teamWaterScore >= teamZeroScore && teamWaterScore >= teamPowerScore) {
      message = `🎉 Welcome 🎉, ${name} from ${teamIcons[team]} ${teamName} ${teamIcons[team]}\n🎉 Congratulations 🎉  ${teamIcons[team]} Team Water Wise!! ${teamIcons[team]}\nYou have the most attendees with ${teamWaterScore} people.`;
      showGreeting(message, true, team);
    } else if (teamZeroScore >= teamWaterScore && teamZeroScore >= teamPowerScore) {
      message = `🎉 Welcome 🎉 ${name} from ${teamName}\n🎉 Congratulations 🎉  ${teamIcons[team]} Team Net Zero!! ${teamIcons[team]} \nYou have the most attendees with ${teamZeroScore} people.`;
      showGreeting(message, true, team);
    } else {
      message = `🎉 Welcome 🎉 ${name} from ${teamName}\n🎉 Congratulations 🎉  ${teamIcons[team]} Team Renewables!! ${teamIcons[team]}\nYou have the most attendees with ${teamPowerScore} people.`;
      CK
      showGreeting(message, true, team);
    }
  } else {
    message = `🎉 Welcome 🎉 ${name} from ${teamIcons[team]} ${teamName} ${teamIcons[team]}`;
    showGreeting(message, false, team);
  }

  // Save attendee in localStorage
  let attendees = JSON.parse(localStorage.getItem("attendees") || "[]");
  attendees.push({ name, teamKey: team, teamName: teamName, teamIcon: teamIcons[team], teamBackground: teamColors[team] });
  localStorage.setItem("attendees", JSON.stringify(attendees));

  // Re-render list from storage
  renderAttendees();


  // Update attendance on browser
  attendeeCountEl.textContent = count;
  form.reset();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  // Clear everything in localStorage
  localStorage.removeItem("attendees");
  renderAttendees(); // refresh empty list

  localStorage.clear();

  // Reset team counts in DOM
  ["water", "zero", "power"].forEach(team => {
    document.getElementById(team + "Count").textContent = "0";
  });

  // Reset global attendee count
  count = 0;
  document.getElementById("attendeeCount").textContent = "0";

  // Reset progress bar
  document.getElementById("progressBar").style.width = "0%";

  alert("All counters have been reset!");
});



