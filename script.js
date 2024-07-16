// Global variable to store the current language
let currentLanguage = 'he';

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initSmoothScrolling();
    initVoiceInput();
    initLanguageSelector();
    loadTranslations(currentLanguage); // Initial loading of translations
});

function initContactForm() {
    const form = document.getElementById('contact-form');
    const responseDiv = document.getElementById('contact-form-response');
    if (responseDiv) responseDiv.style.display = 'none';
    if (form) form.addEventListener('submit', handleFormSubmit);
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
}

function initVoiceInput() {
    const recognitionButton = document.getElementById('voice-input');
    if (recognitionButton && 'webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognitionButton.addEventListener('click', () => recognition.start());
        recognition.onresult = handleVoiceInput;
    }
}

function initLanguageSelector() {
    const languageToggle = document.getElementById('language-toggle');
    const languageDropdown = document.getElementById('language-dropdown');
    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', toggleLanguageDropdown);
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', changeLanguage);
        });
        document.addEventListener('click', closeLanguageDropdown);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const responseDiv = document.getElementById('contact-form-response');

    fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    })
    .then(response => {
        responseDiv.style.display = 'block';
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        responseDiv.textContent = 'An error occurred. Please try again.';
        responseDiv.style.display = 'block';
    });
}

function smoothScroll(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (href && href !== '#') {
        document.querySelector(href).scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function toggleServiceDetails(serviceId) {
    const details = document.getElementById(serviceId + '-details');
    if (details) {
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }
}

function handleVoiceInput(event) {
    console.log('Voice input received:', event.results[0][0].transcript);
    // Here you can add logic to handle the voice input
}

function toggleLanguageDropdown(e) {
    e.stopPropagation();
    const languageDropdown = document.getElementById('language-dropdown');
    if (languageDropdown) {
        languageDropdown.style.display = languageDropdown.style.display === 'block' ? 'none' : 'block';
    }
}

function changeLanguage(e) {
    e.preventDefault();
    e.stopPropagation();
    const lang = this.getAttribute('data-lang');
    console.log('Changing language to:', lang);

    const flagSrc = this.querySelector('img').src;
    const currentLanguageFlag = document.getElementById('current-language-flag');
    if (currentLanguageFlag) {
        currentLanguageFlag.src = flagSrc;
    }

    const languageDropdown = document.getElementById('language-dropdown');
    if (languageDropdown) {
        languageDropdown.style.display = 'none';
    }

    currentLanguage = lang;
    loadTranslations(lang);
}

function closeLanguageDropdown(e) {
    const languageToggle = document.getElementById('language-toggle');
    const languageDropdown = document.getElementById('language-dropdown');
    if (languageToggle && languageDropdown &&
        !languageToggle.contains(e.target) &&
        !languageDropdown.contains(e.target)) {
        languageDropdown.style.display = 'none';
    }
}

function loadTranslations(lang) {
    console.log('Loading translations for:', lang);
    fetch('translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Translations loaded:', data);
            applyTranslations(data, lang);
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });
}

function applyTranslations(translations, lang) {
    console.log('Applying translations for language:', lang);
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translations[key][lang];
            } else {
                element.textContent = translations[key][lang];
            }
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${lang}`);
        }
    });

    // Update the direction of the page based on the language
    document.dir = (lang === 'he') ? 'rtl' : 'ltr';

    // Update CSS classes based on the language
    document.body.classList.remove('lang-he', 'lang-en', 'lang-es');
    document.body.classList.add(`lang-${lang}`);
}