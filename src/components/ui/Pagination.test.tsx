import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders nothing for single page', () => {
    render(<Pagination currentPage={1} lastPage={1} onPageChange={vi.fn()} />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders page buttons', () => {
    render(<Pagination currentPage={1} lastPage={5} onPageChange={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(<Pagination currentPage={3} lastPage={5} onPageChange={vi.fn()} />);
    expect(screen.getByText('3')).toHaveClass('bg-primary');
  });

  it('calls onPageChange when page is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} lastPage={5} onPageChange={onPageChange} />);
    await user.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables prev button on first page', () => {
    render(<Pagination currentPage={1} lastPage={5} onPageChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} lastPage={5} onPageChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[buttons.length - 1]).toBeDisabled();
  });

  it('shows ellipsis for many pages', () => {
    render(<Pagination currentPage={5} lastPage={20} onPageChange={vi.fn()} />);
    expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1);
  });

  it('navigates forward with next button', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} lastPage={5} onPageChange={onPageChange} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[buttons.length - 1]);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
