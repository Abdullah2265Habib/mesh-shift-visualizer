# Technical Report: Mesh Circular Shift Visualizer
**Submitted by:** 23F-XXXX (Replace with actual ID)

## 1. Introduction
In parallel computing environments containing numerous computing nodes, inter-node communication efficiency is critical. A circular **q-shift** is a fundamental permutation operation where each node `i` safely transfers its data to node `((i + q) mod p)`. 

Visualizing this behavior is invaluable because the physical topology of the computing cluster drastically impacts the efficiency of the shift operation. While transferring data sequentially along a 1D ring topology is simple, it requires a worst-case `O(p)` communication steps. By rearranging nodes into a 2D mesh, we can optimize routing and drastically reduce total transmission latency.

## 2. Algorithm Description
The 2D Mesh Shift Algorithm performs the spatial permutation efficiently in two distinct data movement stages based on mathematical modulus and floor operations. Given `p` nodes (where `p` is a perfect square) logically arranged as `sqrt(p) x sqrt(p)`:

**Stage 1 - Row Shift:**
Each node shifts its data strictly within its own row. The data advances by exactly `(q mod sqrt(p))` positions. Because the row wraps around circularly, no data ever crosses into another row during this step.

**Stage 2 - Column Shift:**
The data, now pre-aligned in the correct vertical lane during Stage 1, shifts vertically across columns by `floor(q / sqrt(p))` positions. 

### Worked Example: `p=16`, `q=5`
For `p=16`, the grid is `4x4` (`sqrt(16) = 4`).  
- **Row Shift Amount:** `5 mod 4 = 1`
- **Column Shift Amount:** `floor(5 / 4) = 1`

Let's track a single node, say Node `6`. Node `6` initially holds exactly the data "6".
- Node 6 is at Row 1, Column 2.
- **Stage 1 (Row Shift):** It shifts right by 1 position. `(Column 2 + 1) mod 4 = Column 3`. Data moves to Node 7 (Row 1, Column 3).
- **Stage 2 (Column Shift):** It shifts down by 1 position. `(Row 1 + 1) mod 4 = Row 2`. Data moves from Node 7 to Node 11 (Row 2, Column 3).
Final Destination of data initially at 6: Node 11. (`(6 + 5) = 11 mod 16`, algorithm perfectly matches mathematical definition).

## 3. Application Architecture
### Tech Stack
- Frontend: Vanilla JS (ES Modules natively via browser), HTML5, custom CSS. No NodeJS needed locally.
- Backend: Flask serving static frontend resources (to meet the python-only requirements constraint)

### Components
- **`App` Component**: The core state manager. Passes states down to UI components and orchestration functions.
- **`MeshGrid` Component**: Renders exactly `p` UI nodes dynamically using CSS Grids. Controls smooth movement/animations via DOM manipulation.
- **`ControlPanel` Component**: Captures user input arrays for `p` & `q` and triggers validation states.
- **`ComplexityPanel`**: Render chart comparisons between algorithms based on `q`.
- **`shiftLogic` Utils**: A pure, stateless utility module holding the core logic for calculating exact row and column position movements arrays.

## 4. Complexity Analysis
The analytical metric evaluating efficiency is "Total Communication Steps", mathematically defined for differing topologies.

- **Ring Topology Steps:** `min(q, p - q)`
- **Mesh Topology Steps:** `(q mod sqrt(p)) + floor(q / sqrt(p))`

### Comparative Walkthrough
| Configuration    | Mesh Steps (Row + Col) | Ring Steps (min(q, p-q)) | Advantage        |
| ---------------- | ---------------------- | ------------------------ | ---------------- |
| `p=16, q=3`      | `(3) + (0) = 3 Steps`  | `min(3, 13) = 3 Steps`   | Parity (=)       |
| `p=16, q=5`      | `(1) + (1) = 2 Steps`  | `min(5, 11) = 5 Steps`   | Mesh wins        |
| `p=16, q=7`      | `(3) + (1) = 4 Steps`  | `min(7, 9) = 7 Steps`    | Mesh wins        |
| `p=64, q=3`      | `(3) + (0) = 3 Steps`  | `min(3, 61) = 3 Steps`   | Parity (=)       |
| `p=64, q=5`      | `(5) + (0) = 5 Steps`  | `min(5, 59) = 5 Steps`   | Parity (=)       |
| `p=64, q=7`      | `(7) + (0) = 7 Steps`  | `min(7, 57) = 7 Steps`   | Parity (=)       |

Whenever `q` exceeds `sqrt(p)-1` and isn't approaching `p/2` directly, the 2D plane significantly outperforms sequential rings.

## 5. Deployment Guide
**Local Execution:**
1. Clone the repository
2. Install standard Python HTTP support dependencies: `pip install -r requirements.txt` (Installs Flask).
3. Run the Backend: `python app.py`
4. Access Interface: `http://localhost:5000`

**Cloud Deployment (Render):**
1. Access Render Dashboard -> New Web Service.
2. Link Github source repository.
3. Choose `Python 3` Environment setting.
4. Input Root Directory: `/`
4. Install Script: `pip install -r requirements.txt`
5. Process Execution (Gunicorn): `gunicorn app:app`
6. Commit configurations. Deployment is ready in 2 minutes.

## 6. Screenshots
*(Placeholder - The student will take 3 screenshots capturing the Interface Initial State, Animation State, and the deployed Live URL, and paste it here before exporting to PDF).*

1. **Initial View Panel:**
   [Insert Screenshot]

2. **Mid Stream Data Animation:**
   [Insert Screenshot]

3. **Status Panel showing Live App Deployment:**
   [Insert Screenshot]
