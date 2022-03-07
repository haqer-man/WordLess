function* rowNums(row) { // each time function is called, returns next value from loop until finished
	const rows = ['a','b','c','d','e','f','g','h'];
	var index = rows.indexOf(row);
	while (index < 8) {
		yield rows[index];
		index++;
	}
}

function* allBoxes() { // each time function is called, returns next value from loop until finished
	const boxes = ['a1','a2','a3','a4','b1','b2','b3','b4','c1','c2','c3','c4','d1','d2','d3','d4','e1','e2','e3','e4','f1','f2','f3','f4','g1','g2','g3','g4','h1','h2','h3','h4'];
	for (let i of boxes) {
		yield i;
	}
}

function* allKeys() { // each time function is called, returns next value from loop until finished
	const keys = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	for (let i of keys) {
		yield i;
	}
}

function nextLetter() {
	var currLtr = document.getElementsByClassName('box selected-row selected').item(0).id;

	if (Number(currLtr.split('')[1]) < 4) { // if not already at end of row, moves one square to the rights
		document.getElementById(`${currLtr.split('')[0]}${Number(currLtr.split('')[1])+1}`).className = 'box selected-row selected';
		document.getElementById(currLtr).className = 'box selected-row';
	}
}

function checkLetters(word,guess) {
	if (!words.includes(guess.toLowerCase())) { // if guess is not a word (in wordlist), play 'not a word' animation
		var selected = document.getElementsByClassName('box selected-row selected').item(0).id;
		for (let i = 3; i >= 0; i--) {
			document.getElementsByClassName('box selected-row').item(i).className = 'box selected-row blink';
		}
		document.getElementById(selected).className = 'box selected-row selected blink'; // 'blink' is animation styling classname for 'not a word' cases
		setTimeout(function () {
			var selected = document.getElementsByClassName('box selected-row selected').item(0).id;
			for (let i = 3; i >= 0; i--) {
				document.getElementsByClassName('box selected-row').item(i).className = 'box selected-row';
			}
			document.getElementById(selected).className = 'box selected-row selected';
		}, 1000);
		return null;
	}
	var currRow = document.getElementsByClassName('box selected-row').item(0).id.split('')[0];
	if (guess.toLowerCase() === word) {
		// confetti settings from canvas-confetti npm-js page
		confetti({ // if guess is correct, play confetti animation
			disableForReducedMotion: true,
			particleCount: 100,
			startVelocity: 30,
			spread: 360,
			origin: {
				x: Math.random(),
				// since they fall down, start a bit higher than random
				y: Math.random() - 0.2
			}
		});
		localStorage.games_played = localStorage.getItem('games_played') ? Number(localStorage.games_played)+1 : "1"; // add one to the value of 'games_played' in local storage if it already exists, otherwise, set it equal to 1
		localStorage.solved = localStorage.getItem('solved') ? Number(localStorage.solved)+1 : '1'; // Add 1 to the value of 'solved' in local storage if it already exists, otherwise, set it to 1
		var tries = ['a','b','c','d','e','f','g','h'].indexOf(currRow) + 1; // number of tries is the position in the alphabet of the row letter
		localStorage.setItem(`solved_in_${tries}`, localStorage.getItem(`solved_in_${tries}`) ? Number(localStorage.getItem(`solved_in_${tries}`))+1 : '1'); // add one to the value of 'solved_in_<tries>' in local storage if it already exists, otherwise, set it to 1
		Number(tries) === 1 ? document.getElementById('output').innerHTML = `Congratulations! You got it in 1 try! Click the <b>"New Game"</b> button to play again!` : document.getElementById('output').innerHTML = `Congratulations! You got it in ${tries} tries! Click the <b>"New Game"</b> button to play again!`; // if solved in single try, use singular form of 'try' in output message, otherwise, use plural form ('tries')
		for (let i = 3; i >= 0; i--) {
			document.getElementsByClassName('box selected-row').item(i).className = 'box green-letter'; // set all letters in row green
			document.getElementById(guess[i]).className = 'key green-letter'; // set all keys for correct letters green
		}
		showProgress();
		window.scrollTo(0,document.body.scrollHeight); // scroll to bottom of page/document
	} else if (guess.toLowerCase() !== word && currRow === 'h') { // if on last row and guess is incorrect...
		document.getElementById('output').innerHTML = `Sorry! The word was <b>${word}</b>. Press the <b>"New Game"</b> button to play again!`;
		for (let i = 3; i >= 0; i--) {
			if (guess[i] === word[i]) {
				document.getElementById(`h${i+1}`).className = 'box green-letter'; // if letter is correct, make it green
				document.getElementById(guess[i]).className = 'key green-letter'; // also make corresponding key on virtual keyboard green
			} else if (word.includes(guess[i])) {
				document.getElementById(`h${i+1}`).className = 'box yellow-letter'; // if letter is in wrong position, make it yellow
				document.getElementById(guess[i]).className = 'key yellow-letter'; // also make corresponding key on virtual keyboard yellow
			} else {
				document.getElementById(`h${i+1}`).className = 'box red-letter'; // if letter is not part of target word, make it red
				document.getElementById(guess[i]).className = 'key red-letter'; // also make corresponding key on virtual keyboard red
			}
		}
		localStorage.not_solved = localStorage.not_solved ? Number(localStorage.getItem('not_solved'))+1 : '1'; // add one to value of 'not_solved' in local storage if it already exists, otherwise, set it to 1
		localStorage.games_played = localStorage.getItem('games_played') ? Number(localStorage.games_played)+1 : "1"; // add one to value of 'games_played' in local storage if it already exists, otherwise, set it to 1
		window.scrollTo(0,document.body.scrollHeight); // scroll to bottom of page/document
	} else {
		var curr = document.getElementsByClassName('selected-row');
		for (let i = 3; i >= 0; i--) {
			if (guess[i] === word[i]) {
				curr.item(i).className = 'box green-letter'; // if letter is correct, make it green
				document.getElementById(guess[i]).className = 'key green-letter'; // also make corresponding key on virtual keyboard green
			} else if (word.includes(guess[i])) {
				curr.item(i).className = 'box yellow-letter'; // if letter is in wrong position, make it yellow
				document.getElementById(guess[i]).className = 'key yellow-letter'; // also make corresponding key on virtual keyboard yellow
			} else {
				curr.item(i).className = 'box red-letter'; // if letter is not part of target word, make it red
				document.getElementById(guess[i]).className = 'key red-letter'; // also make corresponding key on virtual keyboard red
			}
		}
		
		var next = window.newRow.next().value; // <next> is the next value of newRow function
		document.getElementById(next + 1).className = 'box selected-row selected'; // select first box of next row 
		for (let i = 2; i <= 4; i++) {
			document.getElementById(`${next}${i}`).className = 'box selected-row'; // move to next row
		}
		if (['a','b','c','d','e','f','g','j'].indexOf(curr.item(0).id[0]) > 3) {
			window.scrollBy(0,1.25 * document.getElementById('a1').scrollHeight);
		}
	}
}

function type(ltr) {
	var currLtr = document.getElementsByClassName('box selected-row selected').item(0);
	if (currLtr === null) {
		return null; // if no square selected, do nothing
	} else {
		if (!currLtr.innerHTML) {
			currLtr.innerHTML = ltr; // if current square is empty, set its contents to ltr
		}
		return void currLtr.id.split('')[1] !== '4' ? nextLetter() : null; // if not at end of row, move right one space
	}
}

function back() {
	var currLtr = document.getElementsByClassName('box selected-row selected').item(0);

	if (Number(currLtr.id.split('')[1]) > 1) { // if not already at farthest box to the left, clear current box and move one space to the left
		if (currLtr.innerHTML) {
			currLtr.innerHTML = '';
		} else {
			currLtr.className = 'box selected-row';
			document.getElementById(currLtr.id.split('')[0] + (Number(currLtr.id.split('')[1]) - 1)).className = 'box selected-row selected';
			document.getElementById(currLtr.id.split('')[0] + (Number(currLtr.id.split('')[1]) - 1)).innerHTML = '';
		}
	} else {
		currLtr.innerHTML = '';
	}
}

function enter(word){
	var currLtr = document.getElementsByClassName('box selected-row selected').item(0); // first result of all elements with classname 'box selected-row selected' (returns <list>)
	if (currLtr !== null) { // if a box is selected
		var currRow = currLtr.id.split('')[0];
		if (document.getElementById(`${currRow}1`).innerHTML && document.getElementById(`${currRow}2`).innerHTML && document.getElementById(`${currRow}3`).innerHTML && document.getElementById(`${currRow}4`).innerHTML) { // if all boxes in row filled
			var currRow = currLtr.id.split('')[0];
			var guess = '';
			for (let i = 1; i < 5; i++) {
				guess += document.getElementById(currRow+i).innerHTML // concatenate all boxes in row to form user's guess
			}
			checkLetters(word,guess);
		}
	}
}

function clearScreen() {
	const clearBoxes = allBoxes(); // initialize generator allBoxes() as clearBoxes
	const clearKeys = allKeys(); // initialize generator allKeys() as clearKeys
	var b = clearBoxes.next().value; // set b to the next value of clearBoxes
	document.getElementById(b).innerHTML = '';
	document.getElementById(b).className = 'box selected-row selected';
	for (let i = 1; i < 4; i++) {
		b = clearBoxes.next().value; // set b to the next value of clearBoxes
		document.getElementById(b).innerHTML = '';
		document.getElementById(b).className = 'box selected-row';
	}
	for (let i = 4; i < 32; i++) {
		b = clearBoxes.next().value; // set b to the next value of clearBoxes
		document.getElementById(b).innerHTML = '';
		document.getElementById(b).className = "box";
	}
	for (let i = 0; i < 26; i++) {
		document.getElementById(clearKeys.next().value).className = 'key'; // Set the classname of the document with an id of the next value of the clearKeys function to 'keyboard'
	}
	document.getElementById('output').innerHTML = '';
}

function showProgress() {
	document.getElementById('total').innerHTML = localStorage.getItem('solved') ? localStorage.solved : '0'; // if 'solved' exists in local storage, display it, otherwise, display 0
	for (let i = 1; i < 9; i++) {
		document.getElementById(''+i).innerHTML = localStorage.getItem(`solved_in_${i}`) ? localStorage.getItem(`solved_in_${i}`) : '0'; // if 'solved_in_<i>' exists in local storage, display it in the corresponding row of player stats
	}
	document.getElementById('not').innerHTML = localStorage.getItem('not_solved') ? localStorage.not_solved : '0'; // if 'not_solved' exists in local storage, display it, otherwise, display 0
	document.getElementById('games').innerHTML = localStorage.getItem('games_played') ? localStorage.games_played : '0'; // if 'game' exists in local storage (used to store number of games played), display it, otherwise, display 0
}

function newGame() {
	showProgress();
	window.scrollTo(0,0); // Scroll to top of window
	clearScreen();
	window.newRow = rowNums('b');
	window.word = words[Math.floor(Math.random() * words.length)]; // Select a random word from wordlist as target word
	
	// Event listeners based on https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
	window.addEventListener('keydown', function(event) {
		if (event.defaultPrevented) {
		return; // Do nothing if event already handled
		}
		var curr = document.getElementsByClassName('box selected-row selected').item(0);
		
		switch(event.keyCode) { // equivalent of "if (event.keyCode === <case 1>) { do something } else if (event.keyCode === <case 2>) { do something } else if (event.keyCode === <case 3>) { do something } else if..."
			case 65:
				type('a');
				break;
			case 66:
				type('b');
				break;
			case 67:
				type('c');
				break;
			case 68:
				type('d');
				break;
			case 69:
				type('e');
				break;
			case 70:
				type('f');
				break;
			case 71:
				type('g');
				break;
			case 72:
				type('h');
				break;
			case 73:
				type('i');
				break;
			case 74:
				type('j');
				break;
			case 75:
				type('k');
				break;
			case 76:
				type('l');
				break;
			case 77:
				type('m');
				break;
			case 78:
				type('n');
				break;
			case 79:
				type('o');
				break;
			case 80:
				type('p');
				break;
			case 81:
				type('q');
				break;
			case 82:
				type('r');
				break;
			case 83:
				type('s');
				break;
			case 84:
				type('t');
				break;
			case 85:
				type('u');
				break;
			case 86:
				type('v');
				break;
			case 87:
				type('w');
				break;
			case 88:
				type('x');
				break;
			case 89:
				type('y');
				break;
			case 90:
				type('z');
				break;
			case 8:
				back();
				break;
			case 40:
			case 13:
				enter(window.word);
				break;
			case 37:
				if (Number(curr.id.split('')[1]) > 1) { // if not already at farthest left space in row, move left one space
					curr.className = 'box selected-row';
					document.getElementById(curr.id.split('')[0] + (Number(curr.id.split('')[1]) - 1)).className = 'box selected-row selected';
				}
				break; // break out of event listener so no other event cases run
			case 39:
				if (Number(curr.id.split('')[1]) < 4) { // if not already at farthest right space in row, move right one space
					curr.className = 'box selected-row';
					document.getElementById(curr.id.split('')[0] + (Number(curr.id.split('')[1]) + 1)).className = 'box selected-row selected';
				}
				break; // break out of event listener so no other event cases run
		}

		event.preventDefault(); // prevent default key functions from running
	}, true);
}


newGame();


// Future Updates:
// fix centering issue
// add mobile compatibility
// 