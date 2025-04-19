/**
 * Custom cursor animation
 */

// DOM elements
let trailElements = [];
let mainCursor; // Main cursor element

// Mouse position
let mouseX = 0;
let mouseY = 0;

// Previous mouse positions for motion detection
let prevMouseX = 0;
let prevMouseY = 0;
let isMoving = false;
let movementTimeout;

// Previous positions for trail
const trailPositions = [];
const numTrailElements = 30; // Increased number of trail elements for better trail

// Animation settings
const ease = 0.8; // Easing for fluid motion

// Initialize custom cursor
function initCustomCursor() {
  // Calculate segment sizes for color distribution (excluding main cursor)
  const trailCount = numTrailElements - 1;
  const firstSegment = Math.floor(trailCount / 3);
  const secondSegment = Math.floor(trailCount / 3) * 2;
  
  // First create all trail elements (excluding the main cursor)
  for (let i = 1; i < numTrailElements; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.width = '38px';
    trail.style.height = '38px';
    trail.style.zIndex = `${9998 - i}`; // Lower z-index for trail elements
    
    // Dynamic color assignments based on proportional segments
    // White (closest to cursor): first third
    // Yellow/Gold (middle): second third
    // Red (end of trail): last third
    if (i <= firstSegment) {
      trail.style.backgroundColor = '#fff'; // WHITE - first third (closest to cursor)
    } else if (i <= secondSegment) {
      trail.style.backgroundColor = '#FFC700'; // GOLD - middle third
    } else {
      trail.style.backgroundColor = '#FF004F'; // RED - last third (end of trail)
    }
    
    document.body.appendChild(trail);
    trailElements.push(trail);
    trailPositions.push({ x: 0, y: 0 });
  }
  
  // Now create the main cursor (to be on top of everything)
  mainCursor = document.createElement('div');
  mainCursor.className = 'cursor-trail cursor-main';
  mainCursor.style.width = '40px';
  mainCursor.style.height = '40px';
  mainCursor.style.backgroundColor = '#fff';
  mainCursor.style.zIndex = '9999'; // Ensure main cursor is on top
  document.body.appendChild(mainCursor);
  
  // Hide default cursor
  document.documentElement.style.cursor = 'none';
  document.body.style.cursor = 'none';
  
  // Add event listeners
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', onElementEnter);
    el.addEventListener('mouseleave', onElementLeave);
    el.style.cursor = 'none'; // Ensure default cursor is hidden on interactive elements
  });
  
  // Start animation loop
  requestAnimationFrame(updateCursorPosition);
}

// Mouse move handler
function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Detect movement
  if (Math.abs(mouseX - prevMouseX) > 3 || Math.abs(mouseY - prevMouseY) > 3) {
    isMoving = true;
    clearTimeout(movementTimeout);
    
    // Set a timeout to detect when movement stops
    movementTimeout = setTimeout(() => {
      isMoving = false;
    }, 100); // 100ms of no significant movement means stopped
  }
  
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

// Mouse down handler
function onMouseDown() {
  mainCursor.classList.add('active');
  trailElements.forEach(trail => trail.classList.add('active'));
}

// Mouse up handler
function onMouseUp() {
  mainCursor.classList.remove('active');
  trailElements.forEach(trail => trail.classList.remove('active'));
}

// Interactive element hover enter
function onElementEnter() {
  mainCursor.classList.add('hover');
  trailElements.forEach(trail => trail.classList.add('hover'));
}

// Interactive element hover leave
function onElementLeave() {
  mainCursor.classList.remove('hover');
  trailElements.forEach(trail => trail.classList.remove('hover'));
}

// Update cursor position with smooth animation
function updateCursorPosition() {
  // Position the main cursor directly at mouse position
  mainCursor.style.transform = `translate(${mouseX - 20}px, ${mouseY - 20}px)`; // Half of 40px
  
  // Initialize trail positions if first run
  if (trailPositions[0].x === 0 && trailPositions[0].y === 0) {
    trailPositions.forEach((pos, i) => {
      pos.x = mouseX;
      pos.y = mouseY;
    });
  }
  
  // Update trail positions with cascading delay
  for (let i = 0; i < trailElements.length; i++) {
    if (isMoving) {
      // When moving: Normal trailing behavior with fluid motion
      const trailEase = ease * (1 - (i * 0.01));
      
      // First element follows the mouse
      if (i === 0) {
        trailPositions[i].x += (mouseX - trailPositions[i].x) * trailEase;
        trailPositions[i].y += (mouseY - trailPositions[i].y) * trailEase;
      } else {
        // Each subsequent element follows the previous one
        trailPositions[i].x += (trailPositions[i-1].x - trailPositions[i].x) * trailEase;
        trailPositions[i].y += (trailPositions[i-1].y - trailPositions[i].y) * trailEase;
      }
    } else {
      // When stopped: All trail elements converge to the mouse position
      const convergenceEase = 0.1 * (1 + (i * 0.05)); // Slower elements catch up faster
      trailPositions[i].x += (mouseX - trailPositions[i].x) * convergenceEase;
      trailPositions[i].y += (mouseY - trailPositions[i].y) * convergenceEase;
    }
    
    // Apply the position with centering (19px is half of 38px width)
    trailElements[i].style.transform = `translate(${trailPositions[i].x - 19}px, ${trailPositions[i].y - 19}px)`;
  }
  
  // Continue animation loop
  requestAnimationFrame(updateCursorPosition);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initCustomCursor); 