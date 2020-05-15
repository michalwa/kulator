(() => {
    class Calculator {
        constructor(root) {
            if(typeof root === 'string') {
                this.root = document.querySelector(root);
            } else {
                this.root = root;
            }

            this.inputDisplay = this.root.querySelector('.input');
            this.resultDisplay = this.root.querySelector('.result');
            this.buttons = this.root.querySelectorAll('.calc-button');
            this.sidebar = this.root.querySelector('.calc-sidebar');

            this.input = '';
            this.result = '0';

            this.functions = [];


            for(let char of '0123456789.+-*/()') {
                this.getButton(char).addEventListener('click', () => this.enter(char));
            }

            this.getButton('C').addEventListener('click', () => this.clear());
            this.getButton('=').addEventListener('click', () => this.calculate());

            this.registerFunction('sin', 'Math.sin');
            this.registerFunction('cos', 'Math.cos');
            this.registerFunction('tg', 'Math.tan');
            this.registerFunction('ctg', '1/Math.tan');
        }

        registerFunction(alias, name) {
            const btn = document.createElement('button');
            this.sidebar.appendChild(btn);
            btn.outerHTML = `<button class="sidebar-button" data-key="${alias}">${alias}</button>`;

            this.sidebar.querySelector(`.sidebar-button[data-key="${alias}"]`)
                .addEventListener('click', () => this.enter(`${alias}(`));

            this.functions.push({ alias, name });
            this.functions.sort((a, b) => b.alias.length - a.alias.length);
        }

        getButton(key) {
            for(let btn of this.buttons) {
                if(btn.getAttribute('data-key') === key.toString()) {
                    return btn;
                }
            }
            return null;
        }

        getSidebarButton(key) {
            for(let btn of this.sidebarButtons) {
                if(btn.getAttribute('data-key') === key.toString()) {
                    return btn;
                }
            }
            return null;
        }

        enter(string) {
            this.input += string;
            this.updateDisplay();
        }

        clear() {
            this.input = '';
            this.result = 0;
            this.updateDisplay();
        }

        calculate() {
            try {
                let input = this.input;
                for(let { alias, name } of this.functions) {
                    input = input.replace(new RegExp(`${alias}`, 'g'), name);
                }

                if((this.result = eval(input)) !== undefined) {
                    this.result = this.result.toString()
                        .replace('Infinity', '&infin;');
                } else {
                    this.result = '0';
                }
            } catch(e) {
                this.result = 'Błąd';
                console.error(e);
            }
            this.updateDisplay();
        }

        updateDisplay() {
            this.inputDisplay.innerHTML = this.input;
            this.resultDisplay.innerHTML = this.result;
        }
    }

    window.onload = () => new Calculator('#calculator');
})();
