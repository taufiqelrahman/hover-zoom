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
          magnifierImage: 'hoverzoom-magnifier--image'
        },
        position: 'left',
        type: 'outside',
        largeImage: '',
        blur: false,
        grayscale: false
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
      window.onload = () => {
        for (let i = 0; i < imgContainer.length; i++) {
          this.applyHoverZoom(i, imgContainer[i]);
        }
      };
    }

    applyHoverZoom(iteration, container) {
      const { image } = this.options.classNames;
      const currentImageEl = container.querySelector(`.${image}`);
      currentImageEl.setAttribute('id', `${image}-${iteration}`);
      const largeImage = currentImageEl.dataset.largeImage
        ? currentImageEl.dataset.largeImage
        : currentImageEl.src;

      const type = currentImageEl.dataset.type || this.options.type;
      if (type === 'outside') {
        this.outsideZoom(iteration, currentImageEl, largeImage);
      } else {
        this.insideZoom(iteration, currentImageEl, largeImage);
      }
      this.addMouseListener(iteration, currentImageEl);
    }

    outsideZoom(iteration, currentImageEl, largeImage) {
      const { zoomedImage, magnifier, magnifierImage } = this.options.classNames;
      const zoomedElement = document.createElement('DIV');
      zoomedElement.classList.add(zoomedImage);
      zoomedElement.setAttribute('id', `${zoomedImage}-${iteration}`);
      zoomedElement.style.setProperty(
        'background-image',
        `url('${largeImage}')`
      );
      zoomedElement.style.setProperty(
        'background-size',
        `${currentImageEl.offsetWidth * 4}px ${currentImageEl.offsetHeight * 4}px`
      );

      const position =
        currentImageEl.dataset.position || this.options.position;
      currentImageEl.parentNode.style.setProperty(
        'flex-direction',
        position === 'left' ? 'row' : 'column'
      );
      this.attachZoomedImage(currentImageEl, zoomedElement);

      const magnifierElement = document.createElement('DIV');
      magnifierElement.classList.add(magnifier);
      magnifierElement.setAttribute('id', `${magnifier}-${iteration}`);

      const magnifierImageElement = document.createElement('IMG');
      magnifierImageElement.classList.add(magnifierImage);
      magnifierImageElement.setAttribute(
        'id',
        `${magnifierImage}-${iteration}`
      );
      magnifierImageElement.setAttribute('src', largeImage);
      magnifierImageElement.style.setProperty(
        'height',
        currentImageEl.offsetHeight
      );
      magnifierImageElement.style.setProperty(
        'width',
        currentImageEl.offsetWidth
      );
      magnifierElement.appendChild(magnifierImageElement);

    currentImageEl.parentNode.appendChild(magnifierElement);

      const magnifierWidth =
        (magnifierElement.offsetHeight * currentImageEl.offsetWidth) /
        currentImageEl.offsetHeight;
      magnifierElement.style.setProperty('width', magnifierWidth);
    }

    attachZoomedImage(currentImageEl, zoomedElement) {
      zoomedElement.style.setProperty(
        'height',
        currentImageEl.offsetHeight
      );
      zoomedElement.style.setProperty(
        'width',
        currentImageEl.offsetWidth
      );

      const position =
        currentImageEl.dataset.position || this.options.position;
      if (position === 'left') {
        zoomedElement.style.setProperty('margin-left', 6);
      } else {
        zoomedElement.style.setProperty('margin-top', 6);
      }
      currentImageEl.parentNode.appendChild(zoomedElement);
    }

    insideZoom(iteration, currentImageEl, largeImage) {
      const { magnifier, magnifierImage, magnifierRound } =
        this.options.classNames;
      const magnifierElement = document.createElement('DIV');
      magnifierElement.classList.add(magnifier);
      magnifierElement.classList.add(magnifierRound);
      magnifierElement.setAttribute(
        'id',
        `${magnifier}-${iteration}`
      );

      const magnifierImageElement = document.createElement('DIV');
      magnifierImageElement.classList.add(magnifierImage);
      magnifierImageElement.setAttribute(
        'id',
        `${magnifierImage}-${iteration}`
      );
      magnifierImageElement.style.setProperty(
        'background-image',
        `url('${largeImage}')`
      );
      magnifierImageElement.style.setProperty(
        'background-size',
        `${currentImageEl.offsetWidth * 4}px ${currentImageEl.offsetHeight * 4}px`
      );
      magnifierImageElement.style.setProperty(
        'height',
        currentImageEl.offsetHeight
      );
      magnifierImageElement.style.setProperty(
        'width',
        currentImageEl.offsetWidth
      );
      magnifierElement.appendChild(magnifierImageElement);

    currentImageEl.parentNode.appendChild(magnifierElement);
    }

    addMouseListener(iteration, currentImageEl) {
      const { magnifier, magnifierImage, zoomedImage } =
        this.options.classNames;
      const magnifierImageElement = document.getElementById(
        `${magnifierImage}-${iteration}`
      );
      const magnifierElement = document.getElementById(
        `${magnifier}-${iteration}`
      );
      const { offsetHeight, offsetWidth } = magnifierElement;
      const zoomedElement = document.getElementById(
        `${zoomedImage}-${iteration}`
      );
      const type = currentImageEl.dataset.type || this.options.type;

      currentImageEl.addEventListener('mousemove', (event) => {
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

      currentImageEl.addEventListener('mouseout', () => {
        currentImageEl.style.setProperty('filter', 'unset');
        magnifierElement.style.setProperty('opacity', 0);
        if (type === 'outside') zoomedElement.style.setProperty('opacity', 0);
      });
    }
  }

  return HoverZoom;

}));
