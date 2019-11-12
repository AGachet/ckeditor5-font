/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FontColorCommand from './fontcolorcommand';
import {EXACT_COLOR, THEME_COLOR, FONT_COLOR, THEME_COLOR_ATTRIBUTE, DEFAULT_COLORS} from './constants';

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
				styles: {
					color: /[\s\S]+/
				}
			},
			model: {
				key: EXACT_COLOR,
				value: viewEl => viewEl.getAttribute(THEME_COLOR_ATTRIBUTE) ? null : viewEl.getStyle('color').replace(/\s/g, '')
			}
		});

		editor.conversion.for('upcast').elementToAttribute({
			view: {
				name: 'span',
				attributes: {
					[THEME_COLOR_ATTRIBUTE]: /\S+/
				}
			},
			model: {
				key: THEME_COLOR,
				value: viewElement => viewElement.getAttribute(THEME_COLOR_ATTRIBUTE)
			}
		});

		editor.conversion.for('downcast').attributeToElement({
			model: EXACT_COLOR,
			view: (modelAttributeValue, viewWriter) => {
				return viewWriter.createAttributeElement('span', {
					style: `color:${modelAttributeValue}`
				}, {priority: 7})
			}
		});

		editor.conversion.for('downcast').attributeToElement({
			model: THEME_COLOR,
			view: (modelAttributeValue, viewWriter) => {
				const themeColors = editor.config.get(FONT_COLOR).themeColors;
				const themeColor = themeColors.find(item => item.key === modelAttributeValue);
				const color = themeColor ? themeColor.color : null;
				return viewWriter.createAttributeElement('span', {
					[THEME_COLOR_ATTRIBUTE]: modelAttributeValue,
					style: `color:${color}`
				}, {priority: 7})
			}
		});

		editor.commands.add(FONT_COLOR, new FontColorCommand(editor));

		editor.model.schema.extend('$text', {allowAttributes: [EXACT_COLOR, THEME_COLOR]});

		editor.model.schema.setAttributeProperties(EXACT_COLOR, {
			isFormatting: true,
			copyOnEnter: true
		});

		editor.model.schema.setAttributeProperties(THEME_COLOR, {
			isFormatting: true,
			copyOnEnter: true
		});
	}
}
