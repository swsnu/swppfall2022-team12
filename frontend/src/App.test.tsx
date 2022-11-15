import { screen } from '@testing-library/react';
import React from 'react';

import App from './App';
import { renderWithProviders } from './test-utils/mocks';

test('renders App without errors', () => {
  renderWithProviders(<App />);
  screen.getByText("Main Page");
});
