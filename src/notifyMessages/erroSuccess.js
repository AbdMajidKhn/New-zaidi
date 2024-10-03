import React from 'react';

import Icon from '../components/icon/Icon';

const _titleSuccess = (
	<span className='d-flex align-items-center'>
		<Icon icon='Info' size='lg' className='me-1' />
		<span>Success</span>
	</span>
);
const _titleError = (
	<span className='d-flex align-items-center'>
		<Icon icon='Warning' size='lg' className='me-1' />
		<span>Error </span>
	</span>
);
const _titleWarning = (
	<span className='d-flex align-items-center'>
		<Icon icon='info' size='lg' className='me-1' />
		<span>Warning </span>
	</span>
);

export { _titleError, _titleSuccess, _titleWarning };
