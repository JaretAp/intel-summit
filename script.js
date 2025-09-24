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

// Team icons
const teamIcons = {
  water: '🌊',
  zero: '🌿',
  power: '⚡'
};

// Track attendence
const maxCount = 5;
let count = parseInt(localStorage.getItem("count") || "0", 10);


// greeting function
function showGreeting(message, team = null) {
  const greeting = document.getElementById("greeting");
  greeting.innerHTML = message;
  greeting.style.display = "block";

  // If a team was passed, apply the background color
  if (team && teamColors[team]) {
    greeting.style.backgroundColor = teamColors[team];
  }

  // Allow browser to register "display:block: before changing opacity
  setTimeout(() => {
    greeting.style.opacity = 1;
  }, 10);



  setTimeout(() => {
    greeting.style.opacity = 0;

    setTimeout(() => {
      greeting.style.display = 'none';
    }, 2000);
  }, 4000);
}

function showWinningMessage(teamKey, teamName, score) {
  const winningMessage = document.getElementById("winningMessage");
  const isMobile = window.innerWidth < 600;

  if(window.innerWidth < 400) {
    winningMessage.innerHTML = `🎉 Congratulations 🎉<br>${teamIcons[teamKey]} ${teamName} ${teamIcons[teamKey]}<br>${teamName} wins summit<br>with ${score} attendees!`;
  } else if (isMobile) {
    winningMessage.innerHTML = `🎉 Congratulations 🎉<br>${teamIcons[teamKey]} ${teamName} ${teamIcons[teamKey]}<br>${teamName} won the summit with ${score} attendees!`;
  } else {
    winningMessage.innerHTML = `🎉 Congratulations 🎉 ${teamIcons[teamKey]} ${teamName} ${teamIcons[teamKey]}<br>${teamName} won the summit with ${score} attendees!`;
  }

  winningMessage.style.backgroundColor = teamColors[teamKey];
  winningMessage.style.display = "block";
  setTimeout(() => {
    winningMessage.style.opacity = 1;
  }, 10);

  localStorage.setItem("winningMessage", winningMessage.innerHTML);
  localStorage.setItem("winningTeam", teamKey); // optional if you want to restyle on reload

}

function renderAttendees() {
  const attendeeItems = document.getElementById("attendeeItems");
  attendeeItems.innerHTML = ""; // clear old list

  let attendees = JSON.parse(localStorage.getItem("attendees") || "[]");

  attendees.forEach(a => {
    const li = document.createElement("li");
    if (window.innerWidth >599.8) {
       li.innerHTML = `<span class="liName">${a.name}</span><span class="teamIcons">${a.teamIcon}</span><span class="liTeam">${a.teamName}</span><span class="teamIcons">${a.teamIcon}</span>`;
    } else {
       li.innerHTML = `<span class="liName">${a.name}</span><br><span class="teamIcons">${a.teamIcon}</span><span class="liTeam">${a.teamName}</span><span class="teamIcons">${a.teamIcon}</span>`;
    }
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
  const savedMessage = localStorage.getItem("winningMessage");
  const savedTeam = localStorage.getItem("winningTeam");

  if (savedMessage) {
    const winningMessage = document.getElementById("winningMessage");
    winningMessage.innerHTML = savedMessage;
    if (savedTeam) {
      winningMessage.style.backgroundColor = teamColors[savedTeam];
    }
    winningMessage.style.display = "block";
    winningMessage.style.opacity = 1;
  }

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
  showGreeting(`🎉Welcome ${name}🎉<br> ${teamIcons[team]}${teamName}${teamIcons[team]}`, team);

 

  // Show winning message
  if (count === maxCount) {
    if (teamWaterScore >= teamZeroScore && teamWaterScore >= teamPowerScore) {
      showWinningMessage("water", "Team Water Wise", teamWaterScore);
    } else if (teamZeroScore >= teamWaterScore && teamZeroScore >= teamPowerScore) {
      showWinningMessage("zero", "Team Net Zero", teamZeroScore);
    } else {
      showWinningMessage("power", "Team Renewables", teamPowerScore);
    }
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

// Reset localStorage and cache for new competition  
document.getElementById("resetBtn").addEventListener("click", () => {
  // Clear everything in localStorage
  localStorage.removeItem("attendees");
  localStorage.removeItem('winningMessage');
  localStorage.removeItem('winningTeam');
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

  // Reset winning message
  const winningMessage = document.getElementById('winningMessage');
  winningMessage.textContent = "";
  winningMessage.style.display = "none";
  winningMessage.style.opacity = 0;

  alert("All counters have been reset!");
});



