import { Component, Prop, Host, State, Event, EventEmitter, h } from '@stencil/core';
import { AmbulanceStaffCertificationsApiFactory, Certification } from '../../api/ambulance-certs';

@Component({
  tag: 'oma-ambulance-certs-list',
  styleUrl: 'oma-ambulance-certs-list.css',
  shadow: true,
})
export class OmaAmbulanceCertsList {
  @Prop() apiBase: string = "";
  @Prop() certificationId: string = "";

  @Event({eventName: "error-event"}) errorEvent: EventEmitter<string>;
  @Event({eventName: "action-event"}) actionEvent: EventEmitter<string>;

  @Prop() certifications: Certification[] = [];

  @State() newCert: Certification = {
    authority: "",
    name: "",
    description: ""
  };

  private error: string = "";
  private dialog: any = null;

  async componentWillLoad() {

  }

  private async addCertification() {
    try {
      let cert = JSON.parse(JSON.stringify(this.newCert));

      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.addCertification(cert);

      if (response.status !== 201) {
        this.error = `[ERR!] cannot add certification: ${response.statusText}`;
        this.errorEvent.emit(this.error);
        return;
      }

      cert.id = response.data.id;
      this.dialog?.close();
      this.newCert = {
        authority: "",
        name: "",
        description: ""
      };
      this.actionEvent.emit("add");

     } catch (e) {
      this.error = `[ERR!] cannot add certification: ${e}`;
      this.errorEvent.emit(this.error);
    }
  }

  private async deleteCertification(cert: Certification) {
    try {
      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.deleteCertification(cert.id);

      if (response.status !== 204) {
        this.error = `[ERR!] cannot delete certification: ${response.statusText}`;
        this.errorEvent.emit(this.error);
        return;
      }

      this.certifications = this.certifications.filter(c => c.id !== cert.id);

    } catch (e) {
      this.error = `Error: ${e}`;
      this.errorEvent.emit(this.error);
    }
  }

  render() {
    return (
      <Host>
        <div class="mylist">
          <md-list>
            {this.certifications.map(cert =>
              <md-list-item>
                <div slot="headline">Name: ({cert.authority}) {cert.name}</div>
                <div slot="supporting-text">Description: {cert.description}</div>
                <md-icon slot="start">workspace_premium</md-icon>
                <md-filled-tonal-button slot="end" onClick={() => this.deleteCertification(cert)}>
                  Delete
                  <md-icon slot="icon">close</md-icon>
                </md-filled-tonal-button>
              </md-list-item>
            )}
          </md-list>
        </div>

        <div class="button-add">
          <md-filled-tonal-button slot="end" onClick={() => this.dialog?.show()}>
            Add new certification
            <md-icon slot="icon">add</md-icon>
          </md-filled-tonal-button>
        </div>

        <md-dialog ref={(el) => this.dialog = el as any}>
          <div slot="title">Add new certification</div>
          <div slot="content">
            <md-outlined-text-field label="Authority"
              value={this.newCert.authority}
              oninput={(e) => this.newCert.authority = (e.target as HTMLInputElement).value}
            />
            <br></br>
            <md-outlined-text-field label="Title"
              value={this.newCert.name}
              oninput={(e) => this.newCert.name = (e.target as HTMLInputElement).value}
            />
            <br></br>
            <md-outlined-text-field label="Description"
              value={this.newCert.description}
              oninput={(e) => this.newCert.description = (e.target as HTMLInputElement).value}
              rows="3"
              type="textarea"
            />
            <br></br>
          </div>
          <div slot="actions">
            <md-text-button onClick={() => this.dialog?.close()}>Cancel</md-text-button>
            <md-text-button onClick={() => this.addCertification()}>Add</md-text-button>
          </div>
        </md-dialog>
      </Host>
    );
  }

}
