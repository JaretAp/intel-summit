// Get all needed DOM elements

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendence
let count = 0;
const maxCount = 56;

// Handle form submission

form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  const name= nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  count++;
  console.log("Total check-ins: ", count);

  // Update Progress Bar
  const percentage = Math.round((count/ maxCount) * 100);
  console.log(`Progress: ${percentage}%`);

  // Update the progress bar element
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage + "%";;



  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Show welcome message
  const message = `🎉 Welcome, ${name} from ${teamName}`;
  console.log(message);

  // Update attendance on browser
  const attendCount = document.getElementById("attendeeCount");
  attendCount.textContent = count;

  form.reset();
});