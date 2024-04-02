import { newE2EPage } from '@stencil/core/testing';

describe('oma-ambulance-certs-certs-edit', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<oma-ambulance-certs-certs-edit></oma-ambulance-certs-certs-edit>');

    const element = await page.find('oma-ambulance-certs-certs-edit');
    expect(element).toHaveClass('hydrated');
  });
});
