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
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { CopyIcon } from "@oxygen-ui/react-icons";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils } from "@wso2is/core/utils";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    TextFieldAdapter
} from "@wso2is/form";
import moment from "moment";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import updateSelfOrganization from "../../api/update-self-organization";
import useGetSelfOrganization from "../../api/use-get-self-organization";
import "./edit-self-organization-form.scss";

/**
 * Props interface of {@link EditSelfOrganizationForm}
 */
export type EditSelfOrganizationFormProps = IdentifiableComponentInterface & {
    /**
     * Callback to trigger when the form is submitted.
     */
    onSubmit?: () => void;
    /**
     * Flag to render the form in read-only mode.
     */
    readOnly?: boolean;
};

export type EditSelfOrganizationFormValues = {
    id: string;
    name: string;
    orgHandle: string;
    created: string;
    lastModified: string;
};

export type EditSelfOrganizationFormErrors = Partial<EditSelfOrganizationFormValues>;

/**
 * Component to hold the self organization details edit/update form.
 *
 * @param props - Props injected to the component.
 * @returns Self organization edit form component.
 */
const EditSelfOrganizationForm: FunctionComponent<EditSelfOrganizationFormProps> = ({
    ["data-componentid"]: componentId = "edit-self-organization-form",
    onSubmit,
    readOnly = true,
    ...rest
}: EditSelfOrganizationFormProps): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const { data: organization, mutate: mutateOrganization } = useGetSelfOrganization();

    const formatDate = (dateString: string): string => {
        if (!dateString) return "";

        return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
    };

    /**
     * Handles the self organization update form submit action.
     * @param values - Form values.
     */
    const handleSubmit = (values: EditSelfOrganizationFormValues): void => {
        const operations: Array<{
            operation: "REPLACE";
            path: string;
            value: string;
        }> = [
            {
                operation: "REPLACE" as const,
                path: "/name",
                value: values.name
            }
        ];

        updateSelfOrganization(operations)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editSelfOrganization.notifications" +
                            ".updateOrganization.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("tenants:editSelfOrganization.notifications" +
                            ".updateOrganization.success.message")
                    })
                );
                mutateOrganization();
                onSubmit && onSubmit();
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editSelfOrganization.notifications" +
                            ".updateOrganization.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("tenants:editSelfOrganization.notifications" +
                            ".updateOrganization.error.message")
                    })
                );
            });
    };

    /**
     * Handles the form level validation.
     * @param values - Form values.
     * @returns Form errors.
     */
    const handleValidate = (values: EditSelfOrganizationFormValues): EditSelfOrganizationFormErrors => {
        const errors: EditSelfOrganizationFormErrors = {
            name: undefined
        };

        if (!values.name) {
            errors.name = t("tenants:editSelfOrganization.form.fields.organizationName.validations.required");
        }

        return errors;
    };

    if (!organization) {
        return <div>Loading...</div>;
    }

    return (
        <FinalForm
            initialValues={ {
                created: formatDate(organization.created),
                id: organization.id,
                lastModified: formatDate(organization.lastModified),
                name: organization.name,
                orgHandle: organization.orgHandle || ""
            } }
            keepDirtyOnReinitialize={ true }
            onSubmit={ handleSubmit }
            validate={ handleValidate }
            render={ ({ handleSubmit }: FormRenderProps) => {
                return (
                    <form
                        onSubmit={ handleSubmit }
                        className="edit-self-organization-form"
                    >
                        <FinalFormField
                            key="id"
                            width={ 16 }
                            className="text-field-container"
                            ariaLabel="id"
                            required={ false }
                            data-componentid={ `${componentId}-id` }
                            name="id"
                            type="text"
                            label={ t("tenants:editSelfOrganization.form.fields.organizationId.label") }
                            component={ TextFieldAdapter }
                            readOnly={ true }
                            InputProps={ {
                                endAdornment: (
                                    <Tooltip
                                        title={ t("tenants:editSelfOrganization.form.fields" +
                                            ".organizationId.hint") }
                                    >
                                        <div>
                                            <IconButton
                                                aria-label="Copy ID"
                                                className="copy-button-adornment"
                                                onClick={ async () => {
                                                    await CommonUtils.copyTextToClipboard(organization.id);
                                                } }
                                                edge="end"
                                            >
                                                <CopyIcon size={ 12 } />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                ),
                                readOnly: true
                            } }
                        />
                        <FinalFormField
                            key="name"
                            width={ 16 }
                            className="text-field-container"
                            ariaLabel="name"
                            required={ !readOnly }
                            data-componentid={ `${componentId}-name` }
                            name="name"
                            type="text"
                            label={ t("tenants:editSelfOrganization.form.fields.organizationName.label") }
                            placeholder={ t("tenants:editSelfOrganization.form.fields.organizationName.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                            readOnly={ readOnly }
                        />

                        <FinalFormField
                            key="orgHandle"
                            width={ 16 }
                            className="text-field-container"
                            ariaLabel="orgHandle"
                            required={ false }
                            data-componentid={ `${componentId}-org-handle` }
                            name="orgHandle"
                            type="text"
                            label={ t("tenants:editSelfOrganization.form.fields.organizationHandle.label") }
                            component={ TextFieldAdapter }
                            readOnly={ true }
                        />

                        <FinalFormField
                            key="created"
                            width={ 16 }
                            className="text-field-container"
                            ariaLabel="created"
                            required={ false }
                            data-componentid={ `${componentId}-created` }
                            name="created"
                            type="text"
                            label={ t("tenants:editSelfOrganization.form.fields.created.label") }
                            component={ TextFieldAdapter }
                            readOnly={ true }
                        />

                        <FinalFormField
                            key="lastModified"
                            width={ 16 }
                            className="text-field-container"
                            ariaLabel="lastModified"
                            required={ false }
                            data-componentid={ `${componentId}-last-modified` }
                            name="lastModified"
                            type="text"
                            label={ t("tenants:editSelfOrganization.form.fields.lastModified.label") }
                            component={ TextFieldAdapter }
                            readOnly={ true }
                        />

                        { !readOnly &&
                            (<Button
                                autoFocus
                                className="edit-self-organization-form-submit-button"
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                { t("tenants:editSelfOrganization.actions.save.label") }
                            </Button>)
                        }
                    </form>
                );
            } }
            { ...rest }
        />
    );
};

export default EditSelfOrganizationForm;
