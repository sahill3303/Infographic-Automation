const CONFIG = {
    WEBHOOK_URL: 'https://sahil0333.app.n8n.cloud/webhook/generate-infographic'
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const generateBtn = document.getElementById('generate-btn');
    const urlInput = document.getElementById('youtube-url');
    const loadingSection = document.getElementById('loading');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    const errorMessage = document.getElementById('error-message');
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-html-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Theme Toggle Logic
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // Generate Button Logic
    generateBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();

        if (!url) {
            showError('Please enter a valid YouTube URL.');
            return;
        }

        if (!isValidYoutubeUrl(url)) {
            showError('Please enter a valid YouTube video URL.');
            return;
        }

        // Reset UI
        showError(''); // Clear errors
        resultSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
        generateBtn.disabled = true;
        generateBtn.innerHTML = `<span>Generating...</span> <div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>`;

        try {
            const response = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ youtubeUrl: url })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const html = await response.text();

            if (!html) {
                throw new Error('No HTML content received from the server.');
            }

            displayResult(html);



        } catch (error) {
            console.error('Generation Error:', error);
            showError('Failed to generate infographic. Please try again later. ' + error.message);
        } finally {
            loadingSection.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.innerHTML = `<span>Generate Infographic</span> <i class="fa-solid fa-bolt"></i>`;
        }
    });

    // Helper: Display Result
    function displayResult(htmlContent) {
        resultContent.innerHTML = htmlContent;
        resultSection.classList.remove('hidden');

        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Helper: Show Error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        // Shake animation for input
        urlInput.parentElement.classList.add('shake');
        setTimeout(() => urlInput.parentElement.classList.remove('shake'), 500);
    }

    // Helper: Validate YouTube URL
    function isValidYoutubeUrl(url) {
        // Simple regex for YouTube URLs
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        return regex.test(url);
    }

    // Download Functionality
    downloadBtn.addEventListener('click', () => {
        const content = resultContent.innerHTML;
        // Wrap content in a basic HTML structure for standalone viewing
        const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Generated Infographic</title>
    <style>body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; line-height: 1.6; }</style>
</head>
<body>
    ${content}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'infographic.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Copy Functionality
    copyBtn.addEventListener('click', () => {
        const content = resultContent.innerHTML;
        navigator.clipboard.writeText(content).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showError('Failed to copy to clipboard');
        });
    });
});

// CSS for Shake Animation (Injecting dynamically or could be in CSS)
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
.shake {
    animation: shake 0.5s;
    border-color: var(--error-color) !important;
}
`;
document.head.appendChild(style);
