export class ControlPanel {
    constructor(container, onControlsChange, onStartShift) {
        this.container = container;
        this.onControlsChange = onControlsChange;
        this.onStartShift = onStartShift;
        this.renderShell();
        this.attachEvents();
    }

    renderShell() {
        this.container.innerHTML = `
            <h2>Parameters</h2>
            <div class="control-group">
                <label>Number of Nodes (p) - Perfect Square</label>
                <input type="number" id="input-p" value="16" min="4" max="64" step="1">
            </div>
            <div class="control-group">
                <label>Shift Amount (q)</label>
                <input type="number" id="input-q" value="5" min="1" max="63" step="1">
            </div>
            <button class="btn" id="btn-start">Start Shift Animation</button>
            <button class="btn" id="btn-reset" style="background: transparent; border: 1px solid var(--node-border);">Reset Grid</button>
        `;
    }

    attachEvents() {
        const tP = document.getElementById('input-p');
        const tQ = document.getElementById('input-q');
        const btnStart = document.getElementById('btn-start');
        const btnReset = document.getElementById('btn-reset');

        const onChange = () => {
            let p = parseInt(tP.value);
            let q = parseInt(tQ.value);
            
            const sqrt = Math.sqrt(p);
            if(p < 4 || p > 64 || !Number.isInteger(sqrt)) {
                btnStart.disabled = true;
                return;
            }
            if(q < 1 || q >= p) {
                btnStart.disabled = true;
                return;
            }
            
            btnStart.disabled = false;
            this.onControlsChange(p, q);
        };

        tP.addEventListener('input', onChange);
        tQ.addEventListener('input', onChange);
        
        btnStart.addEventListener('click', () => {
            let p = parseInt(tP.value);
            let q = parseInt(tQ.value);
            this.onStartShift(p, q);
        });

        btnReset.addEventListener('click', () => {
            let p = parseInt(tP.value);
            let q = parseInt(tQ.value);
            this.onControlsChange(p, q);
        });
        
        onChange();
    }

    setPlaying(isPlaying) {
        document.getElementById('btn-start').disabled = isPlaying;
        document.getElementById('input-p').disabled = isPlaying;
        document.getElementById('input-q').disabled = isPlaying;
        document.getElementById('btn-reset').disabled = isPlaying;
    }
}
