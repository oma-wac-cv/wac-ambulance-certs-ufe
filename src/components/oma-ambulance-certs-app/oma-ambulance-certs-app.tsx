import { Component, Host, Prop, State, h } from '@stencil/core';
import { AmbulanceStaffCertificationsApiFactory, User, Certification } from '../../api/ambulance-certs';

declare global {
  interface Window { navigation: any; }
}

@Component({
  tag: 'oma-ambulance-certs-app',
  styleUrl: 'oma-ambulance-certs-app.css',
  shadow: true,
})

export class OmaAmbulanceCertsApp {
  @Prop() basePath: string="";
  @Prop() apiBase: string="";

  @State() private relativePath: string = "";

  private element: string = "404";
  private entryId: string = "";
  @State() error: string = "";
  private user: User = {
    id: "",
    name: "",
    certifications: []
  };

  @State() userList: User[] = [];
  @State() certificationList: Certification[] = [];

  private navigate(path: string) {
    const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
    if (window.navigation === undefined) {
      return;
    }
    window.navigation.navigate(absolute);
    this.getRouterElements();
  }

  private async getUsers(): Promise<User[]> {
    try {
      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.getUsers();
      if (response.status !== 200) {
        this.error = `[ERR!] cannot fetch users: ${response.statusText}`;
        return [];
      }
      return JSON.parse(JSON.stringify(response.data));
    } catch (e) {
      this.error = `[ERR!] cannot fetch users: ${e}`;
      return JSON.parse(JSON.stringify([]));
    }
  }

  private async getCertifications(): Promise<Certification[]> {
    try {
      const api = AmbulanceStaffCertificationsApiFactory(undefined, this.apiBase);
      const response = await api.getCertifications();
      if (response.status !== 200) {
        this.error = `[ERR!] cannot fetch certifications: ${response.statusText}`;
        return [];
      }

      return JSON.parse(JSON.stringify(response.data));
    } catch (e) {
      this.error = `[ERR!] cannot fetch certifications: ${e}`;
      return JSON.parse(JSON.stringify([]));
    }
  }

  async componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || "/").pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = "";
      }
    }
    window.navigation?.addEventListener('navigate', (ev: Event) => {
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    this.userList = await this.getUsers();
    this.certificationList = await this.getCertifications();

    toRelative(location.pathname);
    this.navigate(this.relativePath);
  }

  private async refreshData() {
    this.userList = JSON.parse(JSON.stringify(await this.getUsers()));
    this.certificationList = JSON.parse(JSON.stringify(await this.getCertifications()));
  }

  private getRouterElements() {
    let element = "selector";
    let entryId = "@new";

    // Certification elements
    if ( this.relativePath.startsWith("certifications") ) {
      entryId = this.relativePath.split("/")[1];
      element = (entryId === undefined) ? "certs-list" : "certs-edit";
      this.element = element
      this.entryId = entryId === undefined ? "@new" : entryId;
      return;
    }

    // User elements
    if (this.relativePath.startsWith("users")) {
      entryId = this.relativePath.split("/")[1];
      element = (entryId === undefined) ? "user-list" : "user-edit";
      this.element = element
      this.entryId = entryId === undefined ? "@new" : entryId;
      if (this.element == "user-edit") {
        let found: User = this.userList.find(user => user.id === this.entryId);
        if (found) {
          this.user = found;
        }
      }
      return;
    }

    // Nothing selected yet
    if (this.relativePath === "") {
      this.element = "selector";
      this.entryId = "@new";
      return;
    }

    this.element = "404";
    this.entryId = "";
    return
  }


  private onChildError(evt: Event) {
    this.error = (evt as CustomEvent).detail;
  }

  private async onActionEvent(evt: Event) {
    const action: string = (evt as CustomEvent).detail

    if (this.element === "user-edit") {

      if (action == "close") {
        await this.refreshData();
        this.navigate("./users");
        return;
      }
    }

    if (this.element === "certs-list") {
      if (action == "add") {
        await this.refreshData();
        this.navigate("./certifications");
        return;
      }
    }
  }

  render() {
    this.getRouterElements();

    const navigate  = (path:string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute);
      this.getRouterElements();
    }

    return (
      <Host>
        {( this.error !== "" &&
          <div class="error">{this.error} </div>
        )}
        { this.element !== "404" && (
          <div class="tabs">
            <md-tabs>
              <md-primary-tab onClick={() => navigate("./certifications")}>Certifications</md-primary-tab>
              <md-primary-tab onClick={() => navigate("./users")}>Users</md-primary-tab>
            </md-tabs>
          </div>
        )}
        { this.element === "certs-list" && (
          <oma-ambulance-certs-list
            onerror-event={(evt) => this.onChildError(evt)}
            onaction-event={(evt) => this.onActionEvent(evt)}
            api-base={this.apiBase}
            certification-id={this.entryId}
            certifications={this.certificationList}
          >
          </oma-ambulance-certs-list>
        )}
        { this.element === "user-list" && (
          <oma-ambulance-certs-user-list
            api-base={this.apiBase}
            users={this.userList}
            certifications={this.certificationList}
            onentry-clicked={
              (ev: CustomEvent<User>) => {
                navigate("./users/" + ev.detail.id.toString());
                this.user = ev.detail;
              }
            }
          >
          </oma-ambulance-certs-user-list>
        )}
        { this.element === "user-edit" && (
          <oma-ambulance-certs-user-edit
            onaction-event={(evt) => this.onActionEvent(evt)}
            api-base={this.apiBase}
            user={this.user}
            certifications={this.certificationList}
          >
          </oma-ambulance-certs-user-edit>
        )}
        { this.element === "404" && (
          <div> 404 - Not found </div>
        )}

        <div class="cat">
          <img src="/assets/cat.gif"/>
        </div>
      </Host>
    );
  }

}
