import { newSpecPage } from '@stencil/core/testing';
import { OmaAmbulanceCertsUserEdit } from '../oma-ambulance-certs-user-edit';

describe('oma-ambulance-certs-user-edit', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OmaAmbulanceCertsUserEdit],
      html: `<oma-ambulance-certs-user-edit></oma-ambulance-certs-user-edit>`,
    });
    expect(page.root).toEqualHtml(`
      <oma-ambulance-certs-user-edit>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </oma-ambulance-certs-user-edit>
    `);
  });
});
