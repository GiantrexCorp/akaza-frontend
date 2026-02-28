import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Select from './Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('Select', () => {
  it('renders with label', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('links label to select via htmlFor/id', () => {
    render(<Select label="Region" options={options} />);
    const select = screen.getByLabelText(/region/i);
    expect(select.tagName).toBe('SELECT');
    expect(select).toHaveAttribute('id');
  });

  it('renders all options', () => {
    render(<Select label="Pick" options={options} />);
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('renders placeholder option', () => {
    render(<Select label="Pick" options={options} placeholder="Select one..." />);
    expect(screen.getAllByRole('option')).toHaveLength(4);
    expect(screen.getByText('Select one...')).toBeInTheDocument();
  });

  it('handles user selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Pick" options={options} onChange={onChange} />);
    await user.selectOptions(screen.getByLabelText(/pick/i), 'b');
    expect(onChange).toHaveBeenCalled();
  });

  it('displays error message', () => {
    render(<Select label="Pick" options={options} error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('uses external id when provided', () => {
    render(<Select label="Custom" options={options} id="my-select" />);
    expect(screen.getByLabelText(/custom/i)).toHaveAttribute('id', 'my-select');
  });

  it('sets aria-invalid when error is present', () => {
    render(<Select label="Country" options={options} error="Required" />);
    expect(screen.getByLabelText(/country/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByLabelText(/country/i)).not.toHaveAttribute('aria-invalid');
  });

  it('links select to error via aria-describedby', () => {
    render(<Select label="Country" options={options} error="Required field" />);
    const select = screen.getByLabelText(/country/i);
    const errorId = select.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    const errorEl = document.getElementById(errorId!);
    expect(errorEl).toHaveTextContent('Required field');
    expect(errorEl).toHaveAttribute('role', 'alert');
  });
});
