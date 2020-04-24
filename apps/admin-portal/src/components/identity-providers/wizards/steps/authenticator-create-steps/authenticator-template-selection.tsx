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

import { Forms } from "@wso2is/forms";
import { Heading, Hint, SelectionCard } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Grid } from "semantic-ui-react";
import { IdPIcons } from "../../../../../configs";
import { IdentityProviderInterface } from "../../../../../models";

/**
 * Proptypes for the general settings wizard form component.
 */
interface AuthenticatorTemplateSelectionWizardFormPropsInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    defaultTemplates: any;
    authenticatorTemplates: any;
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
        defaultTemplates,
        authenticatorTemplates
    } = props;

    const [
        selectedTemplate,
        setSelectedTemplate
    ] = useState<IdentityProviderInterface>(undefined);

    /**
     * Handles inbound protocol selection.
     *
     * @param {IdentityProviderInterface} template - Selected protocol.
     */
    const handleInboundProtocolSelection = (template: IdentityProviderInterface): void => {
        setSelectedTemplate(template);
    };

    return (
        <Forms
            onSubmit={ (): void => {
                onSubmit({
                    templateId: selectedTemplate.id
                })
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                {
                    (defaultTemplates && defaultTemplates instanceof Array && defaultTemplates.length > 0)
                    &&
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Heading as="h4">Inbound protocol</Heading>
                            <Hint icon={ null }>Select one of the following inbound protocol</Hint>
                            { defaultTemplates.map((temp, index) => (
                                <SelectionCard
                                    inline
                                    id={ temp.id }
                                    key={ index }
                                    header={ temp.name }
                                    image={ IdPIcons[temp.image] }
                                    onClick={ (): void => handleInboundProtocolSelection(temp) }
                                    // selected={ selectedInboundProtocol?.id === protocol.id }
                                />))
                            }
                        </Grid.Column>
                    </Grid.Row>
                }
                {
                    (authenticatorTemplates && authenticatorTemplates instanceof Array &&
                        authenticatorTemplates.length > 0) &&
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Heading as="h4">Templates</Heading>
                            <Hint icon={ null }>Get the authenticator settings from already available template</Hint>
                            { authenticatorTemplates.map((template, index) => (
                                <SelectionCard
                                    inline
                                    id={ template.id }
                                    key={ index }
                                    header={ template.name }
                                    image={ IdPIcons[template.image] }
                                    onClick={ (): void => handleInboundProtocolSelection(template) }
                                    selected={ selectedTemplate?.id === template.id }
                                />))
                            }
                        </Grid.Column>
                    </Grid.Row>
                }
            </Grid>
        </Forms>
    );
};
