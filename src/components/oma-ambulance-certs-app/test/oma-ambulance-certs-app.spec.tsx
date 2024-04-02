import { newSpecPage } from '@stencil/core/testing';
import { OmaAmbulanceCertsApp } from '../oma-ambulance-certs-app';

describe('oma-ambulance-certs-app', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OmaAmbulanceCertsApp],
      html: `<oma-ambulance-certs-app></oma-ambulance-certs-app>`,
    });
    expect(page.root).toEqualHtml(`
      <oma-ambulance-certs-app>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </oma-ambulance-certs-app>
    `);
  });
});
