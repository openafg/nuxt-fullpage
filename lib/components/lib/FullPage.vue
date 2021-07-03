<template>
  <div>
    <div ref="fullpage" class="full-page">
      <slot />
    </div>
    <div class="full-page-indicators" v-if="showIndicators">
      <a 
        href="#"
        class="indicator"
        v-for="(item, index) in offsets" 
        :key="index" 
        :data-index="index"
        :class="{'active': index === activeSection}" 
        @click.prevent="scrollToSection(index, true)">
          <span></span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    pluginOption() {
      return this._customOptions || {};
    },

    showIndicators() {
      if (this.pluginOption.hasOwnProperty('showIndicators'))
        return this.pluginOption.showIndicators

      return true
    }
  },

  data() {
    return {
      inMove: false,
      activeSection: 0,
      offsets: [],
      touchStartY: 700
    }
  },

  mounted() {
    if (process.browser) {
      document.addEventListener('keydown', e => {
        e.preventDefault()
        
        if (e.keyCode == 40)
          return this.moveUp()

        if (e.keyCode == 38)
          return this.moveDown()
      });

      window.addEventListener('DOMMouseScroll', this.handleMouseWheelDOM);
      window.addEventListener('mousewheel', this.handleMouseWheel, { passive: false });
      window.addEventListener('touchstart', this.touchStart, { passive: false });
      window.addEventListener('touchend', this.touchMove, { passive: false });
    }
    
    this.calculateSectionOffsets();
  },

  methods: {
    calculateSectionOffsets() {
      if (process.browser) {
        let sections = document.querySelectorAll('.section');

        sections.forEach(section => {
          this.offsets.push(section.offsetTop);
        });

        this.scrollToSection(this.pluginOption.activeSection || 0, true);
      }
    },

    scrollToSection(id, force = false) {
      if (this.inMove && !force) return;

      this.activeSection = parseInt(id);

      this.$refs['fullpage'].style.transform = 'translate3d(0px, -' + this.offsets[id] + 'px, 0px)';

      setTimeout(() => {
        this.inMove = false;
      }, 400);
    },

    handleMouseWheel(e) {
      let sensitivity = this.pluginOption.mouseWheelSensitivity || 100;

      if (e.wheelDelta < -sensitivity && !this.inMove) {
        this.inMove = true;
        this.moveUp();
      } else if (e.wheelDelta > sensitivity && !this.inMove) {
        this.inMove = true;
        this.moveDown();
      }

      e.preventDefault();
      return;
    },

    moveDown() {
      this.activeSection--;

      if (this.activeSection < 0) {
        this.activeSection = 0;
        this.inMove = false;

        return;
      }

      this.scrollToSection(this.activeSection, true);
    },

    moveUp() {
      this.activeSection++;

      if (this.activeSection > this.offsets.length)
        this.activeSection = this.offsets.length - 1;

      if (this.activeSection > this.offsets.length - 1) {
        this.inMove = false;
        return;
      }
      
      this.scrollToSection(this.activeSection, true);
    },

    touchStart(e) {
      e.preventDefault();

      if (e.target.classList.contains('indicator'))
        return this.scrollToSection(e.target.getAttribute('data-index'), true);
      
      if (e.target.tagName.toLowerCase() === 'a')
        return e.target.click()
        
      this.touchStartY = e.changedTouches[0].screenY;
    },

    touchMove(e) {
      e.preventDefault();
      
      if (this.inMove) return;

      let touchendY = e.changedTouches[0].screenY;
      if (touchendY === this.touchStartY) return;

      if (e.target.classList.contains('indicator'))
        return;

      this.inMove = true;
      if (this.touchStartY < touchendY) {
        this.moveDown();
      } else {
        this.moveUp();
      }

      this.touchStartY = 0;
      return;
    }
  },

  destroyed() {
    if (process.browser) {
      window.removeEventListener('mousewheel', this.handleMouseWheel, { passive: false });
      window.removeEventListener('keydown', this.handleMouseWheelDOM);
      window.removeEventListener('DOMMouseScroll', this.handleMouseWheelDOM);
      window.removeEventListener('touchstart', this.touchStart);
      window.removeEventListener('touchend', this.touchMove);
    }
  }
}
</script>
<style>
.full-page {
  height: 100%;
  position: relative;
  transform: translate3d(0px, 0px, 0px);
  transition: all 900ms ease 0s;
}

.full-page-indicators {
  height: 100%;
  position: absolute;
  left: 10px;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  width: 25px;
}

.full-page-indicators a {
  border: 1px solid white;
  border-radius: 50px;
  width: 10px;
  height: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.full-page-indicators a.active span {
  transition: all 900ms ease 0s;
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50px;
  background-color: white;
}
</style>
