/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { GridLayout, PageLayout, Section } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Label, Ref } from "semantic-ui-react";
import { AppConstants, history } from "../../core";

/**
 * Props for my account settings page.
 */
type MyAccountSettingsPageInterface = IdentifiableComponentInterface;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const ValidationConfigPage: FunctionComponent<MyAccountSettingsPageInterface> = (
    props: MyAccountSettingsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);

    const { t } = useTranslation();

    /**
     * Handle connector advance setting selection.
     */
    const handleSelection = () => {
        history.push(AppConstants.getPaths().get("VALIDATION_CONFIG_EDIT"));
    };

    return (
        <PageLayout
            pageTitle={ "Validation configuration" }
            title={ (
                <>
                    { "Validation Configuration" }
                    <Label size="medium" className="preview-label ml-2">
                        { t("common:preview") }
                    </Label>
                </>
            ) }
            description={ "Validation configuration related settings." }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <GridLayout
                    isLoading={ false }
                    showTopActionPanel={ false }
                >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 12 }>
                            <Section
                                data-componentid={ `${componentId}-settings-section` }
                                description={ "Customize password validation rules for your users." }
                                icon={ null }
                                header={ "Password" }
                                onPrimaryActionClick={ handleSelection }
                                primaryAction={ "Configure" }
                            >
                                <Divider hidden/>
                            </Section>
                        </Grid.Column>
                    </Grid.Row>
                </GridLayout>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ValidationConfigPage.defaultProps = {
    "data-componentid": "validation-config-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ValidationConfigPage;
