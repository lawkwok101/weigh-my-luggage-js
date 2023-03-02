const luggageRows = new Map();
let luggageIDIncrement = 0;
const weightHTML = '<span class="weight-unit">lb</span>';
const bodyWeightInput = document.getElementById('body-weight');

function clearCell(element) {
  const el = element;
  el.innerHTML = '';
}

function calculateWeights() {
  const bodyWeightAlert = document.getElementById('alert-empty-body-weight');
  const maxWeightInput = document.getElementById('max-weight').value;
  let overweightCount = 0;
  let totalWiggleRoom = 0;

  // if (!bodyWeightInput) {
  //   document.getElementById('alert-empty-body-weight').innerHTML = '&#8592; Please enter your body weight.';
  //   document.getElementById('body-weight').focus();
  // } else {
  //   clearCell(bodyWeightAlert);
  // }

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
      luggageWeightOutput.innerHTML = luggageWeight.toFixed(1) + weightHTML;

      if (maxWeightInput) {
        const wiggleRoom = (maxWeightInput - luggageWeight);
        if (wiggleRoom >= 0) {
          const text = wiggleRoom.toFixed(1) + weightHTML;
          wiggleRoomOutput.innerHTML = `<span class="underweight">${text}<span>`;
        } else {
          const text = Math.abs(wiggleRoom.toFixed(1)) + weightHTML;
          wiggleRoomOutput.innerHTML = `<span class="overweight">${text} too heavy.</span>`;
          overweightCount += 1;
        }
        totalWiggleRoom += wiggleRoom;
      }
    }
  }
  weightMessage(totalWiggleRoom, maxWeightInput, overweightCount);
}

function weightMessage(totalWiggleRoom, maxWeightInput, overweightCount) {
  const heavyMessage = document.getElementById('overweight-message');
  const howManyBags = overweightCount > 1 ? 'Some bags are too heavy. ' : 'A bag is too heavy. ';
  if (totalWiggleRoom < 0) {
    const text = Math.abs(totalWiggleRoom).toFixed(1) + weightHTML;
    heavyMessage.innerHTML = `<span class="overweight">${howManyBags} Consider moving items to bags with wiggle room. However, you would still need to remove ${text}.</span>`;
  } else if (totalWiggleRoom >= 0 && overweightCount >= 1) {
    heavyMessage.innerHTML = `<span class="overweight">${howManyBags}</span><span class="underweight">However, you have enough wiggle room in another bag. Consider rearranging your items to stay under the weight limit.</span>`;
  } else if ((maxWeightInput) && (totalWiggleRoom <= 0) || (overweightCount === 0)) {
    heavyMessage.innerHTML = '<span class="underweight">All your luggage is under your airline\'s weight limit.</span>';
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
    td[0].innerHTML = `<button class="remove-button" type="button" tabindex="-1" onclick="removeLuggage(${id})">–</button>`;
    td[0].setAttribute('id', `button-${id}`);
    td[1].innerHTML = `<span class="luggage-description" contenteditable="true" tabindex="-1" placeholder="Luggage ${id}">Luggage ${id}</span>`;
    td[1].setAttribute('id', `description-${id}`);
    td[2].innerHTML = `<input type="number" step=".1" id="scale-weight-${id}" class="weight-input has-min" min="${bodyWeightInput.value}"> <span class="weight-unit">lb</span>`;
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
