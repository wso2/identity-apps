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
import { EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { ApplicationEditForm as ApplicationInboundProtocolEditForm } from "./application-inbound-protocol-edit-form";
import { ApplicationEditForm as ApplicationMainEditForm } from "./application-main-edit-form";
import {
    ApplicationInterface
} from "../../models";
import { ApplicationEditTabMetadataInterface } from "../../models/application-templates";
import { DynamicFormInterface, SupportedAPIList } from "../../models/dynamic-fields";
import "./application-edit-form.scss";

/**
 * Prop types of the `ApplicationEditForm` component.
 */
export interface ApplicationEditFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The tab metadata to be used for the application edit form generation.
     */
    tab: ApplicationEditTabMetadataInterface
    /**
     * Current editing application data.
     */
    application: ApplicationInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Dynamic application edit form component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationEditForm: FunctionComponent<ApplicationEditFormPropsInterface> = (
    props: ApplicationEditFormPropsInterface
): ReactElement => {
    const {
        tab,
        application,
        isLoading,
        onUpdate,
        readOnly,
        ["data-componentid"]: componentId
    } = props;

    const formSubmissions: Partial<{ [api in SupportedAPIList]: ((e: MouseEvent<HTMLButtonElement>) => void) }> = {};

    const { t } = useTranslation();

    const renderForms = () => {
        return tab?.forms?.map((form: DynamicFormInterface) => {
            switch(form?.api) {
                case SupportedAPIList.APPLICATION_PATCH:
                    return (
                        <ApplicationMainEditForm
                            formMetadata={ form }
                            application={ application }
                            isLoading={ isLoading }
                            onUpdate={ onUpdate }
                            readOnly={ readOnly }
                            data-componentid={ componentId }
                            hideSubmitBtn={ tab?.singleForm }
                            formSubmission={
                                (submissionFunction: (e: MouseEvent<HTMLButtonElement>) => void) =>
                                    formSubmissions[form?.api] = submissionFunction
                            }
                        />
                    );
                case SupportedAPIList.APPLICATION_SAML_INBOUND_PROTOCOL_PUT:
                    return (
                        <ApplicationInboundProtocolEditForm
                            formMetadata={ form }
                            application={ application }
                            isLoading={ isLoading }
                            onUpdate={ onUpdate }
                            readOnly={ readOnly }
                            data-componentid={ componentId }
                            hideSubmitBtn={ tab?.singleForm }
                            formSubmission={
                                (submissionFunction: (e: MouseEvent<HTMLButtonElement>) => void) =>
                                    formSubmissions[form?.api] = submissionFunction
                            }
                        />
                    );
            }
        });
    };

    return (
        <EmphasizedSegment
            className="application-dynamic-edit-form"
            data-componentid={ `${componentId}-forms` }
            padded="very"
        >
            { renderForms() }
            {
                tab?.singleForm && (
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    type="submit"
                                    data-componentid={ `${componentId}-update-button` }
                                    onClick={ (e: MouseEvent<HTMLButtonElement>) => Object.values(
                                        formSubmissions).forEach(
                                        (func: (e: MouseEvent<HTMLButtonElement>) => void) => func(e)) }
                                >
                                    { t("common:update") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application edit form component.
 */
ApplicationEditForm.defaultProps = {
    "data-componentid": "application-edit-form"
};
