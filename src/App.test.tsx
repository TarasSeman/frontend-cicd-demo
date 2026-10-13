import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the deployment dashboard', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /ship confidently/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ci quality gates/i })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
  });
});
