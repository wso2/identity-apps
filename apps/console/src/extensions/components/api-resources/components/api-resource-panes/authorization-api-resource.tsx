/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

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
import { ExtendedFeatureConfigInterface } from "../../../../configs/models";
import {
    APIResourcePanesCommonPropsInterface
} from "../../models";

/**
 * Prop-types for the Authorization part of the edit API Resource page component.
 */
type AuthorizationAPIResourceInterface = SBACInterface<ExtendedFeatureConfigInterface> & 
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
