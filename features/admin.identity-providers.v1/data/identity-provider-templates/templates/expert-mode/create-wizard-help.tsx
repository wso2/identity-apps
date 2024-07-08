/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";

/**
 * Prop types of the component.
 */
type ExpertModeIdPCreateWizardHelpPropsInterface = IdentifiableComponentInterface;

/**
 * Help content for the custom IdP template creation wizard.
 *
 * @param props - Props injected into the component.
 * @returns Expert Mode IDP create wizard help content.
 */
const ExpertModeIdPCreateWizardHelp: FunctionComponent<ExpertModeIdPCreateWizardHelpPropsInterface> = (
    props: ExpertModeIdPCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <div data-componentid={ componentId }>
            <Heading as="h5">
                {
                    t("authenticationProvider:templates.expert" +
                        ".wizardHelp.name.heading")
                }
            </Heading>
            <p>
                {
                    t("authenticationProvider:templates.expert." +
                        "wizardHelp.name.connectionDescription")
                }
            </p>

            <Divider/>

            <Heading as="h5">
                { t("authenticationProvider:templates.expert.wizardHelp.description.heading") }
            </Heading>
            <p>
                {
                    t("authenticationProvider:templates.expert." +
                        "wizardHelp.description.connectionDescription")
                }
            </p>
        </div>
    );
};

/**
 * Default props for the component
 */
ExpertModeIdPCreateWizardHelp.defaultProps = {
    "data-componentid": "expert-mode-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ExpertModeIdPCreateWizardHelp;
