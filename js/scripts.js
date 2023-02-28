const luggageRows = new Map([[1, 'Luggage 1']]);
let luggageIDIncrement = 1;
const weightHTML = ' <span class="weight-unit">lb</span>';

function clearCell(element) {
  const el = element;
  el.innerHTML = '';
}

function calculateWeights() {
  const bodyWeightInput = document.getElementById('body-weight').value;
  const maxWeightInput = document.getElementById('max-weight').value;
  let overweightCount = 0;
  let totalWiggleRoom = 0;

  if (!bodyWeightInput) {
    document.getElementById('alert-empty-body-weight').innerHTML = '&#8592; Please enter your body weight.';
    document.getElementById('body-weight').focus();
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const [id] of luggageRows) {
    const scaleWeightInput = document.getElementById(`scale-weight-${id}`).value;
    const luggageWeightOutput = document.getElementById(`luggage-weight-${id}`);
    const wiggleRoomOutput = document.getElementById(`wiggle-room-${id}`);

    if (!scaleWeightInput || !bodyWeightInput) {
      clearCell(luggageWeightOutput);
      clearCell(wiggleRoomOutput);
      continue;
    }
    if (scaleWeightInput <= bodyWeightInput) {
      alert(`"Scale Weight" for Luggage ${id} should be more than your body weight.\r\rMake sure you weigh yourself and the luggage at the same time.`);
      clearCell(luggageWeightOutput);
      clearCell(wiggleRoomOutput);
      continue;
    }
    if (!maxWeightInput) {
      clearCell(wiggleRoomOutput);
      continue;
    }
    const luggageWeight = (scaleWeightInput - bodyWeightInput);
    luggageWeightOutput.innerHTML = luggageWeight.toFixed(1) + weightHTML;

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

  weightMessage(totalWiggleRoom, maxWeightInput, overweightCount);
}

function weightMessage(totalWiggleRoom, maxWeightInput, overweightCount) {
  const heavyMessage = document.getElementById('overweight-message');
  const howManyBags = overweightCount > 1 ? 'Some bags are too heavy. ' : 'A bag is too heavy. ';
  if (totalWiggleRoom < 0) {
    const text = Math.abs(totalWiggleRoom).toFixed(1) + weightHTML;
    heavyMessage.innerHTML = `${howManyBags} After accounting for wiggle room, <span class="overweight">you still need to remove ${text}</span>`;
  } else if (totalWiggleRoom >= 0 && overweightCount >= 1) {
    heavyMessage.innerHTML = `${howManyBags} <span class="underweight">However, you have enough wiggle room to rearrange.</span>`;
  } else if ((maxWeightInput) && (totalWiggleRoom <= 0) || (overweightCount === 0)) {
    heavyMessage.innerHTML = '<span class="underweight">All your luggage is under your airline\'s weight limit!</span>';
  }
}

function addLuggage() {
  luggageIDIncrement += 1;
  luggageRows.set(luggageIDIncrement, `Luggage ${luggageIDIncrement}`);
  const id = luggageIDIncrement;

  if ('content' in document.createElement('template')) {
    const tbody = document.getElementById('luggage-list');
    const template = document.getElementById('luggage-row');

    const clone = template.content.cloneNode(true);
    const tr = clone.querySelectorAll('tr');
    const td = clone.querySelectorAll('td');

    tr[0].setAttribute('id', `luggage-${id}`);
    td[0].innerHTML = `<button class="remove-button" type="button" tabindex="-1" onclick="removeLuggage(${id})">–</button>`;
    td[1].innerHTML = `<span class="luggage-description" contenteditable="true" tabindex="-1" placeholder="Luggage ${id}">Luggage ${id}</span>`;
    td[2].innerHTML = `<input type="number" id="scale-weight-${id}" class="weight-input" min=""> <span class="weight-unit">lb</span>`;
    td[3].innerHTML = `<td><span id="luggage-weight-${id}"></span></td>`;
    td[4].innerHTML = `<td><span id="wiggle-room-${id}"></span></td>`;

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
}

// eslint-disable-next-line no-unused-vars
function toggleUnits(button) {
  const weightButton = button.innerHTML;
  const unitDisplay = document.getElementsByClassName('weight-unit');
  const weightUnit = (weightButton == 'kg' ? 'kg' : 'lb');
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

const bodyWeightInput = document.getElementById('body-weight');

// function updateValue(e) {
//   const input = document.getElementsByClassName('weight-input');
//   input.setAttribute('min', e.target.value);
//   // console.log('23');
// }

bodyWeightInput.focus();
// bodyWeightInput.addEventListener('change', updateValue);
