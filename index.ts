///////////////////////////////////
//
//  Name: HoverZoom
//  Version: 1.0.0
//  Author: Taufiq El Rahman
//
///////////////////////////////////

interface HoverZoomOptions {
  classNames: {
    container: string;
    image: string;
    zoomedImage: string;
    magnifier: string;
    magnifierRound: string;
    magnifierImage: string;
  };
  position: "left" | "bottom";
  type: "outside" | "inside";
  largeImage: string;
  blur: boolean;
  grayscale: boolean;
}

interface HoverZoomInternal {
  options: HoverZoomOptions;
  iteration: number;
  currentContainer: HTMLElement | null;
  zoomedElement: HTMLElement | null;
  currentImageEl: HTMLImageElement | null;
  magnifierElement: HTMLElement | null;
  magnifierImageElement: HTMLElement | HTMLImageElement | null;
  isSafari: boolean;
  init?: (options?: Partial<HoverZoomOptions>) => void;
}

(function () {
  const HoverZoom: Partial<HoverZoomInternal> = {};

  HoverZoom.isSafari =
    /constructor/i.test(window.HTMLElement as any) ||
    (function (p: any) {
      return p && p.toString() === "[object SafariRemoteNotification]";
    })(
      !(window as any).safari ||
        (typeof (window as any).safari !== "undefined" &&
          (window as any).safari.pushNotification)
    );

  HoverZoom.init = function (options?: Partial<HoverZoomOptions>) {
    const defaults: HoverZoomOptions = {
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
    HoverZoom.options = {
      ...defaults,
      ...options,
      classNames: { ...defaults.classNames, ...(options?.classNames || {}) },
    };
    const imgContainers = document.getElementsByClassName(
      HoverZoom.options.classNames.container
    );
    window.onload = () => {
      for (let i = 0; i < imgContainers.length; i++) {
        HoverZoom.iteration = i;
        HoverZoom.currentContainer = imgContainers[i] as HTMLElement;
        applyHoverZoom();
      }
    };
  };

  function applyHoverZoom() {
    if (!HoverZoom.options || !HoverZoom.currentContainer) return;
    const { image } = HoverZoom.options.classNames;
    HoverZoom.currentImageEl = HoverZoom.currentContainer.querySelector(
      `.${image}`
    ) as HTMLImageElement;
    if (!HoverZoom.currentImageEl) return;
    HoverZoom.currentImageEl.id = `${image}-${HoverZoom.iteration}`;
    HoverZoom.options.largeImage =
      HoverZoom.currentImageEl.dataset.largeImage ||
      HoverZoom.currentImageEl.src;
    const type =
      (HoverZoom.currentImageEl.dataset.type as "outside" | "inside") ||
      HoverZoom.options.type;
    if (type === "outside") {
      outsideZoom();
    } else {
      insideZoom();
    }
    addMouseListener();
  }

  function outsideZoom() {
    if (
      !HoverZoom.options ||
      !HoverZoom.currentImageEl ||
      !HoverZoom.currentContainer
    )
      return;
    const { zoomedImage, magnifier, magnifierImage } =
      HoverZoom.options.classNames;
    HoverZoom.zoomedElement = document.createElement("div");
    HoverZoom.zoomedElement.classList.add(zoomedImage);
    HoverZoom.zoomedElement.id = `${zoomedImage}-${HoverZoom.iteration}`;
    HoverZoom.zoomedElement.style.backgroundImage = `url('${HoverZoom.options.largeImage}')`;
    HoverZoom.zoomedElement.style.backgroundSize = `${
      HoverZoom.currentImageEl.offsetWidth * 4
    }px ${HoverZoom.currentImageEl.offsetHeight * 4}px`;
    const position =
      HoverZoom.currentImageEl.dataset.position || HoverZoom.options.position;
    HoverZoom.currentContainer.style.flexDirection =
      position === "left" ? "row" : "column";
    attachZoomedImage();
    HoverZoom.magnifierElement = document.createElement("div");
    HoverZoom.magnifierElement.classList.add(magnifier);
    HoverZoom.magnifierElement.id = `${magnifier}-${HoverZoom.iteration}`;
    const imgElem = document.createElement("img");
    imgElem.classList.add(magnifierImage);
    imgElem.id = `${magnifierImage}-${HoverZoom.iteration}`;
    imgElem.src = HoverZoom.options.largeImage;
    imgElem.style.height = `${HoverZoom.currentImageEl.offsetHeight}px`;
    imgElem.style.width = `${HoverZoom.currentImageEl.offsetWidth}px`;
    HoverZoom.magnifierImageElement = imgElem;
    HoverZoom.magnifierElement.appendChild(imgElem);
    HoverZoom.currentContainer.appendChild(HoverZoom.magnifierElement);
    const magnifierWidth =
      (HoverZoom.magnifierElement.offsetHeight *
        HoverZoom.currentImageEl.offsetWidth) /
      HoverZoom.currentImageEl.offsetHeight;
    HoverZoom.magnifierElement.style.width = `${magnifierWidth}px`;
  }

  function attachZoomedImage() {
    if (
      !HoverZoom.zoomedElement ||
      !HoverZoom.currentImageEl ||
      !HoverZoom.currentContainer
    )
      return;
    HoverZoom.zoomedElement.style.height = `${HoverZoom.currentImageEl.offsetHeight}px`;
    HoverZoom.zoomedElement.style.width = `${HoverZoom.currentImageEl.offsetWidth}px`;
    const position =
      HoverZoom.currentImageEl.dataset.position || HoverZoom.options?.position;
    if (position === "left") {
      HoverZoom.zoomedElement.style.marginLeft = "6px";
    } else {
      HoverZoom.zoomedElement.style.marginTop = "6px";
    }
    HoverZoom.currentContainer.appendChild(HoverZoom.zoomedElement);
  }

  function insideZoom() {
    if (
      !HoverZoom.options ||
      !HoverZoom.currentImageEl ||
      !HoverZoom.currentContainer
    )
      return;
    const { magnifier, magnifierImage, magnifierRound } =
      HoverZoom.options.classNames;
    HoverZoom.magnifierElement = document.createElement("div");
    HoverZoom.magnifierElement.classList.add(magnifier, magnifierRound);
    HoverZoom.magnifierElement.id = `${magnifier}-${HoverZoom.iteration}`;
    HoverZoom.magnifierImageElement = document.createElement("div");
    HoverZoom.magnifierImageElement.classList.add(magnifierImage);
    HoverZoom.magnifierImageElement.id = `${magnifierImage}-${HoverZoom.iteration}`;
    HoverZoom.magnifierImageElement.style.backgroundImage = `url('${HoverZoom.options.largeImage}')`;
    HoverZoom.magnifierImageElement.style.backgroundSize = `${
      HoverZoom.currentImageEl.offsetWidth * 4
    }px ${HoverZoom.currentImageEl.offsetHeight * 4}px`;
    HoverZoom.magnifierImageElement.style.height = `${HoverZoom.currentImageEl.offsetHeight}px`;
    HoverZoom.magnifierImageElement.style.width = `${HoverZoom.currentImageEl.offsetWidth}px`;
    HoverZoom.magnifierElement.appendChild(HoverZoom.magnifierImageElement);
    HoverZoom.currentContainer.appendChild(HoverZoom.magnifierElement);
  }

  function addMouseListener() {
    if (!HoverZoom.options || !HoverZoom.currentImageEl) return;
    const { image, magnifier, magnifierImage, zoomedImage } =
      HoverZoom.options.classNames;
    const magnifierImageElement = document.getElementById(
      `${magnifierImage}-${HoverZoom.iteration}`
    ) as HTMLElement;
    const magnifierElement = document.getElementById(
      `${magnifier}-${HoverZoom.iteration}`
    ) as HTMLElement;
    if (!magnifierElement || !magnifierImageElement) return;
    const { offsetHeight, offsetWidth } = magnifierElement;
    const zoomedElement = document.getElementById(
      `${zoomedImage}-${HoverZoom.iteration}`
    ) as HTMLElement;
    const currentImageEl = document.getElementById(
      `${image}-${HoverZoom.iteration}`
    ) as HTMLImageElement;
    const type =
      (currentImageEl.dataset.type as "outside" | "inside") ||
      HoverZoom.options.type;
    HoverZoom.currentImageEl.addEventListener(
      "mousemove",
      (event: MouseEvent) => {
        let filter = "opacity(0.8)";
        if (currentImageEl.dataset.blur || HoverZoom.options?.blur)
          filter += " blur(2px)";
        if (currentImageEl.dataset.grayscale || HoverZoom.options?.grayscale)
          filter += " grayscale(100%)";
        currentImageEl.style.filter = filter;
        magnifierElement.style.opacity = "1";
        if (type === "outside" && zoomedElement)
          zoomedElement.style.opacity = "1";
        const posX = event.offsetX
          ? event.offsetX
          : event.pageX - currentImageEl.offsetLeft;
        const posY = event.offsetY
          ? event.offsetY
          : event.pageY - currentImageEl.offsetTop;
        let magnifierTransformX: number, magnifierTransformY: number;
        const bgPosXMultiplier = 3;
        const bgPosYMultiplier = 3;
        if (type === "outside" && zoomedElement) {
          zoomedElement.style.backgroundPositionX = `${
            -posX * bgPosXMultiplier
          }px`;
          zoomedElement.style.backgroundPositionY = `${
            -posY * bgPosYMultiplier
          }px`;
          magnifierTransformX = offsetWidth * 0.5;
          magnifierTransformY = offsetHeight * -0.52;
        } else {
          magnifierImageElement.style.backgroundPositionX = `${
            -posX * bgPosXMultiplier
          }px`;
          magnifierImageElement.style.backgroundPositionY = `${
            -posY * bgPosYMultiplier
          }px`;
          magnifierTransformX = offsetWidth * 0.5;
          magnifierTransformY = -(offsetHeight * 0.51);
        }
        magnifierElement.style.transform = `translate(${
          event.offsetX - magnifierTransformX
        }px, ${event.offsetY + magnifierTransformY}px)`;
        magnifierImageElement.style.transform = `translate(${
          -event.offsetX + offsetWidth / 2 - 1
        }px, ${-event.offsetY + offsetHeight / 2}px)`;
      }
    );
    HoverZoom.currentImageEl.addEventListener("mouseout", () => {
      currentImageEl.style.filter = "";
      magnifierElement.style.opacity = "0";
      if (type === "outside" && zoomedElement)
        zoomedElement.style.opacity = "0";
    });
  }

  (window as any).HoverZoom = HoverZoom;
})();
