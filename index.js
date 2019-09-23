///////////////////////////////////
//
//  Name: HoverZoom
//  Version: 1.0.0
//  Author: Taufiq El Rahman
//
///////////////////////////////////

(function () {
	this.HoverZoom = {};
  const _ = this.HoverZoom;

  // check if the browser is safari
  _.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]'; })(!window['safari'] || (typeof safari !== 'undefined' && window.safari.pushNotification));

  /*
  list of object props

  - options: contains plugin options
  - currentContainer: [temporary object] contains current container applied
  - zoomedElement: [temporary object] contains current zoomed image element (only for outside type)
  - currentImageEl: [temporary object] contains current original image element
  - magnifierElement: [temporary object] contains current magnifier box / circle element
  - magnifierImageElement: [temporary object] contains current image inside magnifier element
  
   */

	_.init = function() {
		// Define option defaults
		const defaults = {
			classNames: { // list of classnames
				container: 'hoverzoom',
				image: 'hoverzoom-image',
				zoomedImage: 'hoverzoom-zoom',
				magnifier: 'hoverzoom-magnifier',
				magnifierRound: 'hoverzoom-magnifier--round',
				magnifierImage: 'hoverzoom-magnifier--image'
			},
			position: 'left', // [left|bottom] zoomed element's position (outside type only)
      type: 'outside', // [outside|inside] magnifier type
      magnifierHeight: 60, // magnifier box's height
      magnifierWidth: 60, // magnifier box's width
      largeImage: '', // image source if large image url is passed
      blur: false, // blur option for original image
      grayscale: false, // grayscale option for original image
		};

		// Create options by merging defaults with the passed in arguments
		if (arguments[0] && typeof arguments[0] === 'object') {
			_.options = { ...defaults, ...arguments[0]};
		}

		const imgContainer = document.getElementsByClassName(_.options.classNames.container);
		window.onload = () => {
      // iterate though all elements which have .hoverzoom class in the DOM
			for (var i = 0; i < imgContainer.length; i++) {
				_.currentContainer = imgContainer[i];
				applyHoverZoom();
			}
		};
	};

	function applyHoverZoom() {
    _.currentImageEl = _.currentContainer.querySelector(`.${_.options.classNames.image}`);
    _.options.largeImage = _.currentImageEl.dataset.largeImage ? _.currentImageEl.dataset.largeImage : _.currentImageEl.src;

		if (_.options.type === 'outside') {
      outsideZoom();
		} else {
      insideZoom();
    }
    addMouseListener();
  }
  
  function outsideZoom() {
		const { zoomedImage, magnifier, magnifierImage  } = _.options.classNames;
    // create zoomed image
    _.zoomedElement = document.createElement('DIV');
    _.zoomedElement.classList.add(zoomedImage);
    _.zoomedElement.style.setProperty('background-image', `url('${_.options.largeImage}')`);

    // set zoomed image's position [left|bottom]
    _.currentContainer.style.setProperty('flex-direction', _.options.position === 'left' ? 'row' : 'column');
    attachZoomedImage();

    // create magnifier box
    _.magnifierElement = document.createElement('DIV');
    _.magnifierElement.classList.add(magnifier);
    _.options.magnifierWidth = _.options.magnifierHeight * _.currentImageEl.offsetWidth / _.currentImageEl.offsetHeight;
    _.magnifierElement.style.setProperty('width', _.options.magnifierWidth);

    // create image inside magnifier box
    _.magnifierImageElement = document.createElement('IMG');
    _.magnifierImageElement.classList.add(magnifierImage);
    _.magnifierImageElement.setAttribute('src', _.options.largeImage);
    _.magnifierImageElement.style.setProperty('height', _.currentImageEl.offsetHeight);
    _.magnifierImageElement.style.setProperty('width', _.currentImageEl.offsetWidth);
    _.magnifierElement.appendChild(_.magnifierImageElement);

    // append magnifier to container
    _.currentContainer.appendChild(_.magnifierElement);
  }

	function attachZoomedImage() {
    // only for outside type
		_.zoomedElement.style.setProperty('height', _.currentImageEl.offsetHeight);
    _.zoomedElement.style.setProperty('width', _.currentImageEl.offsetWidth);
    if (_.options.position === 'left') {
      _.zoomedElement.style.setProperty('margin-left', 6);
    } else {
      _.zoomedElement.style.setProperty('margin-top', 6);
    }
    // attach to container
		_.currentContainer.appendChild(_.zoomedElement);
	}

  function insideZoom() {
		const { magnifier, magnifierImage, magnifierRound } = _.options.classNames;
    // create magnifier circle
    _.magnifierElement = document.createElement('DIV');
    _.magnifierElement.classList.add(magnifier);
    _.magnifierElement.classList.add(magnifierRound);

    // create image inside magnifier circle
    _.magnifierImageElement = document.createElement('DIV');
    _.magnifierImageElement.classList.add(magnifierImage);
    _.magnifierImageElement.style.setProperty('background-image', `url('${_.options.largeImage}')`);
    _.magnifierImageElement.style.setProperty('height', _.currentImageEl.offsetHeight);
    _.magnifierImageElement.style.setProperty('width', _.currentImageEl.offsetWidth);
    _.magnifierElement.appendChild(_.magnifierImageElement);
    
    // set size for magnifier circle
    _.options.magnifierWidth = 180;
    _.options.magnifierHeight = 180;

    // append magnifier to container
    _.currentContainer.appendChild(_.magnifierElement);
  }

	function addMouseListener() {
    // apply listener when the mouse is hovering the image
		_.currentImageEl.addEventListener('mousemove', event => {
      // sets filter and opacity
      let filter = 'opacity(0.8)';
      if (_.options.blur) filter += ' blur(2px)'; // adds blur filter
      if (_.options.grayscale) filter += ' grayscale(100%)'; // adds grayscale filter
      _.currentImageEl.style.setProperty('filter', filter);
      _.magnifierElement.style.setProperty('opacity', 1);
			if (_.options.type === 'outside') _.zoomedElement.style.setProperty('opacity', 1);

      // calculate background-position for zoomed image (outside) and magnifier image (inside)
			const posX = event.offsetX ? (event.offsetX) : event.pageX - _.currentImageEl.offsetLeft;
      const posY = event.offsetY ? (event.offsetY) : event.pageY - _.currentImageEl.offsetTop;
      let magnifierTransformX, magnifierTransformY;
      const bgPosXMultiplier = 3;
      const bgPosYMultiplier = _.isSafari ? 1.3 : 3;

      if (_.options.type === 'outside') {
        _.zoomedElement.style.setProperty('background-position-x', `${-posX * bgPosXMultiplier}px`);
        _.zoomedElement.style.setProperty('background-position-y', `${-posY * bgPosYMultiplier}px`);
        magnifierTransformX = (_.options.magnifierWidth / 2);
        magnifierTransformY = (_.options.magnifierHeight / 2);
      } else {
        _.magnifierImageElement.style.setProperty('background-position-x', `${-posX * bgPosXMultiplier}px`);
        _.magnifierImageElement.style.setProperty('background-position-y', `${-posY * bgPosYMultiplier}px`);
        magnifierTransformX = (_.options.magnifierWidth / 2);
        magnifierTransformY = -(_.options.magnifierHeight / 6);
      }

      // calculate translation of magnifier
      _.magnifierElement.style.setProperty('transform', `translate(${event.offsetX - magnifierTransformX}px, ${event.offsetY + magnifierTransformY}px)`);
      _.magnifierImageElement.style.setProperty('transform', `translate(${-event.offsetX + _.options.magnifierWidth / 2 - 1}px, ${-event.offsetY + (_.options.magnifierHeight / 2 - 3)}px)`);
		});

    // apply listener when the mouse is NOT hovering the image
		_.currentImageEl.addEventListener('mouseout', () => {
      // sets filter and opacity
      _.currentImageEl.style.setProperty('filter', 'unset');
			_.magnifierElement.style.setProperty('opacity', 0);
			if (_.options.type === 'outside') _.zoomedElement.style.setProperty('opacity', 0);
		});
	}
}());
