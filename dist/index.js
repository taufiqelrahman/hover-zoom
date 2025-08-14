"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverZoom = void 0;
// Main HoverZoom class encapsulates all logic and state
var HoverZoom = /** @class */ (function () {
    function HoverZoom(options) {
        this.iteration = 0;
        this.currentContainer = null;
        this.zoomedElement = null;
        this.currentImageEl = null;
        this.magnifierElement = null;
        this.magnifierImageElement = null;
        // Merge user options with defaults
        this.options = __assign(__assign(__assign({}, HoverZoom.defaultOptions), options), { classNames: __assign(__assign({}, HoverZoom.defaultOptions.classNames), ((options === null || options === void 0 ? void 0 : options.classNames) || {})) });
    }
    // Utility: Detect if browser is Safari
    HoverZoom.isSafari = function () {
        return (/constructor/i.test(window.HTMLElement) ||
            (function (p) {
                return p && p.toString() === "[object SafariRemoteNotification]";
            })(!window.safari ||
                (typeof window.safari !== "undefined" &&
                    window.safari.pushNotification)));
    };
    // Initialize the plugin and attach to all containers
    HoverZoom.prototype.init = function () {
        var _this = this;
        var imgContainers = document.getElementsByClassName(this.options.classNames.container);
        window.onload = function () {
            for (var i = 0; i < imgContainers.length; i++) {
                _this.iteration = i;
                _this.currentContainer = imgContainers[i];
                _this.applyHoverZoom();
            }
        };
    };
    // Set up zoom/magnifier for a single container
    HoverZoom.prototype.applyHoverZoom = function () {
        var image = this.options.classNames.image;
        if (!this.currentContainer)
            return;
        this.currentImageEl = this.currentContainer.querySelector(".".concat(image));
        if (!this.currentImageEl)
            return;
        this.currentImageEl.id = "".concat(image, "-").concat(this.iteration);
        this.options.largeImage =
            this.currentImageEl.dataset.largeImage || this.currentImageEl.src;
        var type = this.currentImageEl.dataset.type ||
            this.options.type;
        if (type === "outside") {
            this.outsideZoom();
        }
        else {
            this.insideZoom();
        }
        this.addMouseListener();
    };
    // Create and attach the zoomed image and magnifier for 'outside' type
    HoverZoom.prototype.outsideZoom = function () {
        var _a = this.options.classNames, zoomedImage = _a.zoomedImage, magnifier = _a.magnifier, magnifierImage = _a.magnifierImage;
        if (!this.currentImageEl || !this.currentContainer)
            return;
        this.zoomedElement = document.createElement("div");
        this.zoomedElement.classList.add(zoomedImage);
        this.zoomedElement.id = "".concat(zoomedImage, "-").concat(this.iteration);
        this.zoomedElement.style.backgroundImage = "url('".concat(this.options.largeImage, "')");
        this.zoomedElement.style.backgroundSize = "".concat(this.currentImageEl.offsetWidth * 4, "px ").concat(this.currentImageEl.offsetHeight * 4, "px");
        var position = this.currentImageEl.dataset.position || this.options.position;
        this.currentContainer.style.flexDirection =
            position === "left" ? "row" : "column";
        this.attachZoomedImage();
        this.magnifierElement = document.createElement("div");
        this.magnifierElement.classList.add(magnifier);
        this.magnifierElement.id = "".concat(magnifier, "-").concat(this.iteration);
        var imgElem = document.createElement("img");
        imgElem.classList.add(magnifierImage);
        imgElem.id = "".concat(magnifierImage, "-").concat(this.iteration);
        imgElem.src = this.options.largeImage;
        imgElem.style.height = "".concat(this.currentImageEl.offsetHeight, "px");
        imgElem.style.width = "".concat(this.currentImageEl.offsetWidth, "px");
        this.magnifierImageElement = imgElem;
        this.magnifierElement.appendChild(imgElem);
        this.currentContainer.appendChild(this.magnifierElement);
        var magnifierWidth = (this.magnifierElement.offsetHeight * this.currentImageEl.offsetWidth) /
            this.currentImageEl.offsetHeight;
        this.magnifierElement.style.width = "".concat(magnifierWidth, "px");
    };
    // Attach the zoomed image to the container
    HoverZoom.prototype.attachZoomedImage = function () {
        if (!this.zoomedElement || !this.currentImageEl || !this.currentContainer)
            return;
        this.zoomedElement.style.height = "".concat(this.currentImageEl.offsetHeight, "px");
        this.zoomedElement.style.width = "".concat(this.currentImageEl.offsetWidth, "px");
        var position = this.currentImageEl.dataset.position || this.options.position;
        if (position === "left") {
            this.zoomedElement.style.marginLeft = "6px";
        }
        else {
            this.zoomedElement.style.marginTop = "6px";
        }
        this.currentContainer.appendChild(this.zoomedElement);
    };
    // Create and attach the magnifier for 'inside' type
    HoverZoom.prototype.insideZoom = function () {
        var _a = this.options.classNames, magnifier = _a.magnifier, magnifierImage = _a.magnifierImage, magnifierRound = _a.magnifierRound;
        if (!this.currentImageEl || !this.currentContainer)
            return;
        this.magnifierElement = document.createElement("div");
        this.magnifierElement.classList.add(magnifier, magnifierRound);
        this.magnifierElement.id = "".concat(magnifier, "-").concat(this.iteration);
        this.magnifierImageElement = document.createElement("div");
        this.magnifierImageElement.classList.add(magnifierImage);
        this.magnifierImageElement.id = "".concat(magnifierImage, "-").concat(this.iteration);
        this.magnifierImageElement.style.backgroundImage = "url('".concat(this.options.largeImage, "')");
        this.magnifierImageElement.style.backgroundSize = "".concat(this.currentImageEl.offsetWidth * 4, "px ").concat(this.currentImageEl.offsetHeight * 4, "px");
        this.magnifierImageElement.style.height = "".concat(this.currentImageEl.offsetHeight, "px");
        this.magnifierImageElement.style.width = "".concat(this.currentImageEl.offsetWidth, "px");
        this.magnifierElement.appendChild(this.magnifierImageElement);
        this.currentContainer.appendChild(this.magnifierElement);
    };
    // Add mouse event listeners for zoom/magnifier effect
    HoverZoom.prototype.addMouseListener = function () {
        var _this = this;
        if (!this.currentImageEl)
            return;
        var _a = this.options.classNames, image = _a.image, magnifier = _a.magnifier, magnifierImage = _a.magnifierImage, zoomedImage = _a.zoomedImage;
        var magnifierImageElement = document.getElementById("".concat(magnifierImage, "-").concat(this.iteration));
        var magnifierElement = document.getElementById("".concat(magnifier, "-").concat(this.iteration));
        if (!magnifierElement || !magnifierImageElement)
            return;
        var offsetHeight = magnifierElement.offsetHeight, offsetWidth = magnifierElement.offsetWidth;
        var zoomedElement = document.getElementById("".concat(zoomedImage, "-").concat(this.iteration));
        var currentImageEl = document.getElementById("".concat(image, "-").concat(this.iteration));
        var type = currentImageEl.dataset.type ||
            this.options.type;
        this.currentImageEl.addEventListener("mousemove", function (event) {
            var filter = "opacity(0.8)";
            if (currentImageEl.dataset.blur || _this.options.blur)
                filter += " blur(2px)";
            if (currentImageEl.dataset.grayscale || _this.options.grayscale)
                filter += " grayscale(100%)";
            currentImageEl.style.filter = filter;
            magnifierElement.style.opacity = "1";
            if (type === "outside" && zoomedElement)
                zoomedElement.style.opacity = "1";
            var posX = event.offsetX
                ? event.offsetX
                : event.pageX - currentImageEl.offsetLeft;
            var posY = event.offsetY
                ? event.offsetY
                : event.pageY - currentImageEl.offsetTop;
            var magnifierTransformX, magnifierTransformY;
            var bgPosXMultiplier = 3;
            var bgPosYMultiplier = 3;
            if (type === "outside" && zoomedElement) {
                zoomedElement.style.backgroundPositionX = "".concat(-posX * bgPosXMultiplier, "px");
                zoomedElement.style.backgroundPositionY = "".concat(-posY * bgPosYMultiplier, "px");
                magnifierTransformX = offsetWidth * 0.5;
                magnifierTransformY = offsetHeight * -0.52;
            }
            else {
                magnifierImageElement.style.backgroundPositionX = "".concat(-posX * bgPosXMultiplier, "px");
                magnifierImageElement.style.backgroundPositionY = "".concat(-posY * bgPosYMultiplier, "px");
                magnifierTransformX = offsetWidth * 0.5;
                magnifierTransformY = -(offsetHeight * 0.51);
            }
            magnifierElement.style.transform = "translate(".concat(event.offsetX - magnifierTransformX, "px, ").concat(event.offsetY + magnifierTransformY, "px)");
            magnifierImageElement.style.transform = "translate(".concat(-event.offsetX + offsetWidth / 2 - 1, "px, ").concat(-event.offsetY + offsetHeight / 2, "px)");
        });
        this.currentImageEl.addEventListener("mouseout", function () {
            currentImageEl.style.filter = "";
            magnifierElement.style.opacity = "0";
            if (type === "outside" && zoomedElement)
                zoomedElement.style.opacity = "0";
        });
    };
    // Default options for the plugin
    HoverZoom.defaultOptions = {
        classNames: {
            container: "hoverzoom",
            image: "hoverzoom-image",
            zoomedImage: "hoverzoom-zoom",
            magnifier: "hoverzoom-magnifier",
            magnifierRound: "hoverzoom-magnifier--round",
            magnifierImage: "hoverzoom-magnifier--image",
        },
        position: "left",
        type: "outside",
        largeImage: "",
        blur: false,
        grayscale: false,
    };
    return HoverZoom;
}());
exports.HoverZoom = HoverZoom;
