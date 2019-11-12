import View from '@ckeditor/ckeditor5-ui/src/view';

export default class ColorInputView extends View {
	constructor(locale) {
		super(locale);

		const bind = this.bindTemplate;

		this.set('isEnabled');
		this.set('value');

		this.setTemplate({
			tag: 'input',
			attributes: {
				class: [
					bind.if('isEnabled', 'ck-enabled'),
				],
				type: 'color'
			},
			on: {
				input: bind.to('input')
			}
		});
	}

	setValue(newValue) {
		this.element.value = !newValue ? '#000000' : newValue;
	}

	getValue(){
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
