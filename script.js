function* rowNums(row) {
	const rows = ['a','b','c','d','e','f','g','h'];
	var index = rows.indexOf(row);
	while (index < 8) {
		yield rows[index];
		index++;
	}
}

function* allBoxes() {
	const boxes = ['a1','a2','a3','a4','b1','b2','b3','b4','c1','c2','c3','c4','d1','d2','d3','d4','e1','e2','e3','e4','f1','f2','f3','f4','g1','g2','g3','g4','h1','h2','h3','h4'];
	for (let i of boxes) {
		yield i;
	}
}


function nextRow() {
	// Takes the first character (index 0) of the id of the first item (.item(0)) with a class name of 'box selected-row'
	var currRow = document.getElementsByClassName('box selected-row').item(0).id.split('')[0];
	var next = window.newRow.next().value;
	console.log(next, currRow);
	for (let i = 1; i <= 4; i++) {
		document.getElementById(`${currRow}${i}`).className = document.getElementById(`${currRow}${i}`).className.replace(/(s.*\b )/,'');
		document.getElementById(`${next}${i}`).className = 'box selected-row';
		document.getElementById(`${currRow}${i}`).className = 'box';
	}
	document.getElementById(`${next}1`).className = 'box selected-row selected';
}

function nextLetter() {
	var currLtr = document.getElementsByClassName('box selected-row selected').item(0).id;

	if (Number(currLtr.split('')[1]) < 4) {
		document.getElementById(`${currLtr.split('')[0]}${Number(currLtr.split('')[1])+1}`).className = 'box selected-row selected';
		document.getElementById(currLtr).className = 'box selected-row';
	}
}

function checkLetters(guess,word) {
	var currRow = document.getElementsByClassName('box selected-row').item(0).id.split('')[0];
	if (guess.toLowerCase() === word.toLowerCase()) {
		document.getElementById('output').innerHTML = `Congratulations! You got it in ${['a','b','c','d','e','f','g','h'].indexOf(currRow) + 1} tries! Click the "New Game" button to play again!`;
		for (let i in guess) {
			document.getElementsByClassName('box selected-row').item(i).style.backgroundColor = "#24c662";
		}
		void (window.canContinue = false);
	} else {
		var curr = document.getElementsByClassName('selected-row');
		for (let i in guess) {
			if (guess[i].toLowerCase() === word[i]) {
				curr.item(i).className += ' green-letter';
			} else if (word.toLowerCase().includes(guess[i].toLowerCase())) {
				curr.item(i).className += ' yellow-letter';
			} else {
				curr.item(i).className += ' red-letter';
			}
			/*if (guess[i].toLowerCase() === word[i].toLowerCase()) {
				document.getElementsByClassName('box selected-row').item(i).style.backgroundColor = "#24c662";
			} else if (word.toLowerCase().includes(guess[i].toLowerCase())) {
				document.getElementsByClassName('box selected-row').item(i).style.backgroundColor = "#c9b63b";
			} else {
				document.getElementsByClassName('box selected-row').item(i).style.backgroundColor = "#bc3441";
			}*/
		}
	}
}

function nextRow() {
	// Takes the first character (index 0) of the id of the first item (.item(0)) with a class name of 'box selected-row'
	var currRow = document.getElementsByClassName('box selected-row').item(0).id.split('')[0];
	var next = window.newRow.next().value;
	console.log(next, currRow);
	for (let i = 1; i <= 4; i++) {
		document.getElementById(`${currRow}${i}`).className = document.getElementById(`${currRow}${i}`).className.replace(/(s.*\b )/,'');
		document.getElementById(`${next}${i}`).className = 'box selected-row';
		document.getElementById(`${currRow}${i}`).className = 'box';
	}
	document.getElementById(`${next}1`).className = 'box selected-row selected';
}

function type(ltr) {
	var currLtr = document.getElementsByClassName('box selected-row selected').item(0);
	if (!currLtr.innerHTML) {
		currLtr.innerHTML = ltr;
	}
	void currLtr.id.split('')[1] !== '4' ? nextLetter() : console.log('\n');
}

function back() {
	var currLtr = document.getElementsByClassName('box selected-row selected').item(0);

	if (Number(currLtr.id.split('')[1]) > 1) {
		if (currLtr.innerHTML) {
			currLtr.innerHTML = '';
		} else {
			currLtr.className = 'box selected-row';
			document.getElementById(currLtr.id.split('')[0] + (Number(currLtr.id.split('')[1]) - 1)).className = 'box selected-row selected';
			document.getElementById(currLtr.id.split('')[0] + (Number(currLtr.id.split('')[1]) - 1)).innerHTML = '';
		}
	}
}

function enter(word){
	var currLtr = document.getElementsByClassName('box selected-row selected').item(0);
	var currRow = currLtr.id.split('')[0];
	if (document.getElementById(`${currRow}1`).innerHTML && document.getElementById(`${currRow}2`).innerHTML && document.getElementById(`${currRow}3`).innerHTML && document.getElementById(`${currRow}4`).innerHTML) {
		var currRow = currLtr.id.split('')[0];
		checkLetters(`${document.getElementById(currRow+1).innerHTML}${document.getElementById(currRow+2).innerHTML}${document.getElementById(currRow+3).innerHTML}${document.getElementById(currRow+4).innerHTML}`,word)
		if (window.canContinue) {
			// nextRow() function
			
		}
	}
}

function clearScreen() {
	const clear = allBoxes();
	var b = clear.next().value;
	document.getElementById(b).innerHTML = '';
	document.getElementById(b).className = 'box selected-row selected';
	for (let i = 1; i < 4; i++) {
		b = clear.next().value;
		document.getElementById(b).innerHTML = '';
		document.getElementById(b).className = 'box selected-row';
	}
	for (let i = 4; i < 32; i++) {
		b = clear.next().value;
		document.getElementById(b).innerHTML = '';
		document.getElementById(b).className = "box";
	}
}

function newGame() {
	clearScreen();
	window.newRow = rowNums('b');
	window.canContinue = true;
	var word = words[Math.floor(Math.random() * words.length)];
	console.log(word);
	
	// Event listeners based on https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
	window.addEventListener('keydown', function(event) {
		if (event.defaultPrevented) {
		return; // Do nothing if event already handled
		}
		var curr = document.getElementsByClassName('box selected-row selected').item(0);
		
		switch(event.code) {
			case 'KeyA':
			case 'KeyB':
			case 'KeyC':
			case 'KeyD':
			case 'KeyE':
			case 'KeyF':
			case 'KeyG':
			case 'KeyH':
			case 'KeyI':
			case 'KeyJ':
			case 'KeyK':
			case 'KeyL':
			case 'KeyM':
			case 'KeyN':
			case 'KeyO':
			case 'KeyP':
			case 'KeyQ':
			case 'KeyR':
			case 'KeyS':
			case 'KeyT':
			case 'KeyU':
			case 'KeyV':
			case 'KeyW':
			case 'KeyX':
			case 'KeyY':
			case 'KeyZ':
				type(`${event.key}`);
				break;
			case 'Backspace':
				back();
				break;
			case 'ArrowDown':
			case 'Enter':
				enter(word);
				break;
			case 'ArrowLeft':
				if (Number(curr.id.split('')[1]) > 1) {
					curr.className = 'box selected-row';
					document.getElementById(curr.id.split('')[0] + (Number(curr.id.split('')[1]) - 1)).className = 'box selected-row selected';
				}
				break;
			case 'ArrowRight':
				if (Number(curr.id.split('')[1]) < 4) {
					curr.className = 'box selected-row';
					document.getElementById(curr.id.split('')[0] + (Number(curr.id.split('')[1]) + 1)).className = 'box selected-row selected';
				}
				break;
			case 'Escape':
				break;
		}

		event.preventDefault();
	}, true);
}


newGame();

// set up keyboard that will show colors that have been provided
// set up check if guess is a word
// fix new game button