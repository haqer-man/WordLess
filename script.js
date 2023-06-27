// event listener function
function handleKeyDown(event) {
	if (event.defaultPrevented) {
		return; // Do nothing if event already handled
	}

	console.log(event.key);

	if ( ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'].includes(event.key.toLowerCase()) ) {
		game.screen.board.type(event.key); // if user typed a letter, pass the letter to the game.
	} else if ( ['Backspace','ArrowDown','Enter','ArrowLeft','ArrowRight'].includes(event.code) ) {
		switch(event.code) {  // equivalent of "if (event.key === <case 1>) { do something } else if (event.key === <case 2>) { do something } else if (event.key === <case 3>) { do something } else if..."
			case 'Backspace':
				game.backspace(); break;
			case "ArrowDown":
			case "Enter":
				game.enter(); break;
			case "ArrowLeft":
				game.screen.board.moveLeft(); break;
			case "ArrowRight":
				game.screen.board.moveRight(); break; // break out of event listener so no other event cases run
		}
		event.preventDefault(); // prevent default key functions from running
	}
}

class Screen {

	// properties and methods for the board
	board = {
		// used to move down rows of the board
		_rowLetters: [ 'a','b','c','d','e','f','g','h' ],

		// used to cycle through all boxes on the board
		_tileIds: [ 'a1','a2','a3','a4','b1','b2','b3','b4','c1','c2','c3','c4','d1','d2','d3','d4','e1','e2','e3','e4','f1','f2','f3','f4','g1','g2','g3','g4','h1','h2','h3','h4' ],

		*rowGen() { // each time function is called, returns next value from loop until finished and current status of completion
			for ( let r = 1 ; r < 8 ; r++ ) {
				yield this._rowLetters[ r ]; // returns { value: this.rows[ index ], done: True/False }
			}
		},

		get currRow() {
			let currentRow = document.getElementsByClassName('selected-row'); // returns an automatically updating list of HTMLElements with the 'selected-row' class
			return currentRow;
		},

		*boxGen( ...args ) { // each time function is called, returns next value from loop until finished ( status: Done ) OR gives id of next box in row
			if ( args.length === 0 ) {
				for ( let b of this._tileIds ) {
					yield b; // returns { value: b, done: True/False }
				}
			} else {
				yield this._tileIds[ this._tileIds.indexOf( args[0] ) + 1 ]; // returns { value: * next value in _tileIds *, done: True/False }
			}
		},

		get currLtr() {
			return document.getElementsByClassName('selected').item(0); // returns the first HTMLElement with the 'selected' class
		},

		clearBoxById( id ) {
			document.getElementById( id ).innerHTML = '';
		},

		get guess() {
			let s = '';
			for ( let i = 0 ; i < 4 ; i++ ) {
				s += this.currRow.item(i).innerHTML.toLowerCase();
			}
			return s;
		},

		type( ltr ) {
			if ( this.currLtr === null ) {
				return null; // if no square selected, do nothing
			} else {
				if ( !this.currLtr.innerHTML ) {
					this.currLtr.innerHTML = ltr; // if current square is empty, set its contents to ltr
				}
				return void this.currLtr.id[1] !== '4' ? this.moveRight() : null; // if not at end of row, move right one space
			}
		},

		moveLeft() {
			let curr = this.currLtr;
			if ( Number( curr.id[1] ) > 1 ) { // if not already at farthest left space in row, move left one space
				curr.classList.toggle('selected');
				document.getElementById( curr.id[0] + ( Number( curr.id[1] ) - 1 ) ).classList.toggle('selected');
			}
		},

		moveRight() {
			let curr = this.currLtr;
			if ( Number( curr.id[1] ) < 4 ) { // if not alreayd at farthest right space in row, move right one space
				curr.classList.toggle('selected');
				document.getElementById( curr.id[0] + ( Number( curr.id[1] ) + 1 ) ).classList.toggle('selected');
			}
		}
	};

	// properties and methods for the keyboard
	keyboard = {
		// used to cycle through all _keyIds in virtual keybaord
		_keyIds: [ 'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z' ],

		*keyGen() {
			for ( let i of this._keyIds ) { // each time function is called, returns next letter in the alphabet until 'z'
				yield i;
			}
		},
	};

	colorLetterById( id , color ) { // function to color tiles and _keyIds
		// if *color* is not already set, add *color* to the list of classes on element with id *id*. Otherwise, remove *color* from the element's classes
		let e = document.getElementById( id ).classList;
		e.add( color );
		e.remove('selected-row');
		e.remove('selected');
	}

	clear() { // resets the board by clearing all boxes' classes, then setting first row's boxes to correct starting classes

		const boxes = this.board.boxGen(); // initialize generator boxGen() as boxes
		const keys = this.keyboard.keyGen(); // initialize generator keyGen() as keys
		let b = boxes.next().value; // set b to the next value of boxes

		for ( let i = 0 ; i < 58 ; i++ ) {
			if ( i === 0 ) {
				this.board.clearBoxById( b );
				document.getElementById( b ).className = 'box selected-row selected';
				b = boxes.next().value; // set b to the next value of boxes
			} else if ( i < 4 ) {
				this.board.clearBoxById( b );
				document.getElementById( b ).className = 'box selected-row';
				b = boxes.next().value; // set b to the next value of boxes
			} else if ( i < 32 ) {
				this.board.clearBoxById( b );
				document.getElementById( b ).className = 'box';
				b = boxes.next().value; // set b to the next value of boxes
			} else {
				// Set the classname of the element with an id of the next value of the _keyIds instance of keyGen to 'key'
				document.getElementById(keys.next().value).className = 'key';
			}
		}
		this.board.clearBoxById('output');
	}

	showProgress() {
		document.getElementById('total').innerHTML = Number( localStorage.getItem('solved') ); // show value of 'solved' in local storage
		for ( let i = 1 ; i < 9 ; i++ ) {
			document.getElementById(''+i).innerHTML = Number( localStorage.getItem(`solved_in_${i}`) ); // show value of 'solved_in_<i>' from local storage
		}
		document.getElementById('not').innerHTML = Number( localStorage.getItem('not_solved') ); // show value of 'not_solved' from local storage
		document.getElementById('games').innerHTML = Number( localStorage.getItem('games_played') ); // show value of 'games_played' from local storage
	}
}

class Game {
	constructor( ) {
		// words from https://www.litscape.com/words/length/4_letters/4_letter_words.html
		let words = ['abet', 'able', 'ably', 'abut', 'aced', 'aces', 'ache', 'achy', 'acid', 'acme', 'acne', 'acre', 'acts', 'acyl', 'adds', 'adze',
	'afar', 'afro', 'agar', 'aged', 'ages', 'agin', 'agog', 'ague', 'ahas', 'ahem', 'ahoy', 'aide', 'aids', 'ails', 'aims', 'airs', 'airy',
	'ajar', 'akin', 'alas', 'albs', 'ales', 'alga', 'ally', 'alms', 'aloe', 'alps', 'also', 'alto', 'alum', 'amen', 'amid', 'amok', 'amps', 'amyl',
	'anal', 'ands', 'anew', 'anon', 'ante', 'ants', 'anus', 'aped', 'aper', 'apes', 'apex', 'apps', 'aqua', 'arch', 'arcs', 'area', 'ares', 'aria',
	'arid', 'aril', 'arks', 'arms', 'army', 'arts', 'arty', 'aryl', 'ashy', 'asks', 'asps', 'atom', 'atop', 'aunt', 'aura', 'auto', 'aver', 'avid',
	'avow', 'away', 'awed', 'awes', 'awls', 'awns', 'awol', 'awry', 'axed', 'axel', 'axes', 'axis', 'axle', 'axon', 'ayes', 'baas', 'babe', 'baby',
	'back', 'bade', 'bags', 'baht', 'bail', 'bait', 'bake', 'bald', 'bale', 'balk', 'ball', 'balm', 'band', 'bane', 'bang', 'bank', 'bans', 'barb',
	'bard', 'bare', 'barf', 'bark', 'barn', 'bars', 'base', 'bash', 'bask', 'bass', 'bath', 'bats', 'baud', 'bawd', 'bawl', 'bays', 'bead', 'beak',
	'beam', 'bean', 'bear', 'beat', 'beau', 'beds', 'beef', 'been', 'beep', 'beer', 'bees', 'beet', 'begs', 'bell', 'belt', 'bend', 'bene', 'bent',
	'berm', 'best', 'beta', 'bets', 'bevy', 'bias', 'bibs', 'bide', 'bids', 'bike', 'bile', 'bilk', 'bill', 'bind', 'bins', 'bios', 'bird', 'birr',
	'bite', 'bits', 'bitt', 'blab', 'blah', 'bleb', 'bled', 'blew', 'blip', 'blob', 'bloc', 'blog', 'blot', 'blow', 'blue', 'blur', 'boar', 'boas',
	'boat', 'bobs', 'bode', 'body', 'bogs', 'boil', 'bold', 'bole', 'boll', 'bolt', 'bomb', 'bond', 'bone', 'bonk', 'bony', 'book', 'boom', 'boon',
	'boor', 'boos', 'boot', 'bops', 'bore', 'born', 'boss', 'both', 'bots', 'bout', 'bowl', 'bows', 'boxy', 'boys', 'brad', 'brag', 'bran', 'bras',
	'brat', 'bray', 'bred', 'brew', 'brie', 'brim', 'bris', 'brow', 'bubo', 'buck', 'buds', 'buff', 'bugs', 'bulb', 'bulk', 'bull', 'bump', 'bums',
	'bunk', 'buns', 'bunt', 'buoy', 'burl', 'burn', 'burp', 'burr', 'burs', 'bury', 'bush', 'busk', 'bust', 'busy', 'buts', 'butt', 'buys', 'buzz',
	'byes', 'byte', 'cabs', 'cads', 'cafe', 'cage', 'cake', 'calf', 'call', 'calm', 'calx', 'came', 'camp', 'cams', 'cane', 'cans', 'cant', 'cape',
	'caps', 'card', 'care', 'carp', 'cars', 'cart', 'case', 'cash', 'cask', 'cast', 'cats', 'cave', 'caws', 'ceca', 'cede', 'cell', 'celt', 'cent',
	'chad', 'chap', 'char', 'chat', 'chef', 'chew', 'chic', 'chin', 'chip', 'chis', 'chop', 'chow', 'chub', 'chug', 'chum', 'cite', 'city', 'clad',
	'clan', 'clap', 'claw', 'clay', 'clef', 'clip', 'clod', 'clog', 'clop', 'clot', 'cloy', 'club', 'clue', 'coal', 'coat', 'coax', 'cobs', 'cock', 'coda',
	'code', 'cods', 'coed', 'cogs', 'coho', 'coif', 'coil', 'coin', 'cola', 'cold', 'colt', 'coma', 'comb', 'come', 'cone', 'conk', 'cons', 'cook',
	'cool', 'coop', 'coos', 'coot', 'cope', 'cops', 'copy', 'cord', 'core', 'cork', 'corm', 'corn', 'cost', 'cosy', 'cots', 'coup', 'cove', 'cowl',
	'cows', 'cozy', 'crab', 'crag', 'cram', 'crap', 'crew', 'crib', 'crop', 'crow', 'crud', 'crux', 'cube', 'cubs', 'cuds', 'cued', 'cues', 'cuff',
	'cull', 'culm', 'cult', 'cups', 'curb', 'curd', 'cure', 'curl', 'curs', 'curt', 'cusp', 'cuss', 'cute', 'cuts', 'cyan', 'cyme', 'cyst', 'czar',
	'dabs', 'dado', 'dads', 'daft', 'dame', 'damn', 'damp', 'dams', 'dang', 'dank', 'dare', 'dark', 'darn', 'dart', 'dash', 'data', 'date', 'daub', 'dawn',
	'days', 'daze', 'dead', 'deaf', 'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer', 'dees', 'deet', 'deft', 'defy', 'deil',
	'dele', 'delf', 'deli', 'dell', 'deme', 'demo', 'demy', 'dene', 'dens', 'dent', 'deny', 'dere', 'derm', 'desk', 'deva', 'dews', 'dewy', 'deys',
	'dhow', 'dial', 'dibs', 'dice', 'died', 'dies', 'diet', 'digs', 'dill', 'dime', 'dims', 'dine', 'ding', 'dins', 'dint', 'dips', 'dire', 'dirt',
	'disc', 'dish', 'disk', 'ditz', 'diva', 'dive', 'dock', 'dodo', 'doer', 'does', 'doff', 'doge', 'dogs', 'dojo', 'dole', 'doll', 'dolt', 'dome',
	'done', 'dong', 'dons', 'doom', 'door', 'dope', 'dork', 'dorm', 'dorr', 'dors', 'dose', 'dote', 'doth', 'dots', 'doty', 'dove', 'down', 'doxx', 'doxy',
	'doze', 'dozy', 'drab', 'drag', 'dram', 'draw', 'dray', 'dreg', 'drew', 'drey', 'drib', 'drip', 'drop', 'drub', 'drug', 'drum', 'dual', 'dubs',
	'duck', 'duct', 'dude', 'duds', 'duel', 'dues', 'duet', 'duff', 'duke', 'dull', 'duly', 'dumb', 'dump', 'dune', 'dung', 'dunk', 'duos', 'dupe',
	'dusk', 'dust', 'duty', 'dyad', 'dyed', 'dyer', 'dyes', 'dyne', 'dzos', 'each', 'earl', 'earn', 'ears', 'ease', 'east', 'easy', 'eats', 'eave',
	'ebbs', 'echo', 'ecru', 'eddy', 'edge', 'edgy', 'edit', 'eeks', 'eels', 'eely', 'eery', 'effs', 'eggs', 'eggy', 'egos', 'eked', 'eker', 'ekes',
	'elix', 'elks', 'ells', 'elms', 'else', 'emir', 'emit', 'emus', 'ends', 'envy', 'eons', 'epic', 'eras', 'ergo', 'ergs', 'eros', 'etas', 'etch',
	'euro', 'even', 'ever', 'eves', 'evil', 'ewer', 'ewes', 'exam', 'exes', 'exit', 'exon', 'expo', 'eyed', 'eyes', 'face', 'fact', 'fade', 'fads',
	'fail', 'fain', 'fair', 'fake', 'fall', 'fame', 'fang', 'fans', 'fare', 'farm', 'fast', 'fate', 'fats', 'faun', 'faux', 'fave', 'fawn', 'faze',
	'fear', 'feat', 'feds', 'feed', 'feel', 'fees', 'feet', 'fell', 'felt', 'fend', 'fens', 'fern', 'feta', 'feud', 'fibs', 'figs', 'file', 'fill',
	'film', 'find', 'fine', 'fink', 'fins', 'fire', 'firm', 'firs', 'fish', 'fist', 'fits', 'five', 'fizz', 'flab', 'flag', 'flan', 'flap', 'flat',
	'flaw', 'flax', 'flay', 'flea', 'fled', 'flee', 'flew', 'flex', 'flip', 'flit', 'floe', 'flog', 'flop', 'flow', 'flox', 'flub', 'flue', 'flux',
	'foal', 'foam', 'fobs', 'foci', 'foes', 'fogs', 'fogy', 'fohs', 'foil', 'fold', 'folk', 'fond', 'font', 'food', 'fool', 'foot', 'fops', 'fora',
	'forb', 'fore', 'fork', 'form', 'fort', 'foul', 'four', 'fowl', 'foxy', 'fozy', 'fray', 'free', 'fret', 'friz', 'frog', 'from', 'fuel', 'fuff',
	'fuki', 'full', 'fume', 'fumy', 'fund', 'funk', 'furl', 'furs', 'fury', 'fuse', 'fuss', 'fuze', 'fuzz', 'gabs', 'gaff', 'gaga', 'gage', 'gags',
	'gain', 'gait', 'gala', 'gale', 'gall', 'gals', 'game', 'gang', 'gaol', 'gape', 'gaps', 'garb', 'gash', 'gasp', 'gate', 'gave', 'gawk', 'gawp',
	'gaze', 'gear', 'geek', 'gees', 'geld', 'gell', 'gels', 'gems', 'gene', 'gent', 'germ', 'gets', 'gift', 'gigs', 'gild', 'gill', 'gilt', 'gimp',
	'gins', 'gird', 'girl', 'girn', 'gist', 'give', 'glad', 'glee', 'glen', 'glia', 'glib', 'glob', 'glow', 'glue', 'glug', 'glum', 'glut', 'gnar',
	'gnat', 'gnaw', 'gnus', 'goad', 'goal', 'goat', 'gobs', 'goby', 'gods', 'goer', 'goes', 'goji', 'gold', 'golf', 'gone', 'gong', 'good', 'goof',
	'goon', 'goop', 'goos', 'gore', 'gory', 'gosh', 'goth', 'gout', 'gown', 'grab', 'gram', 'gray', 'grew', 'grey', 'grid', 'grim', 'grin', 'grip',
	'grit', 'grow', 'grub', 'guck', 'guff', 'gulf', 'gull', 'gulp', 'gums', 'gunk', 'guns', 'guru', 'gush', 'gust', 'guts', 'guys', 'gyms', 'gyne',
	'gyps', 'gyre', 'gyro', 'hack', 'hags', 'hail', 'hair', 'half', 'hall', 'halo', 'halt', 'hams', 'hand', 'hang', 'haps', 'hard', 'hare', 'hark',
	'harm', 'harp', 'hash', 'hasp', 'hate', 'hath', 'hats', 'haul', 'have', 'hawk', 'haws', 'hays', 'haze', 'hazy', 'head', 'heal', 'heap', 'hear',
	'heat', 'heck', 'heed', 'heel', 'heft', 'heir', 'held', 'hell', 'helm', 'help', 'heme', 'hems', 'hens', 'herb', 'herd', 'here', 'hero', 'hers', 'heth',
	'hewn', 'hews', 'hick', 'hics', 'hide', 'high', 'hike', 'hill', 'hilt', 'hind', 'hint', 'hips', 'hire', 'hiss', 'hits', 'hive', 'hoar', 'hoax',
	'hobo', 'hoed', 'hoer', 'hoes', 'hogs', 'hold', 'hole', 'holy', 'home', 'hone', 'honk', 'hood', 'hoof', 'hook', 'hoop', 'hoot', 'hope', 'hops',
	'horn', 'horo', 'hose', 'host', 'hots', 'hour', 'howl', 'hows', 'hubs', 'hued', 'hues', 'huff', 'huge', 'hugs', 'huhs', 'hula', 'hulk', 'hull',
	'hump', 'hums', 'hung', 'hunk', 'hunt', 'hurl', 'hurt', 'hush', 'husk', 'huts', 'hymn', 'hype', 'hypo', 'iamb', 'ibex', 'ibis', 'iced', 'icer',
	'ices', 'icky', 'icon', 'idea', 'ides', 'idle', 'idly', 'idol', 'iffy', 'ilea', 'ilka', 'ilks', 'ills', 'imam', 'imps', 'inch', 'inks', 'inky',
	'inns', 'into', 'ions', 'iota', 'ipad', 'ired', 'ires', 'irid', 'iris', 'irks', 'iron', 'isle', 'isms', 'itch', 'item', 'jabs', 'jack', 'jade',
	'jags', 'jail', 'jali', 'jamb', 'jams', 'jars', 'java', 'jaws', 'jays', 'jazz', 'jean', 'jeep', 'jeer', 'jeli', 'jell', 'jerk', 'jest', 'jets',
	'jibe', 'jigs', 'jilt', 'jink', 'jinx', 'jive', 'jivy', 'jobs', 'jock', 'jogs', 'join', 'joke', 'jolt', 'josh', 'jots', 'jowl', 'joys', 'judo',
	'jugs', 'juke', 'july', 'jump', 'june', 'junk', 'jury', 'just', 'jute', 'juts', 'kale', 'kaon', 'kaph', 'kata', 'kats', 'kava', 'kays', 'keek',
	'keel', 'keen', 'keep', 'kegs', 'kelp', 'keps', 'kept', 'kern', 'keys', 'kick', 'kids', 'kill', 'kiln', 'kilt', 'kina', 'kind', 'kine', 'king',
	'kink', 'kips', 'kiss', 'kite', 'kits', 'kiwi', 'knar', 'knee', 'knew', 'knit', 'knob', 'knot', 'know', 'knur', 'kook', 'kudu', 'kuna', 'kyak',
	'kyat', 'labs', 'lace', 'lack', 'lacy', 'lade', 'lads', 'lady', 'lags', 'laid', 'lain', 'lair', 'lake', 'lamb', 'lame', 'lamp', 'land', 'lane',
	'lank', 'laps', 'lard', 'lari', 'lark', 'lash', 'lass', 'last', 'late', 'laud', 'lava', 'lave', 'lawn', 'laws', 'lays', 'laze', 'lazy', 'lead',
	'leaf', 'leak', 'lean', 'leap', 'lear', 'leas', 'lede', 'leek', 'leer', 'lees', 'left', 'legs', 'leks', 'lend', 'lens', 'lent', 'lept', 'less',
	'lest', 'lets', 'leus', 'levs', 'levy', 'lewd', 'liar', 'lice', 'lick', 'lids', 'lied', 'lien', 'lier', 'lies', 'lieu', 'life', 'lift', 'like',
	'lilt', 'lily', 'limb', 'lime', 'limn', 'limo', 'limp', 'limy', 'line', 'link', 'lint', 'lion', 'lips', 'lira', 'lire', 'lirk', 'lisp', 'list',
	'lite', 'live', 'load', 'loaf', 'loam', 'loan', 'lobe', 'lobs', 'loch', 'loci', 'lock', 'loco', 'lode', 'loft', 'logo', 'logs', 'loin', 'loll',
	'lone', 'long', 'look', 'loom', 'loon', 'loop', 'loos', 'loot', 'lope', 'lops', 'lord', 'lore', 'lory', 'lose', 'loss', 'lost', 'loti', 'lots',
	'loud', 'lout', 'love', 'lows', 'luau', 'lube', 'luck', 'luff', 'luge', 'lugs', 'lull', 'lump', 'lung', 'lure', 'lurk', 'lush', 'lust', 'lute',
	'lynx', 'lyre', 'mace', 'mach', 'made', 'mage', 'magi', 'maid', 'mail', 'maim', 'main', 'make', 'male', 'mall', 'malt', 'mama', 'mane', 'mans',
	'many', 'maps', 'mara', 'mare', 'mark', 'marl', 'mars', 'mart', 'mash', 'mask', 'mass', 'mast', 'mate', 'math', 'mats', 'matt', 'maul', 'maws',
	'mayo', 'mays', 'maze', 'mead', 'meal', 'mean', 'meat', 'meek', 'meet', 'meld', 'melt', 'meme', 'memo', 'mend', 'mens', 'menu', 'meow', 'mere',
	'mesa', 'mesh', 'mess', 'mews', 'mica', 'mice', 'midi', 'miff', 'mild', 'mile', 'milk', 'mill', 'mils', 'mime', 'mind', 'mine', 'mini', 'mink',
	'mint', 'minx', 'mire', 'miss', 'mist', 'mite', 'mitt', 'moan', 'moat', 'mobs', 'mock', 'mode', 'mods', 'moho', 'mold', 'mole', 'molt', 'moms',
	'monk', 'mood', 'moon', 'moor', 'moos', 'moot', 'mope', 'mops', 'more', 'moss', 'most', 'moth', 'move', 'mown', 'mows', 'much', 'muck', 'muff',
	'mugs', 'mule', 'mull', 'mums', 'muon', 'murk', 'muse', 'mush', 'musk', 'must', 'mute', 'mutt', 'myna', 'myth', 'nabs', 'nags', 'nail', 'name',
	'nand', 'nape', 'naps', 'naut', 'nave', 'navy', 'nays', 'nazi', 'neap', 'near', 'neat', 'neck', 'need', 'neon', 'nerd', 'nest', 'nets', 'nevi',
	'news', 'newt', 'next', 'nibs', 'nice', 'nick', 'nigh', 'nils', 'nine', 'nips', 'nobs', 'nock', 'node', 'nods', 'noel', 'none', 'noon', 'nope',
	'norm', 'nose', 'nosy', 'note', 'noun', 'nova', 'nubs', 'nude', 'nuke', 'null', 'numb', 'nuns', 'nuts', 'oafs', 'oaks', 'oars', 'oath', 'oats',
	'obey', 'oboe', 'octo', 'odds', 'odes', 'odor', 'offs', 'ogle', 'ogre', 'ohms', 'oils', 'oily', 'oink', 'okay', 'okra', 'olea', 'oleo', 'omen',
	'omit', 'omni', 'once', 'ones', 'only', 'onto', 'onus', 'onyx', 'oohs', 'oops', 'ooze', 'oozy', 'opal', 'open', 'opts', 'oral', 'orbs', 'orca',
	'ores', 'oryx', 'ouch', 'ours', 'oust', 'outs', 'ouzo', 'oval', 'oven', 'over', 'ovum', 'owed', 'ower', 'owes', 'owls', 'owly', 'owns', 'oxea',
	'oxen', 'oxes', 'pace', 'pack', 'pact', 'pads', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'pall', 'palm', 'palp', 'pals', 'pane', 'pang',
	'pans', 'pant', 'papa', 'paps', 'pare', 'park', 'pars', 'part', 'pass', 'past', 'pate', 'path', 'pats', 'pave', 'pawn', 'paws', 'pays', 'peak',
	'peal', 'pear', 'peas', 'peat', 'peck', 'peek', 'peel', 'peep', 'peer', 'pegs', 'pelf', 'pelt', 'pend', 'pens', 'pent', 'peon', 'pepo', 'peps',
	'perk', 'perm', 'pert', 'peso', 'pest', 'pets', 'pews', 'phis', 'phiz', 'phub', 'pica', 'pick', 'pied', 'pier', 'pies', 'pigs', 'pike', 'pile',
	'pili', 'pill', 'pimp', 'pine', 'ping', 'pink', 'pins', 'pint', 'pion', 'pipe', 'pips', 'pita', 'pith', 'pits', 'pity', 'pius', 'plan', 'play',
	'plea', 'pleb', 'pled', 'plod', 'plop', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus', 'pock', 'pods', 'poem', 'poet', 'pogo', 'poke', 'poky',
	'pole', 'poll', 'polo', 'pomp', 'pond', 'pony', 'pooh', 'pool', 'poop', 'poor', 'pope', 'pops', 'pore', 'pork', 'porn', 'port', 'pose', 'posh',
	'post', 'posy', 'pots', 'pouf', 'pour', 'pout', 'poxy', 'pram', 'pray', 'prep', 'prey', 'prim', 'prod', 'prom', 'prop', 'pros', 'prow', 'psis',
	'pubs', 'puce', 'puck', 'puff', 'pugs', 'puke', 'pull', 'pulp', 'puma', 'pump', 'punk', 'puns', 'punt', 'puny', 'pupa', 'pups', 'pure', 'purr',
	'push', 'puts', 'putt', 'pyre', 'qadi', 'qaid', 'qats', 'qoph', 'quad', 'quay', 'quid', 'quin', 'quip', 'quit', 'quiz', 'race', 'rack', 'racy',
	'raft', 'rage', 'rags', 'raid', 'rail', 'rain', 'rake', 'rami', 'ramp', 'rams', 'rand', 'rang', 'rank', 'rant', 'rape', 'raps', 'rapt', 'rare',
	'rash', 'rasp', 'rate', 'rats', 'rave', 'raws', 'rays', 'raze', 'razz', 'read', 'reak', 'real', 'ream', 'reap', 'rear', 'redo', 'reds', 'reed',
	'reef', 'reek', 'reel', 'refs', 'rein', 'rely', 'rend', 'rent', 'repo', 'resh', 'rest', 'revs', 'rhos', 'rial', 'ribs', 'rice', 'rich', 'rick',
	'ride', 'rids', 'riel', 'rife', 'riff', 'rift', 'rigs', 'rile', 'rill', 'rily', 'rime', 'rims', 'rind', 'ring', 'rink', 'riot', 'ripe', 'rips',
	'rise', 'risk', 'rite', 'rive', 'road', 'roam', 'roan', 'roar', 'robe', 'robs', 'rock', 'rode', 'rods', 'roes', 'roil', 'role', 'roll', 'romp',
	'rood', 'roof', 'rook', 'room', 'root', 'rope', 'ropy', 'rose', 'rosy', 'rote', 'rots', 'roue', 'rout', 'rove', 'rows', 'rubs', 'ruby', 'rude',
	'rued', 'rues', 'ruff', 'rugs', 'ruin', 'rule', 'rums', 'rune', 'rung', 'runs', 'runt', 'ruse', 'rush', 'rust', 'rute', 'ruts', 'sack', 'sacs',
	'safe', 'saga', 'sage', 'sags', 'sagy', 'said', 'sail', 'sake', 'saki', 'sale', 'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'saps', 'sard',
	'sari', 'sash', 'sass', 'sate', 'save', 'sawn', 'saws', 'says', 'scab', 'scam', 'scan', 'scar', 'scat', 'scot', 'scry', 'scud', 'scum', 'scuz',
	'seal', 'seam', 'sear', 'seas', 'seat', 'sect', 'seed', 'seek', 'seem', 'seen', 'seep', 'seer', 'sees', 'self', 'sell', 'seme', 'send', 'sent',
	'sera', 'sere', 'serf', 'seta', 'sets', 'sewn', 'sews', 'sexy', 'shah', 'sham', 'shed', 'shew', 'shim', 'shin', 'ship', 'shiv', 'shmo', 'shoe',
	'shoo', 'shop', 'shot', 'show', 'shun', 'shut', 'shwa', 'sick', 'side', 'sift', 'sigh', 'sign', 'sikh', 'siku', 'silk', 'sill', 'silo', 'silt',
	'sine', 'sing', 'sink', 'sins', 'sips', 'sire', 'sirs', 'site', 'sits', 'sitz', 'size', 'skep', 'skew', 'skid', 'skim', 'skin', 'skip', 'skis',
	'skit', 'slab', 'slam', 'slap', 'slat', 'slaw', 'slay', 'sled', 'slew', 'slid', 'slim', 'slip', 'slit', 'slob', 'sloe', 'slog', 'slop', 'slot',
	'slow', 'slug', 'slum', 'slur', 'smit', 'smog', 'smug', 'smut', 'snag', 'snap', 'snip', 'snit', 'snob', 'snog', 'snot', 'snow', 'snub', 'snug',
	'soak', 'soap', 'soar', 'sobs', 'sock', 'soda', 'sods', 'sofa', 'soft', 'soil', 'sold', 'sole', 'soli', 'solo', 'sols', 'some', 'soms', 'sone',
	'song', 'sons', 'soon', 'soot', 'sops', 'sore', 'sort', 'sots', 'soul', 'soup', 'sour', 'sown', 'sows', 'soya', 'soys', 'spam', 'span', 'spar',
	'spas', 'spat', 'spay', 'sped', 'spin', 'spit', 'spot', 'spry', 'spud', 'spun', 'spur', 'stab', 'stag', 'star', 'stat', 'stay', 'stem', 'step',
	'stew', 'stir', 'stop', 'stow', 'stub', 'stud', 'stun', 'stye', 'styx', 'subs', 'such', 'suck', 'suds', 'sued', 'suer', 'sues', 'suet', 'suit',
	'sulk', 'sumo', 'sump', 'sums', 'sung', 'sunk', 'suns', 'suqs', 'sure', 'surf', 'swab', 'swag', 'swam', 'swan', 'swap', 'swat', 'sway', 'swig',
	'swim', 'swiz', 'swop', 'swum', 'sync', 'tabs', 'tabu', 'tack', 'taco', 'tact', 'tags', 'tail', 'taka', 'take', 'tala', 'talc', 'tale', 'talk',
	'tall', 'tame', 'tamp', 'tams', 'tank', 'tans', 'tape', 'taps', 'tare', 'tarn', 'taro', 'tarp', 'tars', 'tart', 'task', 'taus', 'taut', 'taxa',
	'taxi', 'teak', 'teal', 'team', 'tear', 'teas', 'tech', 'teed', 'teem', 'teen', 'tees', 'tell', 'tend', 'tens', 'tent', 'term', 'tern', 'terp',
	'test', 'teth', 'text', 'than', 'that', 'thaw', 'thee', 'them', 'then', 'they', 'thin', 'this', 'thou', 'thru', 'thud', 'thug', 'thus', 'tick',
	'tics', 'tide', 'tidy', 'tied', 'tier', 'ties', 'tiff', 'tike', 'tile', 'till', 'tilt', 'time', 'tine', 'ting', 'tins', 'tint', 'tiny', 'tipi',
	'tips', 'tire', 'tizz', 'toad', 'toed', 'toes', 'toff', 'tofu', 'toga', 'toil', 'toke', 'told', 'toll', 'tomb', 'tome', 'toms', 'tone', 'tong',
	'tons', 'took', 'tool', 'toot', 'tops', 'tore', 'torn', 'toro', 'tort', 'toss', 'tote', 'tots', 'tour', 'tout', 'town', 'tows', 'toys', 'tram',
	'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trod', 'tron', 'trot', 'troy', 'true', 'tsar', 'tuba', 'tube', 'tubs', 'tuck', 'tufa',
	'tuff', 'tuft', 'tugs', 'tums', 'tuna', 'tune', 'turf', 'turn', 'tusk', 'tutu', 'twig', 'twin', 'twit', 'twos', 'tyke', 'type', 'typo', 'tyro',
	'tzar', 'ughs', 'ugly', 'ukes', 'ulna', 'umbo', 'umps', 'undo', 'unit', 'unix', 'unto', 'upon', 'urea', 'urge', 'uric', 'urns', 'used', 'user',
	'uses', 'uvea', 'vain', 'vale', 'vamp', 'vane', 'vang', 'vans', 'vape', 'vara', 'vary', 'vase', 'vast', 'vats', 'vatu', 'veal', 'vear', 'veer',
	'vees', 'veil', 'vein', 'vela', 'vend', 'vent', 'verb', 'very', 'vest', 'veto', 'vets', 'vial', 'vibe', 'vice', 'vied', 'vies', 'view', 'vile',
	'vine', 'viol', 'visa', 'vise', 'vita', 'voes', 'void', 'vole', 'volt', 'vote', 'vows', 'vugs', 'wack', 'wade', 'wadi', 'wads', 'waft', 'wage',
	'wags', 'waif', 'wail', 'wait', 'wake', 'wale', 'walk', 'wall', 'waly', 'wand', 'wane', 'want', 'ward', 'ware', 'warm', 'warn', 'warp', 'wars',
	'wart', 'wary', 'wash', 'wasp', 'watt', 'wauk', 'waul', 'wave', 'wavy', 'wawl', 'waxy', 'ways', 'weak', 'weal', 'wean', 'wear', 'webs', 'weds',
	'weed', 'week', 'ween', 'weep', 'weir', 'weld', 'well', 'welt', 'wend', 'went', 'wept', 'were', 'west', 'wets', 'wham', 'what', 'when', 'whet',
	'whew', 'whey', 'whim', 'whip', 'whir', 'whiz', 'whoa', 'whom', 'whop', 'whup', 'wick', 'wide', 'wife', 'wifi', 'wigs', 'wild', 'wile', 'will',
	'wilt', 'wily', 'wimp', 'wind', 'wine', 'wing', 'wink', 'wins', 'wipe', 'wire', 'wiry', 'wise', 'wish', 'wisp', 'wist', 'with', 'wits', 'wive',
	'woad', 'woes', 'woke', 'woks', 'wolf', 'womb', 'wons', 'wont', 'wood', 'woof', 'wool', 'woos', 'word', 'wore', 'work', 'worm', 'worn', 'wort',
	'wove', 'wows', 'wrap', 'wren', 'writ', 'wyes', 'xray', 'xyst', 'yack', 'yaff', 'yagi', 'yaks', 'yald', 'yams', 'yang', 'yank', 'yaps', 'yard',
	'yare', 'yarn', 'yaud', 'yaup', 'yawl', 'yawn', 'yawp', 'yaws', 'yeah', 'yean', 'year', 'yeas', 'yegg', 'yeld', 'yelk', 'yell', 'yelm', 'yelp',
	'yens', 'yerk', 'yesk', 'yeti', 'yett', 'yews', 'yill', 'yins', 'yipe', 'yips', 'yird', 'yirr', 'ynal', 'yodh', 'yods', 'yoga', 'yogi', 'yoke',
	'yolk', 'yond', 'yoni', 'yore', 'your', 'yowe', 'yowl', 'yows', 'yoyo', 'yuan', 'yuck', 'yuga', 'yuks', 'yule', 'yurt', 'yutz', 'ywis', 'zags',
	'zany', 'zaps', 'zarf', 'zati', 'zeal', 'zebu', 'zeds', 'zees', 'zein', 'zens', 'zeps', 'zerk', 'zero', 'zest', 'zeta', 'zhos', 'zigs', 'zinc',
	'zine', 'zing', 'zips', 'ziti', 'zits', 'zizz', 'zoea', 'zoic', 'zone', 'zonk', 'zoom', 'zoos', 'zori', 'zulu', 'zyme'];
		this.word = words[ Math.floor( Math.random() * words.length ) ]; // pick a random word from wordlist as target word
		this.words = words;
		this.screen = new Screen;
		this.rows = this.screen.board.rowGen();
	}

	backspace() {
		let currLtr = this.screen.board.currLtr;
		if ( Number( currLtr.id[1] ) > 1 ) { // if not already at farthest box to the left, clear current box and move one space to the left
			if ( currLtr.innerHTML ) {
				currLtr.innerHTML = '';
			} else {
				document.getElementById( currLtr.id[0] + ( Number( currLtr.id[1] ) - 1)).classList.toggle('selected');
				this.screen.board.clearBoxById( currLtr.id[0] + ( Number( currLtr.id[1] ) - 1 ) );
				currLtr.classList.toggle('selected');
			}
		} else {
			currLtr.innerHTML = '';
		}
	}

	enter() {
		let currLtr = this.screen.board.currLtr;
		if ( currLtr !== null ) { // if a box is selected
			let currRow = currLtr.id[0];
			if ( document.getElementById(`${currRow}1`).innerHTML && document.getElementById(`${currRow}2`).innerHTML &&
				document.getElementById(`${currRow}3`).innerHTML && document.getElementById(`${currRow}4`).innerHTML ) { // if all boxes in row filled
					let guess = this.screen.board.guess;
					if ( guess === this.word ) {
						this.correct( guess );
					} else {
						this.checkAttempt( guess );
					}
				}
		} else {
			return null;
		}
	}
	playBlinkAnimation() {
		for ( let i = 3 ; i >= 0 ; i-- ) {
			this.screen.board.currRow.item( i ).classList.toggle( 'blink' );
		}
		// 'blink' is animation styling for 'not a word' cases

		setTimeout( () => {
			for ( let i = 3 ; i >= 0 ; i-- ) {
				this.screen.board.currRow.item( i ).classList.toggle( 'blink' );
			}
		}, 1000 );
	}

	finalRowCheck( userGuess ) {
		let screen = this.screen;
		document.getElementById('output').innerHTML = `Sorry! The word was <b>${this.word}</b>. Press the <b>"New Game"</b> button to play again!`;
		for (let i = 3; i >= 0; i--) {
			if (userGuess[i] === this.word[i]) {
				screen.colorLetterById( `h${i+1}`, 'green-letter' ); // if letter is correct, make it green
				screen.colorLetterById( userGuess[i], 'green-letter' ); // also make corresponding key on virtual keyboard green
			} else if ( this.word.includes( userGuess[i] ) ) {
				screen.colorLetterById( `h${i+1}`, 'yellow-letter' ); // if letter is in wrong position, make it yellow
				screen.colorLetterById( userGuess[i], 'yellow-letter' ); // also make corresponding key on virtual keyboard yellow
			} else {
				screen.colorLetterById( `h${i+1}`, 'red-letter' ); // if letter is not part of target word, make it red
				screen.colorLetterById( userGuess[i], 'red-letter' ); // also make corresponding key on virtual keyboard red
			}
		}
		localStorage.setItem( 'not_solved' , Number( localStorage.getItem('not_solved') ) + 1 ); // add one to 'not_solved' in local storage
		localStorage.setItem( 'games_played' , Number( localStorage.getItem('games_played') ) + 1 ); // add one to 'games_played' in local storage
		this.screen.showProgress();
		window.scrollTo(0,document.body.scrollHeight); // scroll to bottom of page/document
	}

	correct( keyIds ) {
		// confetti from https://www.kirilv.com/canvas-confetti/
		var count = 200;
		var defaults = {
			origin: { y: 0.7 }
		};

		function fire(particleRatio, opts) {
			confetti(Object.assign({}, defaults, opts, {
				particleCount: Math.floor(count * particleRatio)
		}));
		}

		fire(0.25, {
			spread: 26,
			startVelocity: 55,
		});
		fire(0.2, {
			spread: 60,
		});
		fire(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 45,
		});

		localStorage.games_played = Number( localStorage.getItem('games_played') ) + 1; // add one to the value of 'games_played' in local storage - if 0, adds one to null, which equals 1
		localStorage.solved = Number( localStorage.getItem('solved') ) + 1; // Add 1 to the value of 'solved' in local storage
		let tries = ['a','b','c','d','e','f','g','h'].indexOf( this.screen.board.currRow.item(0).id[0] ) + 1; // number of tries is the position in the alphabet of the row letter
		localStorage.setItem( `solved_in_${tries}`, Number( localStorage.getItem( `solved_in_${tries}` ) ) + 1 ) // add one to 'solved_in_<tries>' in local storage
		Number( tries ) === 1 ? document.getElementById('output').innerHTML = // if solved in single try, use singular for of 'try' in output message
		"Congratulations! You got it in 1 try! Click the <b>\"New Game\"</b> button to play again!" : document.getElementById('output').innerHTML = // otherwise, use plural form ('tries')
		`Congratulations! You got it in ${tries} tries! Click the <b>"New Game"</b> button to play again!`;

		for ( let i = 3 ; i >= 0 ; i-- ) {
			this.screen.colorLetterById( this.screen.board.currRow.item(i).id , 'green-letter' ); // set all letters in row green
			this.screen.colorLetterById( keyIds[i], 'green-letter' ); // set all _keyIds for correct letters green
		}

		this.screen.showProgress();
		window.scrollTo( 0, document.body.scrollHeight ); // scroll to bottom of page
	}

	checkAttempt( userGuess ) {
		if ( !this.words.includes( userGuess.toLowerCase() ) ) {// if guess is not a word (in the wordlist), play 'not a word' animation
			this.playBlinkAnimation();
		} else if ( userGuess.toLowerCase() === this.word ) { // if user guessed the word, play confetti and congratulate
			this.correct( userGuess );
		} else if ( userGuess.toLowerCase() !== this.word && this.screen.board.currRow.item(0).id[0] === 'h' ) { // if on last row and guess is incorrect run final row check
			this.finalRowCheck( userGuess );
		} else {
			for ( let i = 3 ; i >= 0 ; i-- ) {
				if ( userGuess[i] === this.word[i] ) {
					this.screen.colorLetterById( this.screen.board.currRow.item(i).id, 'green-letter' ); // if letter is correct, make it green
					this.screen.colorLetterById( userGuess[i], 'green-letter' ); // also make corresponding key on virtual keyboard green
				} else if ( this.word.includes( userGuess[i] ) ) {
					this.screen.colorLetterById( this.screen.board.currRow.item(i).id, 'yellow-letter' ); // if letter is in wrong position, make it yellow
					this.screen.colorLetterById( userGuess[i], 'yellow-letter' ); // also make corresponding key on virtual keyboard yellow
				} else {
					this.screen.colorLetterById( this.screen.board.currRow.item(i).id, 'red-letter' ); // if letter not part of target word, make it rec
					this.screen.colorLetterById( userGuess[i], 'red-letter' ); // also make corresponding key on virtual keyboard red
				}
			}

			let next = this.rows.next().value; // <next> is the next value of the rowGen function
			document.getElementById( next + 1 ).classList.add('selected-row', 'selected'); // select first box of next row
			for ( let i = 2 ; i <= 4 ; i++ ) {
				document.getElementById( next + i ).classList.add('selected-row'); // move to next row
			}
			if ( ['a','b','c','d','e','f','g'].indexOf( this.screen.board.currRow.item(0).id[0] ) > 3 ) {
				window.scrollBy(0, 1.25 * document.getElementById('a1').scrollHeight); // scroll down by the height of the first box
			}
		}
	}

	newGame() {
		window.scrollTo(0,0); // Scroll to top of window
		game = new Game; // initialize the Game class
		this.screen.clear();

		// Event liosteners based on https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/
		window.addEventListener('keydown', handleKeyDown, true);
	}
}

game = new Game();
game.newGame();
game.screen.showProgress();

// Future Updates:
// fix centering issue
// add mobile compatibility
// move stats to new html page

// MEDIUM MODE - keyboard buttons don't change color - ** come up with a cute words-related name for difficulty
// Gamemode: NO KEYBOARD COLORING
// Gamemode: NO TILE COLORING
// Gamemode idea: "You got 1 letter correct!" (ultimate mode)
