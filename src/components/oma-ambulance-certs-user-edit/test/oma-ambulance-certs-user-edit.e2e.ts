import { newE2EPage } from '@stencil/core/testing';

describe('oma-ambulance-certs-user-edit', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<oma-ambulance-certs-user-edit></oma-ambulance-certs-user-edit>');

    const element = await page.find('oma-ambulance-certs-user-edit');
    expect(element).toHaveClass('hydrated');
  });
});
