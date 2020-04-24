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

import { Heading, Hint, SelectionCard } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { ApplicationTemplateIllustrations, InboundProtocolLogos } from "../../../configs";
import { ApplicationTemplateListItemInterface, AuthProtocolMetaListItemInterface } from "../../../models";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { ApplicationManagementUtils } from "../../../utils";
import { EmptyPlaceholder } from "../../shared";

/**
 * Proptypes for the protocol selection wizard form component.
 */
interface ProtocolSelectionWizardFormPropsInterface {
    initialSelectedTemplate?: ApplicationTemplateListItemInterface;
    defaultTemplates: ApplicationTemplateListItemInterface[];
    onSubmit: (values: ApplicationTemplateListItemInterface) => void;
    triggerSubmit: boolean;
    selectedProtocols: string[];
}

/**
 * Protocol selection wizard form component.
 *
 * @param {ProtocolSelectionWizardFormPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ProtocolSelectionWizardForm: FunctionComponent<ProtocolSelectionWizardFormPropsInterface> = (
    props: ProtocolSelectionWizardFormPropsInterface
): ReactElement => {

    const {
        initialSelectedTemplate,
        selectedProtocols,
        onSubmit,
        defaultTemplates,
        triggerSubmit
    } = props;

    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);

    const [
        selectedTemplate,
        setSelectedTemplate
    ] = useState<ApplicationTemplateListItemInterface>(undefined);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     * Called when submit is triggered.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }
        onSubmit(selectedTemplate);
    }, [triggerSubmit]);

    /**
     *  Get Application templates.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationManagementUtils.getApplicationTemplates()
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [applicationTemplates]);

    useEffect(() => {
        if (initialSelectedTemplate) {
            setSelectedTemplate(initialSelectedTemplate)
        }
    }, [initialSelectedTemplate]);

    /**
     * Handles inbound protocol selection.
     *
     * @param {AuthProtocolMetaListItemInterface} protocol - Selected protocol.
     */
    const handleInboundProtocolSelection = (template: ApplicationTemplateListItemInterface): void => {
        setSelectedTemplate(template);
    };

    /**
     * Filter already existing protocol from the template.
     *
     * @param templates Templates array to be filtered.
     */
    const filterProtocol = (
        templates: ApplicationTemplateListItemInterface[]
    ): ApplicationTemplateListItemInterface[] => {
        if (templates) {
            return templates.filter(
                (temp) => !selectedProtocols.includes(temp.authenticationProtocol))
        } else {
            return null
        }
    };

    /**
     * Available default templates after filtering.
     */
    const availableDefaultTemplates = filterProtocol(defaultTemplates);

    /**
     * Available templates from api after filtering.
     */
    const availableTemplates = filterProtocol(applicationTemplates);

    return (
        <Grid>

            {
                (availableDefaultTemplates.length > 0)
                &&
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h4">Inbound protocol</Heading>
                        <Hint icon={ null }>Select one of the following inbound protocol</Hint>
                        { availableDefaultTemplates.map((temp, index) => (
                            <SelectionCard
                                inline
                                id={ temp.id }
                                key={ index }
                                header={ temp.name }
                                image={ InboundProtocolLogos[temp.image] }
                                onClick={ (): void => handleInboundProtocolSelection(temp) }
                                selected={ selectedTemplate?.id === temp.id }
                            />))
                        }
                    </Grid.Column>
                </Grid.Row>
            }
            {
                !isApplicationTemplateRequestLoading && availableTemplates.length > 0 &&
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h4">Templates</Heading>
                        <Hint icon={ null }>Get the inbound protocol settings from the template</Hint>
                        { availableTemplates.map((temp, index) => (
                            <SelectionCard
                                inline
                                id={ temp.id }
                                key={ index }
                                header={ temp.name }
                                image={
                                    ApplicationManagementUtils.findIcon(temp.image, ApplicationTemplateIllustrations)
                                }
                                onClick={ (): void => handleInboundProtocolSelection(temp) }
                                selected={ selectedTemplate?.id === temp.id }
                            />))
                        }
                    </Grid.Column>
                </Grid.Row>
            }
            {
                availableDefaultTemplates.length === 0 && availableTemplates.length === 0 &&
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <EmptyPlaceholder
                            title="No templates available"
                            subtitle="All the protocols have been configured"
                        />
                    </Grid.Column>
                </Grid.Row>
            }
        </Grid>
    );
};
