/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
const bodyWeightInput = document.getElementById('body-weight');
const maxWeightInput = document.getElementById('max-weight');
const luggageList = document.getElementById('luggage-list');
const luggageRowTemplate = document.getElementById('luggage-row');
const noLuggageMessage = document.getElementById('no-luggage');
const messageArea = document.getElementById('message-area');
const freeSpaceLabel = '<span class="underweight-label label" title="You have free space in your luggage">✓ free space</span>';
const overweightLabel = '<span class="overweight-label label" title="This item is over your airline\'s weight limit">overweight</span>';

const luggageID = counter();
const overweightCount = counter();
const totalWiggleRoom = counter();
const wiggleRoomCount = counter();

const luggageRows = new Map();

function counter() {
  let privateCounter = 0;

  function changeBy(val = 1) {
    privateCounter += val;
  }

  return {
    increment: (input) => changeBy(input),
    reset: () => privateCounter = 0,
    get value() { return privateCounter; },
  };
}

function addLuggage() {
  luggageID.increment();
  const id = luggageID.value;
  luggageRows.set(id, `Luggage ${id}`);
  noLuggageMessage.style.display = 'none';

  if ('content' in document.createElement('template')) {
    const clone = luggageRowTemplate.content.cloneNode(true);
    const tr = clone.querySelectorAll('tr');
    const td = clone.querySelectorAll('td');
    const button = clone.querySelectorAll('button');
    const input = clone.querySelectorAll('input');

    // Remove Luggage
    tr[0].id = `luggage-${id}`;
    tr[0].classList.add('fade');
    button[0].addEventListener('click', () => removeLuggage(id));
    // Description
    input[0].value = `Luggage ${id}`;
    input[0].placeholder = `Luggage ${id}`;
    // Scale Weight
    input[1].id = `scale-weight-${id}`;
    input[1].min = bodyWeightInput.value;
    // Arrow
    td[3].id = `arrow-${id}`;
    // Luggage Weight
    td[4].id = `luggage-weight-${id}`;
    // Wiggle Room
    td[5].id = `wiggle-room-${id}`;

    luggageList.appendChild(clone);
    document.getElementById(`scale-weight-${id}`).focus();
  }
}

function removeLuggage(id) {
  document.getElementById(`luggage-${id}`).remove();
  luggageRows.delete(id);

  calculateWeights();

  if (luggageRows.size === 0) {
    noLuggageMessage.style.display = '';
    luggageID.reset();
  }
}

const debounce = (func, wait = 250) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function calculateWeights() {
  const bodyWeight = parseFloat(bodyWeightInput.value);
  const maxWeight = parseFloat(maxWeightInput.value);
  overweightCount.reset();
  totalWiggleRoom.reset();
  wiggleRoomCount.reset();

  for (const [id] of luggageRows) {
    const scaleWeight = parseFloat(document.getElementById(`scale-weight-${id}`).value);
    const luggageWeightOutput = document.getElementById(`luggage-weight-${id}`);
    const wiggleRoomOutput = document.getElementById(`wiggle-room-${id}`);
    const arrow = document.querySelector(`#arrow-${id} span`);

    luggageWeightOutput.textContent = '';
    wiggleRoomOutput.textContent = '';
    arrow.className = 'arrow';

    if (scaleWeight <= bodyWeight) {
      luggageWeightOutput.innerHTML = '<span class="alert alert-fade">Scale Weight must be greater than your body weight.</span>';
      arrow.offsetWidth; /* trigger reflow */
      arrow.className = 'arrow arrow-left';
      continue;
    }

    // Output Luggage Weight
    if (!isNaN(bodyWeight) && !isNaN(scaleWeight)) {
      const luggageWeight = (scaleWeight - bodyWeight);
      luggageWeightOutput.innerHTML = formatWeight(luggageWeight, 'underweight');
      arrow.className = 'arrow arrow-right';

      // Output Wiggle Room
      if (maxWeight) {
        const wiggleRoom = (maxWeight - luggageWeight);

        if (wiggleRoom > 0) {
          wiggleRoomOutput.innerHTML = formatWeight(wiggleRoom, 'underweight', false, true);
          wiggleRoomCount.increment();
        } else if (wiggleRoom === 0) {
          wiggleRoomOutput.innerHTML = formatWeight(wiggleRoom, 'overweight');
        } else {
          wiggleRoomOutput.innerHTML = formatWeight(wiggleRoom, 'overweight', true, true);
          luggageWeightOutput.innerHTML = formatWeight(luggageWeight, 'overweight');
          overweightCount.increment();
        }
        totalWiggleRoom.increment(wiggleRoom);
      }

      weightMessage(luggageWeight);
    }
  }
}

function weightMessage(luggageWeight) {
  messageArea.textContent = '';
  messageArea.className = '';

  // Prevents message area from appearing when no luggage inputs are filled
  if (!luggageWeight) { return; }

  if (luggageRows.size > 0) {
    if ('content' in document.createElement('template')) {
      const hasOverweightLuggage = overweightCount.value > 0;
      const hasWiggleRoom = totalWiggleRoom.value < 0;
      const hasFreeLuggage = wiggleRoomCount.value > 0;
      const hasMaxWeight = (maxWeightInput.value !== '');
      let message = '';
      let cls = 'message overweight column-50';

      if (hasWiggleRoom && hasFreeLuggage) {
        message = 'message-1';
      } else if (hasWiggleRoom && !hasFreeLuggage) {
        message = 'message-2';
      } else if (hasOverweightLuggage) {
        message = 'message-3';
      } else if (hasMaxWeight && !hasOverweightLuggage) {
        message = 'message-4';
        cls = 'message underweight column-50';
      } else if (!hasMaxWeight) {
        message = 'message-5';
      }

      const template = document.getElementById(message);
      const clone = template.content.cloneNode(true);

      if (message === 'message-1') {
        const alert = clone.querySelectorAll('.alert-fix');
        alert[0].innerHTML = formatWeight(totalWiggleRoom.value, 'overweight', true);
      }

      messageArea.appendChild(clone);
      messageArea.style.animation = 'none';
      messageArea.offsetWidth; /* trigger reflow */
      messageArea.style.animation = null;
      messageArea.className = cls;
    }
  }
}

function toggleUnits(button) {
  const allUnits = document.getElementsByClassName('weight-unit');

  for (const unit of allUnits) {
    unit.textContent = (button.textContent === 'kg' ? 'kg' : 'lb');
  }
}

function toggleInstructions(instructionsButton) {
  const button = instructionsButton;
  const instructions = document.getElementById('instructions');
  instructions.style.display = instructions.style.display === 'none' ? '' : 'none';
  button.textContent = (button.textContent === 'Show instructions...') ? 'Hide instructions...' : 'Show instructions...';
}

function formatWeight(weight, underOrOverweight, absoluteValue = false, wiggleRoomLabel = false) {
  const cls = underOrOverweight;
  let formattedWeight = weight;
  let label = '';

  if (wiggleRoomLabel === true) {
    label = underOrOverweight === 'underweight' ? freeSpaceLabel : overweightLabel;
  }

  if (absoluteValue === true) {
    formattedWeight = Math.abs(weight);
  }

  return `<div class="weight"><span class="${cls} fade">${formattedWeight.toFixed(1)} <span class="weight-unit">lb</span></span>${label}</div>`;
}

function validateWeights(e) {
  // regex checks if numbers follow the '000.0' format
  const { value } = e.target;

  const regex = /^\d{0,3}\.?\d{0,1}$/;
  const isValid = regex.test(value);
  if (!isValid) {
    e.target.value = value.slice(0, -1);
  }
}

function updateMinimumWeight(e) {
  const inputs = document.getElementsByClassName('has-min');

  for (const input of inputs) {
    input.min = e.target.value;
  }
}

// START APP
function validateInput(e) {
  if (e.target.matches('.luggage-description')) {
    return;
  }
  validateWeights(e);
}

const debouncedInput = debounce((e) => handleInput(e), 300);
function handleInput(e) {
  if (e.target.matches('.luggage-description')) {
    return;
  }

  if (e.target.matches('#body-weight')) {
    updateMinimumWeight(e);
  }

  calculateWeights();
}

function handleClick(e) {
  if (e.target.matches('.add-luggage-button')) {
    addLuggage();
  }

  if (e.target.matches('#instructions-header th:not(:first-child)')
    || e.target.matches('#instructions th')
    || e.target.matches('.scale-weight-highlight')
  ) {
    toggleInstructions();
  }
}

function handleSubmit(e) {
  // Add luggage when user presses Enter
  if (e.target.matches('#step-2')) {
    addLuggage();
  }
}
document.addEventListener('input', validateInput);
document.addEventListener('input', debouncedInput);
document.addEventListener('click', handleClick);
document.addEventListener('submit', handleSubmit);

addLuggage();
addLuggage();
bodyWeightInput.focus();
