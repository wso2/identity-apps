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

import Button from "@oxygen-ui/react/Button";
import Grid from "@oxygen-ui/react/Grid";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form/src";
import { FormValue } from "@wso2is/forms";
import { Heading, useWizardAlert } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Modal } from "semantic-ui-react";
import { addUser } from "../../api";
import { hiddenSchemas } from "../../constants/user-management-constants";

interface AddUserWizardPropsInterface extends IdentifiableComponentInterface {
    closeWizard: () => void;
    onSuccessfulUserAddition?: (id: string) => void;
}

/**
 * User creation wizard.
 *
 * @returns User creation wizard.
 */
export const AddUserWizard: FunctionComponent<AddUserWizardPropsInterface> = (
    props: AddUserWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        [ "data-componentid" ]: componentId,
        onSuccessfulUserAddition
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ alert, , alertComponent ] = useWizardAlert();

    const profileSchemas: ProfileSchemaInterface[] = useSelector(
        (state: AppState) => state.profile.profileSchemas);


    const displayedAttributes: ProfileSchemaInterface[] = useMemo(() => {
        return profileSchemas.filter((schema: ProfileSchemaInterface) => {
            let resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

            if (schema?.profiles?.console?.supportedByDefault !== undefined) {
                resolveSupportedByDefaultValue = schema?.profiles?.console?.supportedByDefault;
            }

            if (hiddenSchemas.includes(schema.name)) {
                return false;
            }

            if (resolveSupportedByDefaultValue && !schema.multiValued) {
                return true;
            }

            return false;
        });
    }, [ profileSchemas ]);

    let submit: any;

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const handleSubmit = async (values: Map<string, FormValue>) => {
        setIsSubmitting(true);
        const userDetails: any = {
            attributes: values,
            org_id: "456e8400-e29b-41d4-a716-446655440001",
            type: "person"
        };

        addUser(userDetails)
            .then((response: AxiosResponse) => {
                if (response.status === 202) {
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUserPendingApproval.success.description"
                        ),
                        level: AlertLevels.WARNING,
                        message: t(
                            "users:notifications.addUserPendingApproval.success.message"
                        )
                    }));
                } else {
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUser.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "users:notifications.addUser.success.message"
                        )
                    }));
                }

                onSuccessfulUserAddition(response.data.id);
            })
            .catch((error: AxiosError) => {
                if (!error.response || error.response.status === 401) {
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUser.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:notifications.addUser.error.message"
                        )
                    }));
                } else {
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUser.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:notifications.addUser.genericError.message"
                        )
                    }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
                closeWizard();
            });
    };

    return (
        <Modal
            data-componentid={ componentId }
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("extensions:manage.users.wizard.addUser.title") }
                <Heading as="h6">
                    { t("extensions:manage.users.wizard.addUser.subtitle") }
                </Heading>
            </Modal.Header>
            <Modal.Content scrolling>
                <Grid container>
                    <Grid xs={ 8 }>
                        { alert && alertComponent }
                        <FinalForm
                            keepDirtyOnReinitialize={ true }
                            onSubmit={ handleSubmit }
                            render={ ({ handleSubmit }: FormRenderProps) => {
                                submit = handleSubmit;

                                return (
                                    <form
                                        id="user-profile-form"
                                        onSubmit={ handleSubmit }
                                        className="user-profile-form"
                                    >
                                        <FinalFormField
                                            data-componentId={ `${ componentId }-profile-form-username-input` }
                                            key={ "username" }
                                            ariaLabel="username"
                                            type="text"
                                            name={ "username" }
                                            label={ "Username" }
                                            component={ TextFieldAdapter }
                                            className="mb-3"
                                        />
                                        <FinalFormField
                                            data-componentId={ `${ componentId }-profile-form-password-input` }
                                            key={ "password" }
                                            ariaLabel="password"
                                            type="password"
                                            name={ "password" }
                                            label={ "Password" }
                                            component={ TextFieldAdapter }
                                            className="mb-3"
                                        />
                                        <FinalFormField
                                            data-componentId={ `${ componentId }-profile-form-givenname-input` }
                                            key={ "givenname" }
                                            ariaLabel="givenname"
                                            type="text"
                                            name={ "name.givenname" }
                                            label={ "First Name" }
                                            component={ TextFieldAdapter }
                                            className="mb-3"
                                        />
                                        <FinalFormField
                                            data-componentId={ `${ componentId }-profile-form-lastname-input` }
                                            key={ "lastname" }
                                            ariaLabel="lastname"
                                            type="text"
                                            name={ "name.lastname" }
                                            label={ "Last Name" }
                                            component={ TextFieldAdapter }
                                            className="mb-3"
                                        />
                                        {
                                            displayedAttributes.map((attribute: ProfileSchemaInterface) => {
                                                return (
                                                    <FinalFormField
                                                        data-componentId={
                                                            `${ componentId }-profile-form-${ attribute.name }-input` }
                                                        key={ attribute.name }
                                                        ariaLabel={ attribute.name }
                                                        type="text"
                                                        name={ attribute.name }
                                                        label={ attribute.displayName }
                                                        component={ TextFieldAdapter }
                                                        className="mb-3"
                                                    />
                                                );
                                            })
                                        }
                                    </form>
                                );
                            } }
                        />
                    </Grid>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Grid container>
                    <Grid xs={ 6 } textAlign={ "left" }>
                        <Button
                            data-componentid={ `${ componentId }-cancel-button` }
                            variant="text"
                            onClick={ () => {
                                closeWizard();
                            } }
                            disabled={ isSubmitting }

                        >
                            { t("common:cancel") }
                        </Button>
                    </Grid>
                    <Grid xs={ 6 } textAlign={ "right" }>
                        <Button
                            data-componentid={ `${ componentId }-finish-button` }
                            variant="contained"
                            onClick={ (event: any) => {
                                submit(event);
                            } }
                            loading={ isSubmitting }
                            disabled={ isSubmitting }
                        >
                            { t("extensions:manage.features.user.addUser.finish") }
                        </Button>
                    </Grid>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
