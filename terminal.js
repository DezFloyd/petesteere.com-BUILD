(function() {
    if (document.getElementById('dev-nav-wrapper')) return;

    // Calculate relative path for navigation commands
    const isSubdir = window.location.pathname.includes('/AboutMe/') || window.location.pathname.includes('/Portfolio/');
    const basePath = isSubdir ? '../' : './';

    // Inject Terminal CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #dev-nav-wrapper {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            font-family: 'Courier New', Courier, monospace;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        #dev-nav-toggle {
            background: #0f172a;
            color: #10b981;
            border: 1px solid #10b981;
            padding: 8px 16px;
            cursor: pointer;
            font-family: inherit;
            font-weight: bold;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        #dev-nav-toggle:hover {
            background: #10b981;
            color: #0f172a;
        }
        #dev-terminal {
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid #10b981;
            width: 380px;
            height: 280px;
            margin-bottom: 12px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            padding: 12px;
            color: #10b981;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform-origin: bottom right;
        }
        #dev-terminal.hidden {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            pointer-events: none;
        }
        #terminal-output {
            flex-grow: 1;
            overflow-y: auto;
            margin-bottom: 10px;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        #terminal-output div {
            margin-bottom: 4px;
        }
        #terminal-input-line {
            display: flex;
            align-items: center;
            border-top: 1px solid rgba(16, 185, 129, 0.3);
            padding-top: 8px;
        }
        .prompt {
            margin-right: 8px;
            font-weight: bold;
        }
        #terminal-input {
            background: transparent;
            border: none;
            color: #10b981;
            font-family: inherit;
            font-size: 0.9rem;
            flex-grow: 1;
            outline: none;
        }
    `;
    document.head.appendChild(style);

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