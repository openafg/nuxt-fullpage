<template>
  <div>
    <div ref="fullpage" class="full-page">
      <slot />
    </div>
    <div class="sections-menu">
      <span
        class="menu-point"
        v-bind:class="{active: activeSection == index}"
        v-on:click="scrollToSection(index)"
        v-for="(offset, index) in offsets"
        v-bind:key="index">
      </span>
    </div>
  </div>
</template>

<script>
export default {
  // props: {_customFullPageOptions},
  
  data() {
    return {
      inMove: false,
      activeSection: 0,
      offsets: [],
      touchStartY: 0
    }
  },

  mounted() {
    if (process.browser) {
      document.addEventListener('keydown', e => {
        e.preventDefault();

        if (e.keyCode == 40)
          return this.moveUp()

        if (e.keyCode == 38)
          return this.moveDown()
      });

      window.addEventListener('DOMMouseScroll', this.handleMouseWheelDOM); // Mozilla Firefox
      window.addEventListener('mousewheel', this.handleMouseWheel, {
        passive: false
      }); // Other browsers
      window.addEventListener('touchstart', this.touchStart, {
        passive: false
      }); // mobile devices
      window.addEventListener('touchmove', this.touchMove, {
        passive: false
      }); //
    }
    
    this.calculateSectionOffsets()
  },

  methods: {
    calculateSectionOffsets() {
      if (process.browser) {
        let sections = document.querySelectorAll('.section');
        let length = sections.length;

        for (let i = 0; i < length; i++) {
          let sectionOffset = sections[i].offsetTop;
          this.offsets.push(sectionOffset);
        }
      }
    },

    scrollToSection(id, force = false) {
      if (this.inMove && !force) return false;
      this.activeSection = id;

      document.querySelectorAll('.section')[id].scrollIntoView({
        behavior: 'smooth'
      });

      setTimeout(() => {
        this.inMove = false;
      }, 1000);
    },

    handleMouseWheel: function(e) {
      if (e.wheelDelta < -50 && !this.inMove) {
        this.inMove = true
        this.moveUp();
      } else if (e.wheelDelta > 50 && !this.inMove) {
        this.inMove = true
        this.moveDown();
      }

      e.preventDefault();
      return false;
    },

    moveDown() {
      this.activeSection--;

      if (this.activeSection < 0) {
        this.activeSection = 0
        this.inMove = false
        return false;
      }

      this.scrollToSection(this.activeSection, true);
    },

    moveUp() {
      this.activeSection++;

      if (this.activeSection > this.offsets.length)
        this.activeSection = this.offsets.length - 1

      if (this.activeSection > this.offsets.length - 1) {
        this.inMove = false
        return false;
      }
      
      this.scrollToSection(this.activeSection, true);
    },

    touchStart(e) {
      e.preventDefault();
      this.touchStartY = e.touches[0].clientY;
    },

    touchMove(e) {
      if (this.inMove) return false;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      if (this.touchStartY < currentY) {
        this.moveDown();
      } else {
        this.moveUp();
      }

      this.touchStartY = 0;
      return false;
    }
  },

  destroyed() {
    if (process.browser) {
      window.removeEventListener('mousewheel', this.handleMouseWheel, {
        passive: false
      }); // Other browsers
      window.removeEventListener('keydown', this.handleMouseWheelDOM); // Mozilla Firefox
      window.removeEventListener('DOMMouseScroll', this.handleMouseWheelDOM); // Mozilla Firefox
      window.removeEventListener('touchstart', this.touchStart); // mobile devices
      window.removeEventListener('touchmove', this.touchMove); // mobile devices
    }
  }
}
</script>