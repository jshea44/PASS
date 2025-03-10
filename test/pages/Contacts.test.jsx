import React from 'react';
import { Contacts } from '@pages';
import { expect, it, describe, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { useContactsList } from '@hooks';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useContactsList: vi.fn()
  };
});

describe('Contacts Page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays Loading message while loading', () => {
    useContactsList.mockReturnValue({ isLoading: true });
    const { getByRole } = render(<Contacts />);
    const heading = getByRole('heading');
    expect(heading.textContent).toBe('Loading Contacts...');
  });

  it('displays Errors when fetch errors', () => {
    const errorMessage = 'error';
    useContactsList.mockReturnValue({ isError: true, error: { message: errorMessage } });
    const { getByText } = render(<Contacts />);
    const text = getByText(`Error loading contacts list: ${errorMessage}`);
    expect(text).not.toBeNull();
  });

  it('displays Contacts List Table when there are contacts', () => {
    const firstContact = {
      person: 'Peter Parker',
      familyName: 'Parker',
      givenName: 'Peter',
      webId: 'http://peter.com'
    };
    const secondContact = {
      person: 'Batman',
      familyName: 'Batman',
      givenName: 'Batman',
      webId: 'http://batman.com'
    };
    useContactsList.mockReturnValue({ data: [firstContact, secondContact] });
    const { getByRole } = render(
      <BrowserRouter>
        <Contacts />
      </BrowserRouter>
    );
    const contacts = getByRole('grid');
    expect(contacts).not.toBeNull();
  });
  it('displays empty list message when there are no contacts', () => {
    useContactsList.mockReturnValue({ data: [] });
    const { getByLabelText } = render(<Contacts />);
    const contacts = getByLabelText('No Items Found Box');
    expect(contacts).not.toBeNull();
  });
});
