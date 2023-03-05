const luggageRows = new Map();
let luggageIDIncrement = 0;
const bodyWeightInput = document.getElementById('body-weight');

function clearCell(element) {
  const el = element;
  el.innerHTML = '';
}

function formatWeight(unformattedWeight, classString, needAbsoluteValue = false) {
  const cls = classString;
  let weight = unformattedWeight;
  if (needAbsoluteValue === true) {
    weight = Math.abs(unformattedWeight);
  }
  return `<span class="${cls}">${weight.toFixed(1)} <span class="weight-unit">lb</span></span>`;
}

function calculateWeights() {
  let overweightCount = 0;
  let totalWiggleRoom = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const [id] of luggageRows) {
    const scaleWeightInput = document.getElementById(`scale-weight-${id}`);
    const luggageWeightOutput = document.getElementById(`luggage-weight-${id}`);
    const wiggleRoomOutput = document.getElementById(`wiggle-room-${id}`);

    // reset luggage row data and errors
    clearCell(luggageWeightOutput);
    clearCell(wiggleRoomOutput);

    if (scaleWeightInput.value !== '' && (scaleWeightInput.value <= bodyWeightInput.value)) {
      luggageWeightOutput.innerHTML = '<span class="alert">Scale Weight must be greater than your body weight.</span>';
      continue;
    }

    if (bodyWeightInput.value !== '' && scaleWeightInput.value !== '') {
      const luggageWeight = (scaleWeightInput.value - bodyWeightInput.value);
      const maxWeightInput = document.getElementById('max-weight').value;

      luggageWeightOutput.innerHTML = formatWeight(luggageWeight, 'luggage-underweight');

      if (maxWeightInput) {
        const wiggleRoom = (maxWeightInput - luggageWeight);
        if (wiggleRoom > 0) {
          wiggleRoomOutput.innerHTML = `${formatWeight(wiggleRoom, 'underweight')} <span class="underweight-label label" title="You have free space in your luggage">✓ free space</span>`;
        } else if (wiggleRoom === 0) {
          wiggleRoomOutput.innerHTML = formatWeight(wiggleRoom, 'overweight');
        } else {
          wiggleRoomOutput.innerHTML = `${formatWeight(wiggleRoom, 'overweight', true)} <span class="overweight-label label" title="This item is over your airline's weight limit">overweight</span>`;
          luggageWeightOutput.innerHTML = formatWeight(luggageWeight, 'luggage-overweight');
          overweightCount += 1;
        }
        totalWiggleRoom += wiggleRoom;
      }
      weightMessage(totalWiggleRoom, maxWeightInput, overweightCount);
    }
  }
}

function weightMessage(totalWiggleRoom, maxWeightInput, overweightCount) {
  const removeAmount = formatWeight(totalWiggleRoom, undefined, true);
  const messageArea = document.getElementById('overweight-message');
  messageArea.textContent = '';
  messageArea.setAttribute('class', '');

  if ('content' in document.createElement('template')) {
    let message = '';

    if (totalWiggleRoom < 0) {
      message = 'message-1';
    } else if (overweightCount >= 1) {
      message = 'message-2';
    } else if (((maxWeightInput !== '') && (totalWiggleRoom <= 0)) || (overweightCount === 0)) {
      message = 'message-3';
      messageArea.setAttribute('class', 'all-underweight');
    }

    const template = document.getElementById(message);
    const clone = template.content.cloneNode(true);

    if (message === 'message-1') {
      const alert = clone.querySelectorAll('.alert-fix');
      alert[0].innerHTML = removeAmount;
    }

    messageArea.appendChild(clone);
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
    tr[0].setAttribute('id', `luggage-${id}`);
    button[0].setAttribute('onclick', `removeLuggage(${id})`);
    // Description
    input[0].setAttribute('value', `Luggage ${id}`);
    input[0].setAttribute('placeholder', `Luggage ${id}`);
    // Scale Weight
    input[1].setAttribute('id', `scale-weight-${id}`);
    input[1].setAttribute('min', bodyWeightInput.value);
    // Luggage Weight
    td[3].setAttribute('id', `luggage-weight-${id}`);
    // Wiggle Room
    td[4].setAttribute('id', `wiggle-room-${id}`);

    tbody.appendChild(clone);
  } else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.

    // const allLuggage = document.getElementById('luggage-list');
    // let html = '<tr>';
    // html += '<td>Luggage 2</td></tr>';
    // allLuggage.insertAdjacentHTML('beforeend', html);
  }
  calculateWeights();
}

// eslint-disable-next-line no-unused-vars
function removeLuggage(id) {
  document.getElementById(`luggage-${id}`).remove();
  document.getElementById(`alert-${id}`).remove();
  luggageRows.delete(id);
  calculateWeights();

  if (luggageRows.size === 0) {
    const easterEgg = document.getElementById('no-luggage');
    luggageIDIncrement = 0;
    easterEgg.style.display = '';
  }
}

// eslint-disable-next-line no-unused-vars
function toggleUnits(button) {
  const allUnits = document.getElementsByClassName('weight-unit');
  // eslint-disable-next-line no-restricted-syntax
  for (const unit of allUnits) {
    unit.textContent = (button.textContent === 'kg' ? 'kg' : 'lb');
  }
}

// eslint-disable-next-line no-unused-vars
function toggleInstructions(instructionsButton) {
  const button = instructionsButton;
  const instructions = document.getElementById('instructions');
  instructions.style.display = instructions.style.display === 'none' ? '' : 'none';
  button.textContent = (button.textContent === 'Show instructions...') ? 'Hide instructions...' : 'Show instructions...';
}

function updateMinimumWeight(e) {
  const inputs = document.getElementsByClassName('has-min');
  // eslint-disable-next-line no-restricted-syntax
  for (const input of inputs) {
    input.setAttribute('min', e.target.value);
  }
}

function updateRowsOnChange(e) {
  const target = e.target.closest('.weight-input');
  if (target) {
    calculateWeights();
  }
}
function validate(element) {
  // console.log(/^\d{1,3}\.?\d{1,2}$/.test(e.value));
  var max_chars = 5;
  if(element.value.length > max_chars) {
      element.value = element.value.substr(0, max_chars);
  }
}

// Initial luggage row;
addLuggage();

document.addEventListener('change', updateRowsOnChange);
bodyWeightInput.addEventListener('change', updateMinimumWeight);
bodyWeightInput.focus();
