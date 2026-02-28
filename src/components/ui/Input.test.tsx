import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('links label to input via htmlFor/id', () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText(/username/i);
    expect(input.tagName).toBe('INPUT');
    const id = input.getAttribute('id');
    expect(id).toBeTruthy();
    const label = document.querySelector(`label[for="${id}"]`);
    expect(label).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    const input = screen.getByLabelText(/name/i);
    await user.type(input, 'John');
    expect(input).toHaveValue('John');
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies error border styling', () => {
    render(<Input label="Email" error="Required" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass('border-red-500');
  });

  it('renders password toggle', async () => {
    const user = userEvent.setup();
    render(<Input label="Password" type="password" />);
    const input = document.querySelector('input')!;
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    await user.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('uses external id when provided', () => {
    render(<Input label="Custom" id="my-input" />);
    const input = screen.getByLabelText(/custom/i);
    expect(input).toHaveAttribute('id', 'my-input');
  });
});
