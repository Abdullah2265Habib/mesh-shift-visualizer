import { calculateShift } from '../utils/shiftLogic.js';

export class ComplexityPanel {
    constructor(container) {
        this.container = container;
        this.renderShell();
    }

    renderShell() {
        this.container.innerHTML = `
            <h2>Complexity Analysis</h2>
            <div class="stat-row">
                <span class="stat-label">Row Shift Amount</span>
                <span class="stat-val" id="val-row-shift">-</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Col Shift Amount</span>
                <span class="stat-val" id="val-col-shift">-</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Total Formula</span>
                <span class="stat-val" style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">
                    Mesh: (q mod √p) + ⌊q/√p⌋ <br/>
                    Ring: min(q, p-q)
                </span>
            </div>
            
            <div class="bar-chart">
                <div class="bar-row">
                    <div class="bar-label">
                        <span>Ring Steps</span>
                        <span id="val-ring-steps">0</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar ring" id="bar-ring" style="width: 0%"></div>
                    </div>
                </div>
                <div class="bar-row">
                    <div class="bar-label">
                        <span>Mesh Steps</span>
                        <span id="val-mesh-steps">0</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar mesh" id="bar-mesh" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    update(p, q) {
        const stats = calculateShift(p, q);
        document.getElementById('val-row-shift').innerText = stats.rowShift;
        document.getElementById('val-col-shift').innerText = stats.colShift;
        document.getElementById('val-ring-steps').innerText = stats.ringSteps;
        document.getElementById('val-mesh-steps').innerText = stats.meshSteps;

        const maxSteps = Math.max(stats.ringSteps, stats.meshSteps, 1);
        document.getElementById('bar-ring').style.width = `${(stats.ringSteps / maxSteps) * 100}%`;
        document.getElementById('bar-mesh').style.width = `${(stats.meshSteps / maxSteps) * 100}%`;
    }
}
