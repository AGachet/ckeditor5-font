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


	execute({paletteKey, color}) {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const changedAttr = paletteKey ? THEME_COLOR : EXACT_COLOR;
		const removedAttr = paletteKey ? EXACT_COLOR : THEME_COLOR;
		const attrValue = paletteKey || color;

		model.change(writer => {
			if (attrValue){
				if (selection.isCollapsed) {
					writer.setSelectionAttribute(changedAttr, attrValue);
					writer.removeSelectionAttribute(removedAttr);
				} else {
					const ranges = model.schema.getValidRanges(selection.getRanges(), changedAttr);

					for (const range of ranges) {
						writer.setAttribute(changedAttr, attrValue, range);
						writer.removeAttribute(removedAttr, range);
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
