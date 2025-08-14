// HoverZoomOptions defines the configuration for the HoverZoom plugin
export interface HoverZoomOptions {
  classNames?: Partial<{
    container: string;
    image: string;
    zoomedImage: string;
    magnifier: string;
    magnifierRound: string;
    magnifierImage: string;
  }>;
  position?: "left" | "bottom";
  type?: "outside" | "inside";
  largeImage?: string;
  blur?: boolean;
  grayscale?: boolean;
}

// Main HoverZoom class encapsulates all logic and state
export class HoverZoom {
  private options: Required<HoverZoomOptions>;
  private iteration = 0;
  private currentContainer: HTMLElement | null = null;
  private zoomedElement: HTMLElement | null = null;
  private currentImageEl: HTMLImageElement | null = null;
  private magnifierElement: HTMLElement | null = null;
  private magnifierImageElement: HTMLElement | HTMLImageElement | null = null;

  // Default options for the plugin
  static defaultOptions: Required<HoverZoomOptions> = {
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

  // Utility: Detect if browser is Safari
  static isSafari(): boolean {
    return (
      /constructor/i.test(window.HTMLElement as any) ||
      (function (p: any) {
        return p && p.toString() === "[object SafariRemoteNotification]";
      })(
        !(window as any).safari ||
          (typeof (window as any).safari !== "undefined" &&
            (window as any).safari.pushNotification)
      )
    );
  }

  constructor(options?: HoverZoomOptions) {
    // Merge user options with defaults
    this.options = {
      ...HoverZoom.defaultOptions,
      ...options,
      classNames: {
        ...HoverZoom.defaultOptions.classNames,
        ...(options?.classNames || {}),
      },
    };
  }

  // Initialize the plugin and attach to all containers
  public init(): void {
    const imgContainers = document.getElementsByClassName(
      this.options.classNames.container!
    );
    window.onload = () => {
      for (let i = 0; i < imgContainers.length; i++) {
        this.iteration = i;
        this.currentContainer = imgContainers[i] as HTMLElement;
        this.applyHoverZoom();
      }
    };
  }

  // Set up zoom/magnifier for a single container
  private applyHoverZoom(): void {
    const { image } = this.options.classNames;
    if (!this.currentContainer) return;
    this.currentImageEl = this.currentContainer.querySelector(
      `.${image}`
    ) as HTMLImageElement;
    if (!this.currentImageEl) return;
    this.currentImageEl.id = `${image}-${this.iteration}`;
    this.options.largeImage =
      this.currentImageEl.dataset.largeImage || this.currentImageEl.src;
    const type =
      (this.currentImageEl.dataset.type as "outside" | "inside") ||
      this.options.type;
    if (type === "outside") {
      this.outsideZoom();
    } else {
      this.insideZoom();
    }
    this.addMouseListener();
  }

  // Create and attach the zoomed image and magnifier for 'outside' type
  private outsideZoom(): void {
    const { zoomedImage, magnifier, magnifierImage } = this.options.classNames;
    if (!this.currentImageEl || !this.currentContainer) return;
    this.zoomedElement = document.createElement("div");
    this.zoomedElement.classList.add(zoomedImage!);
    this.zoomedElement.id = `${zoomedImage}-${this.iteration}`;
    this.zoomedElement.style.backgroundImage = `url('${this.options.largeImage}')`;
    this.zoomedElement.style.backgroundSize = `${
      this.currentImageEl.offsetWidth * 4
    }px ${this.currentImageEl.offsetHeight * 4}px`;
    const position =
      this.currentImageEl.dataset.position || this.options.position;
    this.currentContainer.style.flexDirection =
      position === "left" ? "row" : "column";
    this.attachZoomedImage();
    this.magnifierElement = document.createElement("div");
    this.magnifierElement.classList.add(magnifier!);
    this.magnifierElement.id = `${magnifier}-${this.iteration}`;
    const imgElem = document.createElement("img");
    imgElem.classList.add(magnifierImage!);
    imgElem.id = `${magnifierImage}-${this.iteration}`;
    imgElem.src = this.options.largeImage;
    imgElem.style.height = `${this.currentImageEl.offsetHeight}px`;
    imgElem.style.width = `${this.currentImageEl.offsetWidth}px`;
    this.magnifierImageElement = imgElem;
    this.magnifierElement.appendChild(imgElem);
    this.currentContainer.appendChild(this.magnifierElement);
    const magnifierWidth =
      (this.magnifierElement.offsetHeight * this.currentImageEl.offsetWidth) /
      this.currentImageEl.offsetHeight;
    this.magnifierElement.style.width = `${magnifierWidth}px`;
  }

  // Attach the zoomed image to the container
  private attachZoomedImage(): void {
    if (!this.zoomedElement || !this.currentImageEl || !this.currentContainer)
      return;
    this.zoomedElement.style.height = `${this.currentImageEl.offsetHeight}px`;
    this.zoomedElement.style.width = `${this.currentImageEl.offsetWidth}px`;
    const position =
      this.currentImageEl.dataset.position || this.options.position;
    if (position === "left") {
      this.zoomedElement.style.marginLeft = "6px";
    } else {
      this.zoomedElement.style.marginTop = "6px";
    }
    this.currentContainer.appendChild(this.zoomedElement);
  }

  // Create and attach the magnifier for 'inside' type
  private insideZoom(): void {
    const { magnifier, magnifierImage, magnifierRound } =
      this.options.classNames;
    if (!this.currentImageEl || !this.currentContainer) return;
    this.magnifierElement = document.createElement("div");
    this.magnifierElement.classList.add(magnifier!, magnifierRound!);
    this.magnifierElement.id = `${magnifier}-${this.iteration}`;
    this.magnifierImageElement = document.createElement("div");
    this.magnifierImageElement.classList.add(magnifierImage!);
    this.magnifierImageElement.id = `${magnifierImage}-${this.iteration}`;
    this.magnifierImageElement.style.backgroundImage = `url('${this.options.largeImage}')`;
    this.magnifierImageElement.style.backgroundSize = `${
      this.currentImageEl.offsetWidth * 4
    }px ${this.currentImageEl.offsetHeight * 4}px`;
    this.magnifierImageElement.style.height = `${this.currentImageEl.offsetHeight}px`;
    this.magnifierImageElement.style.width = `${this.currentImageEl.offsetWidth}px`;
    this.magnifierElement.appendChild(this.magnifierImageElement);
    this.currentContainer.appendChild(this.magnifierElement);
  }

  // Add mouse event listeners for zoom/magnifier effect
  private addMouseListener(): void {
    if (!this.currentImageEl) return;
    const { image, magnifier, magnifierImage, zoomedImage } =
      this.options.classNames;
    const magnifierImageElement = document.getElementById(
      `${magnifierImage}-${this.iteration}`
    ) as HTMLElement;
    const magnifierElement = document.getElementById(
      `${magnifier}-${this.iteration}`
    ) as HTMLElement;
    if (!magnifierElement || !magnifierImageElement) return;
    const { offsetHeight, offsetWidth } = magnifierElement;
    const zoomedElement = document.getElementById(
      `${zoomedImage}-${this.iteration}`
    ) as HTMLElement;
    const currentImageEl = document.getElementById(
      `${image}-${this.iteration}`
    ) as HTMLImageElement;
    const type =
      (currentImageEl.dataset.type as "outside" | "inside") ||
      this.options.type;
    this.currentImageEl.addEventListener("mousemove", (event: MouseEvent) => {
      let filter = "opacity(0.8)";
      if (currentImageEl.dataset.blur || this.options.blur)
        filter += " blur(2px)";
      if (currentImageEl.dataset.grayscale || this.options.grayscale)
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
    });
    this.currentImageEl.addEventListener("mouseout", () => {
      currentImageEl.style.filter = "";
      magnifierElement.style.opacity = "0";
      if (type === "outside" && zoomedElement)
        zoomedElement.style.opacity = "0";
    });
  }
}
