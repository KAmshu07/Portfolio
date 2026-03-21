/* Render shim — wires up UI deps and re-exports */
import { render, setRenderDeps } from './rendering/Renderer.js';
import { getNearBuilding, zoneAnnouncement } from './ui.js';

setRenderDeps(getNearBuilding, zoneAnnouncement);

export { render };
