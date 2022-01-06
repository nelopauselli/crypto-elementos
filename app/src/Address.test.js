import React from 'react';
import ReactDOM from 'react-dom';
import Address from './Address';

it('create component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Address value="0x012345679801234567980123456789" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('text', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Address value="0x012345679801234567980123456789" />, div);

  const expected = '0x0123...56789';
  
  expect(div.textContent).toBe(expected);
  ReactDOM.unmountComponentAtNode(div);
});