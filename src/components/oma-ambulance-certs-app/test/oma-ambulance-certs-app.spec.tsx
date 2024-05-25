import { newSpecPage } from '@stencil/core/testing';
import { OmaAmbulanceCertsApp } from '../oma-ambulance-certs-app';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe('oma-ambulance-certs-app', () => {
  let mock: MockAdapter;

  beforeAll(() => { mock = new MockAdapter(axios); });
  afterEach(() => { mock.reset(); });

  it('renders on error', async () => {
    mock.onGet().networkError();
    const page = await newSpecPage({
      url: "http://localhost/ambulance-certs/",
      components: [OmaAmbulanceCertsApp],
      html: `<oma-ambulance-certs-app base-path="/"></oma-ambulance-certs-app>`,
    });
    page.win.navigation = new EventTarget()

    const wlList = page.rootInstance as OmaAmbulanceCertsApp;
    const expectedUsers = wlList?.userList?.length;
    const expectedCertifications = wlList?.certificationList?.length;

    const errorMessage = page.root.shadowRoot.querySelectorAll(".error");
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    expect(errorMessage.length).toBeGreaterThanOrEqual(1)
    expect(expectedUsers).toEqual(0);
    expect(expectedCertifications).toEqual(0);
    expect(items.length).toEqual(expectedUsers + expectedCertifications);
  });

  it('renders on success', async () => {
    const page = await newSpecPage({
      url: "http://localhost/ambulance-certs/",
      components: [OmaAmbulanceCertsApp],
      html: `<oma-ambulance-certs-app base-path="/"></oma-ambulance-certs-app>`,
    });
    page.win.navigation = new EventTarget()

    const wlList = page.rootInstance as OmaAmbulanceCertsApp;
    const expectedUsers = wlList?.userList?.length;
    const expectedCertifications = wlList?.certificationList?.length;

    const errorMessage = page.root.shadowRoot.querySelectorAll(".error");
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    expect(errorMessage.length).toBeGreaterThanOrEqual(0)
    expect(expectedUsers).toEqual(0);
    expect(expectedCertifications).toEqual(0);
    expect(items.length).toEqual(expectedUsers + expectedCertifications);
  });

});
