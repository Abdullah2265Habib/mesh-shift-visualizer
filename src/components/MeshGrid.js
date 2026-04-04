export class MeshGrid {
    constructor(container) {
        this.container = container; 
        this.nodes = [];
    }

    render(p, pData) {
        const sqrt = Math.sqrt(p);
        this.container.innerHTML = '';
        this.container.style.gridTemplateColumns = `repeat(${sqrt}, 60px)`;
        this.container.style.gridTemplateRows = `repeat(${sqrt}, 60px)`;
        
        this.nodes = [];
        for (let i = 0; i < p; i++) {
            let el = document.createElement('div');
            el.className = 'node';
            el.id = `node-${i}`;
            
            let idxEl = document.createElement('div');
            idxEl.className = 'node-idx';
            idxEl.innerText = i;
            
            let dataEl = document.createElement('div');
            dataEl.className = 'node-data';
            dataEl.innerText = pData[i];
            
            el.appendChild(idxEl);
            el.appendChild(dataEl);
            this.container.appendChild(el);
            this.nodes.push(el);
        }
    }
    
    async animateMovements(movements) {
        const wait = ms => new Promise(res => setTimeout(res, ms));
        
        const flyingElements = [];
        
        this.nodes.forEach(n => {
            const dataEl = n.querySelector('.node-data');
            if(dataEl) dataEl.style.opacity = '0';
        });

        for (let mov of movements) {
            let fromNode = this.nodes[mov.from];
            let toNode = this.nodes[mov.to];
            
            let flyEl = document.createElement('div');
            flyEl.className = 'flying-data';
            flyEl.innerText = mov.val;
            
            flyEl.style.left = (fromNode.offsetLeft + 18) + 'px';
            flyEl.style.top = (fromNode.offsetTop + 18) + 'px';
            
            this.container.parentElement.appendChild(flyEl);
            
            flyingElements.push({
                el: flyEl,
                toX: toNode.offsetLeft + 18,
                toY: toNode.offsetTop + 18,
                toIdx: mov.to,
                val: mov.val
            });
        }
        
        await wait(50);
        for(let item of flyingElements) {
            item.el.style.left = item.toX + 'px';
            item.el.style.top = item.toY + 'px';
            this.nodes[item.toIdx].classList.add('moving');
        }
        
        await wait(1000); 
        
        for(let item of flyingElements) {
            item.el.remove();
            this.nodes[item.toIdx].classList.remove('moving');
            const dataEl = this.nodes[item.toIdx].querySelector('.node-data');
            dataEl.style.opacity = '1';
            dataEl.innerText = item.val;
        }
    }
}
