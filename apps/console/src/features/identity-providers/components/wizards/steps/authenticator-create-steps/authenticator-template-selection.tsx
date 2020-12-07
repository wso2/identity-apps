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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import { Heading, Hint, SelectionCard } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { getIdPIcons } from "../../../../configs";
import {
    FederatedAuthenticatorMetaDataInterface,
    IdentityProviderInterface,
    IdentityProviderTemplateListItemInterface
} from "../../../../models";

/**
 * Proptypes for the general settings wizard form component.
 */
interface AuthenticatorTemplateSelectionWizardFormPropsInterface extends TestableComponentInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    manualModeOptions: FederatedAuthenticatorMetaDataInterface[];
    authenticatorTemplates: IdentityProviderTemplateListItemInterface[];
}

/**
 * General settings wizard form component.
 *
 * @param {AuthenticatorTemplateSelectionWizardFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticatorTemplateSelection:
    FunctionComponent<AuthenticatorTemplateSelectionWizardFormPropsInterface> = (
    props: AuthenticatorTemplateSelectionWizardFormPropsInterface
): ReactElement => {

    const {
        triggerSubmit,
        onSubmit,
        manualModeOptions,
        authenticatorTemplates,
        [ "data-testid" ]: testId
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
                    (authenticatorTemplates && authenticatorTemplates instanceof Array &&
                        authenticatorTemplates.length > 0) &&
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Heading as="h4">
                                { t("console:develop.features.idp.wizards.addAuthenticator.steps." +
                                    "authenticatorSelection.quickSetup.title") }
                            </Heading>
                            <Hint icon={ null }>
                                { t("console:develop.features.idp.wizards.addAuthenticator.steps." +
                                    "authenticatorSelection.quickSetup.subTitle") }
                            </Hint>
                            { authenticatorTemplates.map((template, index) => (
                                <SelectionCard
                                    inline
                                    id={ template.id }
                                    key={ index }
                                    header={ template.name }
                                    image={ getIdPIcons()[template.image] }
                                    imageOptions={ {
                                        fill: "primary"
                                    } }
                                    onClick={ (): void => handleTemplateSelection(template) }
                                    selected={ selectedTemplate?.id === template.id }
                                    data-testid={ `${ testId }-template-${ index }` }
                                />))
                            }
                        </Grid.Column>
                    </Grid.Row>
                }
                {
                    (manualModeOptions && manualModeOptions instanceof Array && manualModeOptions.length > 0)
                    &&
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Heading as="h4">
                                { t("console:develop.features.idp.wizards.addAuthenticator.steps." +
                                    "authenticatorSelection.manualSetup.title") }
                            </Heading>
                            <Hint icon={ null }>
                                { t("console:develop.features.idp.wizards.addAuthenticator.steps." +
                                    "authenticatorSelection.manualSetup.subTitle") }
                            </Hint>
                            { manualModeOptions.map((option, index) => (
                                <SelectionCard
                                    inline
                                    id={ option.authenticatorId }
                                    key={ index }
                                    header={ option.displayName }
                                    image={ option.icon }
                                    imageOptions={ {
                                        fill: "primary"
                                    } }
                                    onClick={ (): void => handleManualModeOptionSelection(option) }
                                    selected={ selectedManualModeOption?.authenticatorId === option.authenticatorId }
                                    data-testid={ `${ testId }-manual-option-${ index }` }
                                />))
                            }
                        </Grid.Column>
                    </Grid.Row>
                }
            </Grid>
        </Forms>
    );
};
