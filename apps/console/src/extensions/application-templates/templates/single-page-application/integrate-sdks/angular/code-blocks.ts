/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { SDKInitConfig } from "../../../../shared";

export const authModuleImportCode = (): string => {

    return (
        "import { AsgardeoAuthModule } from \"@asgardeo/auth-angular\";"
    );
};

export const authServiceImportCode = (): string => {

    return (
        "import { AsgardeoAuthService } from \"@asgardeo/auth-angular\";"
    );
};

export const angularSDKInitialisationCode = (SDKInitConfig: SDKInitConfig): string => {

    const scopesForDisplay = (): string => {

        return `[ ${
            SDKInitConfig?.scope?.map((item: string) => {
                return `"${ item }"`;
            })
        } ]`;
    };

    return `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AsgardeoAuthModule } from "@asgardeo/auth-angular";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AsgardeoAuthModule.forRoot({
            signInRedirectURL: "${ SDKInitConfig.signInRedirectURL }",
            signOutRedirectURL: "${ SDKInitConfig.signOutRedirectURL }",
            clientID: "${ SDKInitConfig.clientID }",
            baseUrl: "${ SDKInitConfig.baseUrl }",
            scope: ${ scopesForDisplay() }
        })
    ],
    providers: [
        // Add your providers here.
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
`;
};


export const serviceInjectionCode = (): string => {

    return (
        "constructor(public auth: AsgardeoAuthService) { }"
    );
};

export const loginButtonCode = (): string => {

    return (
        "<button (click)=\"auth.signIn()\">Login</button>"
    );
};

export const logoutButtonCode = (): string => {

    return (
        "<button button (click)=\"auth.signOut()\">Logout</button>"
    );
};

export const stateSubscriptionCode = (): string => {

    return (
        `import { Component } from '@angular/core';
import { AsgardeoAuthService } from "@asgardeo/auth-angular";

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <ng-container *ngIf="(auth.state$ | async)?.isAuthenticated; else unauthenticatedView">
        <ul>
          <li>{{ (auth.state$ | async)?.username }}</li>
        </ul>

        <button button (click)="auth.signOut()">Logout</button>
      </ng-container>

      <ng-template #unauthenticatedView>
        <button (click)="auth.signIn()">Login</button>
      </ng-template>
    </div>
  \`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AsgardeoAuthService) { }
}
`
    );
};
