import { newE2EPage } from '@stencil/core/testing';

describe('oma-ambulance-certs-user-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<oma-ambulance-certs-user-list></oma-ambulance-certs-user-list>');

    const element = await page.find('oma-ambulance-certs-user-list');
    expect(element).toHaveClass('hydrated');
  });
});
