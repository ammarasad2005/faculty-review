import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders read-only mode correctly', () => {
    render(<StarRating rating={3} maxRating={5} interactive={false} />);
    const container = screen.getByRole('img');
    expect(container).toHaveAttribute('aria-label', 'Rating: 3 out of 5 stars');
    const stars = container.querySelectorAll('[aria-hidden="true"]');
    expect(stars.length).toBe(5);
  });

  it('renders interactive mode correctly', () => {
    const handleRatingChange = vi.fn();
    render(<StarRating rating={3} maxRating={5} interactive={true} onRatingChange={handleRatingChange} />);

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Rate faculty');

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);

    // Check first button attributes
    expect(buttons[0]).toHaveAttribute('aria-label', 'Rate 1 stars');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');

    // Check fourth button attributes
    expect(buttons[3]).toHaveAttribute('aria-label', 'Rate 4 stars');
    expect(buttons[3]).toHaveAttribute('aria-pressed', 'false');

    // Click 4th star
    fireEvent.click(buttons[3]);
    expect(handleRatingChange).toHaveBeenCalledWith(4);
  });
});
