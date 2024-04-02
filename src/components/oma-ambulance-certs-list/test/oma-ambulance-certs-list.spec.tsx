import { newSpecPage } from '@stencil/core/testing';
import { OmaAmbulanceCertsList } from '../oma-ambulance-certs-list';

describe('oma-ambulance-certs-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OmaAmbulanceCertsList],
      html: `<oma-ambulance-certs-list></oma-ambulance-certs-list>`,
    });
    expect(page.root).toEqualHtml(`
      <oma-ambulance-certs-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </oma-ambulance-certs-list>
    `);
  });
});
