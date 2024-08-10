/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode, useMemo } from "react";
import { Grid } from "semantic-ui-react";
import { ApplicationTabIDs } from "../../admin.extensions.v1";
import useApplicationTemplateMetadata from "../hooks/use-application-template-metadata";
import { ApplicationEditTabMetadataInterface } from "../models/templates";

/**
 * Prop types of the `ApplicationTabComponentsFilter` component.
 */
export interface ApplicationTabComponentsFilterPropsInterface extends IdentifiableComponentInterface {
    /**
     * Current tab id.
     */
    tabId: ApplicationTabIDs;
}

/**
 * Application tab components filtering component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationTabComponentsFilter: FunctionComponent<
    PropsWithChildren<ApplicationTabComponentsFilterPropsInterface>
> = ({
    tabId,
    children,
    "data-componentid": _componentId = "application-tab-components-filter"
}: PropsWithChildren<ApplicationTabComponentsFilterPropsInterface>): ReactElement => {

    const {
        templateMetadata,
        isTemplateMetadataRequestLoading
    } = useApplicationTemplateMetadata();

    /**
     * Extract the data-component IDs that need to be hidden in the current application tab.
     */
    const hiddenComponents: string[] = useMemo(() => {
        let componentList: string[] = [];

        templateMetadata?.edit?.tabs?.forEach((tab: ApplicationEditTabMetadataInterface) => {
            if (tab?.id === tabId) {
                if (tab?.hiddenComponents
                    && Array.isArray(tab?.hiddenComponents)
                    && tab?.hiddenComponents?.length > 0) {
                    componentList = tab?.hiddenComponents;
                }
            }
        });

        return componentList;
    }, [ templateMetadata, tabId ]);

    const renderTabContents = (): ReactElement => {
        if (isTemplateMetadataRequestLoading || !hiddenComponents) {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <ContentLoader inline="centered" active/>
                    </Grid.Column>
                </Grid.Row>
            );
        } else if (hiddenComponents?.length === 0) {
            return (
                <>
                    { children }
                </>
            );
        } else {
            return (
                <>
                    {
                        React.Children.map(children, (child: ReactNode) => {
                            const componentId: string = child?.["props"]?.["data-componentid"];

                            if (componentId && hiddenComponents?.includes(componentId)) {
                                return null;
                            }

                            return child;
                        })
                    }
                </>
            );
        }
    };

    return renderTabContents();
};
