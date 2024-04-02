import { Component, Prop, State, Event, Host, h } from '@stencil/core';
import { AmbulanceStaffCertificationsApiFactory, User, UserCertification, Certification } from '../../api/ambulance-certs';

@Component({
  tag: 'oma-ambulance-certs-user-list',
  styleUrl: 'oma-ambulance-certs-user-list.css',
  shadow: true,
})
export class OmaAmbulanceCertsUserList {
  @Prop() apiBase: string = "";
  @Prop() userId: string = "";

  @State() userEdit: User = {
    id: "",
    name: "",
    certifications: []
  };
  @State() certEdit: Certification = null;

  @State() users: User[] = [];
  @State() userCertifications: UserCertification[] = [];
  @State() certifications: Certification[] = [];

  @State() newCertSelected: Certification = null;

  @State() expanded: string = "";
  @State() elementCertSelect: string | null = null;

  dialog!: any;
  error: string = "";

  private getCertFromUserCertification(userCert: any) {
    return this.certifications.find(cert => cert.id === userCert.certification_id);
  }

  private openDialog(user: User, cert: UserCertification, event: Event) {
    this.userEdit = user;
    this.certEdit = this.certifications.find(c => c.id === cert.certification_id);
    this.dialog.show();
  }

  private isCertSelected(cert: Certification) {
    if (!this.userEdit || !this.userEdit.certifications) {
      return false;
    }
    const is_selected = this.userEdit.certifications.find(
    userCert => (userCert as any).certification_id === cert.id) !== undefined;
    return is_selected;
  }

  async componentWillLoad() {
    this.users = await this.getUsers();
    this.certifications = await this.getCertifications();
  }

  private async getUsers(): Promise<User[]> {
    try {
      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.getUsers();
      if (response.status !== 200) {
        this.error = `Error: ${response.statusText}`;
        return [];
      }

      return response.data;
    } catch (e) {
      this.error = `Error: ${e}`;
      return [];
    }
  }

  private async getCertifications(): Promise<Certification[]> {
    try {
      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.getCertifications();
      if (response.status !== 200) {
        this.error = `Error: ${response.statusText}`;
        return [];
      }

      return response.data;
    } catch (e) {
      this.error = `Error: ${e}`;
      return [];
    }
  }

  private async saveCert() {
    if (!this.userEdit) {
      return;
    }
    const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);

    let editedUser: User = JSON.parse(JSON.stringify(this.userEdit));
    editedUser.certifications = JSON.parse(JSON.stringify(this.userCertifications));

    const response = await api.updateUser(editedUser.id, editedUser);
    if (response.status !== 200) {
      this.error = `Error: ${response.statusText}`;
      return;
    }
    this.users = await this.getUsers();
    this.dialog.close();
  }

  private onCertSelect(cert: string, event: Event) {
    this.expanded = this.expanded === cert ? "" : cert;
  }

  render() {
    if (this.error) {
      return (
        <Host>
          <div class="error">{this.error}</div>;
        </Host>
      );
    }
    return (
      <Host>
        {this.error && <div class="error">{this.error}</div>}
        <md-list>
          {this.users.map(user =>
            <md-list-item>
              <div slot="headline">{user.name}</div>
              <div slot="supporting-text">
                <md-chip-set>
                  {user.certifications.map(cert =>
                    <md-assist-chip
                      always-focusable
                      disabled
                      onClick={(evt) => this.openDialog(user, cert, evt)}
                      label={this.getCertFromUserCertification(cert).name || "Unknown"}>
                    </md-assist-chip>
                  )}
                </md-chip-set>
              </div>
              <md-icon slot="start">person</md-icon>
              <md-filled-tonal-icon-button slot="end"
                onClick={() => {
                  this.dialog?.show();
                  this.userEdit = user;
                  this.userCertifications = user.certifications;
                }}>
                <md-icon>edit</md-icon>
              </md-filled-tonal-icon-button>
            </md-list-item>
          )}
        </md-list>

        <md-dialog ref={(el) => this.dialog = el as any } >
          <div slot="headline">
            Editing user <b>{this.userEdit?.name}</b>
          </div>
          <div slot="content">
            <md-outlined-select
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
            </md-outlined-select>

            <md-filled-tonal-icon-button
              onClick={() => {
                if (!this.newCertSelected || this.userCertifications.find(uc => uc.certification_id === this.newCertSelected.id)) {
                  return;
                }
                this.userCertifications.push({
                  certification_id: this.newCertSelected.id,
                  issued_at: "",
                  expires_at: ""
                });
                this.elementCertSelect = null;
              }}
            >
              <md-icon>add</md-icon>
            </md-filled-tonal-icon-button>

            <md-list>
              {this.userCertifications.map(cert =>
                <md-list-item>
                  <div slot="headline">{this.getCertFromUserCertification(cert).name}</div>
                  <div slot="supporting-text">
                    {this.getCertFromUserCertification(cert).description}

                    <br></br>
                    <br></br>
                    <md-outlined-text-field label="Issued at"
                      value={cert.issued_at}
                      oninput={(e) => cert.issued_at = (e.target as HTMLInputElement).value}
                    ></md-outlined-text-field>
                    <br></br>
                    <md-outlined-text-field label="Expires at"
                      value={cert.expires_at}
                      oninput={(e) => cert.expires_at = (e.target as HTMLInputElement).value}
                    ></md-outlined-text-field>
                    <br></br>

                    <md-filled-tonal-icon-button
                      onClick={(evt) => {
                        this.userCertifications = this.userCertifications.filter(
                          c => c.certification_id !== cert.certification_id
                        );
                      }}
                    >
                      <md-icon>close</md-icon>
                    </md-filled-tonal-icon-button>
                  </div>
                </md-list-item>
              )}
            </md-list>
          </div>
          <div slot="actions">
            <md-text-button onClick={() => this.dialog?.close()}>Cancel</md-text-button>
            <md-text-button onClick={() => this.saveCert()} >OK</md-text-button>
          </div>
        </md-dialog>
      </Host>
    );
  }

}
