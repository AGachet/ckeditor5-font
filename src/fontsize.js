/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module font/fontsize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FontSizeEditing from './fontsize/fontsizeediting';
import FontSizeUI from './fontsize/fontsizeui';

/**
 * The Font Size plugin.
 *
 * It requires {@link module:font/fontsizeediting~FontSizeEditing} and {@link module:font/fontsizeui~FontSizeUI} plugins.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FontSize extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ FontSizeEditing, FontSizeUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FontSize';
	}
}
