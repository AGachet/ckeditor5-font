import View from '@ckeditor/ckeditor5-ui/src/view';
import {jscolor} from './jscolor';

const JsColorOptions = {
	hash: true,
	borderRadius: 2,
	padding: 5,
	uppercase: false
};

export default class ColorInputView extends View {
	constructor(locale) {
		super(locale);

		const bind = this.bindTemplate;
		this.set('value');
		this.set('parent');

		this.setTemplate({
			tag: 'input',
			attributes: {
				class: ['ck', 'ck-color-input'],
			},
			on: {
				blur: bind.to('blur')
			}
		});
	}

	setInputValue(newValue) {
		const value = !newValue ? '#000000' : newValue;
		if (this.colorPicker) {
			this.colorPicker.fromString(value);
		} else if (this.element){
			this.element.value = value;
		}
	}

	getInputValue() {
		if (this.colorPicker) {
			return this.colorPicker.toHEXString();
		} else if (this.element){
			return this.element.value;
		}
	}

	render() {
		super.render();

		this.on('change:value', (evt, name, value) => {
			this.setInputValue(value);
		});

		this.on('change:parent', (evt, name, value) => {
			this.colorPicker = new jscolor(this.element, {
				...JsColorOptions,
				container: value
			});
			this.setInputValue(this.value);
		});
	}
}
