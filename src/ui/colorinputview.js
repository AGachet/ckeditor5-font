import View from '@ckeditor/ckeditor5-ui/src/view';

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

		this.set('isEnabled');
		this.set('value');

		this.setTemplate({
			tag: 'input',
			attributes: {
				class: [
					'ck',
					'ck-color-input',
					bind.if('isEnabled', 'ck-enabled'),
				],
				type: 'color'
			},
			on: {
				mousedown: preventDropdownClosing(this, closeDropdownOnBlur),
				input: bind.to('input')
			}
		});
	}

	setValue(newValue) {
		this.element.value = !newValue ? '#000000' : newValue;
	}

	getValue() {
		return this.element.value;
	}

	render() {
		super.render();
		this.setValue(this.value);
		this.on('change:value', (evt, name, value) => {
			this.setValue(value);
		});
	}
}
