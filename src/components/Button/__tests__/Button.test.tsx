import { render, screen } from '@testing-library/react';

import Button from '@components/Button';

describe('Button', () => {
  it('renders label', () => {
    render(<Button>Hello</Button>);
    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument();
  });
});
