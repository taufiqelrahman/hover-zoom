## [1.5.1] - 2025-08-19

### Fixed

- Fixed bug position from left to right

## [1.5.0] - 2025-08-19

### Fixed

- Fixed ESM build bug that caused import errors in some environments

## [1.4.0] - 2025-08-19

### Added

- Improved accessibility for keyboard users
- Added more robust error handling for missing or invalid image elements
- Enhanced documentation and usage examples

### Changed

- Further code cleanup and minor performance optimizations

## [1.3.0] - 2025-08-18

### Changed

- Refactored internal logic to eliminate unnecessary mutable state
- Removed unused parameters (`iteration`, `container`) from internal methods
- All DOM operations now use local variables and parentNode references
- Codebase is now cleaner and more maintainable

## [1.2.0] - 2025-08-16

### Added

- ESM and UMD build outputs for broader compatibility
- Improved demo page and documentation
- Enhanced initialization to support more flexible usage

### Changed

- Refactored code for better modularity and maintainability

## [1.1.2] - 2025-08-16

### Fixed

- Minor bug fixes and code cleanup

## [1.1.1] - 2025-08-16

### Changed

- Improved TypeScript type safety and fixed build warnings
- Updated documentation and usage examples

## [1.1.0] - 2025-08-16

### Changed

- Refactored codebase for better readability and maintainability
- Improved initialization to support DOMContentLoaded event
- Enhanced modularity and code structure for easier extension

## [1.0.0] - 2025-08-16

### Added

- Initial release of HoverZoom plugin (v1.0.0)
- Pure JavaScript image zoom on hover, no dependencies
- Supports both 'inside' and 'outside' zoom types
- Configurable options: position, type, blur, grayscale, large image source
- Works with multiple images on a page
- Modern, modular, and readable codebase
- Browser compatibility: Chrome, Firefox, Safari, Opera
