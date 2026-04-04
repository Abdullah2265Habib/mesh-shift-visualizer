import { ControlPanel } from './components/ControlPanel.js';
import { ComplexityPanel } from './components/ComplexityPanel.js';
import { MeshGrid } from './components/MeshGrid.js';
import { getStage1State, getStage2State } from './utils/shiftLogic.js';

export class App {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.state = { nodes: [], p: 16, q: 5, isPlaying: false };
        this.renderLayout();
        
        this.meshGrid = new MeshGrid(document.getElementById('mesh-grid'));
        this.complexityPanel = new ComplexityPanel(document.getElementById('complexity-panel'));
        this.controlPanel = new ControlPanel(
            document.getElementById('control-panel'),
            this.handleControlsChange.bind(this),
            this.handleStartShift.bind(this)
        );
    }
    
    renderLayout() {
        this.rootElement.innerHTML = `
            <div class="app-container">
                <div class="app-layout">
                    <header>
                        <h1>Mesh Circular Shift</h1>
                    </header>
                    <div class="left-col">
                        <div id="control-panel" class="panel"></div>
                        <div id="complexity-panel" class="panel"></div>
                    </div>
                    <div class="right-col">
                        <div class="status" id="status-text">Initial State (Before Shift)</div>
                        <div class="mesh-container">
                            <div class="mesh-wrapper">
                                <div id="mesh-grid" class="mesh-grid"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    handleControlsChange(p, q) {
        this.state.p = p;
        this.state.q = q;
        this.state.nodes = Array.from({length: p}, (_, i) => i);
        
        document.getElementById('status-text').innerText = 'Initial State (Before Shift)';
        this.meshGrid.render(p, this.state.nodes);
        this.complexityPanel.update(p, q);
    }

    async handleStartShift(p, q) {
        this.state.isPlaying = true;
        this.controlPanel.setPlaying(true);
        
        document.getElementById('status-text').innerText = 'Stage 1: Row Shift Animation...';
        const st1 = getStage1State(p, q, this.state.nodes);
        await this.meshGrid.animateMovements(st1.movements);
        this.state.nodes = st1.state;
        
        document.getElementById('status-text').innerText = 'State after Stage 1 (Row Shift completed)';
        await this.wait(1000);
        
        document.getElementById('status-text').innerText = 'Stage 2: Column Shift Animation...';
        const st2 = getStage2State(p, q, this.state.nodes);
        await this.meshGrid.animateMovements(st2.movements);
        this.state.nodes = st2.state;
        
        document.getElementById('status-text').innerText = 'Final State (After Stage 2)';
        this.controlPanel.setPlaying(false);
        this.state.isPlaying = false;
    }

    wait(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
}
