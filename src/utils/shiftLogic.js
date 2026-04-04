export function calculateShift(p, q) {
    const sqrt = Math.sqrt(p);
    const rowShift = q % sqrt;
    const colShift = Math.floor(q / sqrt);
    const ringSteps = Math.min(q, p - q);
    const meshSteps = rowShift + colShift;
    return { sqrt, rowShift, colShift, ringSteps, meshSteps };
}

export function getStage1State(p, q, nodes) {
    const { sqrt, rowShift } = calculateShift(p, q);
    let newState = [...nodes];
    let movements = [];
    
    for(let i=0; i<p; i++) {
        let r = Math.floor(i / sqrt);
        let c = i % sqrt;
        let new_c = (c + rowShift) % sqrt;
        let targetIdx = r * sqrt + new_c;
        newState[targetIdx] = nodes[i];
        
        movements.push({
            from: i,
            to: targetIdx,
            val: nodes[i]
        });
    }
    return { state: newState, movements };
}

export function getStage2State(p, q, nodes) {
    const { sqrt, colShift } = calculateShift(p, q);
    let newState = [...nodes];
    let movements = [];
    
    for(let i=0; i<p; i++) {
        let r = Math.floor(i / sqrt);
        let c = i % sqrt;
        let new_r = (r + colShift) % sqrt;
        let targetIdx = new_r * sqrt + c;
        newState[targetIdx] = nodes[i];
        
        movements.push({
            from: i,
            to: targetIdx,
            val: nodes[i]
        });
    }
    return { state: newState, movements };
}
