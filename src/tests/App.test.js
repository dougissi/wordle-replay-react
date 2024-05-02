import { render, screen } from '@testing-library/react';
import App from '../App';

// TODO: UPDATE
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/enter/i);
  expect(linkElement).toBeInTheDocument();
});
