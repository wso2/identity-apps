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

import { FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import {
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
    APIResourcePanesCommonPropsInterface
} from "../../models";

/**
 * Prop-types for the Authorization part of the edit API Resource page component.
 */
type AuthorizationAPIResourceInterface = SBACInterface<FeatureConfigInterface> &
    IdentifiableComponentInterface & APIResourcePanesCommonPropsInterface;

/**
 * Authorization part of the edit API Resource page.
 *
 * @param props - Props injected to the component.
 * @returns Authorization part of the edit API Resource page component
 */
export const AuthorizationAPIResource: FunctionComponent<AuthorizationAPIResourceInterface> = (
    props: AuthorizationAPIResourceInterface
): ReactElement => {

    const {
        apiResourceData,
        isAPIResourceDataLoading,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    return (
        !isAPIResourceDataLoading
            ? (
                <>
                    {
                        <EmphasizedSegment padded="very">
                            <Form
                                data-componentid={ `${componentId}-form` }
                                onSubmit={ () => null }
                                id={ `${componentId}-form` }
                                uncontrolledForm={ false }
                            >
                                <Field.Checkbox
                                    ariaLabel="authorization"
                                    name="authorization"
                                    label={ t("extensions:develop.apiResource.tabs.authorization.form" +
                                        ".fields.authorize.label") }
                                    hint={
                                        (<>
                                            { t("extensions:develop.apiResource.tabs.authorization.form" +
                                                ".fields.authorize.hint") }
                                            <DocumentationLink
                                                link={ getLink("develop.apiResources.addAPIResource." +
                                                    "requiredAuthorization.learnMore") }
                                            >
                                                { t("extensions:common.learnMore") }
                                            </DocumentationLink>
                                        </>)
                                    }
                                    width={ 16 }
                                    defaultValue={ apiResourceData.requiresAuthorization }
                                    readOnly={ true }
                                    data-componentid={ `${componentId}-authorize` }
                                />
                            </Form>
                        </EmphasizedSegment>
                    }
                </>
            )
            : <ContentLoader dimmer />
    );
};

/**
 * Default props for the component.
 */
AuthorizationAPIResource.defaultProps = {
    "data-componentid": "authorization-api-resource"
};
