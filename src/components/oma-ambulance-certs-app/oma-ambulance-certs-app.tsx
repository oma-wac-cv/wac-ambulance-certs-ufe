import { Component, Host, Prop, State, h } from '@stencil/core';


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
  private entryId: string = "404";
  private error:   string = "";

  componentWillLoad() {
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
    toRelative(location.pathname);
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
      return;
    }

    // Nothing selected yet
    if (this.relativePath === "") {
      this.element = "selector";
      this.entryId = "@new";
      return;
    }

    this.element = "404";
    this.entryId = "404";
    return
  }

  private onChildError(evt: Event) {
    this.error = (evt as CustomEvent).detail;
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
        {this.error !== "" && (
          <div class="error"> {this.error} </div>
        )}
        { this.element !== "404" && (
          <md-tabs>
            <md-primary-tab onClick={() => navigate("./certifications")}>Certifications</md-primary-tab>
            <md-primary-tab onClick={() => navigate("./users")}>Users</md-primary-tab>
          </md-tabs>
        )}
        { this.element === "certs-list" && (
          <oma-ambulance-certs-list
            onerror-event={(evt) => this.onChildError(evt)}
            api-base={this.apiBase}
            certification-id={this.entryId}
          >
          </oma-ambulance-certs-list>
        )}
        { this.element === "user-list" && (
          <oma-ambulance-certs-user-list
            api-base={this.apiBase}
            user-id={this.entryId}
          >
          </oma-ambulance-certs-user-list>
        )}
        { this.element === "404" && (
          <div> 404 - Not found </div>
        )}
      </Host>
    );
  }

}
