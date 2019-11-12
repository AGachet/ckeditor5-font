import View from '@ckeditor/ckeditor5-ui/src/view';
import {jscolor} from './jscolor';

function preventDropdownClosing(view, closeDropdownOnBlur) {
	return view.bindTemplate.to(evt => {
		closeDropdownOnBlur(false);
		evt.stopPropagation();
	});
}

export default class ColorInputView extends View {
	constructor(locale, closeDropdownOnBlur) {
		super(locale);

		const bind = this.bindTemplate;
		const input = document.createElement('input');
		this.colorPicker = new jscolor(input, {hash:true, borderRadius: 2, padding: 5});
		this.colorPicker.fromString('#000000');

		this.set('value');

		this.setTemplate({
			tag: 'div',
			children:[
				input
			],
			attributes: {
				class: ['ck', 'ck-color-input']
			},
			on: {
				mousedown: preventDropdownClosing(this, closeDropdownOnBlur),
				change: bind.to('change')
			}
		});
	}

	setValue(newValue) {
		this.colorPicker.fromString(!newValue ? '#000000' : newValue);
	}

	getValue() {
		return this.colorPicker.toHEXString();
	}

	render() {
		super.render();
		this.setValue(this.value);
		this.on('change:value', (evt, name, value) => {
			this.setValue(value);
		});
	}
}
