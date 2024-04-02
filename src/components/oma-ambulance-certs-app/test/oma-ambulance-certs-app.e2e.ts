import { newE2EPage } from '@stencil/core/testing';

describe('oma-ambulance-certs-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<oma-ambulance-certs-app></oma-ambulance-certs-app>');

    const element = await page.find('oma-ambulance-certs-app');
    expect(element).toHaveClass('hydrated');
  });
});
