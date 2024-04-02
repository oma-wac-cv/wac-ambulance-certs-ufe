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

  @State() certifications: Certification[] = [];
  @State() newCert: Certification = {
    authority: "",
    name: "",
    description: ""
  };

  private error: string = "";
  private dialog: any = null;

  private async getCertifications(): Promise<Certification[]> {
    try {
      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.getCertifications();
      if (response.status !== 200) {
        this.error = `Error: ${response.statusText}`;
        this.errorEvent.emit(this.error);
        return [];
      }

      return response.data;
    } catch (e) {
      this.error = `Error: ${e}`;
      this.errorEvent.emit(this.error);
      return [];
    }
  }

  async componentWillLoad() {
    this.certifications = await this.getCertifications()
  }

  private async addCertification() {
    try {
      let cert = JSON.parse(JSON.stringify(this.newCert));

      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.addCertification(cert);

      if (response.status !== 200) {
        this.error = `Error: ${response.statusText}`;
        this.errorEvent.emit(this.error);
        return;
      }

      cert.id = response.data.id;
      this.certifications = [...this.certifications, cert];
      this.dialog?.close();
      this.newCert = {
        authority: "",
        name: "",
        description: ""
      };

    } catch (e) {
      this.error = `Error: ${e}`;
      this.errorEvent.emit(this.error);
    }
  }

  private async deleteCertification(cert: Certification) {
    try {
      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.deleteCertification(cert.id);

      if (response.status !== 204) {
        this.error = `Error: ${response.statusText}`;
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
        <md-list>
          {this.certifications.map(cert =>
            <md-list-item>
              <div slot="headline">{cert.authority}: {cert.name}</div>
              <div slot="supporting-text">Popis: {cert.description}</div>
              <md-icon slot="start">workspace_premium</md-icon>
              <md-filled-tonal-icon-button slot="end" onClick={() => this.deleteCertification(cert)}>
                <md-icon>close</md-icon>
              </md-filled-tonal-icon-button>
            </md-list-item>
          )}
        </md-list>
        <md-fab size="small" aria-label="Edit" onClick={() => this.dialog?.show()}>
          <md-icon slot="icon">add</md-icon>
        </md-fab>

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
