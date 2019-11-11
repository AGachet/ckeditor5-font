/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import {EXACT_COLOR, THEME_COLOR} from './constants';

export default class FontColorCommand extends Command {
	constructor(editor) {
		super(editor);
	}

	refresh() {
		const model = this.editor.model;
		const doc = model.document;
		const attribute = doc.selection.getAttribute(THEME_COLOR) ? THEME_COLOR : EXACT_COLOR;
		this.value = doc.selection.getAttribute(attribute);
		this.isEnabled = model.schema.checkAttributeInSelection(doc.selection, attribute);
	}
	execute(colorItem = {}) {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const attribute = colorItem.paletteKey ? THEME_COLOR : EXACT_COLOR;
		const removedAttribute = colorItem.paletteKey ? EXACT_COLOR : THEME_COLOR;
		const value = colorItem.paletteKey || colorItem.color;

		model.change(writer => {
			if (value && attribute){
				if (selection.isCollapsed) {
					writer.setSelectionAttribute(attribute, value);
					writer.removeSelectionAttribute(removedAttribute);
				} else {
					const ranges = model.schema.getValidRanges(selection.getRanges(), attribute);
					for (const range of ranges) {
						writer.setAttribute(attribute, value, range);
						writer.removeAttribute(removedAttribute, range);
					}
				}
			} else{
				if (selection.isCollapsed) {
					writer.removeSelectionAttribute(THEME_COLOR);
					writer.removeSelectionAttribute(EXACT_COLOR);
				} else {
					const ranges = selection.getRanges();
					const themeRanges = model.schema.getValidRanges(ranges, THEME_COLOR);
					const exactRanges = model.schema.getValidRanges(ranges, EXACT_COLOR);

					for (const range of themeRanges) {
						writer.removeAttribute(THEME_COLOR, range);
					}
					for (const range of exactRanges) {
						writer.removeAttribute(EXACT_COLOR, range);
					}
				}
			}
		});
	}
}
