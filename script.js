// Get all needed DOM elements

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendence
let count = 0;
const maxCount = 3;

// Message function
function showGreeting(message, isGoalReached = false) {
  const greeting = document.getElementById("greeting");
  greeting.textContent = message;
  greeting.style.display = "block";

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

  let teamWaterScore = parseInt(document.getElementById("waterCount").textContent); 
  let teamZeroScore = parseInt(document.getElementById("zeroCount").textContent);
  let teamPowerScore = parseInt(document.getElementById("powerCount").textContent);

  // Show welcome message
  let message = "";
 

  if (count === maxCount) {
    if (teamWaterScore >= teamZeroScore && teamWaterScore >= teamPowerScore) {
      greeting.style.whiteSpace = "pre-line";
      message = `🎉 Welcome, ${name} from ${teamName}\nCongratulations Team Water Wise!!\nYou have the most attendees with ${teamWaterScore} people.\n Great Work, Team Water Wise!!`;
      showGreeting(message, true);
    } else if (teamZeroScore >= teamWaterScore && teamZeroScore >= teamPowerScore) {
      greeting.style.whiteSpace = "pre-line";
      message = `🎉 Welcome, ${name} from ${teamName}\nCongratulations Team Net Zero!!\nYou have the most attendees with ${teamZeroScore} people.\n Great Work, Team Net Zero!!`;
      showGreeting(message, true);
    } else {
      greeting.style.whiteSpace = "pre-line";
      message = `🎉 Welcome, ${name} from ${teamName}\nCongratulations Team Renewables!!\nYou have the most attendees with ${teamPowerScore} people.\n Great Work, Team Renewables!!`;
      showGreeting(message, true);
    } 
  } else {
    message = `🎉 Welcome, ${name} from ${teamName}`;
    showGreeting(message);
  }
  

  
  // Update attendance on browser
  const attendCount = document.getElementById("attendeeCount");
  attendCount.textContent = count;

  form.reset();
});



