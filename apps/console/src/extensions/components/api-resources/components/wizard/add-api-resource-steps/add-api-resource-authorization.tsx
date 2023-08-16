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
import { DocumentationLink, Message, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ExtendedFeatureConfigInterface } from "../../../../../configs/models";
import { AuthorizationAPIResourceInterface } from "../../../models";

/**
 * Prop-types for the add API resources wizard authorization component.
 */
interface AddAPIResourceAuthorizationInterface extends SBACInterface<ExtendedFeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Trigger submission
     */
    triggerSubmission: (submitFunctionCb: () => void) => void;
    /**
     * initial basic details
     */
    initalRequiredAuthorizationValue: boolean;
    /**
     * trigger submission
     */
    setRequiredAuthorization: (requiresAuthorization: boolean) => void;
    /**
     * Submit callback
     */
    submitCallback?: (requiresAuthorization: boolean) => void;
}

const FORM_ID: string = "apiResource-authorization";

/**
 * Add API Resource authorization component.
 *
 * @param props - Props injected to the component.
 * @returns Add API Resource authorization component
 */
export const AddAPIResourceAuthorization: FunctionComponent<AddAPIResourceAuthorizationInterface> = (
    props: AddAPIResourceAuthorizationInterface
): ReactElement => {

    const {
        triggerSubmission,
        initalRequiredAuthorizationValue,
        setRequiredAuthorization,
        submitCallback,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     */
    const submitAuthorization = (values: AuthorizationAPIResourceInterface): void => {
        setRequiredAuthorization(values.authorization);

        submitCallback && submitCallback(values.authorization);
    };

    return (
        <Form
            data-testid={ `${componentId}-form` }
            onSubmit={ submitAuthorization }
            triggerSubmit={ (submitFunction: () => void) => triggerSubmission(submitFunction) }
            id={ FORM_ID }
            uncontrolledForm={ false }
        >
            <Message
                type="info"
                content={ 
                    (<>
                        { t("extensions:develop.apiResource.wizard.addApiResource.steps.authorization.form." + 
                            "rbacMessage") }
                        <DocumentationLink
                            link={ getLink("develop.apiResources.addAPIResource.rbacInfoBox.learnMore") }
                        >
                            { t("extensions:common.learnMore") }
                        </DocumentationLink>
                    </>)                   
                }
            />
            <Field.Checkbox
                ariaLabel="authorization"
                name="authorization"
                label={ t("extensions:develop.apiResource.wizard.addApiResource.steps.authorization.form.fields." + 
                    "authorize.label") }
                tabIndex={ 3 }
                hint={
                    (<>
                        <Trans 
                            i18nKey= { "extensions:develop.apiResource.wizard.addApiResource.steps.authorization." + 
                                "form.fields.authorize.hint" }>
                            If checked, it will be mandatory to add authorization when configuring the application to 
                            consume the API resource. <b>This field cannot be edited once created.</b>
                        </Trans>
                        <DocumentationLink
                            link={ getLink("develop.apiResources.addAPIResource.requiredAuthorization.learnMore") }
                        >
                            { t("extensions:common.learnMore") }
                        </DocumentationLink>
                    </>)
                }
                width={ 16 }
                defaultValue={ initalRequiredAuthorizationValue }           
                data-componentid={ `${componentId}-authorize` }
            />
        </Form>
    );
};

/**
 * Default props for the component.
 */
AddAPIResourceAuthorization.defaultProps = {
    "data-componentid": "add-api-resource-authorizaiton"
};
