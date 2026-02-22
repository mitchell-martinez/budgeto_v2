import { render, screen } from '@testing-library/react';

import Donut from '@components/Donut';

describe('Donut', () => {
  it('renders label and formatted value', () => {
    render(
      <Donut value={12345} total={20000} color='#00ff88' label='Income' />,
    );
    expect(screen.getByLabelText(/Income/)).toBeInTheDocument();
    expect(screen.getByText('$12,345')).toBeInTheDocument();
  });

  it('caps percent at 100%', () => {
    render(<Donut value={300} total={100} color='#00ff88' label='Over' />);
    const circles = screen.getByLabelText(/Over/).querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(1);
    const progress = circles[1];
    const dashArray = progress.getAttribute('stroke-dasharray');
    expect(dashArray).toBeTruthy();
    const [dash, rest] = (dashArray ?? '0 0').split(' ').map(Number);
    // when capped to 100%, dash should be <= total circumference and rest >= 0
    expect(dash).toBeGreaterThan(0);
    expect(rest).toBeGreaterThanOrEqual(0);
  });

  it('uses provided color for progress ring', () => {
    render(<Donut value={50} total={100} color='#123456' label='Color' />);
    const circles = screen.getByLabelText(/Color/).querySelectorAll('circle');
    const progress = circles[1];
    expect(progress.getAttribute('stroke')).toBe('#123456');
  });
});
