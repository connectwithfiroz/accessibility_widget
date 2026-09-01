"use strict";
var WIDGET_SPEECH_LANGUAGE = 'en';
const scriptPath = document.currentScript.src;
// Extract the directory path of the current script
const lastSlashIndex = scriptPath.lastIndexOf('/');
const secondLastSlashIndex = scriptPath.lastIndexOf('/', lastSlashIndex - 1);
const AC_SCRIPT_DIR = scriptPath.substring(0, secondLastSlashIndex);
var widgetSection = ``;
var accessabilityBtnText = ``;
	
function isExcludedElement(element) {
	// Check if the element is inside #main_w_container or has class .accessability-f_item__name
	if (
		element.closest('#main_w_container') ||
		element.classList.contains('accessability-f_item__name') ||
		element.classList.contains('waf-text-spacing') ||
		element.classList.contains('feature-image') ||
		element.classList.contains('icon_global') ||
		element.classList.contains('copyright-text') ||
		element.classList.contains('waf-copy')
	) {
		return true;
	}
	// Exclude script and svg elements
	if (element.tagName === 'SCRIPT' || element.tagName === 'DIV' || element.tagName === 'LINK' ||
		element.tagName === 'HTML' ||
		element.tagName === 'HEAD' ||
		element.tagName === 'BODY' ||
		(element.tagName === 'svg' && element.namespaceURI === 'http://www.w3.org/2000/svg')) {
		return true;
	}
	return false;
}
const athr = 'Rmlyb3pBbnNhcmk4Nzg5NzAxOTE2';
function handleFontSizes(btnId, featureItemId, featureStepsId, tickIconId, increase, btn) {
	var Storageclick = btn + '-clickCount';
	var ButtonStorageClick = btn + '-buttonClicked';
	var clickCount = 0;
	// Check local storage for previous state
	var localStorageClickCount = localStorage.getItem(Storageclick);
	if (localStorageClickCount) {
		clickCount = parseInt(localStorageClickCount, 10);
	}
	document.addEventListener('DOMContentLoaded', function() {
		var featureItem = document.getElementById(featureItemId);
		var featureSteps = document.getElementById(featureStepsId);
		var tickIcon = document.getElementById(tickIconId);
		// Get Storage Items
		var FontSizeBtnState = JSON.parse(localStorage.getItem(ButtonStorageClick));
		var FontSizeClickState = JSON.parse(localStorage.getItem(Storageclick));
		// var FontSizeState = localStorage.getItem(SizeStorage);
		var FontSizeStateBigger = localStorage.getItem('bt-size');
		var FontSizeStateSmaller = localStorage.getItem('st-size');
		if (FontSizeBtnState) {
			featureItem.classList.add('feature-active');
			featureSteps.classList.add('featureSteps-visible');
			tickIcon.style.display = 'inline-block';
			// Add step span tags dynamically
			var StoragestepsHTML = '';
			for (var i = 0; i < 4; i++) {
				StoragestepsHTML += '<span class="' + (i < FontSizeClickState ? 'active step accessability-features__step' : 'step accessability-features__step') + '"></span>';
			}
			featureSteps.innerHTML = StoragestepsHTML;

			if (FontSizeStateBigger != 0) {
				document.getElementById('btn-small-text').disabled = true;
				var elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)');
				elements.forEach(function(element) {
					// Exclude elements inside #main_w_container and with class .accessability-f_item__name
					if (!isExcludedElement(element)) {
						var currentSize = window.getComputedStyle(element).fontSize;
						var newSize = parseFloat(currentSize) + parseFloat(FontSizeStateBigger);
						element.style.setProperty('font-size', newSize + 'px', 'important');
					}
				});

			}

			if (FontSizeStateSmaller != 0) {
				document.getElementById('btn-s9').disabled = true;
				var elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)');
				elements.forEach(function(element) {
					// Exclude elements inside #main_w_container and with class .accessability-f_item__name
					if (!isExcludedElement(element)) {
						var currentSize = window.getComputedStyle(element).fontSize;
						var newSize = parseFloat(currentSize) - parseFloat(FontSizeStateSmaller);
						element.style.setProperty('font-size', newSize + 'px', 'important');
					}
				});
			}
		}
	});

	document.getElementById(btnId).addEventListener('click', function() {
		// Check local storage for previous state
		let clickCount = 0;
		let addsize = 0;
		var localStorageClickCount = localStorage.getItem(Storageclick);
		if (localStorageClickCount) {
			clickCount = parseInt(localStorageClickCount, 10);
		}
		
		clickCount++;
		addsize += 2;
		var featureItem = document.getElementById(featureItemId);
		var featureSteps = document.getElementById(featureStepsId);
		var tickIcon = document.getElementById(tickIconId);

		if (btnId == "btn-s9") {
			document.getElementById('btn-small-text').disabled = true;
			localStorage.setItem('btn-big', true);
		}else if (btnId == "btn-small-text") {
			document.getElementById('btn-s9').disabled = true;
			localStorage.setItem('btn-small', true);
		}

		// Save current state to local storage
		localStorage.setItem(Storageclick, clickCount);
		localStorage.setItem(ButtonStorageClick, true);


		if (clickCount === 5) {
			// Reset on 5th click
			clickCount = 0;
			addsize = 0;
			featureItem.classList.remove('feature-active');
			featureSteps.classList.remove('featureSteps-visible');
			featureSteps.innerHTML = '';
			tickIcon.style.display = 'none';
			localStorage.setItem(Storageclick, 0);
			localStorage.setItem(ButtonStorageClick, false);

			if (btnId == "btn-s9") {
				document.getElementById('btn-small-text').disabled = false;
				localStorage.setItem('btn-big', false);
			}
			if (btnId == "btn-small-text") {
				var otherBtn = document.getElementById('btn-s9').disabled = false;
				localStorage.setItem('btn-small', false);
			}

			// Reset font size of all elements
			resetFontSizes(btn, Storageclick, ButtonStorageClick);
			return;
		}else if (clickCount === 1) {
			// Add feature-active class on the first click
			featureItem.classList.add('feature-active');
			featureSteps.classList.add('featureSteps-visible');
			localStorage.setItem(Storageclick, clickCount);
			localStorage.setItem(ButtonStorageClick, true);
		}

		// Update data-reader-content attribute
		document.getElementById(btnId).setAttribute('data-reader-content', clickCount);

		// Add step span tags dynamically
		var stepsHTML = '';
		for (var i = 0; i < 4; i++) {
			stepsHTML += '<span class="' + (i < clickCount ? 'active step accessability-features__step' : 'step accessability-features__step') + '"></span>';
		}
		featureSteps.innerHTML = stepsHTML;

		// Display tick icon until the 4th click
		if (clickCount < 5) {
			tickIcon.style.display = 'inline-block';
		}
		adjustFontSizes(increase, btn, addsize);
	});
}

function adjustFontSizes(increase, btn, addsize, additional_params = {}) {
	let font_steps = (additional_params && additional_params.font_steps !== undefined) ? additional_params.font_steps : 1;
	var SizeStorage = btn + '-size';
	var elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)');
	elements.forEach(function(element) {
		// Exclude elements inside #main_w_container and with class .accessability-f_item__name
		if (!isExcludedElement(element)) {
			var currentSize = window.getComputedStyle(element).fontSize;
			var newSize = increase ? parseFloat(currentSize) + (font_steps * 1) : parseFloat(currentSize) - (font_steps * 1);
			element.style.fontSize = newSize + 'px';
			// element.style.setProperty('font-size', newSize + 'px', 'important');
			localStorage.setItem(SizeStorage, parseFloat(addsize));
		}
	});
}

// Reset font sizes
function resetFontSizes() {
	var elements = document.querySelectorAll('*');
	elements.forEach(function(element) {
		element.style.fontSize = '';
		localStorage.setItem('st-size', 0);
		localStorage.setItem('st-clickCount', 0);
		localStorage.setItem('st-buttonClicked', false);
		localStorage.setItem('bt-size', 0);
		localStorage.setItem('bt-clickCount', 0);
		localStorage.setItem('bt-buttonClicked', false);
		localStorage.setItem('btn-big', false);
		localStorage.setItem('btn-small', false);
	});
}

let letterSpacing = 0; // Initial letter spacing (auto)
let clickCountText = 0; // Counter to track button clicks

// Check local storage for previous state
var localStorageSpacingCount = localStorage.getItem('ts-clickCount');
if (localStorageSpacingCount) {
	clickCountText = parseInt(localStorageSpacingCount, 10);
}


function increaseAndReset() {
	clickCountText++;
	var featureItem_ts = document.getElementById('featureItem-ts');
	var featureSteps_ts = document.getElementById('featureSteps-ts');
	var tickIcon_ts = document.getElementById('tickIcon-ts');

	// Save current state to local storage
	localStorage.setItem('ts-clickCount', clickCountText);
	localStorage.setItem('ts-buttonClicked', true);

	// Reset letter spacing after the third click
	if (clickCountText === 4) {
		letterSpacing = 0; // Reset letter spacing to auto (0)
		clickCountText = 0; // Reset click count
		featureItem_ts.classList.remove('feature-active');
		featureSteps_ts.classList.remove('featureSteps-visible');
		featureSteps_ts.innerHTML = '';
		tickIcon_ts.style.display = 'none';

		// Save current state to local storage
		localStorage.setItem('ts-clickCount', clickCountText);
		localStorage.setItem('ts-buttonClicked', false);

		// Reset font size of all elements
		resetLetterspacing();
		return;
	}

	// Add feature-active class on the first click
	if (clickCountText === 1) {
		featureItem_ts.classList.add('feature-active');
		featureSteps_ts.classList.add('featureSteps-visible');

		// Save current state to local storage
		localStorage.setItem('ts-clickCount', clickCountText);
		localStorage.setItem('ts-buttonClicked', true);
	}

	// Add step span tags dynamically
	var stepsHTML_ts = '';
	for (var i = 0; i < 3; i++) {
		stepsHTML_ts += '<span class="' + (i < clickCountText ? 'active step accessability-features__step' : 'step accessability-features__step') + '"></span>';
	}
	featureSteps_ts.innerHTML = stepsHTML_ts;
	// Display tick icon until the 4th click
	if (clickCountText < 4) {
		tickIcon_ts.style.display = 'inline-block';
	}

	letterSpacing += 0.7; // Increase by 5px
	applyLetterSpacing();
}

function decreaseSpacing() {
	letterSpacing -= 5; // Decrease by 5px
	applyLetterSpacing();
}

function applyLetterSpacing() {
	const elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)'); // Select all elements except buttons
	elements.forEach(function(element) {
		if (!isExcludedElement(element)) {

			var currentSize_ts = parseFloat(window.getComputedStyle(element).letterSpacing);
			currentSize_ts = isNaN(currentSize_ts) ? 0 : currentSize_ts; // Handle cases where lineHeight is 'normal' or an invalid value

			// Convert to pixels (optional, depending on your needs)
			currentSize_ts = currentSize_ts + 'px';
			var newSize_ts = parseFloat(currentSize_ts) + 0.7;
			// element.style.letterSpacing = newSize_ts;
			element.style.setProperty('letter-spacing', newSize_ts + 'px', 'important');
			localStorage.setItem('ts-spacing', parseFloat(newSize_ts));
		}
	});
}

function resetLetterspacing() {
	var elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)');
	elements.forEach(function(element) {
		// Reset font-size style for all elements
		element.style.letterSpacing = ''; // Reset to default or "normal"
		localStorage.setItem('ts-spacing', null);
		localStorage.setItem('ts-clickCount', 0);
		localStorage.setItem('ts-buttonClicked', false);
	});
}

var clickCount_lh = 0;

// Check local storage for previous state
var localStorageClickCount = localStorage.getItem('lh-clickCount');
if (localStorageClickCount) {
	clickCount_lh = parseInt(localStorageClickCount, 10);
}

function increaseLineheight() {
	var elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)');
	elements.forEach(function(element) {
		// Exclude elements inside #main_w_container and with class .accessability-f_item__name
		if (!isExcludedElement(element)) {
			var currentSize_lh = parseFloat(window.getComputedStyle(element).lineHeight);
			currentSize_lh = isNaN(currentSize_lh) ? 0 : currentSize_lh; // Handle cases where lineHeight is 'normal' or an invalid value

			// Convert to pixels (optional, depending on your needs)
			currentSize_lh = currentSize_lh + 'px';
			var newSize_lh = parseFloat(currentSize_lh) + 5 + 'px';
			localStorage.setItem('lh-height', parseFloat(newSize_lh));
			// element.style.lineHeight = newSize_lh;
			element.style.setProperty('line-height', newSize_lh, 'important'); /*add er*/

		}
	});
}

function resetlineheight() {
	var elements = document.querySelectorAll('*');
	elements.forEach(function(element) {
		// Reset font-size style for all elements
		element.style.lineHeight = ''; // Reset to default or "normal"
	});
	localStorage.setItem('lh-height', null);
	localStorage.setItem('lh-clickCount', 0);
	localStorage.setItem('lh-buttonClicked', false);
}

// Function to toggle the visibility of images
function toggleImages() {
	document.documentElement.classList.toggle('image-hide');
	document.documentElement.id = document.documentElement.classList.contains('image-hide') ? 'imageHideBg' : '';
	var images = document.querySelectorAll('img');
	// var bgRemove = document.querySelectorAll('*');
	var imageVisibilityState = {};
	// var bgimageVisibilityState = {};
	var tickIcon_ht = document.getElementById('tickIcon-hi');
	var featureItem = document.getElementById('featureItem-hi');

	// Toggle the visibility of images
	images.forEach(function(image, index) {
		if (!isExcludedElement(image)) {
			image.style.setProperty('visibility', image.style.visibility === 'hidden' ? 'visible' : 'hidden', 'important');
			imageVisibilityState[index] = image.style.visibility;

		}
	});


	// Toggle the visibility of the tickIcon
	tickIcon_ht.style.display = tickIcon_ht.style.display === 'none' ? 'inline-block' : 'none';

	// Toggle the feature-active class on featureItem
	featureItem.classList.toggle('feature-active');

	localStorage.setItem('imageVisibilityState', JSON.stringify(imageVisibilityState));

}

function highlightLinks() {
	var tickIcon_ht = document.getElementById('tickIcon-ht');
	var featureItem = document.getElementById('featureItem-ht');


	//AGAR feature-active class hai to remove kr do
	var linksHighlighted = true;
	if(featureItem.classList.contains('feature-active')){
		linksHighlighted = false;
	}

	// Toggle the visibility of the tickIcon
	tickIcon_ht.style.display = tickIcon_ht.style.display === 'none' ? 'inline-block' : 'none';

	// Toggle the feature-active class on featureItem
	featureItem.classList.toggle('feature-active');

	// Toggle the highlight of links
	var links = document.querySelectorAll('a');
	
	links.forEach(function(link, index) {
		if (!isExcludedElement(link)) {
			link.style.setProperty('background', link.style.background ? '' : 'black', 'important');
			link.style.setProperty('color', link.style.color ? '' : 'yellow', 'important');
			// Check if link is highlighted
			// if (link.style.getPropertyValue('background') === 'black' && link.style.getPropertyValue('color') === 'yellow') {
			// 	linksHighlighted = true;
			// }
		}
	});

	// Save state in local storage
	var HighlightLinkState = {
		tickIconVisible: tickIcon_ht.style.display === 'none' ? false : true,
		featureActive: featureItem.classList.contains('feature-active'),
		linksHighlighted: linksHighlighted
	};
	localStorage.setItem("highlightLinks", JSON.stringify(HighlightLinkState));
}

// Function to toggle the cursor feature and save state in local storage
function toggleCursorFeature() {
	;
	// Toggle the 'waf-bg-cursor' class on the body
	document.documentElement.classList.toggle('waf-bg-cursor');

	// Toggle the tick icon
	var tickIcon_cursor = document.getElementById('tickIcon-cursor');
	tickIcon_cursor.style.display = tickIcon_cursor.style.display === 'none' ? 'inline-block' : 'none';

	var featureItem = document.getElementById('featureItem-Cursor');

	// Toggle the feature-active class on featureItem
	featureItem.classList.toggle('feature-active');

	// Save state in local storage
	localStorage.setItem("cursorFeatureActive", featureItem.classList.contains('feature-active'));
}


function toggleFontFeature() {
	// Toggle the 'waf-font-df' class on the body
	document.documentElement.classList.toggle('waf-font-df');

	// Toggle the tick icon
	var tickIcon_df = document.getElementById('tickIcon-df');
	tickIcon_df.style.display = tickIcon_df.style.display === 'none' ? 'inline-block' : 'none';

	var featureItem = document.getElementById('featureItem-df');

	// Toggle the feature-active class on featureItem
	featureItem.classList.toggle('feature-active');

	// Save state in local storage
	localStorage.setItem("dyslexia", document.documentElement.classList.contains('waf-font-df'));

}

function openMain() {
	var mainElement = document.getElementById('main_w_container');
	mainElement.classList.add('showWidget');
	mainElement.style.right = '0px';
	mainElement.style.display = 'block';
}

function closeMain() {
	var mainElement = document.getElementById('main_w_container');
	mainElement.classList.remove('showWidget');
	// mainElement.style.right = '-490px';
	mainElement.style.display = 'none';
	var widgetBtn = document.getElementById('widget-custom-trigger');
	widgetBtn.style.display = 'flex';

}

function resetAll() {
	
	let reloadConfirmation = 1 || window.confirm('Reset to default mode, We need to reload the page. would you like to continue?');
	if(reloadConfirmation){
		//------->>> SCROLL UP/DOWN RESET ---//
		window.scrollTo(0, 0);
		localStorage.clear('scrollUpDown')
		//-------<<< SCROLL UP/DOWN RESET ---//
		var resetFeatures = document.querySelectorAll('.reset-feature');
		resetFeatures.forEach(function(feature) {
			feature.classList.remove('feature-active');
		});
	
		// Hide spans with class 'reset-tick'
		var resetTicks = document.querySelectorAll('.reset-tick');
		resetTicks.forEach(function(tick) {
			tick.style.display = 'none';
		});
	
		// Remove yellow highlight color on links
		var links = document.querySelectorAll('a');
		links.forEach(function(link) {
			link.style.background = '';
			link.style.color = '';
		});
	
		localStorage.setItem('highlightLinks', false);
	
		// Make Images Visible
	
		var images = document.querySelectorAll('img');
		images.forEach(function(image) {
			image.style.visibility = 'visible';
		});
	
		var resetImageVisibilityState = {};
		localStorage.setItem('imageVisibilityState', JSON.stringify(resetImageVisibilityState));
	
		document.documentElement.classList.remove('image-hide');
		document.documentElement.id = document.documentElement.classList.contains('image-hide') ? 'imageHideBg' : '';
	
	
		//Make Invert to default
	
		document.documentElement.classList.remove('waf-bg-white');
		localStorage.setItem('invertFeature', false);
	
		// Make font to default
	
		document.documentElement.classList.remove('waf-font-df');
		localStorage.setItem("dyslexia", false);
	
		// Make cursor default
	
		document.documentElement.classList.remove('waf-bg-cursor');
		localStorage.setItem("cursorFeatureActive", false);
	
		// Make Light-Dark to default
	
		// Uncheck
		var reset_check = document.getElementById("checkbox").checked = false;
		document.body.classList.remove("dark", reset_check);
		localStorage.setItem("darkMode", false);
	
		//Reset Lineheight
		localStorage.setItem('lh-range-value', 0);
		document.getElementById("line_height_ranger").value = 0;
		resetlineheight();
		//FONT SIZE
		localStorage.setItem('btn_ranger-clickCount', false);
		localStorage.setItem('btn_ranger-buttonClicked', false);
	
	
		// Reset Ltter Spacing
		localStorage.setItem('ts-range-value', 0);
		document.getElementById("text_space_ranger").value = 0;
		resetLetterspacing();
	
		//Reset Font Sizes
		document.getElementById("font_size_ranger").value = 0;
		resetFontSizes();
		document.getElementById('btn-s9').disabled = false;
		document.getElementById('btn-small-text').disabled = false;
	
		// Remove inner HTML of parent divs with class 'reset-steps'
		var resetSteps = document.querySelectorAll('.reset-steps');
		resetSteps.forEach(function(step) {
			step.innerHTML = '';
			step.classList.remove('featureSteps-visible');
		});
	
	
		startReading('Accessability feature disabled.').then(()=>{
			// resetspeech()	;//Reset Speech
		});
		
		localStorage.setItem("speak", false);
		//RESET ZOOM LEVEL
		document.getElementById("zoom_ranger").value = 0;
		document.body.style.zoom = 1;
		localStorage.setItem('zl-clickCount', false)
		location.reload();
	}
	

}


// grab the UI elements to work with
let isReading = false;
let utterance = null;
let previousSelectedElement = null;

// Create audio elements for sound effects
const speakOnSound = new Audio(`${AC_SCRIPT_DIR}/audio/screen_reader_on.mp3`);
const speakOffSound = new Audio();
// const speakOffSound = new Audio(`${AC_SCRIPT_DIR}/audio/screen_reader_off.mp3`);

function toggleSpeech() {
	if (!isReading) {
		// Enable speech
		speakOnSound.play();
		isReading = true;
	} else {
		// Disable speech
		resetspeech();
	}
}

function resetspeech() {
	speakOffSound.play();
	window.speechSynthesis.cancel();
	isReading = false;
	previousSelectedElement = null;
}

function startReadingOld(text) {
	utterance = new SpeechSynthesisUtterance(text);

	// Set properties for a more formal voice
	utterance.rate = 0.7; // Adjust the rate (0.5 is slower, 2.0 is faster)
	utterance.pitch = 10.0; // Set pitch to 1.0 for a natural voice

	// Attempt to set a female voice
	const voices = window.speechSynthesis.getVoices();
	const femaleVoice = voices.find(voice => voice.name.includes('female') && voice.lang.includes('en'));
	if (femaleVoice) {
		utterance.voice = femaleVoice;
	}

	window.speechSynthesis.speak(utterance);

	// Add an event listener for the 'end' event to reset the selection
	utterance.addEventListener('end', function() {
		resetSelection();
	});
}

function startReadingOld2(text, lang = 'en-US') {

	const speech = new SpeechSynthesisUtterance();
	const availableVoices = window.speechSynthesis.getVoices();
	let selectedVoice = null;

	// Check if the specified language is available
	selectedVoice = availableVoices.find(voice => voice.lang.includes(lang));
	if (selectedVoice) {
		speech.voice = selectedVoice;
		speech.lang = selectedVoice.lang;
		// alert(`Selected language (${lang}) is not available.`);
		return;
	}

	speech.text = text;
	speech.volume = 1; // Volume (0 to 1)
	speech.rate = 0.9; // Speed (0.1 to 10)
	speech.pitch = 1; // Pitch (0 to 2)

	// Speak the text
	window.speechSynthesis.speak(speech);

	// Add an event listener for the 'end' event to reset the selection
	speech.addEventListener('end', function() {
		resetSelection();
	});
}
function stopGoogleTextToSpeech(){
	document.getElementById('googleTextSpeecher').src = '';
}
function googleTextToSpeech(params) {
	return;
	const text = params.text; 
	const language = params.language;
	const languageGender = params.languageGender; 
	//HANDLE TEXT LENGTH AND LANAUGE AND GENEDER REQUIRED
	fetch(`${AC_SCRIPT_DIR}${atob('L2NvbnRyb2xsZXIvR29vZ2xlVGV4dFRvU3BlZWNoQ29udHJvbGxlci5waHA=')}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `text=${encodeURIComponent(text)}
		&language=${encodeURIComponent(language)}&languageGender=${encodeURIComponent(languageGender)}`
	})
	.then(response => response.json())
	.then(data => {
		if (data.audioContent) {
			const audioElement = document.getElementById('googleTextSpeecher');
			audioElement.src = 'data:audio/mp3;base64,' + data.audioContent;
			audioElement.play();
		} else {
			console.error('Error:', data.error);
		}
	})
	.catch(error => {
		console.error('Error:', error);
	});
}
function isTextGujarti(text){
	// Check if the text contains Gujarati characters
    const gujaratiRegex = /[\u0A80-\u0AFF]/;
    return (gujaratiRegex.test(text));
}
function startReading(text, lang = WIDGET_SPEECH_LANGUAGE) {
	//AGAR TEXT GUJARTI ME HOGA TO GOOGLE API CALL HOGA ELSE DEFAULT SpeechSynthesis CALL HOGA --TO MINIMIZE GOOGLE API REQUEST
	return new Promise((resolve, reject)=>{
		try {
			stopGoogleTextToSpeech();
			if(isTextGujarti(text)){
				//IN CASE OF GUJARTI CALL GOOGLE API
				const textToSpeechArgs = {
					text : text,
					language : "gu-IN", 
					languageGender : "MALE", 
				}
				googleTextToSpeech(textToSpeechArgs);
				//END
				resolve();
				return;
			}else{
				const speech = new SpeechSynthesisUtterance();
				// if(lang =='gu'){
				// 	speech.lang = "gu-IN";
				// }else if(lang =='hi'){
				// 	speech.lang = "hi-IN";
				// }else if(lang =='en'){
				// 	speech.lang = "en-US";
				// }else{
				// 	console.log('Invalid language selected, Default language English selected.')
				// 	speech.lang = "en-US";
				// }
				speech.lang = "en-US";
				speech.text = text;
				speech.volume = 1; // Volume (0 to 1)
				speech.rate = 0.9; // Speed (0.1 to 10)
				speech.pitch = 1; // Pitch (0 to 2)
				// Speak the text
				window.speechSynthesis.speak(speech);
				// Add an event listener for the 'end' event to reset the selection
				speech.addEventListener('end', function () {
					resetSelection();
					resolve();
				});
			}
		} catch (error) {
			reject(error);
		}
	})
}

function selectAndSpeak(element) {
	const range = document.createRange();
	range.selectNodeContents(element);
	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	if (previousSelectedElement !== element) {
		// If a different element is clicked, cancel the current speech
		window.speechSynthesis.cancel();
		startReading(selection.toString());
		previousSelectedElement = element;
	} else {
		// If the same element is clicked, toggle between play/pause
		if (isReading) {
			window.speechSynthesis.pause();
		} else {
			window.speechSynthesis.resume();
		}
	}
}

function resetSelection() {
	const selection = window.getSelection();
	selection.removeAllRanges();
	previousSelectedElement = null;
}
function scrollUp(){
	let scrollUpTickIcon = document.getElementById('scrollUptickIcon');
	scrollUpTickIcon.style.display = scrollUpTickIcon.style.display == 'inline-block'?'none':'inline-block';
	
	document.getElementById('scrollDowntickIcon').style.display = 'none';
	window.scrollTo(0, 0);
}
function scrollDown(){
	
	document.getElementById('scrollDowntickIcon').style.display = 'inline-block';
	document.getElementById('scrollUptickIcon').style.display = 'none';
	
	window.scrollTo(0, document.body.scrollHeight);
}
function init(params) {
	//FONT RANGER PRESET VALUE //
	//-------------->>> SET OLD SCROLL UP/DOWN STATUS --------------//
	let scrollUPDownStatus = localStorage.getItem('scrollUpDown');
	if(scrollUPDownStatus){
		if(scrollUPDownStatus == 'up'){
			scrollUp();
		}else if(scrollUPDownStatus == 'down'){
			scrollDown();
		}
	}
	//--------------<<< SET OLD SCROLL UP/DOWN STATUS --------------//
	//-------------->>> SET OLD FONT SIZE STATUS --------------//
	var localStorageClickCount = localStorage.getItem('btn_ranger-clickCount');
	if (localStorageClickCount != null) {
		let fontSizeRangerContainer = document.getElementById("featureItem-font_size");
		let fontSizeTickIcon = document.getElementById("tickIcon-font_size");
		// alert(localStorageClickCount)
		if(localStorageClickCount !='false' && localStorageClickCount != 0){
			let fontRangerValue = 0;
			fontRangerValue = parseInt(localStorageClickCount, 10);
			document.getElementById("font_size_ranger").value = fontRangerValue;
			adjustFontSizes(true, 'bt', fontRangerValue, {font_steps:fontRangerValue});
			fontSizeRangerContainer.classList.add("feature-active");
			fontSizeTickIcon.style.display = 'inline-block';
		}else{
			fontSizeRangerContainer.classList.remove("feature-active");
			fontSizeTickIcon.style.display = 'none';
		}
	}
	//--------------<<< SET OLD FONT SIZE STATUS --------------//
	//-------------->>> SET OLD LINE HEIGHT STATUS --------------//
	let localStorageLHClickCount = localStorage.getItem('lh-range-value');
	if (localStorageLHClickCount != null && localStorageLHClickCount != 'false' && localStorageLHClickCount != 0) {
		setLineHeight(localStorageLHClickCount);
		document.getElementById("line_height_ranger").value = localStorageLHClickCount;
	}
	//--------------<<< SET OLD LINE HEIGHT STATUS --------------//
	//-------------->>> SET OLD TEXT SPACING STATUS --------------//
	let localStorageTSClickCount = localStorage.getItem('ts-range-value');
	if (localStorageTSClickCount != null && localStorageTSClickCount != 0) {
		setLetterSpacing(localStorageTSClickCount);
		document.getElementById("text_space_ranger").value = localStorageTSClickCount;
	}
	//--------------<<< SET OLD TEXT SPACING STATUS --------------//
	//-------------->>> SET OLD ZOOM LEVEL STATUS --------------//
	let localStorageZLClickCount = localStorage.getItem('zl-clickCount');
	let zoomRangerContainer = document.getElementById("featureItem-zoom");
	let zoomTickIcon = document.getElementById("tickIcon-zoom");
	if (localStorageZLClickCount != null) {
		if(localStorageZLClickCount != 'false' && localStorageZLClickCount != 0){
		let zoomRangerValue = 0;
		zoomRangerValue = parseInt(localStorageZLClickCount, 10);
		document.getElementById("zoom_ranger").value = zoomRangerValue;

		document.body.style.zoom =  1 + (0.1 * zoomRangerValue);//it will handle both negative and positive value
		
			zoomRangerContainer.classList.add("feature-active");
			zoomTickIcon.style.display = 'inline-block';
		}else{
			zoomRangerContainer.classList.remove("feature-active");
			zoomTickIcon.style.display = 'none';
		}
	}
	//--------------<<< SET OLD ZOOM LEVEL STATUS --------------//



	//-------------->>> ON HOVER OF FEATURE ITEM SPEAK THE TEXT --------------//
	var ENABLE_OPTION_READ = true;
	var featureItems = document.querySelectorAll(".accessability-f_item, .speakIt");
	featureItems.forEach((ele) => {
		ele.addEventListener('mouseleave', function(e) {
			window.speechSynthesis.cancel();
		});
		ele.addEventListener('mouseenter', function(e) {
			if(ENABLE_OPTION_READ){
				let title = e.currentTarget.getAttribute('title');
				if(title){
					startReading(title);
				}
			}
		});
	});
	//--------------<<< ON HOVER OF FEATURE ITEM SPEAK THE TEXT --------------//

	//--- THIS FUNCTION ADD EVENT LISTNER TO ALL HTML ELEMENT ---//
	var featureItem_ts = document.getElementById('featureItem-ts');
	var featureSteps_ts = document.getElementById('featureSteps-ts');
	var tickIcon_ts = document.getElementById('tickIcon-ts');

	// Restore tickIcon visibility
	var SpacingState = JSON.parse(localStorage.getItem('ts-buttonClicked'));
	var SpacingClickState = JSON.parse(localStorage.getItem('ts-clickCount'));
	var SpacingSizeState = localStorage.getItem('ts-spacing');


	if (SpacingState) {

		tickIcon_ts.style.display = 'inline-block';
		featureItem_ts.classList.add('feature-active');
		featureSteps_ts.classList.add('featureSteps-visible');

		var stepsHTML_ts = '';
		for (var i = 0; i < 3; i++) {
			stepsHTML_ts += '<span class="' + (i < SpacingClickState ? 'active step accessability-features__step' : 'step accessability-features__step') + '"></span>';
		}
		featureSteps_ts.innerHTML = stepsHTML_ts;

		const elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)'); // Select all elements except buttons
		elements.forEach(function(element) {
			if (!isExcludedElement(element)) {
				element.style.setProperty('letter-spacing', SpacingSizeState + 'px', 'important');
			}
		});
	}


		var tickIcon_ht = document.getElementById('tickIcon-hi');
		var featureItem = document.getElementById('featureItem-hi');
		var images = document.querySelectorAll('img');

		// Restore tickIcon visibility
		var imageVisibilityState = JSON.parse(localStorage.getItem('imageVisibilityState'));

		if (imageVisibilityState) {
			images.forEach(function(image, index) {
				if (!isExcludedElement(image) && imageVisibilityState[index]) {
					image.style.setProperty('visibility', imageVisibilityState[index], 'important');

				}
			});
		}

		if (imageVisibilityState && imageVisibilityState['1'] === 'hidden') {
			tickIcon_ht.style.display = 'inline-block';
			featureItem.classList.add('feature-active');
			document.documentElement.classList.toggle('image-hide');
			document.documentElement.id = document.documentElement.classList.contains('image-hide') ? 'imageHideBg' : '';
		}


	document.getElementById('widget_body').addEventListener('mouseleave', function() {
		window.speechSynthesis.cancel();
	});
	document.getElementById('dark-btn').addEventListener('click', function() {

		var tickIcon_ht_dark = document.getElementById('tickIcon-ht-dark');
		var featureItemDrak = document.getElementById('featureItem-ht-dark');
		const checkbox = document.getElementById("checkbox");

		const isDarkMode = checkbox.checked;
		document.body.classList.toggle("dark", isDarkMode);

		// Toggle the visibility of the tickIcon
		tickIcon_ht_dark.style.display = tickIcon_ht_dark.style.display === 'none' ? 'inline-block' : 'none';

		// Toggle the feature-active class on featureItem
		featureItemDrak.classList.toggle('feature-active');

		// Save the state to local storage
		localStorage.setItem("darkMode", isDarkMode);

	});

	// Call applyDarkModeOnLoad function on page load


		var tickIcon_ht_dark = document.getElementById('tickIcon-ht-dark');
		var featureItemDrak = document.getElementById('featureItem-ht-dark');
		const checkbox = document.getElementById("checkbox");

		const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));
		if (isDarkMode === true) {
			checkbox.checked = isDarkMode;
			document.body.classList.add("dark");
			tickIcon_ht_dark.style.display = 'inline-block';
			featureItemDrak.classList.toggle('feature-active');
		}





		var GetCursorState = JSON.parse(localStorage.getItem('cursorFeatureActive'));
		var tickIcon_cursor = document.getElementById('tickIcon-cursor');
		var featureItem = document.getElementById('featureItem-Cursor');

		if (GetCursorState === true) {
			document.documentElement.classList.add('waf-bg-cursor');
			tickIcon_cursor.style.display = 'inline-block';
			featureItem.classList.add('feature-active');
		}




	

		var GetdyslexiaState = JSON.parse(localStorage.getItem('dyslexia'));
		var tickIcon_df = document.getElementById('tickIcon-df');
		var featureItem_df = document.getElementById('featureItem-df');

		if (GetdyslexiaState === true) {
			document.documentElement.classList.add('waf-font-df');
			tickIcon_df.style.display = 'inline-block';
			featureItem_df.classList.add('feature-active');
		}

	

	

		var GetInvertState = JSON.parse(localStorage.getItem('invertFeature'));
		var tickIcon_ic = document.getElementById('tickIcon-ic');
		var featureItem_ic = document.getElementById('featureItem-ic');

		if (GetInvertState === true) {
			document.documentElement.classList.add('waf-bg-white');
			tickIcon_ic.style.display = 'inline-block';
			featureItem_ic.classList.add('feature-active');
		}

	
	
		var GetspeakState = JSON.parse(localStorage.getItem('speak'));
		var tickIcon_sp = document.getElementById('tickIcon_sp');
		var featureItem_sp = document.getElementById('featureItem_sp');

		if (GetspeakState === true) {
			tickIcon_sp.style.display = 'inline-block';
			featureItem_sp.classList.add('feature-active');
			speakOnSound.play();
			isReading = true;
		}



	
		var tickIcon_ht = document.getElementById('tickIcon-ht');
		var featureItem = document.getElementById('featureItem-ht');
		var links = document.querySelectorAll('a');

		// Restore the state from local storage
		var GetHighlightLinkState = JSON.parse(localStorage.getItem('highlightLinks'));
		if (GetHighlightLinkState) {
			// Restore tickIcon visibility
			if (GetHighlightLinkState.tickIconVisible) {
				tickIcon_ht.style.display = 'inline-block';
			} else {
				tickIcon_ht.style.display = 'none';
			}

			// Restore featureItem class
			if (GetHighlightLinkState.featureActive) {
				featureItem.classList.add('feature-active');
			} else {
				featureItem.classList.remove('feature-active');
			}

			// Restore link highlighting
			if (GetHighlightLinkState.linksHighlighted) {
				links.forEach(function(link, index) {
					if (!isExcludedElement(link) && GetHighlightLinkState) {
						link.style.setProperty('background', '#1C1D1F', 'important');
						link.style.setProperty('color', 'yellow', 'important');
					}
				});
			}
		}
	
	//ADD EVENT TO INLARGE SMALL TEXT BUTTON
	handleFontSizes('btn-s9', 'featureItem', 'featureSteps', 'tickIcon', true, 'bt'); // For Bigger Text
	handleFontSizes('btn-small-text', 'featureItem-st', 'featureSteps-st', 'tickIcon-st', false, 'st'); // For Smaller Text

	document.getElementById('btn-s12').addEventListener('click', function() {
		clickCount_lh++;
		var featureItem_lh = document.getElementById('featureItem-lh');
		var featureSteps_lh = document.getElementById('featureSteps-lh');
		var tickIcon_lh = document.getElementById('tickIcon-lh');

		// Save current state to local storage
		localStorage.setItem('lh-clickCount', clickCount_lh);
		localStorage.setItem('lh-buttonClicked', true);

		// Reset on 5th click
		if (clickCount_lh === 4) {
			clickCount_lh = 0;
			featureItem_lh.classList.remove('feature-active');
			featureSteps_lh.classList.remove('featureSteps-visible');
			featureSteps_lh.innerHTML = '';
			tickIcon_lh.style.display = 'none';
			// Reset font size of all elements

			// Save current state to local storage
			localStorage.setItem('lh-clickCount', 0);
			localStorage.setItem('lh-buttonClicked', false);

			resetlineheight();
			return;
		}

		// Add feature-active class on the first click
		if (clickCount_lh === 1) {
			featureItem_lh.classList.add('feature-active');
			featureSteps_lh.classList.add('featureSteps-visible');
			localStorage.setItem('lh-clickCount', 1);
			localStorage.setItem('lh-buttonClicked', true);
		}

		// Update data-reader-content attribute
		document.getElementById('btn-s12').setAttribute('data-reader-content', clickCount_lh);
		// Add step span tags dynamically
		var stepsHTML_lh = '';
		for (var i = 0; i < 3; i++) {
			stepsHTML_lh += '<span class="' + (i < clickCount_lh ? 'active step accessability-features__step' : 'step accessability-features__step') + '"></span>';
		}
		featureSteps_lh.innerHTML = stepsHTML_lh;
		// Display tick icon until the 4th click
		if (clickCount_lh < 4) {
			tickIcon_lh.style.display = 'inline-block';
		}

		increaseLineheight();

	});
	// invert script

	// Function to toggle the 'Invert' feature
	document.getElementById('btn-invert').addEventListener('click', function() {

		// Toggle the 'invert' class on the body
		document.documentElement.classList.toggle('waf-bg-white');

		// Toggle the tick icon
		var tickIcon_ic = document.getElementById('tickIcon-ic');
		tickIcon_ic.style.display = tickIcon_ic.style.display === 'none' ? 'inline-block' : 'none';

		var featureItem = document.getElementById('featureItem-ic');

		// Toggle the feature-active class on featureItem
		featureItem.classList.toggle('feature-active');

		// Save the state in localStorage
		localStorage.setItem('invertFeature', document.documentElement.classList.contains('waf-bg-white'));

	});

	document.getElementById('font_size_ranger').addEventListener('change', function() {
		let currentValue = this.value;
		resetFontSizes();//RESET IN ALL CASE
		adjustFontSizes(true, 'bt', currentValue, {font_steps:currentValue})
		
		var clickCount = currentValue;
		if(clickCount == 0){
			//AGAR VALUE = 0 THEN REMOVE ACTIVE FROM LABEL
			document.getElementById("featureItem-font_size").classList.remove('feature-active');
			document.getElementById("tickIcon-font_size").style.display = 'none';
		}else{
			document.getElementById("featureItem-font_size").classList.add('feature-active');
			document.getElementById("tickIcon-font_size").style.display = 'inline-block';

		}
		localStorage.setItem('btn_ranger-clickCount', clickCount);
		localStorage.setItem('btn_ranger-buttonClicked', true);
		
		return;
	});

	function setLineHeight(currentValue){
		// resetlineheight();//RESET IN ALL CASE
		var clickCount = currentValue;
		if(clickCount == 0){
			resetlineheight();//RESET IN ALL CASE
			//AGAR VALUE = 0 THEN REMOVE ACTIVE FROM LABEL
			document.getElementById("featureItem-line_height").classList.remove('feature-active');
			document.getElementById("tickIcon-line_height").style.display = 'none';
		}else{
			document.getElementById("featureItem-line_height").classList.add('feature-active');
			document.getElementById("tickIcon-line_height").style.display = 'inline-block';


			var lineHeightValue = 5 * currentValue;
			var elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)');
			elements.forEach(function(element) {
				// Exclude elements inside #main_w_container and with class .accessability-f_item__name
				if (!isExcludedElement(element)) {
					var currentSize_lh = parseFloat(window.getComputedStyle(element).lineHeight);
					currentSize_lh = isNaN(currentSize_lh) ? 0 : currentSize_lh; // Handle cases where lineHeight is 'normal' or an invalid value

					// Convert to pixels (optional, depending on your needs)
					currentSize_lh = currentSize_lh + 'px';
					var newSize_lh = parseFloat(currentSize_lh) + lineHeightValue + 'px';
					localStorage.setItem('lh-height', parseFloat(newSize_lh));
					element.style.setProperty('line-height', newSize_lh, 'important'); 

				}
			});
			
		}
		return;
	}
	document.getElementById('line_height_ranger').addEventListener('change', function() {

		let currentValue = this.value;
		setLineHeight(currentValue);
		// Save current state to local storage
		localStorage.setItem('lh-range-value', currentValue);
		// localStorage.setItem('lh-clickCount', currentValue);
		// localStorage.setItem('lh-buttonClicked', true);

	});
	//-------------------->>> EVENT ON TEXT SPACING RANGER ---------------------------//
	function setLetterSpacing(currentValue) {
		
		resetLetterspacing()//RESET IN ALL CASE
		var clickCount = currentValue;
		if(clickCount == 0){
			//AGAR VALUE = 0 THEN REMOVE ACTIVE FROM LABEL
			document.getElementById("featureItem-text_space").classList.remove('feature-active');
			document.getElementById("tickIcon-text_space").style.display = 'none';
		}else{
			document.getElementById("featureItem-text_space").classList.add('feature-active');
			document.getElementById("tickIcon-text_space").style.display = 'inline-block';
			const elements = document.querySelectorAll('*:not(.widget-custom-trigger, .widget-custom-trigger span)'); // Select all elements except buttons
			var newValue = 0.7 * currentValue;
			elements.forEach(function(element) {
				if (!isExcludedElement(element)) {
	
					var currentSize_ts = parseFloat(window.getComputedStyle(element).letterSpacing);
					currentSize_ts = isNaN(currentSize_ts) ? 0 : currentSize_ts; // Handle cases where lineHeight is 'normal' or an invalid value
	
					// Convert to pixels (optional, depending on your needs)
					currentSize_ts = currentSize_ts + 'px';
					var newSize_ts = parseFloat(currentSize_ts) + newValue;
					// element.style.letterSpacing = newSize_ts;
					element.style.setProperty('letter-spacing', newSize_ts + 'px', 'important');
					localStorage.setItem('ts-spacing', parseFloat(newSize_ts));
				}
			});
		}
	}
	document.getElementById('text_space_ranger').addEventListener('change', function() {
		let currentValue = this.value;
		setLetterSpacing(currentValue);
		// Save current state to local storage
		localStorage.setItem('ts-clickCount', currentValue);
		localStorage.setItem('ts-range-value', currentValue);
		return;
	});
	//--------------------<<< EVENT ON TEXT SPACING RANGER ---------------------------//
	//-------------------->>> EVENT ON ZOOM CONTROL RANGER ---------------------------//
	document.getElementById('zoom_ranger').addEventListener('change', function() {
		let currentValue = this.value;
		document.body.style.zoom = 1;
		resetLetterspacing()//RESET IN ALL CASE
		
		var clickCount = currentValue;
		if(clickCount == 0){
			//AGAR VALUE = 0 THEN REMOVE ACTIVE FROM LABEL
			document.getElementById("featureItem-zoom").classList.remove('feature-active');
			document.getElementById("tickIcon-zoom").style.display = 'none';
			localStorage.setItem('zl-buttonClicked', false);
		}else{
			document.getElementById("featureItem-zoom").classList.add('feature-active');
			document.getElementById("tickIcon-zoom").style.display = 'inline-block';
			localStorage.setItem('zl-buttonClicked', true);
			
			document.body.style.zoom =  1 + (0.1 * currentValue);//it will handle both negative and positive value
		}
		// Save current state to local storage
		localStorage.setItem('zl-clickCount', clickCount);
		
		return;
	});
	//--------------------<<< EVENT ON ZOOM CONTROL RANGER ---------------------------//
	//-------------------->>> EVENT ON CLICK ON SCROLL UP/DOWN RANGER ---------------------------//
	document.getElementById('scrollUpBtn').addEventListener('click', function() {
		scrollUp();
		localStorage.setItem('scrollUpDown', 'up')
	});
	document.getElementById('scrollDownBtn').addEventListener('click', function() {
		scrollDown();
		localStorage.setItem('scrollUpDown', 'down')
	});
	//--------------------<<< EVENT ON CLICK ON SCROLL UP/DOWN RANGER ---------------------------//

	//   RGV2ZWxvcGVkIGJ5IC0gRmlyb3ogQW5zYXJpIC04Nzg5NzAxOTY=

	// Show Hide Main Widgets Div on Click
	document.getElementById('widget-custom-trigger').addEventListener('click', function() {
		const mainContainer = document.getElementById('main_w_container');
		if (mainContainer.classList.contains('showWidget')) {
			closeMain();
			mainContainer.classList.remove('showWidget')
		} else {
			this.style.display = 'none';
			openMain();
			mainContainer.classList.add('showWidget')
		}
	});
	document.addEventListener('mouseup', function(event) {
		if (isReading) {
			const clickedElement = event.target;

			// Check if the clicked element can contain text content
			const allowedTags = ['P', 'SPAN', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'LI', 'LABEL', 'BUTTON', 'TD', 'TH', 'STRONG', 'EM', 'B', 'I', 'U', 'SMALL', 'BIG', 'SUB', 'SUP'];

			if (allowedTags.includes(clickedElement.tagName.toUpperCase())) {
				selectAndSpeak(clickedElement);
			}
		}
	});

	// click handler for the "Speak On" button
	const speakEl = document.getElementById('speak');
	speakEl.addEventListener('click', toggleSpeech);


	document.getElementById('speak').addEventListener('click', function() {
		// Toggle the tick icon
		var tickIcon_sp = document.getElementById('tickIcon_sp');
		tickIcon_sp.style.display = tickIcon_sp.style.display === 'none' ? 'inline-block' : 'none';

		var featureItem_sp = document.getElementById('featureItem_sp');

		// Toggle the feature-active class on featureItem
		featureItem_sp.classList.toggle('feature-active');

		// Save state in local storage
		localStorage.setItem("speak", featureItem_sp.classList.contains('feature-active'));
	});

	


	//--- THEME SET START ---
	if (params.backgroundColor) {
		document.documentElement.style.setProperty('--color3', params.backgroundColor)
	}
	//--- THEME SET START END ---
}

function addAccessabilityHTML(params) {
	return new Promise((resolve) => {
		

		if(params['accessabilityBtn']){
			accessabilityBtnText = params['accessabilityBtn'];
		}
		if(params['speechLanguage']){
			WIDGET_SPEECH_LANGUAGE = params['speechLanguage'];
		}
		
		var widgetBtn = `<button id="widget-custom-trigger" class="widget-custom-trigger" aria-label="Accessibility Widget" data-trigger="true" aria-haspopup="dialog">
              ${accessabilityBtnText}
          </button>`;
		//---1
		// const body = document.querySelector('body');
		// body.innerHTML = widgetSection + body.innerHTML;

		//---2
		document.body.insertAdjacentHTML('afterbegin', widgetSection);

		if(params.accessabilityBtnContainer){
			const btnLocation = document.getElementById(params.accessabilityBtnContainer);
			if(!btnLocation){
				alert(atob('SW52YWxpZCBhY2Nlc3NiaWlsdHkgYnV0dG9uIGNvbnRhaW5lciBpZA=='));
			}else{
				btnLocation.innerHTML = `<div id="widget-custom-trigger" aria-label="Accessibility Widget" data-trigger="true" aria-haspopup="dialog">
              ${accessabilityBtnText}
          </div>`;
			}
		}else{
			document.body.insertAdjacentHTML('afterbegin', widgetBtn);
			// body.innerHTML += widgetBtn;
		}
		resolve(params);
	});
}
async function RenderAccessability(params) {
	if(!params.authentication_check_api_url){
		console.error('authentication_check_api_url is rquired');
	}
	const token = document.querySelector('meta[name="acc_tkn"]').getAttribute('content');
	if(!token){
		console.log('QUNDRVNTQUJJTElUWSBUT0tFTiBSRVFVUklFRC4=')
		return false;
	}
	await fetch(params.authentication_check_api_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `token=${(token)}`
	})
	.then(response => response.json())
	.then(data => {
		if (!data.success) {
			console.error(atob('YWNjZXNzYWJpbGl0eSByZW5kZXIgZXJyb3I='));
			return false;
		} else {
			accessabilityBtnText = data.accessabilityBtnText;
			widgetSection = data.widgetSection;
			// document.addEventListener('DOMContentLoaded', function() {
				addAccessabilityHTML(params).then((response) => {
					params = response;
					init(params); //
				});
				return true;
			// });
		}
	})
	.catch(error => {
		console.error('Error:', error);
		return false;
	});
	
}
function cleanupConfigScripts() {
    document.querySelectorAll('.erasableJsSrc').forEach(ele => {
        ele.remove(); // Completely removes the element from DOM instead of emptying .src
    });
}