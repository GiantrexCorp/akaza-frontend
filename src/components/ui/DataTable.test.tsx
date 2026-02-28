import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import DataTable from './DataTable';
import type { Column } from './DataTable';

interface TestItem {
  id: number;
  name: string;
  value: number;
}

const columns: Column<TestItem>[] = [
  { key: 'name', header: 'Name', render: (item) => <span>{item.name}</span> },
  { key: 'value', header: 'Value', render: (item) => <span>{item.value}</span> },
];

const data: TestItem[] = [
  { id: 1, name: 'Alpha', value: 100 },
  { id: 2, name: 'Beta', value: 200 },
  { id: 3, name: 'Gamma', value: 300 },
];

describe('DataTable', () => {
  it('renders column headers with scope="col"', () => {
    render(<DataTable columns={columns} data={data} keyExtractor={(i) => i.id} />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Value');
    headers.forEach((th) => expect(th).toHaveAttribute('scope', 'col'));
  });

  it('renders all rows', () => {
    render(<DataTable columns={columns} data={data} keyExtractor={(i) => i.id} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders cell values', () => {
    render(<DataTable columns={columns} data={data} keyExtractor={(i) => i.id} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('shows empty message when data is empty', () => {
    render(<DataTable columns={columns} data={[]} keyExtractor={(i) => i.id} />);
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<DataTable columns={columns} data={[]} keyExtractor={(i) => i.id} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} data={data} keyExtractor={(i) => i.id} onRowClick={onRowClick} />);
    await user.click(screen.getByText('Alpha'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('adds cursor-pointer class when onRowClick is provided', () => {
    render(<DataTable columns={columns} data={data} keyExtractor={(i) => i.id} onRowClick={vi.fn()} />);
    const rows = screen.getAllByRole('row').slice(1); // skip header row
    rows.forEach((row) => expect(row).toHaveClass('cursor-pointer'));
  });

  it('does not add cursor-pointer when no onRowClick', () => {
    render(<DataTable columns={columns} data={data} keyExtractor={(i) => i.id} />);
    const rows = screen.getAllByRole('row').slice(1);
    rows.forEach((row) => expect(row).not.toHaveClass('cursor-pointer'));
  });
});
