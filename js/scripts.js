const luggageRows = new Map();
let luggageIDIncrement = 0;
const weightHTML = '<span class="weight-unit">lb</span>';
const bodyWeightInput = document.getElementById('body-weight');

function clearCell(element) {
  const el = element;
  el.innerHTML = '';
}

function calculateWeights() {
  const maxWeightInput = document.getElementById('max-weight').value;
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
    document.getElementById(`alert-${id}`).style.display = 'none';

    if (scaleWeightInput.value !== '' && (scaleWeightInput.value <= bodyWeightInput.value)) {
      document.getElementById(`alert-${id}`).style.display = '';
      continue;
    }

    if (bodyWeightInput.value !== '' && scaleWeightInput.value !== '') {
      const luggageWeight = (scaleWeightInput.value - bodyWeightInput.value);
      luggageWeightOutput.innerHTML = `<span class="luggage-underweight">${luggageWeight.toFixed(1) + weightHTML}</span>`;

      if (maxWeightInput) {
        const wiggleRoom = (maxWeightInput - luggageWeight);
        if (wiggleRoom >= 0) {
          const text = wiggleRoom.toFixed(1) + weightHTML;
          wiggleRoomOutput.innerHTML = `<span class="underweight-label" title="There is free space in this luggage.">${text}<span>`;
        } else {
          const text = Math.abs(wiggleRoom).toFixed(1) + weightHTML;
          wiggleRoomOutput.innerHTML = `<span class="overweight">${text}<span class="overweight-label" title="This item is over your airline's weight limit">overweight</span></span>`;
          luggageWeightOutput.innerHTML = `<span class="luggage-overweight">${luggageWeight.toFixed(1) + weightHTML}</span>`;
          overweightCount += 1;
        }
        totalWiggleRoom += wiggleRoom;
      }
    }
  }
  weightMessage(totalWiggleRoom, maxWeightInput, overweightCount);
}

function weightMessage(totalWiggleRoom, maxWeightInput, overweightCount) {
  const removeAmount = Math.abs(totalWiggleRoom).toFixed(1) + weightHTML;
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

    tr[0].setAttribute('id', `luggage-${id}`);
    tr[0].setAttribute('class', 'luggage-row');
    td[0].innerHTML = `<button class="remove-button" type="button" tabindex="-1" onclick="removeLuggage(${id})">–</button>`;
    td[0].setAttribute('id', `button-${id}`);
    td[1].innerHTML = `<input class="luggage-description" onfocus="this.select();" tabindex="-1" placeholder="Luggage ${id}" value="Luggage ${id}" maxlength="20">`;
    td[1].setAttribute('id', `description-${id}`);
    td[2].innerHTML = `<input type="number" step=".1" id="scale-weight-${id}" class="weight-input has-min" min="${bodyWeightInput.value}" required> <span class="weight-unit">lb</span>`;
    td[3].setAttribute('id', `luggage-weight-${id}`);
    td[4].setAttribute('id', `wiggle-room-${id}`);
    td[5].setAttribute('id', `alert-${id}`);

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
  const weightButton = button.innerHTML;
  const unitDisplay = document.getElementsByClassName('weight-unit');
  const weightUnit = (weightButton === 'kg' ? 'kg' : 'lb');
  for (const i of unitDisplay) {
    i.innerHTML = weightUnit;
  }
}

// eslint-disable-next-line no-unused-vars
function toggleInstructions(instructionsButton) {
  const button = instructionsButton;
  const instructions = document.getElementById('instructions');
  instructions.style.display = instructions.style.display === 'none' ? '' : 'none';
  if (button) {
    button.textContent = (button.textContent === 'Show instructions...') ? 'Hide instructions...' : 'Show instructions...';
  }
}

function updateMinimumWeight(e) {
  const inputs = document.getElementsByClassName('has-min');
  for (const i of inputs) {
    i.setAttribute('min', e.target.value);
  }
}

function updateRowsOnChange(e) {
  const target = e.target.closest('.weight-input');
  if (target) {
    calculateWeights();
  }
}

// Initial luggage row;
addLuggage();

document.addEventListener('change', updateRowsOnChange);
bodyWeightInput.addEventListener('change', updateMinimumWeight);
bodyWeightInput.focus();
