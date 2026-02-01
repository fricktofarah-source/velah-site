// components/__tests__/Counter.test.tsx
import { render, screen } from '@testing-library/react';
import Counter from '../Counter';

describe('Counter', () => {
  it('renders with initial value', () => {
    render(<Counter to={100} prefix="$" suffix="M" />);
    expect(screen.getByText('$0M')).toBeInTheDocument();
  });
});
