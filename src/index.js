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
  - iteration: contains the current iteration
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
        _.iteration = i;
				_.currentContainer = imgContainer[i];
				applyHoverZoom();
			}
		};
	};

	function applyHoverZoom() {
		const { image } = _.options.classNames;
    _.currentImageEl = _.currentContainer.querySelector(`.${image}`);
    _.currentImageEl.setAttribute('id', `${image}-${_.iteration}`);
    _.options.largeImage = _.currentImageEl.dataset.largeImage ? _.currentImageEl.dataset.largeImage : _.currentImageEl.src;

    const type = _.currentImageEl.dataset.type || _ .options.type;
		if (type === 'outside') {
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
    _.zoomedElement.setAttribute('id', `${zoomedImage}-${_.iteration}`);
    _.zoomedElement.style.setProperty('background-image', `url('${_.options.largeImage}')`);
    _.zoomedElement.style.setProperty('background-size', `${_.currentImageEl.offsetWidth * 4}px ${_.currentImageEl.offsetHeight * 4}px`);

    // set zoomed image's position [left|bottom]
    const position = _.currentImageEl.dataset.position || _.options.position;
    _.currentContainer.style.setProperty('flex-direction', position === 'left' ? 'row' : 'column');
    attachZoomedImage();

    // create magnifier box
    _.magnifierElement = document.createElement('DIV');
    _.magnifierElement.classList.add(magnifier);
    _.magnifierElement.setAttribute('id', `${magnifier}-${_.iteration}`);

    // create image inside magnifier box
    _.magnifierImageElement = document.createElement('IMG');
    _.magnifierImageElement.classList.add(magnifierImage);
    _.magnifierImageElement.setAttribute('id', `${magnifierImage}-${_.iteration}`);
    _.magnifierImageElement.setAttribute('src', _.options.largeImage);
    _.magnifierImageElement.style.setProperty('height', _.currentImageEl.offsetHeight);
    _.magnifierImageElement.style.setProperty('width', _.currentImageEl.offsetWidth);
    _.magnifierElement.appendChild(_.magnifierImageElement);

    // append magnifier to container
    _.currentContainer.appendChild(_.magnifierElement);

    // set width of magnifier
    const magnifierWidth = _.magnifierElement.offsetHeight * _.currentImageEl.offsetWidth / _.currentImageEl.offsetHeight;
    _.magnifierElement.style.setProperty('width', magnifierWidth);
  }

	function attachZoomedImage() {
    // only for outside type
		_.zoomedElement.style.setProperty('height', _.currentImageEl.offsetHeight);
    _.zoomedElement.style.setProperty('width', _.currentImageEl.offsetWidth);

    const position = _.currentImageEl.dataset.position || _.options.position;
    if (position === 'left') {
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
    _.magnifierElement.setAttribute('id', `${magnifier}-${_.iteration}`);

    // create image inside magnifier circle
    _.magnifierImageElement = document.createElement('DIV');
    _.magnifierImageElement.classList.add(magnifierImage);
    _.magnifierImageElement.setAttribute('id', `${magnifierImage}-${_.iteration}`);
    _.magnifierImageElement.style.setProperty('background-image', `url('${_.options.largeImage}')`);
    _.magnifierImageElement.style.setProperty('background-size', `${_.currentImageEl.offsetWidth * 4}px ${_.currentImageEl.offsetHeight * 4}px`);
    _.magnifierImageElement.style.setProperty('height', _.currentImageEl.offsetHeight);
    _.magnifierImageElement.style.setProperty('width', _.currentImageEl.offsetWidth);
    _.magnifierElement.appendChild(_.magnifierImageElement);

    // append magnifier to container
    _.currentContainer.appendChild(_.magnifierElement);
  }

	function addMouseListener() {
    const { image, magnifier, magnifierImage, zoomedImage } = _.options.classNames;
    const magnifierImageElement = document.getElementById(`${magnifierImage}-${_.iteration}`);
    const magnifierElement = document.getElementById(`${magnifier}-${_.iteration}`);
    const { offsetHeight, offsetWidth } = magnifierElement;
    const zoomedElement = document.getElementById(`${zoomedImage}-${_.iteration}`);
    const currentImageEl = document.getElementById(`${image}-${_.iteration}`);
    const type = currentImageEl.dataset.type || _ .options.type;
    // personalize it
    
    // apply listener when the mouse is hovering the image
		_.currentImageEl.addEventListener('mousemove', event => {
      // sets filter and opacity
      let filter = 'opacity(0.8)';
      if (currentImageEl.dataset.blur || _.options.blur) filter += ' blur(2px)'; // adds blur filter
      if (currentImageEl.dataset.grayscale || _.options.grayscale) filter += ' grayscale(100%)'; // adds grayscale filter
      currentImageEl.style.setProperty('filter', filter);

      magnifierElement.style.setProperty('opacity', 1);
			if (type === 'outside') zoomedElement.style.setProperty('opacity', 1);

      // calculate background-position for zoomed image (outside) and magnifier image (inside)
			const posX = event.offsetX ? (event.offsetX) : event.pageX - currentImageEl.offsetLeft;
      const posY = event.offsetY ? (event.offsetY) : event.pageY - currentImageEl.offsetTop;
      let magnifierTransformX, magnifierTransformY;
      const bgPosXMultiplier = 3;
      const bgPosYMultiplier = 3;

      if (type === 'outside') {
        zoomedElement.style.setProperty('background-position-x', `${-posX * bgPosXMultiplier}px`);
        zoomedElement.style.setProperty('background-position-y', `${-posY * bgPosYMultiplier}px`);
        magnifierTransformX = (offsetWidth * 0.5);
        magnifierTransformY = (offsetHeight * -0.52);
      } else {
        magnifierImageElement.style.setProperty('background-position-x', `${-posX * bgPosXMultiplier}px`);
        magnifierImageElement.style.setProperty('background-position-y', `${-posY * bgPosYMultiplier}px`);
        magnifierTransformX = (offsetWidth * 0.5);
        magnifierTransformY = -(offsetHeight * 0.51);
      }

      // calculate translation of magnifier
      magnifierElement.style.setProperty('transform', `translate(${event.offsetX - magnifierTransformX}px, ${event.offsetY + magnifierTransformY}px)`);
      magnifierImageElement.style.setProperty('transform', `translate(${-event.offsetX + offsetWidth / 2 - 1}px, ${-event.offsetY + (offsetHeight / 2)}px)`);
    });

    // apply listener when the mouse is NOT hovering the image
		_.currentImageEl.addEventListener('mouseout', () => {
      // sets filter and opacity
      currentImageEl.style.setProperty('filter', 'unset');
			magnifierElement.style.setProperty('opacity', 0);
			if (type === 'outside') zoomedElement.style.setProperty('opacity', 0);
		});
	}
}());
