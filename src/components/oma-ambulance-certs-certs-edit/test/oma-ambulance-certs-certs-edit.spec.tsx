import { newSpecPage } from '@stencil/core/testing';
import { OmaAmbulanceCertsCertsEdit } from '../oma-ambulance-certs-certs-edit';

describe('oma-ambulance-certs-certs-edit', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OmaAmbulanceCertsCertsEdit],
      html: `<oma-ambulance-certs-certs-edit></oma-ambulance-certs-certs-edit>`,
    });
    expect(page.root).toEqualHtml(`
      <oma-ambulance-certs-certs-edit>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </oma-ambulance-certs-certs-edit>
    `);
  });
});
