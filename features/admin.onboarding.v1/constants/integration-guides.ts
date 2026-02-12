/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { ApplicationTemplateIdTypes } from "@wso2is/admin.applications.v1/models/application";

/**
 * Framework integration guide interface.
 */
export interface FrameworkIntegrationGuideInterface {
    /** SDK package name */
    sdk: string;
    /** npm install command */
    installCommand: string;
    /** yarn install command */
    yarnCommand: string;
    /** pnpm install command */
    pnpmCommand: string;
    /** File where provider should be added */
    providerFile: string;
    /** Provider/config code snippet */
    providerCode: string;
    /** File where buttons should be added (optional) */
    buttonFile?: string;
    /** Button code snippet (optional) */
    buttonCode?: string;
    /** Documentation URL */
    docsUrl: string;
    /** Display name for the framework */
    displayName: string;
}

/**
 * Configuration for generating integration code.
 */
export interface IntegrationConfigInterface {
    clientId: string;
    clientSecret?: string;
    baseUrl: string;
    redirectUrl: string;
    appName: string;
    templateId?: string;
}

/**
 * React application integration guide.
 */
const REACT_INTEGRATION: FrameworkIntegrationGuideInterface = {
    buttonCode: `import { useAuthContext } from "@asgardeo/auth-react";

function App() {
    const { state, signIn, signOut } = useAuthContext();

    return (
        <div>
            {state.isAuthenticated ? (
                <>
                    <p>Welcome, {state.username}</p>
                    <button onClick={() => signOut()}>Sign Out</button>
                </>
            ) : (
                <button onClick={() => signIn()}>Sign In</button>
            )}
        </div>
    );
}`,
    buttonFile: "App.jsx",
    displayName: "React",
    docsUrl: "https://is.docs.wso2.com/en/next/quick-starts/react/",
    installCommand: "npm install @asgardeo/auth-react",
    pnpmCommand: "pnpm add @asgardeo/auth-react",
    providerCode: `import { AuthProvider } from "@asgardeo/auth-react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const config = {
    signInRedirectURL: "{redirectUrl}",
    signOutRedirectURL: "{redirectUrl}",
    clientID: "{clientId}",
    baseUrl: "{baseUrl}",
    scope: ["openid", "profile"]
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider config={config}>
        <App />
    </AuthProvider>
);`,
    providerFile: "main.jsx",
    sdk: "@asgardeo/auth-react",
    yarnCommand: "yarn add @asgardeo/auth-react"
};

/**
 * Next.js application integration guide.
 */
const NEXTJS_INTEGRATION: FrameworkIntegrationGuideInterface = {
    buttonCode: `"use client";

import { useSession, signIn, signOut } from "@asgardeo/auth-nextjs/client";

export default function Home() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                <p>Welcome, {session.user?.name}</p>
                <button onClick={() => signOut()}>Sign Out</button>
            </>
        );
    }

    return <button onClick={() => signIn("asgardeo")}>Sign In</button>;
}`,
    buttonFile: "app/page.tsx",
    displayName: "Next.js",
    docsUrl: "https://is.docs.wso2.com/en/next/quick-starts/nextjs/",
    installCommand: "npm install @asgardeo/auth-nextjs",
    pnpmCommand: "pnpm add @asgardeo/auth-nextjs",
    providerCode: `// app/api/auth/[...asgardeo]/route.ts
import AsgardeoAuth from "@asgardeo/auth-nextjs";

export const { handlers, auth, signIn, signOut } = AsgardeoAuth({
    clientId: "{clientId}",
    clientSecret: "{clientSecret}",
    baseUrl: "{baseUrl}"
});

export const { GET, POST } = handlers;`,
    providerFile: "app/api/auth/[...asgardeo]/route.ts",
    sdk: "@asgardeo/auth-nextjs",
    yarnCommand: "yarn add @asgardeo/auth-nextjs"
};

/**
 * Angular application integration guide.
 */
const ANGULAR_INTEGRATION: FrameworkIntegrationGuideInterface = {
    buttonCode: `import { Component } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";

@Component({
    selector: "app-root",
    template: \`
        <div *ngIf="isAuthenticated; else loginBtn">
            <p>Welcome!</p>
            <button (click)="logout()">Sign Out</button>
        </div>
        <ng-template #loginBtn>
            <button (click)="login()">Sign In</button>
        </ng-template>
    \`
})
export class AppComponent {
    get isAuthenticated() {
        return this.oauthService.hasValidAccessToken();
    }

    constructor(private oauthService: OAuthService) {}

    login() { this.oauthService.initCodeFlow(); }
    logout() { this.oauthService.logOut(); }
}`,
    buttonFile: "app.component.ts",
    displayName: "Angular",
    docsUrl: "https://is.docs.wso2.com/en/next/quick-starts/angular/",
    installCommand: "npm install angular-oauth2-oidc@17",
    pnpmCommand: "pnpm add angular-oauth2-oidc@17",
    providerCode: `// app.config.ts
import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
    issuer: "{baseUrl}/oauth2/token",
    clientId: "{clientId}",
    redirectUri: "{redirectUrl}",
    responseType: "code",
    scope: "openid profile",
    showDebugInformation: true
};`,
    providerFile: "app.config.ts",
    sdk: "angular-oauth2-oidc@17",
    yarnCommand: "yarn add angular-oauth2-oidc@17"
};

/**
 * Express.js application integration guide.
 */
const EXPRESS_INTEGRATION: FrameworkIntegrationGuideInterface = {
    buttonCode: `// Add to your routes
app.get("/login", passport.authenticate("asgardeo"));

app.get("/callback",
    passport.authenticate("asgardeo", { failureRedirect: "/login" }),
    (req, res) => res.redirect("/")
);

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});`,
    buttonFile: "routes/auth.js",
    displayName: "Express",
    docsUrl: "https://is.docs.wso2.com/en/next/quick-starts/expressjs/",
    installCommand: "npm install passport express-session @asgardeo/passport-asgardeo",
    pnpmCommand: "pnpm add passport express-session @asgardeo/passport-asgardeo",
    providerCode: `// .env
ASGARDEO_CLIENT_ID={clientId}
ASGARDEO_CLIENT_SECRET={clientSecret}
ASGARDEO_BASE_URL={baseUrl}
ASGARDEO_CALLBACK_URL={redirectUrl}

// app.js
const passport = require("passport");
const AsgardeoStrategy = require("@asgardeo/passport-asgardeo");

passport.use(new AsgardeoStrategy({
    clientID: process.env.ASGARDEO_CLIENT_ID,
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
    baseUrl: process.env.ASGARDEO_BASE_URL,
    callbackURL: process.env.ASGARDEO_CALLBACK_URL
}));`,
    providerFile: "app.js",
    sdk: "@asgardeo/passport-asgardeo",
    yarnCommand: "yarn add passport express-session @asgardeo/passport-asgardeo"
};

/**
 * Map of template IDs to integration guides.
 * Only framework-specific templates have hardcoded guides (AI prompt + starter code).
 * Generic application types (mobile, SPA, oidc-web) show OIDC configuration values
 * or API-fetched guide content instead.
 */
export const INTEGRATION_GUIDES: Record<string, FrameworkIntegrationGuideInterface> = {
    [ApplicationTemplateIdTypes.ANGULAR_APPLICATION]: ANGULAR_INTEGRATION,
    [ApplicationTemplateIdTypes.EXPRESSJS_APPLICATION]: EXPRESS_INTEGRATION,
    [ApplicationTemplateIdTypes.NEXT_JS_APPLICATION]: NEXTJS_INTEGRATION,
    [ApplicationTemplateIdTypes.REACT_APPLICATION]: REACT_INTEGRATION
};

/**
 * Get integration guide for a template.
 *
 * @param templateId - The application template ID
 * @returns The integration guide or undefined
 */
export const getIntegrationGuide = (templateId: string): FrameworkIntegrationGuideInterface | undefined => {
    return INTEGRATION_GUIDES[templateId];
};

/**
 * Replace placeholders in code with actual values.
 *
 * @param code - Code string with placeholders
 * @param config - Configuration values
 * @returns Code with placeholders replaced
 */
export const replaceCodePlaceholders = (code: string, config: IntegrationConfigInterface): string => {
    return code
        .replace(/\{clientId\}/g, config.clientId)
        .replace(/\{clientSecret\}/g, config.clientSecret || "YOUR_CLIENT_SECRET")
        .replace(/\{baseUrl\}/g, config.baseUrl)
        .replace(/\{redirectUrl\}/g, config.redirectUrl)
        .replace(/\{appName\}/g, config.appName);
};

/**
 * Generate AI prompt for integration assistance.
 * Uses structured format with guardrails following industry best practices (Clerk-style).
 *
 * @param config - Integration configuration
 * @param framework - Framework display name
 * @returns AI prompt string
 */
export const generateAIPrompt = (config: IntegrationConfigInterface, framework: string): string => {
    const guide: FrameworkIntegrationGuideInterface | undefined = config.templateId
        ? INTEGRATION_GUIDES[config.templateId]
        : undefined;

    const sdk: string = guide?.sdk || "@asgardeo/auth-react";
    const installCmd: string = guide?.installCommand || `npm install ${sdk}`;
    const docsUrl: string = guide?.docsUrl || "https://is.docs.wso2.com/en/next/quick-starts/";

    // Include provider setup code with credentials substituted
    let starterCodeSection: string = "";

    if (guide) {
        const providerCode: string = replaceCodePlaceholders(guide.providerCode, config);

        starterCodeSection = `

### Starter Code — ${guide.providerFile}
\`\`\`
${providerCode}
\`\`\``;
    }

    return `## Add ${framework} Authentication

### Application Details
- **Application Name:** ${config.appName}
- **Client ID:** ${config.clientId}
- **Base URL:** ${config.baseUrl}
- **Redirect URL:** ${config.redirectUrl}
- **SDK:** ${sdk}

### Task
Add authentication (sign-in and sign-out) to my ${framework} application using the official SDK.

### Steps
1. Install the SDK: \`${installCmd}\`
2. Configure the auth provider with the credentials above
3. Add a sign-in button that triggers the login flow
4. Add a sign-out button for authenticated users
5. Display the authenticated user's name/email
6. Protect routes that require authentication
${starterCodeSection}

### ALWAYS DO
- Use the **exact** Client ID and Base URL provided above
- Use \`${sdk}\` — this is the official SDK
- Include \`openid\` and \`profile\` in the scopes
- Handle the authentication callback at the redirect URL
- Show a loading state while authentication is in progress

### NEVER DO
- Do NOT hardcode credentials — use environment variables for production
- Do NOT use a different SDK than \`${sdk}\` for ${framework}
- Do NOT skip the sign-out redirect URL configuration
- Do NOT store tokens in localStorage manually — the SDK handles this

### Verification Checklist
- [ ] SDK installed and imported correctly
- [ ] Auth provider wraps the application root
- [ ] Sign-in redirects to the login page
- [ ] After login, user is redirected back to the app
- [ ] User info (name/email) is displayed when authenticated
- [ ] Sign-out clears the session and redirects properly

### Documentation
${docsUrl}`;
};

/**
 * Relative documentation paths for all application template types.
 * Appended to the deployment's `docSiteURL` so that different deployments
 * each resolve to their own documentation site automatically.
 */
export const TEMPLATE_DOC_PATHS: Record<string, string> = {
    [ApplicationTemplateIdTypes.ANGULAR_APPLICATION]: "/quick-starts/angular/",
    [ApplicationTemplateIdTypes.EXPRESSJS_APPLICATION]: "/quick-starts/expressjs/",
    [ApplicationTemplateIdTypes.M2M_APPLICATION]: "/guides/applications/register-machine-to-machine-app/",
    [ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION]: "/guides/applications/register-mcp-client-app/",
    [ApplicationTemplateIdTypes.MOBILE_APPLICATION]: "/guides/authentication/oidc/implement-auth-code-with-pkce/",
    [ApplicationTemplateIdTypes.NEXT_JS_APPLICATION]: "/quick-starts/nextjs/",
    [ApplicationTemplateIdTypes.OIDC_WEB_APPLICATION]: "/guides/authentication/oidc/implement-auth-code/",
    [ApplicationTemplateIdTypes.REACT_APPLICATION]: "/quick-starts/react/",
    [ApplicationTemplateIdTypes.SPA]: "/guides/authentication/oidc/implement-auth-code-with-pkce/"
};

/**
 * Get the full documentation URL for a given template.
 *
 * @param templateId - The application template ID
 * @param docSiteURL - Documentation site base URL from deployment config
 * @returns Full documentation URL, or undefined if not mapped
 */
export const getTemplateDocsUrl = (templateId?: string, docSiteURL?: string): string | undefined => {
    if (!templateId || !docSiteURL) {
        return undefined;
    }

    const path: string | undefined = TEMPLATE_DOC_PATHS[templateId];

    return path ? `${docSiteURL}${path}` : undefined;
};

/**
 * M2M curl command template for getting access token.
 */
export const M2M_CURL_TEMPLATE: string = `curl -X POST {baseUrl}/oauth2/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id={clientId}" \\
  -d "client_secret={clientSecret}"`;

/**
 * Generate M2M curl command with actual values.
 *
 * @param config - Integration configuration
 * @returns Curl command string
 */
export const generateM2MCurlCommand = (config: IntegrationConfigInterface): string => {
    return replaceCodePlaceholders(M2M_CURL_TEMPLATE, config);
};
