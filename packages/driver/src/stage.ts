// Pure geometry of the stage, the cutout in the full-screen dim that keeps
// the highlighted element visible. Shared by the tour and hints overlays,
// each passing its own padding and radius.

export type StageDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StageOptions = {
  padding: number;
  radius: number;
};

// The full-screen dim with a rounded cutout, as a single evenodd path.
// Supports single or multi-target stage cutouts simultaneously.
export function generateStageSvgPathString(
  stage: StageDefinition | StageDefinition[],
  options: StageOptions
) {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  const stages = Array.isArray(stage) ? stage : [stage];

  let path = `M${windowX},0L0,0L0,${windowY}L${windowX},${windowY}L${windowX},0Z`;

  for (const s of stages) {
    const stagePadding = options.padding;
    const stageRadius = options.radius;

    const stageWidth = s.width + stagePadding * 2;
    const stageHeight = s.height + stagePadding * 2;

    // prevent glitches when stage is too small for radius
    const limitedRadius = Math.min(stageRadius, stageWidth / 2, stageHeight / 2);
    const normalizedRadius = Math.floor(Math.max(limitedRadius, 0));

    const highlightBoxX = s.x - stagePadding + normalizedRadius;
    const highlightBoxY = s.y - stagePadding;
    const highlightBoxWidth = stageWidth - normalizedRadius * 2;
    const highlightBoxHeight = stageHeight - normalizedRadius * 2;

    path += `
    M${highlightBoxX},${highlightBoxY} h${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},${normalizedRadius} v${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},${normalizedRadius} h-${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},-${normalizedRadius} v-${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},-${normalizedRadius} z`;
  }

  return path;
}
