/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import {FONT_COLOR} from './constants';
import fontColorIcon from '../theme/icons/font-color.svg';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {createDropdown} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import ColorTableView from './ui/colortableview';

export default class FontColorUI extends Plugin {
	constructor(editor) {
		super(editor);

		const t = editor.locale.t;

		this.componentName = FONT_COLOR;
		this.icon = fontColorIcon;
		this.dropdownLabel = t('Font Color');
		this.columns = editor.config.get(this.componentName).columns;
		this.colorTableView;
	}

	static get pluginName() {
		return 'FontColorUI';
	}

	init() {
		const editor = this.editor;
		const t = editor.t;
		const fontColorCommand = editor.commands.get(FONT_COLOR);
		const exactColors = editor.config.get(this.componentName).exactColors;
		const themeColors = editor.config.get(this.componentName).themeColors;

		// Register the UI component.
		editor.ui.componentFactory.add(this.componentName, locale => {
			const dropdownView = createDropdown(locale);
			const colorTableView = new ColorTableView(locale, {
				exactColors,
				themeColors,
				columns: this.columns,
				removeButtonLabel: t('Remove color'),
				themeColorsLabel: t('Theme colors'),
				customColorLabel: t('Custom color'),
				exactColorsLabel: t('Exact colors'),
			});

			dropdownView.colorTableView = colorTableView;
			dropdownView.panelView.children.add(colorTableView);
			colorTableView.delegate('execute').to(dropdownView, 'execute');

			this.colorTableView = colorTableView;

			this.colorTableView.bind('selectedColor').to(fontColorCommand, 'value');

			dropdownView.buttonView.set({
				label: this.dropdownLabel,
				icon: this.icon,
				tooltip: true
			});

			dropdownView.extendTemplate({
				attributes: {
					class: 'ck-color-ui-dropdown'
				}
			});

			dropdownView.bind('isEnabled').to(fontColorCommand);

			dropdownView.on('execute', (evt, data) => {
				const color = data.value;
				const themeColor = editor.config.get(FONT_COLOR).themeColors.find(item => item.color === color);
				editor.execute(FONT_COLOR, {paletteKey: themeColor ? themeColor.key : null, color});
				editor.editing.view.focus();
			});

			dropdownView.on('change:isOpen', (evt, name, isVisible) => {
				if (isVisible) {
					this.colorTableView.updateSelectedColors();
				}
			});

			return dropdownView;
		});
	}
}
