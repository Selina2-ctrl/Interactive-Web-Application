// Force reset persona selection
setCookie('chosenPersona', '', -1); // Expire the cookie immediately
let currentPersona = getCookie('chosenPersona') || ''; // Initialize from cookie
let stateHistory = []; // Array to track navigation history
let progress = 0; // Progress counter (capped at 100)
let userChoices = [];


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
  
  const bar = document.getElementById("progress-bar");
  if (bar) {
      bar.style.width = `${progress}%`;
  }

  const progressText = document.getElementById("progress-text");
  if (progressText) {
      progressText.textContent = `Progress: ${progress}%`;
  }
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
function pushState(htmlSnapshot) {
  stateHistory.push(htmlSnapshot);
}

function goBack() {
  if (stateHistory.length > 1) {
      stateHistory.pop(); // remove current
      const previousState = stateHistory[stateHistory.length - 1];
      document.getElementById("intro").innerHTML = previousState;
      addBackButtonIfNeeded(); // reattach any listeners
  }
}

function addBackButtonIfNeeded() {
  const container = document.getElementById("intro");

  // Prevent duplicate buttons
  if (!container.querySelector('button[data-nav="back"]')) {
      const backButton = createElement('button', 'Back', {
          'data-nav': 'back'
      });
      backButton.onclick = goBack;
      container.appendChild(backButton);
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
    updateProgress();
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
  updateProgress();
  const container = document.getElementById("intro");
  container.innerHTML = '';
  
  let outcome = '';
  let options = [];

  userChoices.push(`Chose skill: ${skill}`);


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
              { text: 'Certifications', path: 'certifications' },
              { text: 'University', path: 'university' },
              { text: 'Higher Education', path: 'higher education' }
          ];
          break;
      case 'retail & hospitality':
          outcome = `This route is challenging but rewarding, ${currentPersona}.`;
          options = [
              { text: 'Retail Jobs', path: 'retail' },
              { text: 'Hotel Hospitality', path: 'hospitality' },
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

  userChoices.push(`Chose learning method: ${learningPath}`);

  switch (learningPath) {
    case 'onlineCourses':
      message = `${currentPersona} chose online courses.`;
      container.appendChild(createElement('h2', 'Online Coding Courses'));
      container.appendChild(createElement('p', message));
      container.appendChild(createElement('p', "Start learning with flexible platforms:"));

      container.appendChild(createLink('Coursera – Web Dev, Python, etc.', 'https://www.coursera.org'));
      container.appendChild(createLink('Udemy – Affordable programming courses', 'https://www.udemy.com'));
      container.appendChild(createLink('edX – University-level online courses', 'https://www.edx.org'));

      const form = createOnlineCourseForm();
      container.appendChild(form);
      break;

    case 'bootcamp':
      message = `A coding bootcamp will immerse ${currentPersona} in intensive training.`;
      container.appendChild(createElement('h2', 'Coding Bootcamp'));
      container.appendChild(createElement('p', message));
      container.appendChild(createElement('p', "Explore these well-known coding bootcamps:"));

      container.appendChild(createLink('HyperionDev (South Africa)', 'https://www.hyperiondev.com'));
      container.appendChild(createLink('Le Wagon (Worldwide)', 'https://www.lewagon.com'));
      container.appendChild(createLink('CodeSpace Academy', 'https://www.codespace.co.za'));
      break;

    case 'aiBootcamp':
      message = `An AI bootcamp will help ${currentPersona} master machine learning.`;
      container.appendChild(createElement('h2', 'AI Bootcamp'));
      container.appendChild(createElement('p', message));
      container.appendChild(createElement('p', "Recommended bootcamps for AI training:"));

      container.appendChild(createLink('DeepLearning.AI (via Coursera)', 'https://www.deeplearning.ai'));
      container.appendChild(createLink('DataCamp – Practical ML/AI', 'https://www.datacamp.com'));
      container.appendChild(createLink('The AI Guild Bootcamp', 'https://theguild.ai'));
      break;

    case 'aiOnlineCourses':
      message = `Online AI courses provide great flexibility.`;
      container.appendChild(createElement('h2', 'Online AI Courses'));
      container.appendChild(createElement('p', message));
      container.appendChild(createElement('p', "Start your AI journey with:"));

      container.appendChild(createLink('Coursera – AI by Stanford (Andrew Ng)', 'https://www.coursera.org/learn/machine-learning'));
      container.appendChild(createLink('Google AI Learning', 'https://ai.google/education'));
      container.appendChild(createLink('edX – Artificial Intelligence Courses', 'https://www.edx.org/learn/artificial-intelligence'));
      break;

    default:
      container.appendChild(createElement('p', "This learning path is under construction."));
  }

  const finishBtn = createElement('button', 'Finish Journey');
  finishBtn.onclick = finishStory;
  container.appendChild(finishBtn);

  addNavigationButtons();
  pushState(container.innerHTML);
}
function createLink(text, url) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = url;
  link.target = '_blank';
  link.style.display = 'block';
  link.style.margin = '10px 0';
  link.style.color = '#00BFAE'; // Matches your button/heading color
  link.style.textDecoration = 'underline';
  return link;
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
  progress = 100;
  updateProgress();
  const container = document.getElementById("intro");
  container.innerHTML = '';
  
  const summaryTitle = createElement('h1', `Congratulations, ${currentPersona}!`);
  const summaryMsg = createElement('p', "You've completed your skills journey. Here's a summary of your decisions:");

  container.appendChild(summaryTitle);
  container.appendChild(summaryMsg);

  // Create and append the summary list
  const summaryList = createElement('ul');
  userChoices.forEach(choice => {
    const item = createElement('li', choice);
    summaryList.appendChild(item);
  });
  container.appendChild(summaryList);

  // Add recommendation section (optional)
  const opportunities = generateOpportunities(userChoices);
  container.appendChild(createElement('h2', 'Potential Opportunities'));
  const oppList = createElement('ul');
  opportunities.forEach(opp => {
    const item = createElement('li', opp);
    oppList.appendChild(item);
  });
  container.appendChild(oppList);

  // Add final buttons
  const restartButton = createElement('button', 'Start Again');
restartButton.onclick = () => {
  currentPersona = '';
  userChoices = [];
  progress = 0;
  setCookie('chosenPersona', '', -1); // delete cookie
  document.getElementById('intro').style.display = 'none';
  document.getElementById('persona-selection').style.display = 'block';
  document.getElementById('progress-text').textContent = 'Progress: 0%';
};
container.appendChild(restartButton);


  const homeButton = createElement('button', 'Home', {
    onclick: 'goToHomePage()'
  });
  container.appendChild(homeButton);

  pushState(container.innerHTML);
}

function generateOpportunities(choices) {
  const opportunities = [];

  if (choices.some(c => c.includes('tech'))) {
    opportunities.push('Apply for internships in tech companies');
    opportunities.push('Consider a short course in web or app development');
  }

  if (choices.some(c => c.includes('AI'))) {
    opportunities.push('Join an AI bootcamp or take online machine learning courses');
  }

  if (choices.some(c => c.includes('design'))) {
    opportunities.push('Apply to design schools or start freelancing');
  }

  if (choices.some(c => c.includes('certifications'))) {
    opportunities.push('Earn a professional certification to boost your CV');
  }

  if (choices.some(c => c.includes('retail'))) {
    opportunities.push('Apply for entry-level retail jobs or management trainee programs');
  }

  if (choices.some(c => c.includes('hospitality'))) {
    opportunities.push('Explore hotel or cruise job openings locally or abroad');
  }

  return opportunities.length > 0 ? opportunities : ['Explore career portals to find your next opportunity.'];
}


// Helper function for consistent navigation buttons
function addNavigationButtons() {
  const container = document.getElementById("intro");

  const backButton = createElement('button', 'Back', {
      'data-nav': 'back'
  });
  backButton.onclick = goBack;
  container.appendChild(backButton);

  const homeButton = createElement('button', 'Home');
  homeButton.onclick = goToHomePage;
  container.appendChild(homeButton);
}


function choosePath(path) {
  updateProgress();

  console.log(`choosePath('${path}') was called!`);
  const container = document.getElementById("intro");
  container.innerHTML = '';

  userChoices.push(`Explored path: ${path}`);

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

      container.appendChild(createElement('button', 'Finish Journey', { onclick: 'finishStory()' }));

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
      
      const finishBtn = createElement('button', 'Finish Journey', { onclick: 'finishStory()' });
      container.appendChild(finishBtn);

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

      container.appendChild(createElement('button', 'Finish Journey', { onclick: 'finishStory()' }));

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

      container.appendChild(createElement('button', 'Finish Journey', { onclick: 'finishStory()' }));

      break;
    case 'retail':
      container.appendChild(createElement('h2', 'Retail Job Opportunities'));
      const indeedRetailLink = createElement('a', 'Search Retail Jobs on Indeed South Africa', {
        href: 'https://za.indeed.com/Retail-jobs',
        target: '_blank'
      });
      container.appendChild(indeedRetailLink);

      container.appendChild(createElement('button', 'Finish Journey', { onclick: 'finishStory()' }));

      break;
    case 'hospitality': // Hotel Hospitality
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

      container.appendChild(createElement('button', 'Finish Journey', { onclick: 'finishStory()' }));

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

      container.appendChild(createElement('button', 'Finish Journey', { onclick: 'finishStory()' }));

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

function changeTheme(theme) {
  const root = document.documentElement;

  switch (theme) {
    case 'default':
      root.style.setProperty('--bg-color', '#2C2F36');
      root.style.setProperty('--text-color', '#E0E0E0');
      root.style.setProperty('--button-bg', '#4CAF50');
      root.style.setProperty('--button-hover', '#388E3C');
      root.style.setProperty('--accent-color', '#00BFAE');
      break;
    case 'ocean':
      root.style.setProperty('--bg-color', '#001f3f');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--button-bg', '#0074D9');
      root.style.setProperty('--button-hover', '#005fa3');
      root.style.setProperty('--accent-color', '#7FDBFF');
      break;
    case 'forest':
      root.style.setProperty('--bg-color', '#0b3d0b');
      root.style.setProperty('--text-color', '#e0ffe0');
      root.style.setProperty('--button-bg', '#2E8B57');
      root.style.setProperty('--button-hover', '#1e5e3e');
      root.style.setProperty('--accent-color', '#66bb6a');
      break;
    case 'sunset':
      root.style.setProperty('--bg-color', '#3e1f1f');
      root.style.setProperty('--text-color', '#fff5e6');
      root.style.setProperty('--button-bg', '#FF5733');
      root.style.setProperty('--button-hover', '#c63c1a');
      root.style.setProperty('--accent-color', '#FFC300');
      break;
  }

  // Save user's preference (optional)
  localStorage.setItem('selectedTheme', theme);
}

document.addEventListener('DOMContentLoaded', function () {
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    document.getElementById('theme').value = savedTheme;
    changeTheme(savedTheme);
  }
});


document.addEventListener('DOMContentLoaded', function() {
  if (currentPersona) {
      document.getElementById("persona-selection").style.display = "none";
      document.getElementById("intro").style.display = "block";
      startStory();
  }
});