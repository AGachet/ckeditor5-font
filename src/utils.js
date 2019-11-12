import DropdownButtonView from '@ckeditor/ckeditor5-ui/src/dropdown/button/dropdownbuttonview';
import DropdownPanelView from '@ckeditor/ckeditor5-ui/src/dropdown/dropdownpanelview';
import DropdownView from '@ckeditor/ckeditor5-ui/src/dropdown/dropdownview';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import SwitchButtonView from '@ckeditor/ckeditor5-ui/src/button/switchbuttonview';

//Remove whitespace from colors so that equality comparison works for them
export function removeWhitespaceFromColor(colorItem) {
	if (!colorItem || !colorItem.color) {
		return colorItem;
	}
	colorItem.color = colorItem.color.replace(/\s/g, '');
	return colorItem;
}

export function createDropdown(locale) {
	const buttonView = new DropdownButtonView(locale);

	const panelView = new DropdownPanelView(locale);
	const dropdownView = new DropdownView(locale, buttonView, panelView);

	buttonView.bind('isEnabled').to(dropdownView);
	buttonView.bind('isOn').to(dropdownView, 'isOpen');

	return dropdownView;
}

export function makeDropdownBlurHandler(dropdownView){
	let handler;
	return enabled => {
		if (enabled){
			handler = closeDropdownOnBlur(dropdownView);
		} else {
			dropdownView.off('render', handler);
		}
	}
}

export function closeDropdownOnBlur(dropdownView) {
	let handler = () => {
		clickOutsideHandler({
			emitter: dropdownView,
			activator: () => dropdownView.isOpen,
			callback: () => {
				dropdownView.isOpen = false;
			},
			contextElements: [dropdownView.element]
		});
	};
	dropdownView.on('render', handler);
	return handler;
}

export function closeDropdownOnExecute(dropdownView) {
	// Close the dropdown when one of the list items has been executed.
	let handler = evt => {
		// Toggling a switch button view should not close the dropdown.
		if (evt.source instanceof SwitchButtonView) {
			return;
		}
		dropdownView.isOpen = false;
	};
	dropdownView.on('execute', handler);
	return handler;
}

export function focusDropdownContentsOnArrows(dropdownView) {
	// If the dropdown panel is already open, the arrow down key should focus the first child of the #panelView.
	dropdownView.keystrokes.set('arrowdown', (data, cancel) => {
		if (dropdownView.isOpen) {
			dropdownView.panelView.focus();
			cancel();
		}
	});

	// If the dropdown panel is already open, the arrow up key should focus the last child of the #panelView.
	dropdownView.keystrokes.set('arrowup', (data, cancel) => {
		if (dropdownView.isOpen) {
			dropdownView.panelView.focusLast();
			cancel();
		}
	});
}
