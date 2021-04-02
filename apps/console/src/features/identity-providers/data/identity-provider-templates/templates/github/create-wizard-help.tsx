/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Prop types of the component.
 */
type GithubIdentityProviderCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the gihub IDP template creation wizard.
 *
 * @param {GithubIdentityProviderCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const GithubIdentityProviderCreateWizardHelp: FunctionComponent<GithubIdentityProviderCreateWizardHelpPropsInterface> = (
    props: GithubIdentityProviderCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Name</Heading>
            <p>Provide a unique name for the gibub authentication provider so that it can be easily identified.</p>
            <p>E.g., MyGithubAuthProvider.</p>
        </div>
    );
};

/**
 * Default props for the component
 */
GithubIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "custom-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GithubIdentityProviderCreateWizardHelp;
