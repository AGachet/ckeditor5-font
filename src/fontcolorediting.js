/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FontColorCommand from './fontcolorcommand';
import {FONT_COLOR, THEME_COLOR_ATTRIBUTE, DEFAULT_COLORS} from './constants';

function renderUpcastElement(){
	return viewEl => viewEl.getAttribute(THEME_COLOR_ATTRIBUTE) || viewEl.getStyle('color').replace(/\s/g, '');
}

function renderDowncastElement(themeColors){
	return (modelAttributeValue, viewWriter) => {
		const themeColor = themeColors.find(item => item.paletteKey === modelAttributeValue);
		const attributes = themeColor ? {
			[THEME_COLOR_ATTRIBUTE]: themeColor.paletteKey,
			style: `color:${themeColor.color}`
		} : {
			style: `color:${modelAttributeValue}`
		};
		return viewWriter.createAttributeElement('span', attributes, {priority: 7});
	}
}

export default class FontColorEditing extends Plugin {
	static get pluginName() {
		return 'FontColorEditing';
	}

	constructor(editor) {
		super(editor);

		editor.config.define(FONT_COLOR, {
			themeColors: [],
			exactColors: DEFAULT_COLORS.map(color => ({color})),
			columns: 6
		});

		editor.conversion.for('upcast').elementToAttribute({
			view: {
				name: 'span',
				attributes: {
					[THEME_COLOR_ATTRIBUTE]: /\S+/
				}
			},
			upcastAlso: [{
				name: 'span',
				styles: {
					color: /[\s\S]+/
				}
			}],
			model: {
				key: FONT_COLOR,
				value: renderUpcastElement()
			}
		});

		editor.conversion.for('downcast').attributeToElement({
			model: FONT_COLOR,
			view: renderDowncastElement(editor.config.get(FONT_COLOR).themeColors)
		});

		editor.commands.add(FONT_COLOR, new FontColorCommand(editor));

		editor.model.schema.extend('$text', {allowAttributes: [FONT_COLOR]});

		editor.model.schema.setAttributeProperties(FONT_COLOR, {
			isFormatting: true,
			copyOnEnter: true
		});
	}
}
