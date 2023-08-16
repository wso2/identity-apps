/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import { Heading, Hint, ResourceGrid } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { getIdPIcons } from "../../../../configs/ui";
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
    /**
     * Callback to be executed when a template is selected.
     */
    onTemplateSelect: (template: IdentityProviderInterface) => void;
}

/**
 * Authenticator Selection Component.
 *
 * @param props - Props injected to the component.
 * @returns Authenticator Selection Component.
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
        onTemplateSelect,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderInterface>(undefined);
    const [ selectedManualModeOption, setSelectedManualModeOption ] = useState<any>(undefined);

    /**
     * Handles template selection.
     *
     * @param template - Selected protocol.
     */
    const handleTemplateSelection = (template: IdentityProviderInterface): void => {
        setSelectedTemplate(template);
        onTemplateSelect(template);
        setSelectedManualModeOption(undefined);
    };

    /**
     * Handles manual mode option selection.
     *
     * @param option - Selected manual mode option.
     */
    const handleManualModeOptionSelection = (option: FederatedAuthenticatorMetaDataInterface): void => {
        setSelectedManualModeOption(option);
        onTemplateSelect(option);
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
                                    {
                                        authenticatorTemplates
                                        && authenticatorTemplates instanceof Array
                                        && authenticatorTemplates.length > 0 && (
                                            <>
                                                <Heading as="h4">
                                                    {
                                                        t("console:develop.features.authenticationProvider." +
                                                            "wizards.addAuthenticator.steps.authenticatorSelection." +
                                                            "manualSetup.title")
                                                    }
                                                </Heading>
                                                <Hint>
                                                    {
                                                        t("console:develop.features.authenticationProvider.wizards." +
                                                            "addAuthenticator.steps.authenticatorSelection." +
                                                            "manualSetup.subTitle")
                                                    }
                                                </Hint>
                                            </>
                                        )
                                    }
                                    <Divider hidden />
                                    <ResourceGrid>
                                        {
                                            manualModeOptions.map((
                                                template: FederatedAuthenticatorMetaDataInterface,
                                                templateIndex: number
                                            ) => (
                                                <ResourceGrid.Card
                                                    key={ templateIndex }
                                                    resourceName={ template.displayName || template.name }
                                                    resourceDescription={ template.description }
                                                    resourceImage={ template.icon || getIdPIcons().default }
                                                    onClick={ () => {
                                                        handleManualModeOptionSelection(template);
                                                    } }
                                                    showTooltips={ {
                                                        description: true,
                                                        header: false
                                                    } }
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
