/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import View from '@ckeditor/ckeditor5-ui/src/view';
import ColorGridView from '@ckeditor/ckeditor5-ui/src/colorgrid/colorgridview';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import removeButtonIcon from '@ckeditor/ckeditor5-core/theme/icons/eraser.svg';
import '../../theme/fontcolor.css';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class ColorTableView extends View {
	constructor(locale, {
		exactColors,
		themeColors,
		columns,
		removeButtonLabel,
		themeColorsLabel,
		exactColorsLabel,
		customColorLabel
	}) {
		super(locale);

		this.items = this.createCollection();

		this.themeColors = themeColors;
		this.exactColors = exactColors.filter(item => !themeColors.find(tc => tc.color === item.color));
		this.removeButtonLabel = removeButtonLabel;

		this.focusTracker = new FocusTracker();

		this.keystrokes = new KeystrokeHandler();

		this.set('selectedColor');

		this.columns = columns;

		this.themeColorsGrid = this._createColorsGrid(this.themeColors);

		this._focusCycler = new FocusCycler({
			focusables: this.items,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate list items backwards using the Arrow Up key.
				focusPrevious: 'arrowup',
				// Navigate list items forwards using the Arrow Down key.
				focusNext: 'arrowdown',
			}
		});

		this.setTemplate({
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-color-table'
				]
			},
			children: this.items
		});

		this.items.add(this._removeColorButton());

		const themeColorsLabelView = new LabelView(this.locale);
		themeColorsLabelView.text = themeColorsLabel;
		themeColorsLabelView.extendTemplate({
			attributes: {
				class: [
					'ck',
					'ck-color-grid__label'
				]
			}
		});

		this.items.add(themeColorsLabelView);

		this.items.add(this.themeColorsGrid);

		if (exactColors.length > 0) {
			const exactColorsLabelView = new LabelView(this.locale);
			exactColorsLabelView.text = exactColorsLabel;
			exactColorsLabelView.extendTemplate({
				attributes: {
					class: [
						'ck',
						'ck-color-grid__label'
					]
				}
			});

			this.items.add(exactColorsLabelView);

			this.exactColorsGrid = this._createColorsGrid(this.exactColors);
			this.items.add(this.exactColorsGrid);
		}
	}

	updateSelectedColors() {
		this.themeColorsGrid.selectedColor = this.selectedColor;
		if (this.exactColorsGrid) {
			this.exactColorsGrid.selectedColor = this.selectedColor;
		}
	}

	render() {
		super.render();

		// Items added before rendering should be known to the #focusTracker.
		for (const item of this.items) {
			this.focusTracker.add(item.element);
		}
		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo(this.element);
	}

	focus() {
		this._focusCycler.focusFirst();
	}

	focusLast() {
		this._focusCycler.focusLast();
	}

	_removeColorButton() {
		const buttonView = new ButtonView();

		buttonView.set({
			withText: true,
			icon: removeButtonIcon,
			tooltip: true,
			label: this.removeButtonLabel
		});

		buttonView.class = 'ck-color-table__remove-color';
		buttonView.on('execute', () => {
			this.fire('execute', {value: null});
		});

		return buttonView;
	}

	_createColorsGrid(colors) {
		const colorGrid = new ColorGridView(this.locale, {
			colorDefinitions: colors.map(item => {
				item.label = item.key ? '' : item.color;
				item.options = {hasBorder: true};
				return item;
			}),
			columns: this.columns,
		});
		colorGrid.delegate('execute').to(this);

		return colorGrid;
	}
}
