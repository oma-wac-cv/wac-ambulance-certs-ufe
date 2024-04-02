import { newE2EPage } from '@stencil/core/testing';

describe('oma-ambulance-certs-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<oma-ambulance-certs-list></oma-ambulance-certs-list>');

    const element = await page.find('oma-ambulance-certs-list');
    expect(element).toHaveClass('hydrated');
  });
});
