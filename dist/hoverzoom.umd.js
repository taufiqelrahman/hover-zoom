(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.HoverZoom = factory());
})(this, (function () { 'use strict';

  ///////////////////////////////////
  //
  //  Name: HoverZoom
  //  Version: 1.0.0
  //  Author: Taufiq El Rahman
  //
  ///////////////////////////////////

  class HoverZoom {
    constructor(options = {}) {
      const defaults = {
        classNames: {
          container: 'hoverzoom',
          image: 'hoverzoom-image',
          zoomedImage: 'hoverzoom-zoom',
          magnifier: 'hoverzoom-magnifier',
          magnifierRound: 'hoverzoom-magnifier--round',
          magnifierImage: 'hoverzoom-magnifier--image',
        },
        position: 'right',
        type: 'outside',
        largeImage: '',
        blur: false,
        grayscale: false,
      };
      this.options = { ...defaults, ...options };
      this.isSafari =
        /constructor/i.test(window.HTMLElement) ||
        ((p) => p.toString() === '[object SafariRemoteNotification]')(
          !window['safari'] ||
            (typeof safari !== 'undefined' && window.safari.pushNotification)
        );
    }

    init() {
      const imgContainer = document.getElementsByClassName(
        this.options.classNames.container
      );
      for (let i = 0; i < imgContainer.length; i++) {
        this.iteration = i;
        this.currentContainer = imgContainer[i];
        this.applyHoverZoom();
      }
    }

    applyHoverZoom() {
      const { image } = this.options.classNames;
      this.currentImageEl = this.currentContainer.querySelector(`.${image}`);
      this.currentImageEl.setAttribute('id', `${image}-${this.iteration}`);
      this.options.largeImage = this.currentImageEl.dataset.largeImage
        ? this.currentImageEl.dataset.largeImage
        : this.currentImageEl.src;

      const type = this.currentImageEl.dataset.type || this.options.type;
      if (type === 'outside') {
        this.outsideZoom();
      } else {
        this.insideZoom();
      }
      this.addMouseListener();
    }

    outsideZoom() {
      const { zoomedImage, magnifier, magnifierImage } = this.options.classNames;
      this.zoomedElement = document.createElement('DIV');
      this.zoomedElement.classList.add(zoomedImage);
      this.zoomedElement.setAttribute('id', `${zoomedImage}-${this.iteration}`);
      this.zoomedElement.style.setProperty(
        'background-image',
        `url('${this.options.largeImage}')`
      );
      this.zoomedElement.style.setProperty(
        'background-size',
        `${this.currentImageEl.offsetWidth * 4}px ${
        this.currentImageEl.offsetHeight * 4
      }px`
      );

      const position =
        this.currentImageEl.dataset.position || this.options.position;
      this.currentContainer.style.setProperty(
        'flex-direction',
        position === 'right' ? 'row' : 'column'
      );
      this.attachZoomedImage();

      this.magnifierElement = document.createElement('DIV');
      this.magnifierElement.classList.add(magnifier);
      this.magnifierElement.setAttribute('id', `${magnifier}-${this.iteration}`);

      this.magnifierImageElement = document.createElement('IMG');
      this.magnifierImageElement.classList.add(magnifierImage);
      this.magnifierImageElement.setAttribute(
        'id',
        `${magnifierImage}-${this.iteration}`
      );
      this.magnifierImageElement.setAttribute('src', this.options.largeImage);
      this.magnifierImageElement.style.setProperty(
        'height',
        `${this.currentImageEl.offsetHeight}px`
      );
      this.magnifierImageElement.style.setProperty(
        'width',
        `${this.currentImageEl.offsetWidth}px`
      );
      this.magnifierElement.appendChild(this.magnifierImageElement);

      this.currentContainer.appendChild(this.magnifierElement);

      const magnifierWidth =
        (this.magnifierElement.offsetHeight * this.currentImageEl.offsetWidth) /
        this.currentImageEl.offsetHeight;
      this.magnifierElement.style.setProperty('width', `${magnifierWidth}px`);
    }

    attachZoomedImage() {
      this.zoomedElement.style.setProperty(
        'height',
        `${this.currentImageEl.offsetHeight}px`
      );
      this.zoomedElement.style.setProperty(
        'width',
        `${this.currentImageEl.offsetWidth}px`
      );

      const position =
        this.currentImageEl.dataset.position || this.options.position;
      if (position === 'right') {
        this.zoomedElement.style.setProperty('margin-left', '6px');
      } else {
        this.zoomedElement.style.setProperty('margin-top', '6px');
      }
      this.currentContainer.appendChild(this.zoomedElement);
    }

    insideZoom() {
      const { magnifier, magnifierImage, magnifierRound } =
        this.options.classNames;
      this.magnifierElement = document.createElement('DIV');
      this.magnifierElement.classList.add(magnifier);
      this.magnifierElement.classList.add(magnifierRound);
      this.magnifierElement.setAttribute('id', `${magnifier}-${this.iteration}`);

      this.magnifierImageElement = document.createElement('DIV');
      this.magnifierImageElement.classList.add(magnifierImage);
      this.magnifierImageElement.setAttribute(
        'id',
        `${magnifierImage}-${this.iteration}`
      );
      this.magnifierImageElement.style.setProperty(
        'background-image',
        `url('${this.options.largeImage}')`
      );
      this.magnifierImageElement.style.setProperty(
        'background-size',
        `${this.currentImageEl.offsetWidth * 4}px ${
        this.currentImageEl.offsetHeight * 4
      }px`
      );
      this.magnifierImageElement.style.setProperty(
        'height',
        `${this.currentImageEl.offsetHeight}px`
      );
      this.magnifierImageElement.style.setProperty(
        'width',
        `${this.currentImageEl.offsetWidth}px`
      );
      this.magnifierElement.appendChild(this.magnifierImageElement);

      this.currentContainer.appendChild(this.magnifierElement);
    }

    addMouseListener() {
      const { image, magnifier, magnifierImage, zoomedImage } =
        this.options.classNames;
      const magnifierImageElement = document.getElementById(
        `${magnifierImage}-${this.iteration}`
      );
      const magnifierElement = document.getElementById(
        `${magnifier}-${this.iteration}`
      );
      const { offsetHeight, offsetWidth } = magnifierElement;
      const zoomedElement = document.getElementById(
        `${zoomedImage}-${this.iteration}`
      );
      const currentImageEl = document.getElementById(
        `${image}-${this.iteration}`
      );
      const type = currentImageEl.dataset.type || this.options.type;

      this.currentImageEl.addEventListener('mousemove', (event) => {
        let filter = 'opacity(0.8)';
        if (currentImageEl.dataset.blur || this.options.blur)
          filter += ' blur(2px)';
        if (currentImageEl.dataset.grayscale || this.options.grayscale)
          filter += ' grayscale(100%)';
        currentImageEl.style.setProperty('filter', filter);

        magnifierElement.style.setProperty('opacity', 1);
        if (type === 'outside') zoomedElement.style.setProperty('opacity', 1);

        const posX = event.offsetX
          ? event.offsetX
          : event.pageX - currentImageEl.offsetLeft;
        const posY = event.offsetY
          ? event.offsetY
          : event.pageY - currentImageEl.offsetTop;
        const bgPosXMultiplier = 3;
        const bgPosYMultiplier = 3;

        let magnifierTransformX, magnifierTransformY;
        if (type === 'outside') {
          zoomedElement.style.setProperty(
            'background-position-x',
            `${-posX * bgPosXMultiplier}px`
          );
          zoomedElement.style.setProperty(
            'background-position-y',
            `${-posY * bgPosYMultiplier}px`
          );
          magnifierTransformX = offsetWidth * 0.5;
          magnifierTransformY = offsetHeight * -0.52;
        } else {
          magnifierImageElement.style.setProperty(
            'background-position-x',
            `${-posX * bgPosXMultiplier}px`
          );
          magnifierImageElement.style.setProperty(
            'background-position-y',
            `${-posY * bgPosYMultiplier}px`
          );
          magnifierTransformX = offsetWidth * 0.5;
          magnifierTransformY = -(offsetHeight * 0.51);
        }

        magnifierElement.style.setProperty(
          'transform',
          `translate(${event.offsetX - magnifierTransformX}px, ${
          event.offsetY + magnifierTransformY
        }px)`
        );
        magnifierImageElement.style.setProperty(
          'transform',
          `translate(${-event.offsetX + offsetWidth / 2 - 1}px, ${
          -event.offsetY + offsetHeight / 2
        }px)`
        );
      });

      this.currentImageEl.addEventListener('mouseout', () => {
        currentImageEl.style.setProperty('filter', 'unset');
        magnifierElement.style.setProperty('opacity', 0);
        if (type === 'outside') zoomedElement.style.setProperty('opacity', 0);
      });
    }
  }

  return HoverZoom;

}));
