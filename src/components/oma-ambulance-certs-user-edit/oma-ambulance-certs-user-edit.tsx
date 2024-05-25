import { Component, Prop, State, Event, EventEmitter, Host, h } from '@stencil/core';
import { AmbulanceStaffCertificationsApiFactory, User, Certification } from '../../api/ambulance-certs';

@Component({
  tag: 'oma-ambulance-certs-user-edit',
  styleUrl: 'oma-ambulance-certs-user-edit.css',
  shadow: true,
})
export class OmaAmbulanceCertsUserEdit {

  @Prop() apiBase: string = "";
  @Prop() certifications: Certification[] = [];

  @Prop() user: User = {
    id: "",
    name: "",
    certifications: []
  };

  userEdit: User = {
    id: "",
    name: "",
    certifications: []
  };
  @State() newCertSelected: Certification = null;
  @State() elementCertSelect: string | null = null;

  @Event({eventName: "action-event"}) actionEvent: EventEmitter<string>;

  error: string = "";

  async componentWillLoad() {
    if (typeof this.user === "string") {
      this.userEdit = JSON.parse(this.user);
    } else {
      this.userEdit = JSON.parse(JSON.stringify(this.user));
    }
  }

  private async saveUser() {
    if (!this.userEdit) {
      return;
    }
    const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);

    const response = await api.updateUser(this.userEdit.id, this.userEdit);

    if (response.status !== 200) {
      this.error = `[ERR!] cannot update user: ${response.statusText}`;
      return;
    }

  }

  private getCertFromUserCertification(userCert: any) {
    return this.certifications.find(cert => cert.id === userCert.certification_id);
  }

  render() {
    return (
      <Host>
      {this.userEdit && this.userEdit.id !== "" && <div class="user-box">
        <div>
          <span class="title">Manage certifications for <span class="imp">{this.user.name}</span> </span>
          <br></br>
          <br></br>
          <div slot="content">
            <div class="card-actions">
              <md-filled-select
                label="Select certification"
                value={this.elementCertSelect}
                oninput={(e) => {
                  this.newCertSelected = this.certifications.find(
                    cert => cert.id === (e.target as HTMLSelectElement).value
                  );
                  this.elementCertSelect = (e.target as HTMLSelectElement).value;
                  }
                }
              >{this.certifications.map(cert =>
                  <md-select-option value={cert.id}>
                    <div slot="headline">{cert.name}</div>
                  </md-select-option>
                )}
              </md-filled-select>
              <md-filled-tonal-button
                onClick={() => {
                  if (!this.newCertSelected || this.userEdit.certifications.find(uc => uc.certification_id === this.newCertSelected.id)) {
                    return;
                  }
                  this.userEdit.certifications.push({
                    certification_id: this.newCertSelected.id,
                    issued_at: "",
                    expires_at: ""
                  });
                  this.elementCertSelect = null;
                  this.userEdit = JSON.parse(JSON.stringify(this.userEdit))
                }}
              >
                Add certification
                <md-icon slot="icon">add</md-icon>
              </md-filled-tonal-button>
            </div>
            <md-list>
              {this.userEdit.certifications?.filter(uc => this.certifications.find(c=>c.id ===uc.certification_id)).map(cert =>
                <md-list-item class="cert-item">
                  <div slot="headline"> <span class="subtitle">Name: </span> {this.getCertFromUserCertification(cert).name}</div>
                  <div slot="supporting-text">
                    <span class="subtitle">Description: </span>
                    {this.getCertFromUserCertification(cert).description}
                    <div class="cert-item-dates">
                      <md-filled-text-field label="Issued at"
                        class="1"
                        value={cert.issued_at}
                        oninput={(e) => cert.issued_at = (e.target as HTMLInputElement).value}
                      ></md-filled-text-field>

                      <md-filled-text-field label="Expires at"
                        class="2"
                        value={cert.expires_at}
                        oninput={(e) => {
                          cert.expires_at = (e.target as HTMLInputElement).value;
                        }}
                      ></md-filled-text-field>
                    </div>

                    <div class="cert-item-delete">
                      <md-filled-tonal-button
                        onClick={() => {
                          this.userEdit.certifications = this.userEdit.certifications.filter(
                            c => c.certification_id !== cert.certification_id
                          );
                          this.userEdit = JSON.parse(JSON.stringify(this.userEdit))
                        }}
                      >
                        Delete
                        <md-icon slot="icon">close</md-icon>
                      </md-filled-tonal-button>
                    </div>
                  </div>
                </md-list-item>
              )}
            </md-list>
            <md-filled-tonal-button
              onClick={()=> {
                this.saveUser()
                this.actionEvent.emit("close");
              }}
            >
              Save
              <md-icon slot="icon">save</md-icon>
            </md-filled-tonal-button>
          </div>
        </div>

      </div>}
      </Host>
    );
  }

}
