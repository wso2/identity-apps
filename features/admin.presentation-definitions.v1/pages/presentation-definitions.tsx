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

import { Show } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertInterface, AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, PageLayout, PrimaryButton, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { PresentationDefinitionList } from "../components/presentation-definition-list";
import AddPresentationDefinitionWizard from "../components/wizard/add-presentation-definition";
import { useGetPresentationDefinitions } from "../hooks/use-get-presentation-definitions";

type PresentationDefinitionsPageProps = IdentifiableComponentInterface;

/**
 * Presentation Definitions list page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const PresentationDefinitions: FunctionComponent<PresentationDefinitionsPageProps> = ({
    "data-componentid": componentId = "presentation-definitions"
}: PresentationDefinitionsPageProps): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const dispatch: Dispatch = useDispatch();

    const presentationDefinitionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.presentationDefinitions
    );

    const [ isAddWizardOpen, setIsAddWizardOpen ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState<boolean>(false);

    const {
        data: definitionList,
        isLoading,
        error,
        mutate: mutateList
    } = useGetPresentationDefinitions(true);

    useEffect(() => {
        if (error) {
            dispatch(addAlert<AlertInterface>({
                description: t("presentationDefinitions:notifications.fetchDefinitions.error.description"),
                level: AlertLevels.ERROR,
                message: t("presentationDefinitions:notifications.fetchDefinitions.error.message")
            }));
        }
    }, [ error ]);

    useEffect(() => {
        if (isListUpdated) {
            mutateList();
            setListUpdated(false);
        }
    }, [ isListUpdated ]);

    const definitions: any[] = definitionList?.presentationDefinitions ?? [];

    return (
        <PageLayout
            pageTitle={ t("presentationDefinitions:page.title") }
            title={ t("presentationDefinitions:page.heading") }
            description={
                (<>
                    { t("presentationDefinitions:page.description") }
                    <DocumentationLink
                        link={ getLink("develop.presentationDefinitions.learnMore") }
                        showEmptyLink={ false }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>)
            }
            data-componentid={ `${componentId}-page-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            action={
                definitions.length > 0 && !isLoading && (
                    <Show when={ presentationDefinitionsFeatureConfig?.scopes?.create }>
                        <PrimaryButton
                            onClick={ () => setIsAddWizardOpen(true) }
                            data-componentid={ `${componentId}-add-button` }
                        >
                            <Icon name="add" />
                            { t("presentationDefinitions:buttons.addDefinition") }
                        </PrimaryButton>
                    </Show>
                )
            }
        >
            <PresentationDefinitionList
                isLoading={ isLoading }
                list={ definitions }
                mutateList={ () => setListUpdated(true) }
                onAddClick={ () => setIsAddWizardOpen(true) }
                data-componentid={ `${componentId}-list` }
            />

            { isAddWizardOpen && (
                <AddPresentationDefinitionWizard
                    closeWizard={ () => setIsAddWizardOpen(false) }
                    data-componentid={ `${componentId}-add-wizard` }
                />
            ) }
        </PageLayout>
    );
};

export default PresentationDefinitions;
