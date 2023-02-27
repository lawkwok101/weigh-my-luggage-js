const luggageRows = new Map([ [1,'Luggage 1'] ]);
let luggageIDIncrement = 1;

function calculateWeights() {
	const bodyWeightInput = document.getElementById('bodyWeight').value;
	const weightHTML = ' <span class="weightUnit">lb</span>';
	let totalWiggleRoom = 0;

	if (!bodyWeightInput) {
		alert('Please enter your body weight.')
	};
	
	for (let [id, value] of luggageRows) {
		let scaleWeightInput = document.getElementById('scaleWeight-'+id).value;
		let luggageWeightOutput = document.getElementById('luggageWeight-'+id)
		let wiggleRoomOutput = document.getElementById('wiggleRoom-'+id);

		if (!scaleWeightInput || !bodyWeightInput ) {
			clearCell(luggageWeightOutput);
			clearCell(wiggleRoomOutput);
			continue;
		}
		if (scaleWeightInput <= bodyWeightInput) {
			alert('"Scale Weight" for Luggage '+ id +' should be more than your body weight.\r\rMake sure you weigh yourself and the luggage at the same time.');
			clearCell(luggageWeightOutput);
			clearCell(wiggleRoomOutput);
			continue;
		}

		let luggageWeight = (scaleWeightInput - bodyWeightInput);
		luggageWeightOutput.innerHTML = luggageWeight.toFixed(1) + weightHTML;

		let maxWeightInput = document.getElementById('maxWeight').value;
		if (!maxWeightInput) {
			clearCell(wiggleRoomOutput);
			continue;
		} 
		let wiggleRoom = (maxWeightInput - luggageWeight);
		if (wiggleRoom >= 0) {
			let text = wiggleRoom.toFixed(1) + weightHTML;
			wiggleRoomOutput.innerHTML = '<span style="color:#50C878">'+text+'<span>';
		} else {
			let text = Math.abs(wiggleRoom.toFixed(1)) + weightHTML;
			wiggleRoomOutput.innerHTML = '<span style="color:#EE4B2B">+ '+text+' too heavy.</span>';
		}
		totalWiggleRoom += wiggleRoom;
	}

	let heavyMessage = document.getElementById('heavyMessage');
	if (totalWiggleRoom < 0) {
		text = Math.abs(totalWiggleRoom).toFixed(1) + weightHTML;
		heavyMessage.innerHTML = '<p>Something\'s too heavy. After substracting wiggle room, you still need to remove '+text+'.</p>';
	} else {
		clearCell(heavyMessage);
	}
}

function addLuggage() {
	luggageIDIncrement += 1;
	luggageRows.set(luggageIDIncrement, 'Luggage '+luggageIDIncrement);
	const id = luggageIDIncrement;

	if ('content' in document.createElement('template')) {
    	const tbody = document.querySelector('#luggageList');
    	const template = document.querySelector('#luggageRow');

    	const clone = template.content.cloneNode(true);
    	let tr = clone.querySelectorAll('tr');
		let td = clone.querySelectorAll('td');
		
		tr[0].setAttribute('id','luggage-'+id);
		td[0].innerHTML = '<button type="button" tabindex="-1" onclick="removeLuggage('+id+')">– </button> &nbsp; Luggage ' + id;
		td[1].innerHTML = '<input type="number" id="scaleWeight-'+id+'" class="weightInput"> <span class="weightUnit">lb</span>';
		td[2].innerHTML = '<td><span id="luggageWeight-'+id+'"></span></td>';
		td[3].innerHTML = '<td><span id="wiggleRoom-'+id+'"></span></td>';

    	tbody.appendChild(clone);
	} else {
	  	// Find another way to add the rows to the table because
	  	// the HTML template element is not supported.

		// const allLuggage = document.getElementById('luggageList');
		// let html = '<tr>';
		// html += '<td>Luggage 2</td></tr>';
		// allLuggage.insertAdjacentHTML('beforeend', html);
	}
	calculateWeights();
}

function removeLuggage(id) {
	document.getElementById('luggage-'+id).remove();
	let i = luggageRows.delete(id);
	calculateWeights();
}

function clearCell(element) { element.innerHTML = ''; }

function toggleUnits(button) {
	let weightButton = button.innerHTML;
	let unitDisplay = document.getElementsByClassName('weightUnit');
	weightUnit = (weightButton == 'kg' ? 'kg' : 'lb');
	for (let i of unitDisplay) {
		i.innerHTML = weightUnit;
	}
}

function toggleInstructions(button){
	let instructions = document.getElementById("instructions");
	instructions.style.display = instructions.style.display === 'none' ? '' : 'none';
	button.textContent = button.textContent === 'Show instructions...' ? 'Hide instructions...' : 'Show instructions...';
}

document.getElementById("bodyWeight").focus();