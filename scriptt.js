let currentPersona = getCookie('chosenPersona') || ''; // Initialize from cookie
let stateHistory = []; // Array to track navigation history
let progress = 0; // Progress counter (capped at 100)

class Character {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    greet() {
        return `Hello ${this.name}. ${this.description}`;
    }
}

const maria = new Character("Maria", "A motivated individual eager to explore new career paths.");
const john = new Character("John", "An ambitious person looking to enhance his skills for a better future.");

// Cookie functions with URI encoding
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.substring(cookieName.length);
        }
    }
    return "";
}

// Safe HTML generation
function createElement(tag, content, attributes = {}) {
    const element = document.createElement(tag);
    element.textContent = content;
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    return element;
}

function generateGreeting(name) {
    return `Welcome, ${name}!`;
}

function displayPersonaInfo() {
    const firstName = currentPersona.split(' ')[0];
    alert(`Your chosen persona's first name is: ${firstName}`);
}

function updateProgress() {
    progress = Math.min(progress + Math.round(Math.random() * 10), 100);
    alert(`Your progress is now ${progress}%`);
}

// Persona selection
function selectPersona(personaName) {
    const persona = personaName === 'maria' ? maria : john;
    currentPersona = persona.name;
    alert(persona.greet());
    setCookie('chosenPersona', currentPersona, 7);
    
    document.getElementById("persona-selection").style.display = "none";
    document.getElementById("intro").style.display = "block";
    startStory();
}

// Navigation functions
function pushState(content) {
    stateHistory.push(content);
}

function goBack() {
    if (stateHistory.length > 1) {
        stateHistory.pop(); 
        document.getElementById("intro").innerHTML = stateHistory[stateHistory.length - 1];
    }
}

function goToHomePage() {
    if (confirm("Are you sure you want to go back? Your progress will be saved.")) {
        document.getElementById("intro").style.display = "none";
        document.getElementById("persona-selection").style.display = "block";
    }
}

// Story flow functions
function startStory() {
    const currentDate = new Date().toLocaleDateString();
    const skills = ["Tech", "Further Studies", "Retail & Hospitality"];
    
    const container = document.getElementById("intro");
    container.innerHTML = '';
    
    container.appendChild(createElement('h2', generateGreeting(currentPersona)));
    
    const skillsText = createElement('p', `Today is ${currentDate}. Your first decision: Which skill would you like to learn?`);
    container.appendChild(skillsText);
    
    skills.forEach(skill => {
        const button = createElement('button', skill, {
            onclick: `chooseSkill('${skill.toLowerCase()}')`
        });
        container.appendChild(button);
    });
    
    container.appendChild(createElement('button', 'Back', { onclick: 'goToHomePage()' }));
    container.appendChild(createElement('button', 'Home', { onclick: 'goToHomePage()' }));
    
    displayPersonaInfo();
    pushState(container.innerHTML);
}

// Rest of the story path functions (chooseSkill, choosePath, learnMore) would follow
// the same pattern of using createElement and pushState

// Initialize the app
if (currentPersona) {
    document.getElementById("persona-selection").style.display = "none";
    document.getElementById("intro").style.display = "block";
    startStory();
}

function chooseSkill(skill) {
  const container = document.getElementById("intro");
  container.innerHTML = '';
  
  let outcome = '';
  let options = [];
  updateProgress();

  switch (skill) {
      case 'tech':
          outcome = `${currentPersona} has chosen tech! Technology offers vast opportunities.`;
          options = [
              { text: 'Learn Coding', path: 'coding' },
              { text: 'Learn AI', path: 'AI' },
              { text: 'Learn Design', path: 'design' }
          ];
          break;
      case 'further studies':
          outcome = `Furthering your studies is a good place to start, ${currentPersona}.`;
          options = [
              { text: 'Cerifications', path: 'certifications' },
              { text: 'University', path: 'university' },
              { text: 'Higher Education', path: 'higher education' }
          ];
          break;
      case 'retail & hospitality':
          outcome = `This route is challenging but rewarding, ${currentPersona}.`;
          options = [
              { text: 'Retail Jobs', path: 'retail' },
              { text: 'Hotel Hospitality', path: 'hospitlity' },
              { text: 'Marine Hospitality', path: 'hospitality' }
          ];
          break;
  }

  container.appendChild(createElement('h2', outcome));
  container.appendChild(createElement('p', "Select your next step:"));
  
  options.forEach(option => {
      const button = createElement('button', option.text, {
          onclick: `choosePath('${option.path}')`
      });
      container.appendChild(button);
  });

  addNavigationButtons();
  pushState(container.innerHTML);
}

function learnMore(learningPath) {
  const container = document.getElementById("intro");
  container.innerHTML = '';
  
  let message = '';
  updateProgress();

  switch (learningPath) {
      case 'onlineCourses':
          message = `${currentPersona} chose online courses.`;
          const form = createOnlineCourseForm();
          container.appendChild(form);
          break;
      case 'bootcamp':
          message = `A bootcamp will immerse ${currentPersona} in coding.`;
          container.appendChild(createElement('p', message))
          break;
      
      default:
          message = "This path is still under development!";
  }

  container.insertBefore(createElement('h2', message), container.firstChild);
  
  const finishButton = createElement('button', 'Finish Journey', {
      onclick: 'finishStory()'
  });
  container.appendChild(finishButton);
  
  addNavigationButtons();
  pushState(container.innerHTML);
}

function createOnlineCourseForm() {
  const form = document.createElement('form');
  
  const experienceLabel = createElement('label', 'Your Experience Level:');
  experienceLabel.setAttribute('for', 'experience');
  
  const experienceSelect = document.createElement('select');
  experienceSelect.id = 'experience';
  ['Beginner', 'Intermediate', 'Advanced'].forEach(level => {
      const option = createElement('option', level);
      option.value = level.toLowerCase();
      experienceSelect.appendChild(option);
  });
  
  const submitButton = createElement('button', 'Submit Preferences');
  submitButton.type = 'submit';
  
  form.appendChild(experienceLabel);
  form.appendChild(experienceSelect);
  form.appendChild(submitButton);
  
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      const experience = experienceSelect.value;
      alert(`${currentPersona}, we've noted your ${experience} experience level.`);
  });
  
  return form;
}

function finishStory() {
  const container = document.getElementById("intro");
  container.innerHTML = '';
  
  container.appendChild(createElement('h1', `Congratulations, ${currentPersona}!`));
  container.appendChild(createElement('p', 
      "By investing in your skills, you've taken the first step toward a better career."));
  
  const restartButton = createElement('button', 'Start Again');
  restartButton.onclick = () => location.reload();
  container.appendChild(restartButton);
  
  const homeButton = createElement('button', 'Home');
  homeButton.onclick = goToHomePage;
  container.appendChild(homeButton);
  
  pushState(container.innerHTML);
}

// Helper function for consistent navigation buttons
function addNavigationButtons() {
  const container = document.getElementById("intro");
  
  const backButton = createElement('button', 'Back');
  backButton.onclick = goBack;
  container.appendChild(backButton);
  
  const homeButton = createElement('button', 'Home');
  homeButton.onclick = goToHomePage;
  container.appendChild(homeButton);
}

function choosePath(path) {
  console.log(`choosePath('${path}') was called!`);
  const container = document.getElementById("intro");
  container.innerHTML = '';

  switch (path) {
    case 'coding':
      container.appendChild(createElement('h2', 'Learn Coding Options'));
      const bootcampCodingButton = createElement('button', 'Coding Bootcamp', {
        onclick: `learnMore('bootcamp')`
      });
      container.appendChild(bootcampCodingButton);
      const onlineCodingCoursesButton = createElement('button', 'Online Coding Courses', {
        onclick: `learnMore('onlineCourses')`
      });
      container.appendChild(onlineCodingCoursesButton);
      break;
    case 'AI':
      container.appendChild(createElement('h2', 'Learn AI Options'));
      const bootcampAIButton = createElement('button', 'AI Bootcamp', {
        onclick: `learnMore('aiBootcamp')`
      });
      container.appendChild(bootcampAIButton);
      const onlineAICoursesButton = createElement('button', 'Online AI Courses', {
        onclick: `learnMore('aiOnlineCourses')`
      });
      container.appendChild(onlineAICoursesButton);
      break;
    case 'design':
      container.appendChild(createElement('h2', 'Design Colleges in South Africa'));
      const designColleges = [
        "Cape Peninsula University of Technology",
        "University of Johannesburg",
        "Vega School of Design",
        // Add more colleges here
      ];
      const designCollegesList = createElement('ul');
      designColleges.forEach(college => {
        const listItem = createElement('li', college);
        designCollegesList.appendChild(listItem);
      });
      container.appendChild(designCollegesList);
      break;
    case 'certifications':
      container.appendChild(createElement('h2', 'Available Certifications'));
      const certificationsList = [
        "Project Management Professional (PMP)",
        "Certified Information Systems Security Professional (CISSP)",
        "Google Cloud Certified - Professional Cloud Architect",
        // Add more certifications here
      ];
      const certificationsUl = createElement('ul');
      certificationsList.forEach(cert => {
        const listItem = createElement('li', cert);
        certificationsUl.appendChild(listItem);
      });
      container.appendChild(certificationsUl);
      break;
    case 'university':
      container.appendChild(createElement('h2', 'Universities in South Africa'));
      const universitiesSA = [
        "University of Cape Town",
        "University of the Witwatersrand",
        "Stellenbosch University",
        // Add more universities here
      ];
      const universitiesUl = createElement('ul');
      universitiesSA.forEach(uni => {
        const listItem = createElement('li', uni);
        universitiesUl.appendChild(listItem);
      });
      container.appendChild(universitiesUl);
      break;
    case 'higher education':
      container.appendChild(createElement('h2', 'Higher Education Institutions in South Africa'));
      const higherEducationInstitutions = [
        "Vega",
        "Stadio",
        "Eduvos",
        // Add more institutions here
      ];
      const higherEducationUl = createElement('ul');
      higherEducationInstitutions.forEach(inst => {
        const listItem = createElement('li', inst);
        higherEducationUl.appendChild(listItem);
      });
      container.appendChild(higherEducationUl);
      break;
    case 'retail':
      container.appendChild(createElement('h2', 'Retail Job Opportunities'));
      const indeedRetailLink = createElement('a', 'Search Retail Jobs on Indeed South Africa', {
        href: 'https://za.indeed.com/Retail-jobs',
        target: '_blank'
      });
      container.appendChild(indeedRetailLink);
      break;
    case 'hospitlity': // Hotel Hospitality
      container.appendChild(createElement('h2', 'Hotels in South Africa'));
      const hotelsSA = [
        "The Table Bay Hotel, Cape Town",
        "The Oyster Box, Durban",
        "Saxon Hotel, Villas and Spa, Johannesburg",
        // Add more hotels here
      ];
      const hotelsUl = createElement('ul');
      hotelsSA.forEach(hotel => {
        const listItem = createElement('li', hotel);
        hotelsUl.appendChild(listItem);
      });
      container.appendChild(hotelsUl);
      break;
    case 'hospitality': // Marine Hospitality
      container.appendChild(createElement('h2', 'Cruise Ships in South Africa'));
      const cruiseShipsSA = [
        "MSC Cruises (operates in SA)",
        "P&O Cruises (sometimes visits SA)",
        // Add more cruise lines/ships here
      ];
      const cruisesUl = createElement('ul');
      cruiseShipsSA.forEach(cruise => {
        const listItem = createElement('li', cruise);
        cruisesUl.appendChild(listItem);
      });
      container.appendChild(cruisesUl);
      break;
    case 'further studies':
      container.appendChild(createElement('h2', 'Explore Further Studies'));
      const certificationsButton = createElement('button', 'Certifications', {
        onclick: `choosePath('certifications')`
      });
      container.appendChild(certificationsButton);
      const universityButton = createElement('button', 'University', {
        onclick: `choosePath('university')`
      });
      container.appendChild(universityButton);
      const higherEducationButton = createElement('button', 'Higher Education', {
        onclick: `choosePath('higher education')`
      });
      container.appendChild(higherEducationButton);
      break;
    case 'retail & hospitality':
      container.appendChild(createElement('h2', 'Explore Retail & Hospitality Careers'));
      const retailJobsButton = createElement('button', 'Retail Jobs', {
        onclick: `choosePath('retail')`
      });
      container.appendChild(retailJobsButton);
      const hotelHospitalityButton = createElement('button', 'Hotel Hospitality', {
        onclick: `choosePath('hospitlity')`
      });
      container.appendChild(hotelHospitalityButton);
      const marineHospitalityButton = createElement('button', 'Marine Hospitality', {
        onclick: `choosePath('hospitality')`
      });
      container.appendChild(marineHospitalityButton);
      break;
    default:
      container.appendChild(createElement('p', 'More information about this path coming soon!'));
  }

  addNavigationButtons();
  pushState(container.innerHTML);
}

document.addEventListener('DOMContentLoaded', function() {
  if (currentPersona) {
      document.getElementById("persona-selection").style.display = "none";
      document.getElementById("intro").style.display = "block";
      startStory();
  }
});