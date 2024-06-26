import '@polymer/polymer/polymer-legacy.js';

/**
A simple Polymer `behavior` that wraps the HTML5 full screen API.

It lets you define which element to display in full screen mode
(via the `target` attribute) and toggle normal/full screen
mode by calling the `toggleFullscreen()` method.

Note that this method MUST be triggered directly by user interaction
(typically in a native `onclick` or Polymer's `on-click` handler).
If no `target` is set, the whole page (more specifically
`document.documentElement`) will be displayed full screen.

The element also provides 2 read-only flags as attribute:
- `fullscreenAvailable`: set to `true` if the browser supports
	 HTML5's full screen API (Safari on iOS does not).
- `fullscreen`: set to `true` if an element is currently displayed in
	 full screen mode.

@homepage https://github.com/vguillou/fullscreen-api
@demo demo/index.html
@polymerBehavior
*/
export const FullscreenBehavior = {
	properties: {
		/**
		 * The element to display full screen, or the selector to use to automatically
		 * find  the element to be displayed full screen.
		 *
		 * Note that changing the target while in full screen mode will not
		 * have any effect, as toggling between display modes MUST be
		 * triggered by user interaction.
		 *
		 * If `target` is not set, the whole page (more specifically
		 * `document.documentElement`) will be displayed full screen.
		 *
		 * @attribute target
		 * @type {Object|String}
		 */
		target: {
			type: Object,
			value: undefined,
			notify: true
		},

		/**
		 * Read-only flag (boolean) indicating if an element is being
		 * displayed full screen.
		 *
		 * @attribute fullscreen
		 * @type {boolean}
		 */
		fullscreen:  {
			type: Boolean,
			value: false,
			notify: true,
			readOnly: true,
			reflectToAttribute: true
		},

		/**
		 * Read-only flag (boolean) indicating if full screen mode is available
		 * on the browser (Safari on iOS does not support it).
		 *
		 * @attribute fullscreenAvailable
		 * @type {boolean}
		 */
		fullscreenAvailable:  {
			type: Boolean,
			value: false,
			notify: true,
			readOnly: true,
			reflectToAttribute: true
		}
	},

	/**
	 * Toggle between full screen and normal display mode.
	 * MUST be triggered directly by user interaction
	 * (typically in a native 'onclick' or Polymer's 'on-click' handler).
	 *
	 * @method toggleFullscreen
	 */
	toggleFullscreen: function() {
		if (this.fullscreenAvailable) {
			if (!this.fullscreen) {
				// We are not in full screen mode, let's request it
				// But first let's grad a hold on the target
				var targetElement = typeof this.target !== 'string' ? this.target :
					document.querySelector(this.target);
				targetElement = targetElement || document.documentElement;
				if (targetElement.requestFullscreen) {
					targetElement.requestFullscreen();
				} else if (targetElement.webkitRequestFullscreen) {
					targetElement.webkitRequestFullscreen();
				} else if (targetElement.mozRequestFullScreen) {
					targetElement.mozRequestFullScreen();
				} else if (targetElement.msRequestFullscreen) {
					targetElement.msRequestFullscreen();
				}
			} else {
				// We are in full screen mode, let's exit
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		}
	},

	/**
	 * Exit full screen mode (if toggled)
	 *
	 * @method exitFullscreen
	 */
	exitFullscreen: function() {
		if (this.fullscreen) {
			this.toggleFullscreen();
		}
	},

	ready: function() {
		this._setFullscreenAvailable(this._isFullscreenAvailable());
		if (this.fullscreenAvailable) {
			this._boundFullscreenChangedHandler = this._fullscreenChangedHandler.bind(this);
			document.addEventListener('fullscreenchange', this._boundFullscreenChangedHandler);
			document.addEventListener('webkitfullscreenchange', this._boundFullscreenChangedHandler);
			document.addEventListener('mozfullscreenchange', this._boundFullscreenChangedHandler);
			document.addEventListener('MSFullscreenChange', this._boundFullscreenChangedHandler);
		}
		this._fullscreenChangedHandler();
	},

	detached: function() {
		if (this._boundFullscreenChangedHandler) {
			document.removeEventListener('fullscreenchange', this._boundFullscreenChangedHandler);
			document.removeEventListener('webkitfullscreenchange', this._boundFullscreenChangedHandler);
			document.removeEventListener('mozfullscreenchange', this._boundFullscreenChangedHandler);
			document.removeEventListener('MSFullscreenChange', this._boundFullscreenChangedHandler);
		}
	},

	_fullscreenChangedHandler: function() {
		this._setFullscreen(this._isFullscreenToggled());
	},

	_isFullscreenAvailable: function() {
		return (document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled) ? true : false;
	},

	_isFullscreenToggled: function() {
		return (document.fullscreenElement ||
			document.webkitFullscreenElement ||
			document.mozFullScreenElement ||
			document.msFullscreenElement) ? true : false;
	},
};
