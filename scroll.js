/**
 * Scroll animations for Pluto site
 * This script controls the scroll animation where the Pluto image moves to the right
 * and text appears from the left.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------- ELEMENT SELECTION -------------
  // Get all the DOM elements we need to animate
  const scrollSection = document.querySelector('.scroll-section');
  const imageContainer = document.querySelector('.image-side');
  const textContainer = document.querySelector('.text-side');
  const scrollHeader = document.querySelector('.scroll-header');
  const scrollText = document.querySelector('.scroll-text');
  const plutoImage = document.querySelector('.pluto-image');
  
  // ------------- POSITION CALCULATION -------------
  // Get the initial position of the scroll section
  const sectionTop = scrollSection.offsetTop;
  
  // ------------- SCROLL EVENT HANDLER -------------
  window.addEventListener('scroll', () => {
    // Current scroll position from the top of the page (in pixels)
    const scrollPosition = window.scrollY;
    
    // ------------- SCROLL TRIGGER POINTS -------------
    // When to start the animation (halfway up the viewport before reaching the section)
    const startTrigger = Math.max(0, sectionTop - window.innerHeight / 2);
    
    // When to complete the animation (350px after starting)
    // ADJUST THIS VALUE to make the animation complete faster or slower
    const endTrigger = sectionTop + 350;
    
    // Calculate how far through the animation we are (0 to 1)
    const scrollProgress = Math.min(
      1,
      Math.max(0, (scrollPosition - startTrigger) / (endTrigger - startTrigger))
    );
    
    if (scrollProgress > 0) {
      // ------------- IMAGE POSITION PARAMETERS -------------
      // ADJUST THIS VALUE to control how far right the image moves
      // Higher value = further to the right
      const targetXPosition = 28;  // Final horizontal position (percentage from left)
      
      // ADJUST THIS VALUE to control how far up the image moves
      // Higher value = further up
      const maxYOffset = 2;  // Final vertical offset (vh units)
      
      // Calculate vertical position based on scroll progress
      const yOffset = -scrollProgress * maxYOffset;
      
      // ------------- ANIMATION EASING -------------
      // Create a smooth deceleration effect
      const easeProgress = easeOutQuart(scrollProgress);
      
      // ------------- APPLY IMAGE TRANSFORMATIONS -------------
      // Move the image container right and up
      // FORMULA: translateX controls horizontal position, translateY controls vertical position
      imageContainer.style.transform = `translateX(${easeProgress * targetXPosition}%) translateY(${yOffset}vh)`;
      
      // Rotate and scale the image itself
      // ADJUST rotation (60deg) and scale (0.4) to control final appearance
      plutoImage.style.transform = `rotate(${easeProgress * 60}deg) scale(${1 - easeProgress * 0.4})`;
      
      // ------------- TEXT ANIMATION PARAMETERS -------------
      // Text completes its animation at 70% of the overall scroll progress
      const textCompletion = Math.min(1, scrollProgress / 0.7);
      
      if (textCompletion < 1) {
        // ------------- TEXT MOVEMENT -------------
        // Fade in and slide in the text container from the left
        textContainer.style.opacity = textCompletion;
        // ADJUST -50 (starting offset) and 50 (movement distance) to control text position
        textContainer.style.transform = `translateY(-50%) translateX(${-50 + textCompletion * 50}px)`;
        
        // Fade in and slide up the header
        const headerProgress = Math.min(1, textCompletion * 1.2); // header completes 20% faster
        scrollHeader.style.opacity = headerProgress;
        // ADJUST 20 to control how far the header moves
        scrollHeader.style.transform = `translateY(${20 * (1 - headerProgress)}px)`;
        
        // Fade in and slide up the paragraph text
        const textProgress = Math.min(1, textCompletion * 1.1); // text completes 10% faster
        scrollText.style.opacity = textProgress;
        // ADJUST 20 to control how far the text moves
        scrollText.style.transform = `translateY(${20 * (1 - textProgress)}px)`;
      } else {
        // ------------- FINAL TEXT POSITION -------------
        // Fix text in final position once animation completes
        textContainer.style.opacity = '1';
        textContainer.style.transform = 'translateY(-50%) translateX(0)';
        scrollHeader.style.opacity = '1';
        scrollHeader.style.transform = 'translateY(0)';
        scrollText.style.opacity = '1';
        scrollText.style.transform = 'translateY(0)';
      }
    } else {
      // ------------- RESET POSITION -------------
      // Return everything to starting position when scrolled to top
      imageContainer.style.transform = '';
      plutoImage.style.transform = 'rotate(0deg)';
      textContainer.style.opacity = '0';
      textContainer.style.transform = 'translateY(-50%) translateX(-50px)';
      scrollHeader.style.opacity = '0';
      scrollHeader.style.transform = 'translateY(20px)';
      scrollText.style.opacity = '0';
      scrollText.style.transform = 'translateY(20px)';
    }
  });
  
  // ------------- EASING FUNCTION -------------
  // Creates a smooth deceleration curve for natural-feeling animation
  // x = input from 0 to 1, returns a value from 0 to 1 but with easing applied
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
  
  // Initialize animation state on page load
  window.dispatchEvent(new Event('scroll'));
}); 