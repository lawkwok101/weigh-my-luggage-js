/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */

function counter() {
  let privateCounter = 0;

  function changeBy(val) {
    if (val) {
      privateCounter += val;
    } else {
      privateCounter += 1;
    }
  }

  return {
    increment(input) { changeBy(input); },
    reset() { privateCounter = 0; },
    value() { return privateCounter; },
  };
}

const luggageID = counter();
const overweightCount = counter();
const totalWiggleRoom = counter();
const wiggleRoomCount = counter();

const luggageRows = new Map();
const bodyWeightInput = document.getElementById('body-weight');
const maxWeightInput = document.getElementById('max-weight');

function addLuggage() {
  luggageID.increment();
  const id = luggageID.value();
  luggageRows.set(id, `Luggage ${id}`);
  document.getElementById('no-luggage').style.display = 'none';

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
    tr[0].classList.add('fade');
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
    document.getElementById(`scale-weight-${id}`).focus();
  }
}

function removeLuggage(id) {
  document.getElementById(`luggage-${id}`).remove();
  luggageRows.delete(id);

  calculateWeights();

  if (luggageRows.size === 0) {
    document.getElementById('no-luggage').style.display = '';
    luggageID.reset();
  }
}

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

    luggageWeightOutput.innerHTML = '';
    wiggleRoomOutput.innerHTML = '';

    if (scaleWeight <= bodyWeight) {
      luggageWeightOutput.innerHTML = '<span class="alert alert-fade">Scale Weight must be greater than your body weight.</span>';
      continue;
    }

    // Output Luggage Weight
    if (!isNaN(bodyWeight) && !isNaN(scaleWeight)) {
      const luggageWeight = (scaleWeight - bodyWeight);
      luggageWeightOutput.innerHTML = formatWeight(luggageWeight, 'underweight');

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
  const messageArea = document.getElementById('message-area');
  messageArea.textContent = '';
  messageArea.className = '';

  // Prevents message area from appearing when no luggage inputs are filled
  if (!luggageWeight) { return; }

  if (luggageRows.size > 0) {
    if ('content' in document.createElement('template')) {
      const hasOverweightLuggage = (overweightCount.value() > 0) !== false;
      const hasWiggleRoom = (totalWiggleRoom.value() < 0) !== false;
      const hasFreeLuggage = (wiggleRoomCount.value() > 0) !== false;
      const hasMaxWeight = (maxWeightInput.value !== '');
      let message = '';
      let cls = '';

      if (hasWiggleRoom && hasFreeLuggage) {
        message = 'message-1';
        cls = 'message-overweight message';
      } else if (hasWiggleRoom && !hasFreeLuggage) {
        message = 'message-2';
        cls = 'message-overweight message';
      } else if (hasOverweightLuggage) {
        message = 'message-3';
        cls = 'message-overweight message';
      } else if (hasMaxWeight && !hasOverweightLuggage) {
        message = 'message-4';
        cls = 'message-underweight message';
      } else if (!hasMaxWeight) {
        message = 'message-5';
        cls = 'message-overweight message';
      }

      const template = document.getElementById(message);
      const clone = template.content.cloneNode(true);

      if (message === 'message-1') {
        const alert = clone.querySelectorAll('.alert-fix');
        alert[0].innerHTML = formatWeight(totalWiggleRoom.value(), 'overweight', true);
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
    unit.classList = 'weight-unit';
    unit.offsetWidth; /* trigger reflow */
    unit.classList.add('fade');
  }
}

function toggleInstructions(instructionsButton) {
  const button = instructionsButton;
  const instructions = document.getElementById('instructions');
  instructions.style.display = instructions.style.display === 'none' ? '' : 'none';
  button.textContent = (button.textContent === 'Show instructions...') ? 'Hide instructions...' : 'Show instructions...';
}

function formatWeight(weight, underOrOverweight, absoluteValue = false, wiggleRoomLabel = false) {
  const freeSpaceLabel = '<span class="underweight-label label" title="You have free space in your luggage">✓ free space</span>';
  const overweightLabel = '<span class="overweight-label label" title="This item is over your airline\'s weight limit">overweight</span>';
  const cls = underOrOverweight;
  let formattedWeight = weight;
  let label = '';

  if (underOrOverweight === 'underweight' && wiggleRoomLabel === true) {
    label = freeSpaceLabel;
  } else if (underOrOverweight === 'overweight' && wiggleRoomLabel === true) {
    label = overweightLabel;
  }

  if (absoluteValue === true) {
    formattedWeight = Math.abs(weight);
  }

  return `<span class="${cls} fade-text">${formattedWeight.toFixed(1)} <span class="weight-unit">lb</span></span>${label}`;
}

function validateWeights(e) {
  // regex checks if numbers follow the '000.0' format
  if (/^\d{0,3}\.?\d{0,1}$/.test(e.target.value)) {
    lastValid = e.target.value;
  } else {
    e.target.value = lastValid;
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
  // No need to calculate weights when editing luggage description
  if (e.target.matches('.luggage-description')) {
    return;
  }

  if (e.target.matches('#body-weight')) {
    updateMinimumWeight(e);
  }

  validateWeights(e);
  calculateWeights();
});

document.addEventListener('click', (e) => {
  if (e.target.matches('.add-luggage-button')) {
    addLuggage();
  }

  if (e.target.matches('#instructions-header th:not(:first-child)')
    || e.target.matches('#instructions th')
    || e.target.matches('.scale-weight-highlight')
  ) {
    toggleInstructions();
  }
});

document.addEventListener('submit', (e) => {
  // Add luggage when user presses Enter
  if (e.target.matches('#step-2')) {
    addLuggage();
  }
});
