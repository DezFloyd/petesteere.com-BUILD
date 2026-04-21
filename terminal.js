(function() {
    if (document.getElementById('dev-nav-wrapper')) return;

    // Calculate relative path for navigation commands
    const isSubdir = window.location.pathname.includes('/AboutMe/') || window.location.pathname.includes('/Portfolio/');
    const basePath = isSubdir ? '../' : './';

    // Inject Terminal HTML
    const wrapper = document.createElement('div');
    wrapper.id = 'dev-nav-wrapper';
    wrapper.innerHTML = `
        <div id="dev-terminal" class="hidden">
            <div id="terminal-output"></div>
            <div id="terminal-input-line">
                <span class="prompt">pete@local:~$</span>
                <input type="text" id="terminal-input" autocomplete="off" spellcheck="false">
            </div>
        </div>
        <button id="dev-nav-toggle">_Dev Nav</button>
    `;
    document.body.appendChild(wrapper);

    const toggleBtn = document.getElementById('dev-nav-toggle');
    const terminal = document.getElementById('dev-terminal');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    // Restore state from sessionStorage
    const savedState = sessionStorage.getItem('devTerminalState');
    if (savedState) {
        const state = JSON.parse(savedState);
        if (!state.hidden) {
            terminal.classList.remove('hidden');
        }
        if (state.output) {
            output.innerHTML = state.output;
        } else {
            initOutput();
        }
    } else {
        initOutput();
    }

    function initOutput() {
        output.innerHTML = '<div>DezOS Terminal v1.0</div><div>Type \\'help\\' to see available commands.</div>';
    }

    function saveState() {
        sessionStorage.setItem('devTerminalState', JSON.stringify({
            hidden: terminal.classList.contains('hidden'),
            output: output.innerHTML
        }));
    }

    toggleBtn.addEventListener('click', () => {
        terminal.classList.toggle('hidden');
        if(!terminal.classList.contains('hidden')) {
            input.focus();
        }
        saveState();
    });

    const printLine = (text) => {
        const div = document.createElement('div');
        div.innerHTML = text;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
        saveState();
    }

    output.scrollTop = output.scrollHeight;

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const val = this.value.trim();
            printLine(\`<span style="color: #fff">pete@local:~$</span> \${val}\`);
            this.value = '';
            
            if (!val) return;

            const args = val.split(' ');
            const cmd = args[0].toLowerCase();

            if (cmd === 'help') {
                printLine('Available commands:');
                printLine('  &nbsp;&nbsp;help       - Show this message');
                printLine('  &nbsp;&nbsp;/nav       - List navigation options');
                printLine('  &nbsp;&nbsp;/nav [dst] - Navigate to [dst] (home, about, portfolio)');
                printLine('  &nbsp;&nbsp;/whoami    - Display bio');
                printLine('  &nbsp;&nbsp;clear      - Clear terminal');
            } else if (cmd === '/whoami') {
                printLine('Pete Steere: Tech enthusiast, home automation tinkerer, and devoted family man. I experiment with local LLMs and build elegant solutions for modern problems.');
            } else if (cmd === '/nav') {
                if (args.length === 1) {
                    printLine('Available destinations: home, about, portfolio');
                    printLine('Usage: /nav [destination]');
                } else {
                    const dest = args[1].toLowerCase();
                    if (dest === 'home') window.location.href = basePath + 'index.html';
                    else if (dest === 'about') window.location.href = basePath + 'AboutMe/index.html';
                    else if (dest === 'portfolio') window.location.href = basePath + 'Portfolio/index.html';
                    else printLine(\`Unknown destination: \${dest}\`);
                }
            } else if (cmd === 'clear') {
                output.innerHTML = '';
                saveState();
            } else {
                printLine(\`Command not found: \${cmd}\`);
            }
        }
    });
})();