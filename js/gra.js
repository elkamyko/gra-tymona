
//STATYSTYKI GRACZA

function zapisz_statystyki (statystyki){
	
	localStorage.setItem('statystyki', JSON.stringify(statystyki));
	
}

function wczytaj_statystyki (){
	
	let zapisane_statystyki = localStorage.getItem('statystyki');
	
	if (zapisane_statystyki) {
		return JSON.parse(zapisane_statystyki);
	} else {
		return statystyki;
	}
	
};

let statystyki = {
	wygrane_gracza1: 0,
	wygrane_gracza2: 0
};
//KONFIGURACJA GRY

let arsenal = {
	miecz: {
			nazwa: 'miecz',
			atak: 1,
			obraz: 'miecz.png'
		},
	tarcza: {
			nazwa: 'tarcza',
			atak: 2,
			obraz: 'tarcza.png'
		},
	luk: {
			nazwa: 'luk',
			atak: 3,
			obraz: 'luk.png'
		},
	pazury: {
			nazwa: 'pazury',
			atak: 2,
			obraz: 'pazury.png'
		}
};

let rycerzO = {
	atak: 2,
	start_hp: 5,
	min_hp: 0,
	max_hp: 10,
	max_atak: 3,
	min_atak: 1,
	leczenie: 2,
	hp: 5,
	id: 1,
	avatar: 'bohater.png',
	imie: 'rycerz',
	bronie: [
		{
			nazwa: 'miecz',
			atak: 1
		},
		{
			nazwa: 'tarcza',
			atak: 2
		}
	],
	obrona: 2
};

let potworO = {
	atak: 2,
	start_hp: 5,
	min_hp: 0,
	max_hp: 10,
	max_atak: 4,
	min_atak: 0,
	leczenie: 2,
	hp: 5,
	id: 2,
	avatar: "potwor.png",
	imie: 'potwór',
	bronie: [
		//1,
		//1,
	],
	obrona: 1
};

let smokO = {
	start_hp: 6,
	min_hp: 0,
	max_hp: 12,
	min_atak: 2,
	max_atak: 2,
	leczenie: 2,
	hp: 6,
	id: 3,
	avatar: 'smok.png',
	imie: 'smok',
	bronie: [],
	obrona: 1
	
};

let wampirO = {
	
	start_hp: 5,
	min_hp: 0,
	max_hp: 10,
	min_atak: 1,
	max_atak: 3,
	leczenie: 2,
	hp: 5,
	id: 4,
	lecz_podcz_a: 1,
	avatar: 'wampir.png',
	imie: 'wampir',
	bronie: [],
	obrona: 1
};

let zawodnicy = {
	rycerz: rycerzO,
	smok: smokO,
	potwor: potworO,
	wampir: wampirO,
};

//STAN GRY

let aktualny_gracz;

let gracz1;
let gracz2;

let wygrany;

let zrzucana_bron = null;

let obrona1 = 0;

// WIDOK GRY

let $zrzut = document.getElementById('zrzut');

let $imgZrzutu = document.getElementById('png');

let $gracz1 = document.getElementById('gracz1');
let $gracz2 = document.getElementById('gracz2');

let $ekran_startowy = document.getElementById('ekran-startowy');
let $pole_bitwy = document.getElementById('pole-bitwy');
let $opcje = document.getElementById('opcje');
let $winner1 = document.getElementById('winner1');
let $winner2 = document.getElementById('winner2');
let $statystyki = document.getElementById('statystyki');



function start_game() {
	
//	gracz1 = potworO;
//	gracz2 = rycerzO;
//	gracz1 = rycerzO;
//	gracz2 = smokO;

	let obietnicaWyboruGracza = wybierz_graczy();

	obietnicaWyboruGracza.then(zainicjuj_gre);

}
 
function wybierz_graczy() {
	$('#wybor-gracza-modal').modal('show');
	$('#wybor-gracza-tytul').text('Wybór zawodnika - gracz z lewej strony');
	
	var promise1 = new Promise(function(resolve, reject) {
	  
		$('.wybor-gracza').on('click', function () {
			console.log(this, this.getAttribute('data-gracz'));
			gracz1 = $.extend({}, zawodnicy[ this.getAttribute('data-gracz') ]);
			$('.wybor-gracza').off('click');
			resolve();
		
		});
	  
	});
	
	return promise1.then(function () {
		
		$('#wybor-gracza-tytul').text('Wybór zawodnika - gracz z prawej strony');
		
		return new Promise(function(resolve, reject) {
	  
			$('.wybor-gracza').on('click', function () {
				$('.wybor-gracza').off('click');
				gracz2 = $.extend({}, zawodnicy[ this.getAttribute('data-gracz') ]);
				$('#wybor-gracza-modal').modal('hide');
				resolve();
			
			});
		  
		});
		
	});
	
	
}

function game_over () {
	
	wypisz_tekst('GAME OVER wygrywa '+wygrany.imie);	
	//start_game();
	
	if (gracz1 == wygrany){
		
		statystyki.wygrane_gracza1 = statystyki.wygrane_gracza1 + 1
		
	}
	
	if (gracz2 == wygrany){
		
		statystyki.wygrane_gracza2 = statystyki.wygrane_gracza2 + 1
		
	}
	
	
	zapisz_statystyki(statystyki)
	wyswietl_statystyki()
}

function po_kliknieciu_w_przycisk_start() {
	zmiana_ekranu($pole_bitwy);
	start_game();
}

function zainicjuj_gre() {

	wyswietl_avatary_graczy();
	
	//console.log(gracz1, gracz2);
	
	gracz1.bronie = [];
	gracz2.bronie = [];
	
	wyswietl_bronie();

	aktualny_gracz = gracz1;

	gracz1.hp = gracz1.start_hp;
	gracz2.hp = gracz2.start_hp;
	
	
	wypisz_punkty_zycia();
	wyswietl_gracza();	

}

function atakuj(atakujacy, broniacy, numer_broni) {
	if (aktualny_gracz === atakujacy){
	
		console.log('atakujacy', atakujacy);
		console.log('broniacy', broniacy);
	
		let zyciePrzed = broniacy.hp;
	
		if (atakujacy.lecz_podcz_a) {
			atakujacy.hp = atakujacy.hp + atakujacy.lecz_podcz_a
			if (atakujacy.hp >atakujacy.max_hp){
				atakujacy.hp = atakujacy.max_hp;
			}
		}
		
		
		
		let atak_broni = 0;
		
		if (atakujacy.bronie.length) {
		
			
			atak_broni = atakujacy.bronie[numer_broni].atak;
			//for (let i = 0; i < atakujacy.bronie.length; i = i + 1) {
				//console.log('kolejne powtorzenie petli, i jest rowne', i);
				//atakujacy.bronie[0];
				//console.log('bron o numerze ', i, ' to ', atakujacy.bronie[i]);
				
				//atak_wszystkich_broni = atak_wszystkich_broni + atakujacy.bronie[i];
				
				//console.log('suma wszystkich broni ', atak_wszystkich_broni);
				//console.log('pierwsza bron to ', );
				//console.log('druga bron to ', atakujacy.bronie[1]);
			//}
		
		}
		
		let obrazenia = losuj_atak(atakujacy.min_atak + atak_broni, atakujacy.max_atak);
		if (obrazenia > obrona1){
		broniacy.hp = broniacy.hp - (obrazenia - obrona1) ; 
		}
		
		
		
		if (broniacy.hp <= broniacy.min_hp) {
			broniacy.hp = broniacy.min_hp;
			wygrany = atakujacy;
			game_over();
			
		}
	
		zmien_gracza(broniacy);
		
		wypisz_punkty_zycia();
		
		console.log('obrazenia',zyciePrzed - broniacy.hp);
		
		
	}
}
function obrona (broniacy,obserwujacy) {
	
	if (aktualny_gracz == broniacy) {
	

		zmien_gracza(obserwujacy);
		
		obrona1 = broniacy.obrona;
		
	}
}

function leczenie(leczacy, obserwujacy){

	if(aktualny_gracz == leczacy){

		zmien_gracza(obserwujacy);
		leczacy.hp = leczacy.hp + leczacy.leczenie;
	
		if (leczacy.hp > leczacy.max_hp) {
			leczacy.hp = leczacy.max_hp;
		}

		wypisz_punkty_zycia();
	}	
}

function zmien_gracza(nowy_gracz) {

	aktualny_gracz = nowy_gracz;
	let costam = losuj(50);
	
	if (costam) {
		zrzuc_bron();
	}
	
	wyswietl_gracza();
    obrona1 = 0
}

function losuj_bron() {
	let nazwy_broni = Object.keys(arsenal);
	
	let ilosc_broni = nazwy_broni.length;
	
	let numer_wylosowanej_broni = Math.floor(Math.random() * ilosc_broni);
	
	if (numer_wylosowanej_broni == ilosc_broni) {
		numer_wylosowanej_broni = numer_wylosowanej_broni - 1;	
	}
	
	let wylosowana_bron = arsenal[nazwy_broni[numer_wylosowanej_broni]];
	
	return wylosowana_bron;
}

function zrzuc_bron() {
	
	let bron_do_zrzucenia = losuj_bron(); 
	
	//$zrzut.innerHTML = bron_do_zrzucenia.obraz
	
	$imgZrzutu.src = "./images/" + bron_do_zrzucenia.obraz;
	
	$zrzut.classList.remove('animowalny');
	$zrzut.style.top = 0;
	$zrzut.style.left = ((Math.random() * 80) + 5) + '%';
	pokaz_element($zrzut);
	setTimeout(function () {
		$zrzut.classList.add('animowalny');
		$zrzut.style.top = 'calc(100% - 6em - 8px)';
	}, 0);
	
	zrzucana_bron = bron_do_zrzucenia;
	
}

function zakoncz_zrzut() {
	zrzucana_bron = null;
	ukryj_element($zrzut);
}

function zlap_zrzut() {
	console.log('lapie zrzut!!');
	
	let bron_znaleziona = false;
	
	for (let i=0; i<aktualny_gracz.bronie.length; i=i+1){
		if (aktualny_gracz.bronie[i].nazwa == zrzucana_bron.nazwa) {
			bron_znaleziona = true;
		}
	}
	
	if (!bron_znaleziona){
		aktualny_gracz.bronie.push(zrzucana_bron);
	}
	
	zakoncz_zrzut();
	wyswietl_bronie();
	
}

function losuj_atak (min,max) {
		let wylosowany_atak = Math.round(Math.random() * (max - min)) + min;
		return wylosowany_atak;
		
		
}

function losuj(prawdopodobienstwo) {
	return (Math.random() * 100) < prawdopodobienstwo;
}


//FUNKCJE WIDOKU

function wyswietl_statystyki(N_G){
	zmiana_ekranu($statystyki)
	$winner1.innerHTML = statystyki.wygrane_gracza1;
	$winner2.innerHTML = statystyki.wygrane_gracza2;
	
}

function pokaz_element($element) {
	$zrzut.style.display = 'block';
}

function ukryj_element($element) {
	$zrzut.style.display = 'none';
}

function wyswietl_gracza() {

	if (aktualny_gracz == gracz1) {
		$gracz1.style.backgroundColor = 'rgba(255,0,0,0.1)';
		$gracz2.style.backgroundColor = '#ffffff';
	} else {
		$gracz1.style.backgroundColor = '#ffffff';
		$gracz2.style.backgroundColor = 'rgba(255,0,0,0.1)';
	}

}

function wyswietl_avatary_graczy() {
	document.getElementById('avatar-gracz1').src = './images/' + gracz1.avatar;
	document.getElementById('avatar-gracz2').src = './images/' + gracz2.avatar;
	
	
}

function wypisz_punkty_zycia() {
	document.getElementById('zycie-gracz1').innerHTML = gracz1.hp;
	document.getElementById('zycie-gracz2').innerHTML = gracz2.hp;
}

function wyswietl_bronie() {

	let html_z_broniami = '';

	if (gracz1.bronie.length) {
		
		for (let i=0;i<gracz1.bronie.length;i=i+1) {
		
			html_z_broniami = html_z_broniami + '<button onclick="atakuj(gracz1, gracz2, ' + i + ');">Atak bronią: ' + (gracz1.bronie[i].nazwa) +  '</button>';
			console.log('html do wstawienia na strone: ', html_z_broniami);
		
		}
	
		
	
	} else {
		html_z_broniami = html_z_broniami + '<button onclick="atakuj(gracz1, gracz2);">Atak bez broni</button>';
	}
	
	document.getElementById('bronie-gracz1').innerHTML = html_z_broniami;
	
	
	html_z_broniami = '';
	
	if (gracz2.bronie.length) {
		
		for (let i=0;i<gracz2.bronie.length;i=i+1) {
		
			html_z_broniami = html_z_broniami + '<button onclick="atakuj(gracz2, gracz1, ' + i + ');">Atak bronią ' + (gracz2.bronie[i].nazwa) +  '</button>';
			console.log('html do wstawienia na strone: ', html_z_broniami);
		
		}
		
	} else{
		html_z_broniami = html_z_broniami + '<button onclick="atakuj(gracz2, gracz1);">Atak bez broni</button>';
	}
	
	document.getElementById('bronie-gracz2').innerHTML = html_z_broniami;

};

function wypisz_tekst(tekst) {

	setTimeout(function () {
		alert (tekst);
	}, 10);
}

function pokaz_ekran($ekran_do_pokazania) {
	$ekran_do_pokazania.style.display = 'block';

}

function ukryj_ekran($ekran_do_ukrycia) {
	$ekran_do_ukrycia.style.display = 'none';
}  

function zmiana_ekranu($ekran_do_wyswietlenia) {
	ukryj_ekran($ekran_startowy);
	ukryj_ekran($statystyki)
	ukryj_ekran($opcje);
	ukryj_ekran($pole_bitwy);
	pokaz_ekran($ekran_do_wyswietlenia);
}


// INICJACJA CAŁEJ GRY
$zrzut.style.display = 'none';
$zrzut.addEventListener('transitionend', function () {
	zakoncz_zrzut();
});

zmiana_ekranu($ekran_startowy);

statystyki = wczytaj_statystyki();