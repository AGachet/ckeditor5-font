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
		const attribute = doc.selection.hasAttribute(THEME_COLOR) ? THEME_COLOR : EXACT_COLOR;
		this.value = doc.selection.getAttribute(attribute);
		this.isEnabled = model.schema.checkAttributeInSelection(doc.selection, attribute);
	}

	/**
	 * Executes the command. Applies the `value` of the {@link #attributeKey} to the selection.
	 * If no `value` is passed, it removes the attribute from the selection.
	 *
	 * @protected
	 * @param {Object} [options] Options for the executed command.
	 * @param {String} [options.key] Theme color key.
	 * @param {String} [options.value] The value to apply.
	 * @param {String} [options.attribute] Attribute to change: THEME_COLOR or EXACT_COLOR.
	 * @fires execute
	 */
	execute(options = {}) {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const attribute = options.attribute;
		const removedAttribute = attribute === THEME_COLOR ? EXACT_COLOR : THEME_COLOR;
		const value = attribute === THEME_COLOR ? options.key : options.value;

		model.change(writer => {
			if (value && attribute){
				if (selection.isCollapsed) {
					writer.setSelectionAttribute(attribute, value);
					writer.removeSelectionAttribute(removedAttribute);
				} else {
					const ranges = model.schema.getValidRanges(selection.getRanges(), attribute);
					for (const range of ranges) {
						writer.setAttribute(attribute, value, range);
						writer.setAttribute(removedAttribute, value, range);
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
