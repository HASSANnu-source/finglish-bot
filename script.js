// داده‌های تبدیل فینگلیش به فارسی
const JSON_URL = './data.json';
// تابع بارگذاری داده‌های JSON از یک URL
async function loadJsonData() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error(`خطای دریافت JSON: ${response.status}`);
        jsonData = await response.json();
        console.log('داده‌های JSON بارگذاری شدند:', jsonData);
    } catch (error) {
        console.error('خطا در بارگذاری JSON:', error);
    }
}

// تابع تبدیل فینگلیش به فارسی
async function transliterate(text) {
    try {

        // تقسیم متن به کلمات جداگانه
        const words = text.split(' ');
        const translatedWords = [];

        for (const word of words) {
            const lowerWord = word.toLowerCase();

            // اگر کلمه به 'e' ختم شود، آن را حذف کن
            const wordWithoutE = lowerWord.endsWith('e') ? lowerWord.slice(0, -1) : lowerWord;

            // ابتدا کلمه کامل را در JSON بررسی کن
            if (jsonData[lowerWord]) {
                translatedWords.push(jsonData[lowerWord]);
            }
            // اگر کلمه کامل وجود نداشت، کلمه بدون 'e' را بررسی کن
            else if (jsonData[wordWithoutE]) {
                translatedWords.push(jsonData[wordWithoutE]);
            }
            // در غیر این صورت، از قوانین پیش‌فرض استفاده کن
            else {
                const rules = [
                    [/sh/g, 'ش'], [/ph/g, 'ف'], [/gh/g, 'غ'],
                    [/oo/g, 'و'], [/kh/g, 'خ'], [/ch/g, 'چ'],
                    [/zh/g, 'ژ'], [/ck/g, 'ک'], [/mj/g, 'خامنه‌ای']
                ];

                const letterMap = {
                    'a': 'ا', 'b': 'ب', 'c': 'ک', 'd': 'د',
                    'e': '', 'f': 'ف', 'g': 'گ', 'h': 'ه',
                    'i': 'ی', 'j': 'ج', 'k': 'ک', 'l': 'ل',
                    'm': 'م', 'n': 'ن', 'o': 'و', 'p': 'پ',
                    'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت',
                    'u': 'و', 'v': 'و', 'w': 'و', 'x': 'کس',
                    'y': 'ی', 'z': 'ز'
                };

                let transliterated = rules.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), lowerWord);
                transliterated = [...transliterated].map(char => letterMap[char] ?? char).join('');
                translatedWords.push(transliterated);
            }
        }

        // ترکیب کلمات ترجمه‌شده به یک متن واحد
        return translatedWords.join(' ');

    } catch (error) {
        console.error('خطا در تبدیل:', error);
        return text;
    }
}

// تابع تبدیل متن
async function convertText() {
    const inputText = document.getElementById('inputText').value;
    const resultDiv = document.getElementById('result');

    if (!inputText) {
        resultDiv.innerText = 'لطفاً متن را وارد کنید.';
        return;
    }

    try {
        const convertedText = await transliterate(inputText);
        resultDiv.innerText = convertedText;
    } catch (error) {
        resultDiv.innerText = 'خطا: ' + error.message;
    }
}        
loadJsonData(); // مطمئن شویم که jsonData بارگذاری شده است
convertText()
