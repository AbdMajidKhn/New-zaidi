import * as React from 'react';

function SvgEmojiDizzy(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z' />
			<path d='M9.146 5.146a.5.5 0 01.708 0l.646.647.646-.647a.5.5 0 01.708.708l-.647.646.647.646a.5.5 0 01-.708.708l-.646-.647-.646.647a.5.5 0 11-.708-.708l.647-.646-.647-.646a.5.5 0 010-.708zm-5 0a.5.5 0 01.708 0l.646.647.646-.647a.5.5 0 11.708.708l-.647.646.647.646a.5.5 0 11-.708.708L5.5 7.207l-.646.647a.5.5 0 11-.708-.708l.647-.646-.647-.646a.5.5 0 010-.708zM10 11a2 2 0 11-4 0 2 2 0 014 0z' />
		</svg>
	);
}

export default SvgEmojiDizzy;
