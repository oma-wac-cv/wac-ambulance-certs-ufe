import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'oma-ambulance-certs-certs-edit',
  styleUrl: 'oma-ambulance-certs-certs-edit.css',
  shadow: true,
})
export class OmaAmbulanceCertsCertsEdit {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
