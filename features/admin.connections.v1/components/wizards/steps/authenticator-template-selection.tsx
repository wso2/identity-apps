/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { Forms } from "@wso2is/forms";
import { GenericIcon, Heading, Hint, ResourceGrid } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider, Grid } from "semantic-ui-react";
import { getConnectionIcons } from "../../../configs/ui";
import {
    FederatedAuthenticatorMetaDataInterface
} from "../../../models/authenticators";
import {
    ConnectionInterface,
    ConnectionTemplateInterface
} from "../../../models/connection";
import { ConnectionsManagementUtils } from "../../../utils/connection-utils";

/**
 * Prop-types for the general settings wizard form component.
 */
interface AuthenticatorTemplateSelectionWizardFormPropsInterface extends IdentifiableComponentInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    manualModeOptions: FederatedAuthenticatorMetaDataInterface[];
    authenticatorTemplates: ConnectionTemplateInterface[];
    /**
     * Callback to be executed when a template is selected.
     */
    onTemplateSelect: (template: ConnectionInterface) => void;
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

    const [ selectedTemplate, setSelectedTemplate ] = useState<ConnectionInterface>(undefined);
    const [ selectedManualModeOption, setSelectedManualModeOption ] = useState<any>(undefined);

    /**
     * Handles template selection.
     *
     * @param template - Selected protocol.
     */
    const handleTemplateSelection = (template: ConnectionInterface): void => {
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
                                            t("authenticationProvider:wizards." +
                                                "addAuthenticator.steps.authenticatorSelection.quickSetup.title")
                                        }
                                    </Heading>
                                    <Hint>
                                        {
                                            t("authenticationProvider:wizards." +
                                                "addAuthenticator.steps.authenticatorSelection.quickSetup.subTitle")
                                        }
                                    </Hint>
                                    <Divider hidden />
                                    <ResourceGrid>
                                        {
                                            authenticatorTemplates.map((
                                                template: ConnectionTemplateInterface,
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
                                                        ConnectionsManagementUtils
                                                            .resolveTemplateImage(template.image, getConnectionIcons())
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
                            <>
                                {
                                    authenticatorTemplates
                                    && authenticatorTemplates instanceof Array
                                    && authenticatorTemplates.length > 0 && (
                                        <>
                                            <Heading as="h4">
                                                {
                                                    t("authenticationProvider:" +
                                                        "wizards.addAuthenticator.steps.authenticatorSelection." +
                                                        "manualSetup.title")
                                                }
                                            </Heading>
                                            <Hint>
                                                {
                                                    t("authenticationProvider:wizards." +
                                                        "addAuthenticator.steps.authenticatorSelection." +
                                                        "manualSetup.subTitle")
                                                }
                                            </Hint>
                                        </>
                                    )
                                }
                                <Divider hidden />
                                <Card.Group className="authenticators-grid">
                                    {
                                        manualModeOptions.map((
                                            template: FederatedAuthenticatorMetaDataInterface,
                                            templateIndex: number
                                        ) => (
                                            <Card
                                                key={ templateIndex }
                                                onClick={ () => {
                                                    handleManualModeOptionSelection(template);
                                                } }
                                                data-testid={ `${ componentId }-${ template.name }` }
                                                selected={
                                                    selectedManualModeOption?.authenticatorId === template
                                                        .authenticatorId
                                                }
                                                className={
                                                    selectedManualModeOption?.authenticatorId === template
                                                        .authenticatorId
                                                        ? "selection-info-card selected"
                                                        : "selection-info-card"
                                                }
                                                size="small"
                                            >
                                                <Card.Content className="p-4">
                                                    <GenericIcon
                                                        icon={ template.icon }
                                                        size="micro"
                                                        floated="left"
                                                        shape="square"
                                                        className="theme-icon hover-rounded card-image"
                                                        inline
                                                        transparent
                                                    />
                                                    <Card.Header
                                                        textAlign="left"
                                                        className="card-header ellipsis pt-1"
                                                    >
                                                        { template.displayName || template.name }
                                                    </Card.Header>
                                                    <Card.Description
                                                        className="card-description"
                                                    >
                                                        { template.description }
                                                    </Card.Description>
                                                </Card.Content>
                                            </Card>
                                        ))
                                    }
                                </Card.Group>
                            </>
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
