var myApp = new Framework7( {
	animateNavBackIcon: true,
	template7Pages: true,
	precompileTemplates: true
} );

var $$ = Dom7;

var mainView = myApp.addView( '.view-main', {
	dynamicNavbar: true,
	domCache: true
} );

var BLOCK = {
	'word-button': false,
	'check-button': false
};

var _G = {
	wordsCount: 10
};

var _DICT = [];



getDict();
localStorage.removeItem( "words" );

var container = $$( 'body' );
if ( !container.children( '.progressbar, .progressbar-infinite' ).length ) {
	myApp.showProgressbar( container, 0 );

	// Simluate Loading Something
	var progress = 0;
	function simulateLoading() {
		setTimeout( function () {
			var progressBefore = progress;
			progress += Math.random() * 80;
			myApp.setProgressbar( container, progress );
			if ( progressBefore < 100 ) {
				simulateLoading(); //keep "loading"
			} else
				myApp.hideProgressbar( container ); //hide
		}, Math.random() * 200 + 200 );
	}
	simulateLoading();



// events
	$$( '.word-button' ).on( 'click', onClickWordButton );
	$$( '.enough-button' ).on( 'click', resultPreview );
	$$( document ).on( 'click', '.check-button', onClickCheckButton );
	$$( document ).on( 'click', '.end-button', onClickEndButton );
	$$( document ).on( 'click', '.start-game', onClickStartButton );
}

function resultPreview() {
	var data = [];
	var words = JSON.parse( localStorage.getItem( "words" ) ) || [];
	var tmp_words = [];
	var all_words = {};
	var html;

	for ( i = 1; i <= words.length; i++ ) {
		data.push( getRandomWord() );
	}

	$$.each( data, function ( k, v ) {
		tmp_words.push( {name: v, correct: 0} );
	} );
	$$.each( words, function ( k, v ) {
		tmp_words.push( {name: v, correct: 1} );
	} );

	tmp_words.shuffle();

	$$.each( tmp_words, function ( k, v ) {
		all_words[v.name] = v.correct;
	} );

	html = Template7.templates.listItemCheck( {words: all_words} );

	$$( '.result-preview-words-holder' ).html( html );
	mainView.router.load( {
		pageName: 'result-preview'
	} );
	unBlock( 'word-button' );
}

function onClickStartButton() {
	localStorage.removeItem( "words" );
	$$( '.word-holder' ).data( 'col', 0 );

	mainView.router.load( {
		pageName: 'game'
	} );
	getNewWord();
}

function onClickCheckButton() {
	if ( notBlocked( 'check-button' ) ) {
		var formData = myApp.formToJSON( '#check-result-form' );
		var html = Template7.templates.listItemResult( {words: formData['words']} );
		$$( '.result-words-holder' ).html( html );
		unBlock( 'check-button' );
	}
	mainView.router.load( {
		pageName: 'result'
	} );
}

function onClickEndButton( event ) {
	var word;
	var correctWords = 0;
	var notCorrectWords = 0;
	var words = JSON.parse( localStorage.getItem( "words" ) ) || [];

	$$.each( $$( '#result-form .item-title' ), function ( k, el ) {
		word = $$( el ).text();
		if ( words.indexOf( word ) !== -1 ) {
			console.log( 'ok' );
			correctWords++;
			$$( el ).closest( 'li' ).addClass( 'color-green' );
		} else {
			notCorrectWords++;
			$$( el ).closest( 'li' ).addClass( 'color-red' );
		}
	} );

//	var result_percent = toPercent( ( correctWords - notCorrectWords ) / words.length );
	var result_percent = ( correctWords * 10 ) - ( notCorrectWords * 10 );

	$$( event.target ).closest( '.buttons-row' ).addClass( 'hidden' );
	$$( '.back-to-check' ).addClass( 'disabled' );
	$$( '.result-info, .end-game-button' ).removeClass( 'hidden' );
	$$( '.result-info' ).find( '.card-header' ).text( 'Ваш результат: ' + result_percent );
	$$( '.result-info' ).find( '.card-content-inner' ).html(
			'Вы запомнили ' + correctWords + ' из ' + words.length + "<BR>" +
			'Ошибочных слов: ' + notCorrectWords
			);
}

function getRandomWord() {
	var random_index = randomNumber( 1, _DICT.length - 1 );
	var word = _DICT[random_index];
	_DICT.splice( random_index, 1 );
	if ( word ) {
		return word.trim();
	}
}

function getNewWord() {
	var word = getRandomWord();
	var words = JSON.parse( localStorage.getItem( "words" ) ) || [];
	var count = $$( '.word-holder' ).data( 'col' );

	words.push( word );
	count++;

	$$( '.word-holder' ).text( word );
	$$( '.word-holder' ).data( 'col', count );

	localStorage.setItem( "words", JSON.stringify( words ) );

	unBlock( 'word-button' );
}

function onClickEnoughButton() {

}

function onClickWordButton() {
	if ( notBlocked( 'word-button' ) ) {
		var count = $$( '.word-holder' ).data( 'col' );

		if ( count >= _G.wordsCount ) {
			resultPreview();
		} else {
			getNewWord();
		}
	}
}

function notBlocked( val ) {
	if ( BLOCK[val] === false ) {
		BLOCK[val] = true;
		return true;
	} else {
		return false;
	}
}

function unBlock( val ) {
	BLOCK[val] = false;
}

function getDict( ) {
// myApp.showPreloader();
	$$.ajax( {
		method: 'post',
		url: 'dict.txt',
		success: function ( data ) {
			words = data.split( '\n' );
			_DICT = words;
//			 myApp.hidePreloader();
		}
	} );
}

function randomNumber( m, n ) {
	m = parseInt( m );
	n = parseInt( n );
	return Math.floor( Math.random() * ( n - m + 1 ) ) + m;
}

function toPercent( a ) {
	var c = ( a * 100 ).toFixed( 10 );
	return parseFloat( c );
}

Array.prototype.shuffle = function () {
	for ( var i = this.length - 1; i > 0; i-- ) {
		var num = Math.floor( Math.random() * ( i + 1 ) );
		var d = this[num];
		this[num] = this[i];
		this[i] = d;
	}
	return this;
};