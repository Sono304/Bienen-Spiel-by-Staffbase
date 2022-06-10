var x = 0;
var y = 0;
var zielx = Math.floor(Math.random() * 28) * 20 + 20;
var ziely = 460;
var siegpunkte = 0;
var spielzeit = 90;
var restzeit = 0;
var startzeit = new Date();
var aktuellezeit = new Date();
restzeit = spielzeit - Math.floor((aktuellezeit.getTime() - startzeit.getTime()) / 1000);
console.log(restzeit);
$('#spielzeit').html(`Gametime: ${restzeit} seconds left`);
var gegnerpositionen = [0, 1, 10, 60, 100, 150, 296];
var gegnerbewegung = [5, 2, 3, -2, 4, 5, -3];
var lastScore;
var bestScore;
var scorebest = 0;

$(document).ready(function () {
	takt = window.setInterval(taktung, 50);
	var spielbrett = document.getElementById('leinwand');
	spielfeld = spielbrett.getContext('2d');
	var spielfigur = new Image();
	spielfigur.src = 'spielfigur.png';
	spielfigur.onload = function () {
		spielfeld.drawImage(spielfigur, x, y);
	};
	renderCookie();
	calcBestCookie();
	console.log(bestScore);

	function calcBestCookie() {
		if (bestScore < 0) {
			bestScore = 0;
		} 
		if (scorebest >= bestScore) {
			bestScore = scorebest;
			setBestCookie();
		} else {
			setBestCookie();
		}
	}
	
	function setBestCookie() {
		document.cookie = "BestScore=" + bestScore;
		renderBestCookie();
	}
	
	function renderBestCookie() {
		$('#besterwert #bestvalue').html(getBestCookie("BestScore"));
	}
	
	function getBestCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i <ca.length; i++) {
		  let c = ca[i];
		  while (c.charAt(0) == ' ') {
			c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		  }
		}
		return "";
	}

	function setCookie() {
		document.cookie = "LastScore=" + lastScore;
		renderCookie(); 
	}
	
	function renderCookie() {
		$('#letzterwert #value').html(getCookie("LastScore"));
	}

	function getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i <ca.length; i++) {
		  let c = ca[i];
		  while (c.charAt(0) == ' ') {
			c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		  }
		}
		return "";
	}

	function erzeugeGegner(gx, gy) {
		var img = new Image();
		img.src = 'gegnerfigur.png';
		img.onload = function () {
			spielfeld.drawImage(img, gx, gy);
		};
	}

	function spielende() {
		clearInterval(takt);
		$('#spielendeanzeige').show();
		lastScore = siegpunkte;
		scorebest = siegpunkte;
		console.log(lastScore);
		setCookie();
		calcBestCookie();
	}

	function taktung() {
		spielfeld.clearRect(0, 0, 900, 600);
		zeichneZielfeld();
		spielfeld.drawImage(spielfigur, x, y);
		zielfelderreicht();
		kollisionspruefungGegner();
		setzeGegner();

		var aktuellezeit = new Date();
		restzeit = spielzeit - Math.floor((aktuellezeit.getTime() - startzeit.getTime()) / 1000);
		$('#spielzeit').html(`Gametime: ${restzeit} seconds left`);
		if (restzeit <= 0) {
			spielende();
		}
		function kollisionspruefungGegner() {
			for (nr = 0; nr < gegnerpositionen.length; nr++) {
				var ygeg = 360 - (nr * 40);
				if (Math.abs(x - gegnerpositionen[nr]) < 20 && y == ygeg) {
					// Zusammenstoß
					kollisionGegner();
				}
			}
		}
		function kollisionGegner() {
			clearInterval(takt);
			$('#gameover').show();
			lastScore = siegpunkte;
			scorebest = siegpunkte;
			console.log(lastScore);
			setCookie();
			calcBestCookie();
		}
	}

	function zeichneZielfeld() {
		var zielfeld = new Image();
		zielfeld.src = 'zielbereich.png';
		zielfeld.onload = function () {
			spielfeld.drawImage(zielfeld, zielx, ziely);
		};
	}
	zeichneZielfeld();

	function zielfelderreicht() {
		console.log(`x: ${x}|Ziel x:${zielx}`);
		console.log(`y: ${y}|Ziel y:${ziely}`);

		if (x == zielx && y == ziely) {
			// Ziel erreicht!
			console.log("Ziel erreicht!");
			console.log(bestScore);

			// neues Ziel erzeugen
			if (ziely == 460) {
				ziely = 0;
			}
			else {
				ziely = 460;
			}
			zielx = Math.floor(Math.random() * 28) * 20 + 20;
			siegpunkte++;
			$('#punktestand').html(`Points: ${siegpunkte}`);
		}
		if (siegpunkte > bestScore) {
			bestScore = siegpunkte;
			setBestCookie();
		}
	}

	function setzeGegner() {
		for (nr = 0; nr < gegnerpositionen.length; nr++) {
			gegnerpositionen[nr] += gegnerbewegung[nr] * 5;
			if (gegnerpositionen[nr] > 580 || gegnerpositionen[nr] < 0) {
				gegnerbewegung[nr] *= -1;
			}
			erzeugeGegner(gegnerpositionen[nr], 360 - (nr * 40));
		}
	}

	$(document).bind('keydown', function (evt) {
		// console.log(evt.keyCode);
		switch (evt.keyCode) {
			// Pfeiltaste nach unten
			case 40:
				y += 20;
				if (y >= 480) {
					y = 460;
				}
				// console.log("Wert y: "+y);
				return false;
				break;
			// Pfeiltaste nach oben
			case 38:
				y -= 20;
				if (y <= 0) {
					y = 0;
				}
				// console.log("Wert -y: "+y);
				return false;
				break;
			// Pfeiltaste nach links
			case 37:
				x -= 20;
				if (x <= 0) {
					x = 0;
				}
				// console.log("Wert -x: "+x);
				return false;
				break;
			// Pfeiltaste nach rechts
			case 39:
				x += 20;
				if (x >= 600) {
					x = 580;
				}
				// console.log("Wert x: "+x);
				return false;
				break;
		}
	});
});

function calcBestCookie() {
	if (bestScore < 0) {
		bestScore = 0;
	} 
	if (scorebest >= bestScore) {
		bestScore = scorebest;
		setBestCookie();
	} else {
		setBestCookie();
	}
}

function setBestCookie() {
	document.cookie = "BestScore=" + bestScore;
	renderBestCookie();
}

function renderBestCookie() {
	$('#besterwert #bestvalue').html(getBestCookie("BestScore"));
}

function getBestCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}