/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";

/**
 * Prop types of the component.
 */
type SAMLWebApplicationCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the SAML web application template creation wizard.
 *
 * @param {SAMLWebApplicationCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const SAMLWebApplicationFileBasedCreateWizardHelp: FunctionComponent<
    SAMLWebApplicationCreateWizardHelpPropsInterface
    > = (
        props: SAMLWebApplicationCreateWizardHelpPropsInterface
    ): ReactElement => {

        const {
            [ "data-testid" ]: testId
        } = props;

        const { t } = useTranslation();

        return (
            <div data-testid={ testId }>
                <Heading as="h5">
                    { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                    ".heading.title") }
                </Heading>
                <p>
                    { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                    ".heading.subTitle") }
                </p>
                <p>
                    { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                    ".heading.example") }
                </p>
                <>
                    <Divider/>
                    <Heading as="h5">
                        {
                            t("console:develop.features.applications.wizards.minimalAppCreationWizard" +
                                ".help.template.common.protocol.title")
                        }
                    </Heading>
                    <p>
                        {
                            t("console:develop.features.applications.wizards.minimalAppCreationWizard" +
                                ".help.template.common.protocol.subTitle")
                        }
                    </p>
                </>

                <Divider />

                <>
                    <Heading as="h5">
                        {
                            t("console:develop.features.applications.wizards.minimalAppCreationWizard" +
                                ".help.template.samlWeb.metaFile.title")
                        }
                    </Heading>
                    <p>
                        {
                            t("console:develop.features.applications.wizards.minimalAppCreationWizard" +
                                ".help.template.samlWeb.metaFile.subTitle")
                        }
                    </p>
                </>

                <Divider hidden/>
            </div>
        );
    };

/**
 * Default props for the component
 */
SAMLWebApplicationFileBasedCreateWizardHelp.defaultProps = {
    "data-testid": "saml-web-app-file-based-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SAMLWebApplicationFileBasedCreateWizardHelp;
