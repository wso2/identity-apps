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

import Code from "@oxygen-ui/react/Code";
import Divider from "@oxygen-ui/react/Divider";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    CheckboxFieldAdapter,
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    TextFieldAdapter
} from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import React, {
    ForwardRefExoticComponent,
    ForwardedRef,
    MutableRefObject,
    ReactElement,
    RefAttributes,
    forwardRef,
    useImperativeHandle,
    useRef
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ConfigurationsFormValuesInterface } from "../../models/ui";
import { getIsReadGroupsFeatureEnabled } from "../../utils/ui-utils";
import "./configurations-form.scss";

interface ConfigurationsFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * User store manager.
     */
    userStoreManager:
        | RemoteUserStoreManagerType.WSOutboundUserStoreManager
        | RemoteUserStoreManagerType.RemoteUserStoreManager;
    /**
     * Whether the form is read only or not.
     */
    isReadOnly: boolean;
    /**
     * Callback to be called on form submit.
     * @param values - Form values.
     * @returns void
     */
    onSubmit: (values: ConfigurationsFormValuesInterface) => void;
    /**
     * Initial values for the form.
     */
    initialValues?: Partial<ConfigurationsFormValuesInterface>;
}

export interface ConfigurationsFormRef {
    triggerSubmit: () => void;
}

const ConfigurationsForm: ForwardRefExoticComponent<RefAttributes<ConfigurationsFormRef> &
    ConfigurationsFormPropsInterface> = forwardRef((
        {
            userStoreManager,
            isReadOnly,
            onSubmit,
            initialValues,
            ["data-componentid"]: componentId = "user-store-configurations-form"
        }: ConfigurationsFormPropsInterface,
        ref: ForwardedRef<ConfigurationsFormRef>
    ): ReactElement => {
        const usernameClaimUri: string = ClaimManagementConstants.USER_NAME_CLAIM_URI;
        const userIDClaimUri: string = ClaimManagementConstants.USER_ID_CLAIM_URI;

        const triggerFormSubmit: MutableRefObject<() => void> = useRef<(() => void) | null>(null);

        const { t } = useTranslation();

        const userStoreFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
            state?.config?.ui?.features?.userStores);
        const isReadGroupsFeatureEnabled: boolean = getIsReadGroupsFeatureEnabled(
            userStoreFeatureConfig, userStoreManager);

        // Expose triggerFormSubmit to the parent via the ref.
        useImperativeHandle(
            ref,
            () => ({
                triggerSubmit: () => {
                    if (triggerFormSubmit.current) {
                        triggerFormSubmit.current();
                    }
                }
            }),
            []
        );

        /**
         * Validates the configuration form values and returns any validation errors.
         *
         * @param values - The form values to validate.
         * @returns An object containing validation errors, if any.
         */
        const validateForm = (
            values: ConfigurationsFormValuesInterface
        ): Partial<ConfigurationsFormValuesInterface> => {
            const errors: Partial<ConfigurationsFormValuesInterface> = {};

            if (!values.usernameMapping) {
                errors.usernameMapping = t("remoteUserStores:form.fields.usernameMapping.validation.required");
            }

            if (!values.userIdMapping) {
                errors.userIdMapping = t("remoteUserStores:form.fields.userIdMapping.validation.required");
            }

            if (values.readGroups && userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager) {
                if (!values.groupnameMapping) {
                    if (isReadGroupsFeatureEnabled) {
                        errors.groupnameMapping = t(
                            "remoteUserStores:form.fields.groupnameMapping.validation.readGroupsEnabled");
                    } else {
                        errors.groupnameMapping = t(
                            "remoteUserStores:form.fields.groupnameMapping.validation.required");
                    }
                }
                if (!values.groupIdMapping) {
                    if (isReadGroupsFeatureEnabled) {
                        errors.groupIdMapping = t(
                            "remoteUserStores:form.fields.groupIdMapping.validation.readGroupsEnabled");
                    } else {
                        errors.groupIdMapping = t(
                            "remoteUserStores:form.fields.groupIdMapping.validation.required");
                    }
                }
            }

            return errors;
        };

        /**
         * Renders the group attributes section based on the user store manager and read groups feature status.
         *
         * @returns The group attributes section.
         */
        const renderGroupAttributesSection = () => {
            if (!isReadGroupsFeatureEnabled
                && userStoreManager !== RemoteUserStoreManagerType.RemoteUserStoreManager) {
                return null;
            }

            return (
                <>
                    <Typography variant="h5">
                        { t("remoteUserStores:form.sections.groupAttributes") }
                    </Typography>
                    <Divider />

                    <FormSpy subscription={ { values: true } }>
                        { ({ values }: { values: ConfigurationsFormValuesInterface }) => {
                            const isReadGroupsEnabled: boolean = values?.readGroups;

                            return (
                                <Grid container spacing={ 2 } className="form-grid-container">
                                    { isReadGroupsFeatureEnabled && (
                                        <Grid xs={ 12 }>
                                            <FinalFormField
                                                label={ t(
                                                    "remoteUserStores:form.fields.readGroups.label"
                                                ) }
                                                name="readGroups"
                                                FormControlProps={ {
                                                    fullWidth: true,
                                                    margin: "dense"
                                                } }
                                                data-componentid={ `${componentId}-field-readGroups` }
                                                component={ CheckboxFieldAdapter }
                                                disabled={ isReadOnly }
                                                hint={
                                                    (<Hint className="hint" compact>
                                                        { t("remoteUserStores:form.fields.readGroups.helperText") }
                                                    </Hint>)
                                                }
                                            />
                                        </Grid>
                                    ) }

                                    { userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager && (
                                        <>
                                            <Grid xs={ 12 } md={ 4 }>
                                                <FormLabel
                                                    required={
                                                        isReadGroupsEnabled &&
                                                        userStoreManager ===
                                                            RemoteUserStoreManagerType.RemoteUserStoreManager
                                                    }
                                                    disabled={ isReadOnly || !isReadGroupsEnabled }
                                                >
                                                    { t(
                                                        "remoteUserStores:form.fields.groupnameMapping.label"
                                                    ) }
                                                </FormLabel>
                                            </Grid>
                                            <Grid xs={ 12 } md={ 6 }>
                                                <FinalFormField
                                                    FormControlProps={ {
                                                        margin: "dense"
                                                    } }
                                                    data-componentid={
                                                        `${componentId}-field-groupnameMapping`
                                                    }
                                                    name="groupnameMapping"
                                                    type="text"
                                                    placeholder={ t(
                                                        "remoteUserStores:form.fields.groupnameMapping.placeholder"
                                                    ) }
                                                    component={ TextFieldAdapter }
                                                    disabled={ isReadOnly || !isReadGroupsEnabled }
                                                    helperText={
                                                        (<Hint className="hint" compact>
                                                            { t("remoteUserStores:form.fields." +
                                                                "groupnameMapping.helperText") }
                                                        </Hint>)
                                                    }
                                                />
                                            </Grid>

                                            <Grid xs={ 12 } md={ 4 }>
                                                <FormLabel
                                                    required={
                                                        isReadGroupsEnabled &&
                                                        userStoreManager ===
                                                            RemoteUserStoreManagerType.RemoteUserStoreManager
                                                    }
                                                    disabled={ isReadOnly || !isReadGroupsEnabled }
                                                >
                                                    { t(
                                                        "remoteUserStores:form.fields.groupIdMapping.label"
                                                    ) }
                                                </FormLabel>
                                            </Grid>
                                            <Grid xs={ 12 } md={ 6 }>
                                                <FinalFormField
                                                    FormControlProps={ {
                                                        margin: "dense"
                                                    } }
                                                    ariaLabel="groupIdMapping"
                                                    data-componentid={
                                                        `${componentId}-field-groupIdMapping`
                                                    }
                                                    name="groupIdMapping"
                                                    type="text"
                                                    placeholder={ t(
                                                        "remoteUserStores:form.fields.groupIdMapping.placeholder"
                                                    ) }
                                                    component={ TextFieldAdapter }
                                                    disabled={ isReadOnly || !isReadGroupsEnabled }
                                                    helperText={
                                                        (<Hint className="hint" compact>
                                                            { t(
                                                                "remoteUserStores:form.fields.groupIdMapping.helperText"
                                                            ) }
                                                        </Hint>)
                                                    }
                                                />
                                            </Grid>
                                        </>
                                    ) }
                                </Grid>
                            );
                        } }
                    </FormSpy>
                </>
            );
        };

        return (
            <FinalForm
                onSubmit={ (values: ConfigurationsFormValuesInterface) => {
                    // Group mappings are only required for remote user stores.
                    if (userStoreManager !== RemoteUserStoreManagerType.RemoteUserStoreManager) {
                        delete values.groupnameMapping;
                        delete values.groupIdMapping;
                    }
                    onSubmit(values);
                } }
                validate={ validateForm }
                initialValues={ initialValues }
                render={ ({ handleSubmit }: FormRenderProps) => {
                    triggerFormSubmit.current = handleSubmit;

                    return (
                        <form onSubmit={ handleSubmit } className="configurations-form">
                            <Typography variant="h5">
                                { t("remoteUserStores:form.sections.userAttributes") }
                            </Typography>
                            <Divider />
                            <Grid container spacing={ 2 } className="form-grid-container">
                                <Grid xs={ 12 } md={ 4 }>
                                    <FormLabel required>
                                        { t("remoteUserStores:form.fields.usernameMapping.label") }
                                    </FormLabel>
                                    <br />
                                    <Code variant="caption">{ usernameClaimUri }</Code>
                                </Grid>
                                <Grid xs={ 12 } md={ 6 }>
                                    <FinalFormField
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        data-componentid={ `${componentId}-field-usernameMapping` }
                                        name="usernameMapping"
                                        type="text"
                                        placeholder={
                                            t("remoteUserStores:form.fields.usernameMapping.placeholder")
                                        }
                                        component={ TextFieldAdapter }
                                        disabled={ isReadOnly }
                                        helperText={
                                            (<Hint className="hint" compact>
                                                {
                                                    t("remoteUserStores:form.fields.usernameMapping.helperText")
                                                }
                                            </Hint>)
                                        }
                                    />
                                </Grid>

                                <Grid xs={ 12 } md={ 4 }>
                                    <FormLabel required>
                                        { t("remoteUserStores:form.fields.userIdMapping.label") }
                                    </FormLabel>
                                    <br />
                                    <Code variant="caption">{ userIDClaimUri }</Code>
                                </Grid>
                                <Grid xs={ 12 } md={ 6 }>
                                    <FinalFormField
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        data-componentid={ `${componentId}-field-userIdMapping` }
                                        name="userIdMapping"
                                        type="text"
                                        placeholder={ t("remoteUserStores:form.fields.userIdMapping.placeholder") }
                                        component={ TextFieldAdapter }
                                        disabled={ isReadOnly }
                                        helperText={
                                            (<Hint className="hint" compact>
                                                {
                                                    t("remoteUserStores:form.fields.userIdMapping.helperText")
                                                }
                                            </Hint>)
                                        }
                                    />
                                </Grid>
                            </Grid>

                            { renderGroupAttributesSection() }
                        </form>
                    );
                } }
            />
        );
    });

export default ConfigurationsForm;
