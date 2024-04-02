import { newSpecPage } from '@stencil/core/testing';
import { OmaAmbulanceCertsUserList } from '../oma-ambulance-certs-user-list';

describe('oma-ambulance-certs-user-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OmaAmbulanceCertsUserList],
      html: `<oma-ambulance-certs-user-list></oma-ambulance-certs-user-list>`,
    });
    expect(page.root).toEqualHtml(`
      <oma-ambulance-certs-user-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </oma-ambulance-certs-user-list>
    `);
  });
});
