import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'oma-ambulance-certs-user-edit',
  styleUrl: 'oma-ambulance-certs-user-edit.css',
  shadow: true,
})
export class OmaAmbulanceCertsUserEdit {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
