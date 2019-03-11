/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import FontBackgroundColorCommand from '../../src/fontbackgroundcolor/fontbackgroundcolorcommand';
import FontCommand from '../../src/fontcommand';

import ModelTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/modeltesteditor';

describe( 'FontBackgroundColorCommand', () => {
	let editor, command;

	beforeEach( () => {
		return ModelTestEditor.create()
			.then( newEditor => {
				editor = newEditor;

				command = new FontBackgroundColorCommand( editor );
			} );
	} );

	afterEach( () => {
		editor.destroy();
	} );

	it( 'is a FontCommand', () => {
		expect( FontBackgroundColorCommand.prototype ).to.be.instanceOf( FontCommand );
		expect( command ).to.be.instanceOf( FontCommand );
	} );

	it( 'operates on fontBackgroundColor attribute', () => {
		expect( command ).to.have.property( 'attributeKey', 'fontBackgroundColor' );
	} );
} );
