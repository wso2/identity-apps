/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { FormValue, Forms, Field, Validation } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { MessageWithIcon } from "@wso2is/react-components";
import { addAlert } from "@wso2is/core/store";
import {
    getUserStores,
    UserStoreListItem
} from "../../../../../features/userstores";

/**
 * Prop types of the general user store details component
 */
interface GeneralUserStoreDetailsPropsInterface extends TestableComponentInterface {
    /**
     * Flag to hold the submit state.
     */
    triggerSubmit: boolean;
    /**
     * Callback function to handle basic details submit.
     */
    handleBasicDetailsSubmit?: (values: Map<string, FormValue>) => void;
    /**
     * Callback to handle user store type change.
     */
    handleUserStoreTypeChange?: (userStoreType: string) => void;
    /**
     * User store type.
     */
    userStoreType?: string;
}

/**
 * This component renders the general user store details component.
 *
 * @param {GeneralUserStoreDetailsPropsInterface} props - Props injected to the component.
 *
 * @returns {React.ReactElement}
 */
export const GeneralUserStoreDetails: FunctionComponent<GeneralUserStoreDetailsPropsInterface> = (
    props: GeneralUserStoreDetailsPropsInterface
): ReactElement => {

    const {
        triggerSubmit,
        handleBasicDetailsSubmit,
        userStoreType,
        handleUserStoreTypeChange,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const userStoreOptions = [
        {
            "data-testid": `${ testId }-create-user-store-form-user-store-ldap-option-radio-button`,
            label: "LDAP",
            value: "LDAP"
        },
        {
            "data-testid": `${ testId }-create-user-store-form-user-store-ad-option-radio-button`,
            label: "Active Directory",
            value: "AD"
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
                            type="text"
                            name="name"
                            label="Name"
                            requiredErrorMessage="This field cannot be empty as this is the unique identifier of the
                            user store"
                            required={ true }
                            placeholder="Enter the name of the user store"
                            minLength={ 3 }
                            maxLength={ 50 }
                            width={ 14 }
                            data-testid={ `${ testId }-user-store-name-input` }
                            hint="This will appear as the name of the  remote user store that you connect."
                            validation={ async (value: FormValue, validation: Validation) => {
                                let userStores: UserStoreListItem[] = null;
                                try {
                                    userStores = await getUserStores(null);
                                } catch (error) {
                                    dispatch(addAlert(
                                        {
                                            description: error?.description
                                                || t("console:manage.features.userstores.notifications." +
                                                    "fetchUserstores.genericError" +
                                                    ".description"),
                                            level: AlertLevels.ERROR,
                                            message: error?.message
                                                || t("console:manage.features.userstores.notifications." +
                                                    "fetchUserstores.genericError.message")
                                        }
                                    ));
                                }

                                if (userStores.find((userstore: UserStoreListItem) => userstore.name === value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("console:manage.features.userstores.forms.general." +
                                            "name.validationErrorMessages.alreadyExistsErrorMessage")
                                    );
                                }
                            }
                            }
                        />
                        <Field
                            requiredErrorMessage={ null }
                            type="text"
                            name="description"
                            label="Description"
                            required={ false }
                            placeholder="Enter the description of the user store"
                            maxLength={ 300 }
                            minLength={ 3 }
                            width={ 14 }
                            data-testid={ `${ testId }-user-store-description-textarea` }
                        />
                        <Field
                            type="radio"
                            label="Remote user store type"
                            name="userStoreType"
                            default="createPw"
                            listen={ (values) => {
                                handleUserStoreTypeChange(values.get("userStoreType").toString());
                            } }
                            children={ userStoreOptions }
                            value={ userStoreType ?? "LDAP" }
                            tabIndex={ 6 }
                        />
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={ 14 }>
                                    <MessageWithIcon
                                        content="Note that you will be only granted READ access to this user store
                                        in Asgardeo. So you won’t be able to update any attributes of the user accounts
                                        that you onboard."
                                        type="info"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
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
