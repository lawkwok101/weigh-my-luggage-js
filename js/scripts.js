/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
const luggageRows = new Map();
let luggageIDIncrement = 0;
const bodyWeightInput = document.getElementById('body-weight');
const maxWeightInput = document.getElementById('max-weight');

function formatWeight(unformattedWeight, classString, needAbsoluteValue = false) {
  const cls = classString;
  let weight = unformattedWeight;
  if (needAbsoluteValue === true) {
    weight = Math.abs(unformattedWeight);
  }
  return `<span class="${cls} fade">${weight.toFixed(1)} <span class="weight-unit">lb</span></span>`;
}

function calculateWeights(singleID) {
  const bodyWeight = parseFloat(bodyWeightInput.value);
  const maxWeight = parseFloat(maxWeightInput.value);
  let overweightCount = 0;
  let totalWiggleRoom = 0;

  // Create temporary iterable to calculate single luggage row ID
  const toCalculate = (singleID !== undefined) ? [[singleID, undefined]] : luggageRows;

  for (const [id] of toCalculate) {
    const scaleWeight = parseFloat(document.getElementById(`scale-weight-${id}`).value);
    const luggageWeightOutput = document.getElementById(`luggage-weight-${id}`);
    const wiggleRoomOutput = document.getElementById(`wiggle-room-${id}`);

    luggageWeightOutput.innerHTML = '';
    wiggleRoomOutput.innerHTML = '';

    if (scaleWeight.isNAN || (scaleWeight <= bodyWeight)) {
      luggageWeightOutput.innerHTML = '<span class="alert">Scale Weight must be greater than your body weight.</span>';
      continue;
    }

    if (!isNaN(bodyWeight) && !isNaN(scaleWeight)) {
      const luggageWeight = (scaleWeight - bodyWeight);
      luggageWeightOutput.innerHTML = formatWeight(luggageWeight, 'luggage-underweight fade');

      if (maxWeight) {
        const wiggleRoom = (maxWeight - luggageWeight);
        if (wiggleRoom > 0) {
          wiggleRoomOutput.innerHTML = formatWeight(wiggleRoom, 'underweight fade');
          wiggleRoomOutput.innerHTML += '<span class="underweight-label label" title="You have free space in your luggage">✓ free space</span>';
        } else if (wiggleRoom === 0) {
          wiggleRoomOutput.innerHTML = formatWeight(wiggleRoom, 'overweight fade');
        } else {
          wiggleRoomOutput.innerHTML = formatWeight(wiggleRoom, 'overweight fade', true);
          wiggleRoomOutput.innerHTML += '<span class="overweight-label label" title="This item is over your airline\'s weight limit">overweight</span>';
          luggageWeightOutput.innerHTML = formatWeight(luggageWeight, 'luggage-overweight fade');
          overweightCount += 1;
        }
        totalWiggleRoom += wiggleRoom;
      }
    }
  }
  weightMessage(totalWiggleRoom, overweightCount);
}

function weightMessage(totalWiggleRoom, overweightCount) {
  const messageArea = document.getElementById('message-area');
  messageArea.textContent = '';
  messageArea.className = '';

  if (luggageRows.size !== 0) {
    if ('content' in document.createElement('template')) {
      let message = '';
      let cls = '';

      if (totalWiggleRoom < 0) {
        message = 'message-1';
        cls = 'message-overweight message-fade';
      } else if (overweightCount >= 1) {
        message = 'message-2';
        cls = 'message-overweight message-fade';
      } else if (((maxWeightInput !== '') && (totalWiggleRoom <= 0)) || (overweightCount === 0)) {
        message = 'message-3';
        cls = 'message-underweight message-fade';
      }

      const template = document.getElementById(message);
      const clone = template.content.cloneNode(true);

      if (message === 'message-1') {
        const alert = clone.querySelectorAll('.alert-fix');
        alert[0].innerHTML = formatWeight(totalWiggleRoom, undefined, true);
      }
      messageArea.appendChild(clone);
      messageArea.style.animation = 'none';
      messageArea.offsetWidth; /* trigger reflow */
      messageArea.style.animation = null;
      messageArea.className = cls;
    }
  }
}

function addLuggage() {
  luggageIDIncrement += 1;
  luggageRows.set(luggageIDIncrement, `Luggage ${luggageIDIncrement}`);
  const id = luggageIDIncrement;

  const easterEgg = document.getElementById('no-luggage');
  easterEgg.style.display = 'none';

  if ('content' in document.createElement('template')) {
    const tbody = document.getElementById('luggage-list');
    const template = document.getElementById('luggage-row');

    const clone = template.content.cloneNode(true);
    const tr = clone.querySelectorAll('tr');
    const td = clone.querySelectorAll('td');
    const button = clone.querySelectorAll('button');
    const input = clone.querySelectorAll('input');

    // Remove Luggage
    tr[0].id = `luggage-${id}`;
    button[0].setAttribute('onclick', `removeLuggage(${id})`);
    // Description
    input[0].value = `Luggage ${id}`;
    input[0].placeholder = `Luggage ${id}`;
    // Scale Weight
    input[1].id = `scale-weight-${id}`;
    input[1].min = bodyWeightInput.value;
    // Luggage Weight
    td[3].id = `luggage-weight-${id}`;
    // Wiggle Room
    td[4].id = `wiggle-room-${id}`;

    tbody.appendChild(clone);
  }
  document.getElementById(`scale-weight-${id}`).focus();
}

function removeLuggage(id) {
  document.getElementById(`luggage-${id}`).remove();
  luggageRows.delete(id);

  calculateWeights();

  if (luggageRows.size === 0) {
    const easterEgg = document.getElementById('no-luggage');
    luggageIDIncrement = 0;
    easterEgg.style.display = '';
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

function validate(element) {
  // console.log(/^\d{1,3}\.?\d{1,2}$/.test(e.value));
  const maxChars = 5;
  if (element.value.length > maxChars) {
  element.value = element.value.substr(0, maxChars);
  }
}

function updateMinimumWeight(e) {
  const inputs = document.getElementsByClassName('has-min');
  for (const input of inputs) {
    input.min = e.target.value;
  }
}

// START APP

addLuggage();
addLuggage();
bodyWeightInput.focus();

document.addEventListener('input', (e) => {
  if (e.target.matches('.luggage-description')) { return; }

  // UPDATE ALL ROWS on body weight change
  if (e.target.matches('#body-weight')) {
    updateMinimumWeight(e);
    calculateWeights();
  }
  // UPDATE SINGLE ROW on max weight change
  if (e.target.matches('#max-weight')) {
    calculateWeights();
  }
  // UPDATE SINGLE ROW on scale weight change
  if (e.target.matches('[id^="scale-weight-"]')) {
    const id = e.target.id.split('-')[2];
    calculateWeights(id);
  }
});
