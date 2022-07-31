/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import { Heading, Hint, ResourceGrid } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { getIdPIcons } from "../../../../configs";
import {
    FederatedAuthenticatorMetaDataInterface,
    IdentityProviderInterface,
    IdentityProviderTemplateInterface
} from "../../../../models";
import { IdentityProviderManagementUtils } from "../../../../utils";

/**
 * Prop-types for the general settings wizard form component.
 */
interface AuthenticatorTemplateSelectionWizardFormPropsInterface extends IdentifiableComponentInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    manualModeOptions: FederatedAuthenticatorMetaDataInterface[];
    authenticatorTemplates: IdentityProviderTemplateInterface[];
}

/**
 * Authenticator Selection Component.
 *
 * @param {AuthenticatorTemplateSelectionWizardFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticatorTemplateSelection: FunctionComponent<
    AuthenticatorTemplateSelectionWizardFormPropsInterface
> = (
    props: AuthenticatorTemplateSelectionWizardFormPropsInterface
): ReactElement => {

    const {
        triggerSubmit,
        onSubmit,
        manualModeOptions,
        authenticatorTemplates,
        [ "data-componentid" ]: componentId
    } = props;

    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderInterface>(undefined);
    const [ selectedManualModeOption, setSelectedManualModeOption ] = useState<any>(undefined);
    const { t } = useTranslation();

    /**
     * Handles template selection.
     *
     * @param {IdentityProviderInterface} template - Selected protocol.
     */
    const handleTemplateSelection = (template: IdentityProviderInterface): void => {
        setSelectedTemplate(template);
        setSelectedManualModeOption(undefined);
    };

    /**
     * Handles manual mode option selection.
     *
     * @param option - Selected manual mode option.
     */
    const handleManualModeOptionSelection = (option): void => {
        setSelectedManualModeOption(option);
        setSelectedTemplate(undefined);
    };

    return (
        <Forms
            onSubmit={ (): void => {
                if (selectedTemplate) {
                    onSubmit({
                        templateId: selectedTemplate.id
                    });
                } else if (selectedManualModeOption) {
                    onSubmit({
                        manualModeOptionId: selectedManualModeOption.authenticatorId
                    });
                }
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                {
                    (
                        authenticatorTemplates
                        && authenticatorTemplates instanceof Array
                        && authenticatorTemplates.length > 0
                    )
                        && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Heading as="h4">
                                        {
                                            t("console:develop.features.authenticationProvider.wizards." +
                                                "addAuthenticator.steps.authenticatorSelection.quickSetup.title")
                                        }
                                    </Heading>
                                    <Hint>
                                        {
                                            t("console:develop.features.authenticationProvider.wizards." +
                                                "addAuthenticator.steps.authenticatorSelection.quickSetup.subTitle")
                                        }
                                    </Hint>
                                    <Divider hidden />
                                    <ResourceGrid>
                                        {
                                            authenticatorTemplates.map((
                                                template: IdentityProviderTemplateInterface,
                                                templateIndex: number
                                            ) => (
                                                <ResourceGrid.Card
                                                    key={ templateIndex }
                                                    resourceName={
                                                        template.name === "Enterprise"
                                                            ? "Standard-Based IdP"
                                                            : template.name
                                                    }
                                                    isResourceComingSoon={ template.comingSoon }
                                                    disabled={ template.disabled }
                                                    comingSoonRibbonLabel={ t("common:comingSoon") }
                                                    resourceDescription={ template.description }
                                                    resourceImage={
                                                        IdentityProviderManagementUtils
                                                            .resolveTemplateImage(template.image, getIdPIcons())
                                                    }
                                                    tags={ template.tags }
                                                    onClick={ () => {
                                                        handleTemplateSelection(template);
                                                    } }
                                                    showTooltips={ {
                                                        description: true,
                                                        header: false
                                                    } }
                                                    selected={ selectedTemplate?.id === template.id }
                                                    data-testid={ `${ componentId }-${ template.name }` }
                                                />
                                            ))
                                        }
                                    </ResourceGrid>
                                </Grid.Column>
                            </Grid.Row>
                        )
                }
                {
                    (
                        manualModeOptions
                        && manualModeOptions instanceof Array
                        && manualModeOptions.length > 0
                    )
                        && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Heading as="h4">
                                        {
                                            t("console:develop.features.authenticationProvider.wizards." +
                                                "addAuthenticator.steps.authenticatorSelection.manualSetup.title")
                                        }
                                    </Heading>
                                    <Hint>
                                        {
                                            t("console:develop.features.authenticationProvider.wizards." +
                                                "addAuthenticator.steps.authenticatorSelection.manualSetup.subTitle")
                                        }
                                    </Hint>
                                    <Divider hidden />
                                    <ResourceGrid>
                                        {
                                            manualModeOptions.map((
                                                template: FederatedAuthenticatorMetaDataInterface,
                                                templateIndex: number
                                            ) => (
                                                <ResourceGrid.Card
                                                    key={ templateIndex }
                                                    resourceName={ template.displayName }
                                                    resourceDescription={ template.description }
                                                    resourceImage={ template.icon }
                                                    onClick={ () => {
                                                        handleManualModeOptionSelection(template);
                                                    } }
                                                    showTooltips={ { header: false, description: true } }
                                                    data-testid={ `${ componentId }-${ template.name }` }
                                                    selected={
                                                        selectedManualModeOption?.authenticatorId === template
                                                            .authenticatorId
                                                    }
                                                />
                                            ))
                                        }
                                    </ResourceGrid>
                                </Grid.Column>
                            </Grid.Row>
                        )
                }
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the Authenticator selection.
 */
AuthenticatorTemplateSelection.defaultProps = {
    "data-componentid": "authenticator-template-selection"
};
