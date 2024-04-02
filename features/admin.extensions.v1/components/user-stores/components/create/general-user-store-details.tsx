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

import { isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, RadioChild, Validation } from "@wso2is/forms";
import { FeatureConfigInterface } from "../../../../../admin.core.v1";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { RemoteUserStoreAccessTypes, RemoteUserStoreConstants, RemoteUserStoreTypes } from "../../constants";

/**
 * Prop types of the general user store details component
 */
interface GeneralUserStoreDetailsPropsInterface extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface {
    /**
     * Flag to hold the submit state.
     */
    triggerSubmit: boolean;
    /**
     * Callback function to handle basic details submit.
     */
    handleBasicDetailsSubmit: (values: Map<string, FormValue>) => void;
    /**
     * Callback to handle user store type change.
     */
    handleUserStoreTypeChange: (userStoreAccessType: RemoteUserStoreTypes) => void;
    /**
     * Callback to handle user store access type change.
     */
    handleUserStoreAccessTypeChange: (userStoreType: RemoteUserStoreAccessTypes) => void;
    /**
     * User store type.
     */
    userStoreType?: string;
    /**
     * Checks whether userstore name entered is valid.
     */
    setUserStoreNameValid: (isValid: boolean) => void;
}

/**
 * This component renders the general user store details component.
 *
 * @param props - Props injected to the component.
 *
 * @returns General User Store Details.
 */
export const GeneralUserStoreDetails: FunctionComponent<GeneralUserStoreDetailsPropsInterface> = (
    props: GeneralUserStoreDetailsPropsInterface
): ReactElement => {

    const {
        triggerSubmit,
        featureConfig,
        handleBasicDetailsSubmit,
        userStoreType,
        handleUserStoreAccessTypeChange,
        handleUserStoreTypeChange,
        setUserStoreNameValid,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const userStoreOptions: RadioChild[] = [
        {
            "data-testid": `${testId}-create-user-store-form-user-store-ldap-option-radio-button`,
            label: t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form.fields." +
                "userStoreType.types.ldap.label"),
            value: RemoteUserStoreTypes.LDAP
        },
        {
            "data-testid": `${testId}-create-user-store-form-user-store-ad-option-radio-button`,
            label: t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form.fields." +
                "userStoreType.types.ad.label"),
            value: RemoteUserStoreTypes.ActiveDirectory
        }
    ];

    const accessTypeOptions: RadioChild[] = [
        {
            "data-componentid": `${testId}-create-user-store-form-access-type-read-only-option-radio-button`,
            hint: {
                content: t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form." +
                    "fields.accessType.types.readOnly.hint")
            },
            label: t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form.fields." +
                "accessType.types.readOnly.label"),
            value: RemoteUserStoreAccessTypes.ReadOnly
        },
        {
            "data-componentid": `${testId}-create-user-store-form-access-type-read-write-option-radio-button`,
            hint: {
                content: t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form." +
                    "fields.accessType.types.readWrite.hint")
            },
            label: t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form.fields." +
                "accessType.types.readWrite.label"),
            value: RemoteUserStoreAccessTypes.ReadWrite
        }
    ];

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Forms
                        submitState={ triggerSubmit }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            handleBasicDetailsSubmit(values);
                        } }
                    >
                        <Field
                            className="uppercase"
                            type="text"
                            name="name"
                            label={ 
                                t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings." +
                                "form.fields.name.label")
                            }
                            requiredErrorMessage={ 
                                t("extensions:manage.features.userStores.create.pageLayout.steps." +
                                "generalSettings.form.fields.name.requiredErrorMessage")
                            }
                            required={ true }
                            placeholder={ 
                                t("extensions:manage.features.userStores.create.pageLayout.steps." +
                                "generalSettings.form.fields.name.placeholder")
                            }
                            minLength={ 3 }
                            maxLength={ 50 }
                            width={ 14 }
                            data-testid={ `${testId}-user-store-name-input` }
                            hint={ 
                                t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings." +
                                "form.fields.name.hint")
                            }
                            listen={ (values: Map<string, FormValue>) => {
                                setUserStoreNameValid(values.get("name").length > 0);
                                values.set("name", (values.get("name").toString().toUpperCase()));
                            } }
                            validation={ (value: string, validation: Validation) => {
                                if (!isEmpty(value)) {
                                    // Regular expression to validate having / and _ in the user store name
                                    const regExpInvalidSymbols: RegExp = new RegExp("^[^_/]+$");

                                    // Regular expression to validate having all symbols in the user store name
                                    const regExpAllSymbols: RegExp = new RegExp("^([^a-zA-Z0-9]+$)");

                                    // Already created/restricted user store names
                                    const restrictedUserstores: string[] = [
                                        RemoteUserStoreConstants.PRIMARY_USER_STORE_NAME,
                                        RemoteUserStoreConstants.FEDERATION_USER_STORE_NAME,
                                        RemoteUserStoreConstants.DEFAULT_USER_STORE_NAME
                                    ];

                                    // Reserved user store names.
                                    const reservedUserstores: string[] = [
                                        RemoteUserStoreConstants.INTERNAL_USER_STORE_NAME,
                                        RemoteUserStoreConstants.APPLICATION_USER_STORE_NAME
                                    ];

                                    let isMatch: boolean = true;
                                    let validationErrorMessage: string;

                                    if (!regExpInvalidSymbols.test(value)) {
                                        isMatch = false;
                                        validationErrorMessage = t("extensions:manage.features.userStores.edit."
                                            + "general.form.validations.invalidSymbolsErrorMessage");
                                    } else if ((restrictedUserstores.includes(value.trim().toUpperCase()))) {
                                        isMatch = false;
                                        validationErrorMessage = t("extensions:manage.features.userStores.edit."
                                            + "general.form.validations.restrictedNamesErrorMessage", { name: value });
                                    } else if ((reservedUserstores.includes(value.trim().toUpperCase()))) {
                                        isMatch = false;
                                        validationErrorMessage = t("extensions:manage.features.userStores.edit."
                                            + "general.form.validations.reservedNamesErrorMessage", { name: value });
                                    } else if (regExpAllSymbols.test(value)) {
                                        isMatch = false;
                                        validationErrorMessage = t("extensions:manage.features.userStores.edit."
                                            + "general.form.validations.allSymbolsErrorMessage");
                                    } else {
                                        isMatch = true;
                                    }

                                    if (!isMatch) {
                                        setUserStoreNameValid(false);
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            validationErrorMessage
                                        );
                                    }
                                }
                            } }
                        />
                        <Field
                            requiredErrorMessage={ null }
                            type="text"
                            name="description"
                            label={ 
                                t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings."
                                + "form.fields.description.label")
                            }
                            required={ false }
                            placeholder={ 
                                t("extensions:manage.features.userStores.create.pageLayout.steps."
                                + "generalSettings.form.fields.description.placeholder")
                            }
                            maxLength={ 300 }
                            minLength={ 3 }
                            width={ 14 }
                            data-testid={ `${testId}-user-store-description-textarea` }
                        />
                        <Field
                            type="radio"
                            label={ 
                                t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings."
                                + "form.fields.userStoreType.label")
                            }
                            name="userStoreType"
                            default="createPw"
                            listen={ (values: Map<string, RemoteUserStoreTypes>) => {
                                handleUserStoreTypeChange(values.get("userStoreType"));
                            } }
                            children={ userStoreOptions }
                            value={ userStoreType ?? "LDAP" }
                        />
                        <Field
                            type="radio"
                            label={ 
                                t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings."
                                + "form.fields.accessType.label")
                            }
                            name="accessType"
                            default="createPw"
                            listen={ (values: Map<string, RemoteUserStoreAccessTypes>) => {
                                handleUserStoreAccessTypeChange(values.get("accessType"));
                            } }
                            children={ accessTypeOptions }
                            value={ userStoreType ?? "true" }
                            tabIndex={ 3 }
                            hidden={ 
                                !isFeatureEnabled(featureConfig?.userStores,
                                    RemoteUserStoreConstants.FEATURE_DICTIONARY.get("USERSTORES_READ_WRITE_USERSTORES"))
                            }
                        />
                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
GeneralUserStoreDetails.defaultProps = {
    "data-testid": "asgardeo-customer-userstore-general-details"
};
