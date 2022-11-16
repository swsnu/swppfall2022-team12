import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store';

test('renders App without errors', () => {
  render(<Provider store={store}><App /></Provider>);
  screen.getByText("Main Page");
});
