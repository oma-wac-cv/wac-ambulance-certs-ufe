import { Component, Prop, State, Event, EventEmitter, Host, h } from '@stencil/core';
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

  @Prop() users: User[] = [];
  @Prop() certifications: Certification[] = [];

  @Event({ eventName: "entry-clicked"}) userClicked: EventEmitter<User>;

  async componentWillLoad() {

  }

  private getCertFromUserCertification(userCert: any): Certification {
    let cert: Certification = this.certifications.find(cert => cert.id === userCert.certification_id);
    return cert;
  }

  render() {
    return (
      <Host>
        <div class="mylist">
          <md-list>
            {this.users.map(user =>
              <md-list-item>
                <div slot="headline">{user.name}</div>
                <div slot="supporting-text">
                  <md-chip-set>
                    {user.certifications.filter(uc=> this.certifications.find(c => c.id == uc.certification_id)).map(cert =>
                      <md-assist-chip
                        always-focusable
                        disabled
                        label={this.getCertFromUserCertification(cert).name || "Unknown"}>
                      </md-assist-chip>
                    )}
                  </md-chip-set>
                </div>
                <md-icon slot="start">person</md-icon>
                <md-filled-tonal-button slot="end"
                  onClick={() => {
                    this.userClicked.emit(user);
                    this.userEdit = user;
                  }}>
                  Edit
                  <md-icon slot="icon">edit</md-icon>
                </md-filled-tonal-button>
              </md-list-item>
            )}
          </md-list>
        </div>
      </Host>
    );
  }

}
