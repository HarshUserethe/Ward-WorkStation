        function googleTranslateElementInit() {
            console.log("start")
            new google.translate.TranslateElement({
                pageLanguage: 'en',  // Set the page language to English
                includedLanguages: 'hi',  // Translate to Hindi
                layout: google.translate.TranslateElement.InlineLayout.TEXT, // Set layout to text only
                autoDisplay: false  // Disable automatic display of the translation toolbar
            }, 'google_translate_element');

            // Trigger translation programmatically
            var translateButton = document.querySelector('.goog-te-combo');
            translateButton.dispatchEvent(new Event('change'));
            console.log("end")
        }
 