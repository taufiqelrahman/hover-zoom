///////////////////////////////////
//
//  Type definitions for HoverZoom
//
///////////////////////////////////

declare interface HoverZoomClassNames {
  container: string;
  image: string;
  zoomedImage: string;
  magnifier: string;
  magnifierRound: string;
  magnifierImage: string;
}

declare interface HoverZoomOptions {
  classNames?: Partial<HoverZoomClassNames>;
  position?: "right" | "column" | string;
  type?: "outside" | "inside" | string;
  largeImage?: string;
  blur?: boolean;
  grayscale?: boolean;
}

declare class HoverZoom {
  constructor(options?: HoverZoomOptions);
  init(): void;
  // Internal methods (not recommended for public use)
  private applyHoverZoom(): void;
  private outsideZoom(): void;
  private attachZoomedImage(): void;
  private insideZoom(): void;
  private addMouseListener(): void;
}

export default HoverZoom;
