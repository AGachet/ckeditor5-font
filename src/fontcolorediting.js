/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FontColorCommand from './fontcolorcommand';
import {EXACT_COLOR, THEME_COLOR, FONT_COLOR} from './constants';

export default class FontColorEditing extends Plugin {
	static get pluginName() {
		return 'FontColorEditing';
	}

	constructor(editor) {
		super(editor);

		editor.config.define(FONT_COLOR, {
			themeColors: [
				{
					key: 'defaultColor1', color: 'hsl(0, 0%, 0%)',
				},
				{
					key: 'defaultColor2', color: 'hsl(0, 0%, 15%)',
				},
				{
					key: 'defaultColor3', color: 'hsl(0, 0%, 30%)',
				},
				{
					key: 'defaultColor4', color: 'hsl(0, 0%, 50%)',
				},
				{
					key: 'defaultColor5', color: 'hsl(0, 0%, 75%)',
				},
				{
					key: 'defaultColor6', color: 'hsl(0, 0%, 100%)',
				}
			],
			exactColors: [
				{
					color: 'hsl(0, 0%, 0%)'
				},
				{
					color: 'hsl(0, 0%, 30%)'
				},
				{
					color: 'hsl(0, 0%, 60%)'
				},
				{
					color: 'hsl(0, 0%, 90%)'
				},
				{
					color: 'hsl(0, 0%, 100%)'
				},
				{
					color: 'hsl(0, 75%, 60%)'
				},
				{
					color: 'hsl(30, 75%, 60%)'
				},
				{
					color: 'hsl(60, 75%, 60%)'
				},
				{
					color: 'hsl(90, 75%, 60%)'
				},
				{
					color: 'hsl(120, 75%, 60%)'
				},
				{
					color: 'hsl(150, 75%, 60%)'
				},
				{
					color: 'hsl(180, 75%, 60%)'
				},
				{
					color: 'hsl(210, 75%, 60%)'
				},
				{
					color: 'hsl(240, 75%, 60%)'
				},
				{
					color: 'hsl(270, 75%, 60%)'
				}
			],
			columns: 6
		});

		editor.conversion.for('upcast').elementToAttribute({
			view: {
				name: 'span',
				styles: {
					'color': /[\s\S]+/
				}
			},
			model: {
				key: EXACT_COLOR,
				value: viewElement => viewElement.hasAttribute('theme-palette') ? null : viewElement.getStyle('color').replace(/\s/g, '')
			}
		});

		editor.conversion.for('upcast').elementToAttribute({
			view: {
				name: 'span',
				attributes: {
					'theme-palette': /defaultColor[1-6]/
				}
			},
			model: {
				key: THEME_COLOR,
				value: viewElement => viewElement.getAttribute('theme-palette')
			}
		});

		editor.conversion.for('downcast').attributeToElement({
			model: EXACT_COLOR,
			view: (modelAttributeValue, viewWriter) => viewWriter.createAttributeElement('span', {
				'style': `color:${modelAttributeValue}`
			}, {priority: 7})
		});

		editor.conversion.for('downcast').attributeToElement({
			model: THEME_COLOR,
			view: (modelAttributeValue, viewWriter) => {
				const themeColor = editor.config.get(FONT_COLOR).themeColors.find(item => item.key === modelAttributeValue);
				viewWriter.createAttributeElement('span', {
					'style': `color:${themeColor ? themeColor.color : null}`,
					'theme-palette': modelAttributeValue
				}, {priority: 8})
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
