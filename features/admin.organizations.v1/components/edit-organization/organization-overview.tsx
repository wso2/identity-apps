/**
 * Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsError } from "@wso2is/core/errors";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import moment from "moment";
import React, {
    FormEvent,
    FunctionComponent,
    ReactElement,
    useCallback,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider, Grid } from "semantic-ui-react";
import { deleteOrganization, patchOrganization } from "../../api";
import {
    ORGANIZATION_DESCRIPTION_MAX_LENGTH,
    ORGANIZATION_DESCRIPTION_MIN_LENGTH,
    ORGANIZATION_NAME_MAX_LENGTH,
    ORGANIZATION_NAME_MIN_LENGTH,
    OrganizationManagementConstants
} from "../../constants";
import {
    OrganizationPatchData,
    OrganizationResponseInterface
} from "../../models";

interface OrganizationEditFormProps {
    name: string;
    description?: string;
}

interface OrganizationOverviewPropsInterface
    extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface {
    /**
     * Organization info
     */
    organization: OrganizationResponseInterface;
    /**
     * Is read only view
     */
    isReadOnly: boolean;
    /**
     * Callback for when organization update
     */
    onOrganizationUpdate: (organizationId: string) => void;
    /**
     * Callback for when organization delete
     */
    onOrganizationDelete: (organizationId: string) => void;
}

const FORM_ID: string = "organization-overview-form";

/**
 * Organization overview component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const OrganizationOverview: FunctionComponent<OrganizationOverviewPropsInterface> = (
    props: OrganizationOverviewPropsInterface
): ReactElement => {
    const {
        organization,
        isReadOnly,
        onOrganizationUpdate,
        onOrganizationDelete,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state?.organization?.organization
    );

    const editableFields: Array<string> = [ "name", "description" ];

    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [
        showOrgDeleteConfirmation,
        setShowOrgDeleteConfirmationModal
    ] = useState(false);

    const isOrgHandleFeatureEnabled: boolean = isFeatureEnabled(
        featureConfig.organizations,
        "organizations.orgHandle"
    );

    const handleSubmit: (values: OrganizationResponseInterface) => Promise<void> = useCallback(
        async (values: OrganizationResponseInterface): Promise<void> => {
            setIsSubmitting(true);

            const patchData: OrganizationPatchData[] = Object.keys(values)
                .filter((field: string) => editableFields.includes(field))
                .map((field: string) => {
                    return {
                        operation: "REPLACE",
                        path: `/${ field }`,
                        value: values[ field ]
                    };
                });

            patchOrganization(organization.id, patchData)
                .then((_response: OrganizationResponseInterface) => {
                    dispatch(
                        addAlert({
                            description: t(
                                "organizations:notifications.updateOrganization." +
                                "success.description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                "organizations:notifications.updateOrganization." +
                                "success.message"
                            )
                        })
                    );

                    onOrganizationUpdate(organization.id);
                })
                .catch((error: IdentityAppsError) => {
                    if (error.description) {
                        dispatch(
                            addAlert({
                                description: error.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "organizations:notifications.updateOrganization." +
                                    "error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "organizations:notifications" +
                                ".updateOrganization.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "organizations:notifications" +
                                ".updateOrganization.genericError.message"
                            )
                        })
                    );
                })
                .finally(() => setIsSubmitting(false));
        },
        [ organization, setIsSubmitting ]
    );

    const handleOnDeleteOrganization: (organizationId: string) => void = useCallback(
        (organizationId: string) => {
            deleteOrganization(organizationId)
                .then(() => {
                    dispatch(
                        addAlert({
                            description: t(
                                "organizations:notifications.deleteOrganization.success" +
                                ".description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                "organizations:notifications.deleteOrganization.success.message"
                            )
                        })
                    );

                    setShowOrgDeleteConfirmationModal(false);
                    onOrganizationDelete(organizationId);
                })
                .catch((error: AxiosError) => {
                    if (
                        error.response &&
                        error.response.data &&
                        error.response.data.description
                    ) {
                        if (error.response.data.code === "ORG-60007") {
                            dispatch(
                                addAlert({
                                    description: t(
                                        "organizations:notifications." +
                                        "deleteOrganizationWithSubOrganizationError",
                                        { organizationName: organization.name }
                                    ),
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "organizations:notifications.deleteOrganization.error" +
                                        ".message"
                                    )
                                })
                            );

                            return;
                        }
                        dispatch(
                            addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "organizations:notifications.deleteOrganization.error" +
                                    ".message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "organizations:notifications.deleteOrganization" +
                                ".genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "organizations:notifications.deleteOrganization.genericError" +
                                ".message"
                            )
                        })
                    );
                })
                .finally(() => setShowOrgDeleteConfirmationModal(false));
        },
        [ organization ]
    );

    const handleDisableOrganization: (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => void = useCallback(
        (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
            const isChecked: boolean = data.checked;

            const patchData: OrganizationPatchData = {
                operation: "REPLACE",
                path: "/status",
                value: isChecked ? "DISABLED" : "ACTIVE"
            };

            patchOrganization(organization.id, [ patchData ])
                .then(() => {
                    dispatch(
                        addAlert({
                            description: t(
                                organization.status === "ACTIVE"
                                    ? "organizations:notifications" +
                                    ".disableOrganization.success.description"
                                    : "organizations:notifications" +
                                    ".enableOrganization.success.description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                organization.status === "ACTIVE"
                                    ? "organizations:notifications" +
                                    ".disableOrganization.success.message"
                                    : "organizations:notifications" +
                                    ".enableOrganization.success.message"
                            )
                        })
                    );

                    setShowOrgDeleteConfirmationModal(false);
                    onOrganizationUpdate(organization.id);
                })
                .catch((error: IdentityAppsError) => {
                    if (error.description) {
                        if (error.code === "ORG-60029") {
                            dispatch(
                                addAlert({
                                    description: t(
                                        "organizations:notifications." +
                                        "disableOrganizationWithSubOrganizationError",
                                        { organizationName: organization.name }
                                    ),
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "organizations:notifications.disableOrganization" +
                                        ".genericError.message"
                                    )
                                })
                            );

                            return;
                        }

                        dispatch(
                            addAlert({
                                description: error.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    organization.status === "ACTIVE"
                                        ? "organizations:notifications" +
                                        ".disableOrganization.error.message"
                                        : "organizations:notifications" +
                                        ".enableOrganization.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                organization.status === "ACTIVE"
                                    ? "organizations:notifications" +
                                    ".disableOrganization.genericError.description"
                                    : "organizations:notifications" +
                                    ".enableOrganization.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                organization.status === "ACTIVE"
                                    ? "organizations:notifications" +
                                    ".disableOrganization.genericError.message"
                                    : "organizations:notifications" +
                                    ".enableOrganization.genericError.message"
                            )
                        })
                    );
                });
        },
        [ organization, dispatch, addAlert ]
    );

    const validate = async (
        values: OrganizationEditFormProps
    ): Promise<Partial<OrganizationEditFormProps>> => {
        const error: Partial<OrganizationEditFormProps> = {};

        if (
            values?.name &&
            (values.name.length < ORGANIZATION_NAME_MIN_LENGTH ||
                values?.name.length > ORGANIZATION_NAME_MAX_LENGTH)
        ) {
            error.name =
                `Organization name length should be at least ${ ORGANIZATION_NAME_MIN_LENGTH } ` +
                `and at most ${ ORGANIZATION_NAME_MAX_LENGTH } characters`;
        }

        if (
            values?.description &&
            (values?.description.length > ORGANIZATION_DESCRIPTION_MAX_LENGTH ||
                values?.description.length <
                ORGANIZATION_DESCRIPTION_MIN_LENGTH)
        ) {
            error.description = `Organization description length should be at least
            ${ ORGANIZATION_DESCRIPTION_MIN_LENGTH } and at most ${ ORGANIZATION_DESCRIPTION_MAX_LENGTH } characters`;
        }

        return error;
    };

    return organization ? (
        <>
            <EmphasizedSegment padded="very" key={ organization?.id }>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 8 }>
                            <Form
                                id={ FORM_ID }
                                data-testid={ `${ testId }-form` }
                                onSubmit={ handleSubmit }
                                uncontrolledForm={ false }
                                validate={ validate }
                            >
                                { organization?.name && (
                                    <Field.Input
                                        data-testid={ `${ testId }-overview-form-name-input` }
                                        name="name"
                                        label={ t(
                                            "organizations:edit.fields.name.label"
                                        ) }
                                        required={ true }
                                        requiredErrorMessage="Please enter the organization name"
                                        value={ organization.name }
                                        ariaLabel={ t(
                                            "organizations:edit.fields." +
                                        "name.ariaLabel"
                                        ) }
                                        placeholder={ t(
                                            "organizations:edit.fields." +
                                        "name.placeholder"
                                        ) }
                                        inputType="name"
                                        maxLength={ ORGANIZATION_NAME_MAX_LENGTH }
                                        minLength={ ORGANIZATION_NAME_MIN_LENGTH }
                                        readOnly={ isReadOnly }
                                    />
                                ) }
                                {
                                    <Field.Textarea
                                        data-testid={ `${ testId }-overview-form-description-input` }
                                        name="description"
                                        label={ t(
                                            "organizations:edit.fields." +
                                        "description.label"
                                        ) }
                                        value={ organization?.description ?? "" }
                                        placeholder={ t(
                                            "organizations:edit.fields." +
                                        "description.placeholder"
                                        ) }
                                        ariaLabel={ t(
                                            "organizations:edit.fields." +
                                        "description.ariaLabel"
                                        ) }
                                        inputType="description"
                                        maxLength={
                                            ORGANIZATION_DESCRIPTION_MAX_LENGTH
                                        }
                                        minLength={
                                            ORGANIZATION_DESCRIPTION_MIN_LENGTH
                                        }
                                        readOnly={ isReadOnly }
                                    />
                                }
                                { organization?.domain && (
                                    <Field.Input
                                        data-testid={ `${ testId }-overview-form-domain-input` }
                                        name="domain"
                                        label={ t(
                                            "organizations:edit.fields." +
                                        "domain.label"
                                        ) }
                                        value={ organization?.domain || "" }
                                        readOnly={ true }
                                        ariaLabel={ t(
                                            "organizations:edit.fields." +
                                        "domain.ariaLabel"
                                        ) }
                                        inputType="url"
                                        maxLength={ OrganizationManagementConstants.MAX_ORG_HANDLE_LENGTH }
                                        minLength={ OrganizationManagementConstants.MIN_ORG_HANDLE_LENGTH }
                                    />
                                ) }
                                { organization?.orgHandle && isOrgHandleFeatureEnabled && (
                                    <Field.Input
                                        data-testid={ `${ testId }-overview-form-org-handle-input` }
                                        name="orgHandle"
                                        label={ t(
                                            "organizations:edit.fields.orgHandle.label"
                                        ) }
                                        value={ organization?.orgHandle || organization?.id }
                                        readOnly={ true }
                                        ariaLabel={ t(
                                            "organizations:edit.fields.orgHandle.ariaLabel"
                                        ) }
                                        inputType="copy_input"
                                        maxLength={ OrganizationManagementConstants.MAX_ORG_HANDLE_LENGTH }
                                        minLength={ OrganizationManagementConstants.MIN_ORG_HANDLE_LENGTH }
                                    />
                                ) }
                                <Field.Input
                                    data-testid={ `${ testId }-overview-form-created-input` }
                                    name="id"
                                    label={ t(
                                        "organizations:edit.fields." +
                                    "id.label"
                                    ) }
                                    type="text"
                                    readOnly={ true }
                                    value={ organization?.id }
                                    ariaLabel={ t(
                                        "organizations:edit.fields." +
                                    "id.ariaLabel"
                                    ) }
                                    inputType="copy_input"
                                    maxLength={ OrganizationManagementConstants.MAX_ORG_HANDLE_LENGTH }
                                    minLength={ OrganizationManagementConstants.MIN_ORG_HANDLE_LENGTH }
                                />
                                { organization?.created && (
                                    <Field.Input
                                        data-testid={ `${ testId }-overview-form-created-input` }
                                        name="created"
                                        label={ t(
                                            "organizations:edit.fields." +
                                        "created.label"
                                        ) }
                                        type="text"
                                        readOnly={ true }
                                        value={ moment(organization.created).format(
                                            "YYYY-MM-DD hh:mm:ss"
                                        ) }
                                        ariaLabel={ t(
                                            "organizations:edit.fields." +
                                        "created.ariaLabel"
                                        ) }
                                        inputType="default"
                                        maxLength={ OrganizationManagementConstants.MAX_ORG_HANDLE_LENGTH }
                                        minLength={ OrganizationManagementConstants.MIN_ORG_HANDLE_LENGTH }
                                    />
                                ) }
                                { organization?.lastModified && (
                                    <Field.Input
                                        data-testid={ `${ testId }-overview-form-last-modified-input` }
                                        name="lastModified"
                                        label={ t(
                                            "organizations:edit.fields." +
                                        "lastModified.label"
                                        ) }
                                        type="text"
                                        readOnly={ true }
                                        value={ moment(
                                            organization.lastModified
                                        ).format("YYYY-MM-DD hh:mm:ss") }
                                        ariaLabel={ t(
                                            "organizations:edit.fields." +
                                        "lastModified.ariaLabel"
                                        ) }
                                        inputType="default"
                                        maxLength={ OrganizationManagementConstants.MAX_ORG_HANDLE_LENGTH }
                                        minLength={ OrganizationManagementConstants.MIN_ORG_HANDLE_LENGTH }
                                    />
                                ) }
                                { !isReadOnly && (
                                    <Field.Button
                                        form={ FORM_ID }
                                        size="small"
                                        buttonType="primary_btn"
                                        ariaLabel="Update button"
                                        name="update-button"
                                        className="form-button"
                                        data-testid={ `${ testId }-form-update-button` }
                                        disabled={ isSubmitting }
                                        loading={ isSubmitting }
                                        label={ t("common:update") }
                                    />
                                ) }
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column
                                        mobile={ 16 }
                                        tablet={ 16 }
                                        computer={ 8 }
                                    >

                                    </Grid.Column>
                                </Grid.Row>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                { showOrgDeleteConfirmation && (
                    <ConfirmationModal
                        onClose={ (): void =>
                            setShowOrgDeleteConfirmationModal(false)
                        }
                        type="negative"
                        open={ showOrgDeleteConfirmation }
                        assertionHint={ t(
                            "organizations:confirmations." +
                        "deleteOrganization.assertionHint"
                        ) }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void =>
                            setShowOrgDeleteConfirmationModal(false)
                        }
                        onPrimaryActionClick={ (): void =>
                            handleOnDeleteOrganization(organization.id)
                        }
                        data-testid={ `${ testId }-role-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t(
                                "organizations:confirmations.deleteOrganization.header"
                            ) }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t(
                                "organizations:confirmations.deleteOrganization.message"
                            ) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t(
                                "organizations:confirmations.deleteOrganization.content"
                            ) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                ) }
            </EmphasizedSegment>
            <Divider hidden />
            <Show
                when={
                    featureConfig?.organizations?.scopes?.delete ||
                    featureConfig?.organizations?.scopes?.update
                }
            >
                { !isReadOnly && currentOrganization.id !== organization.id && (
                    <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                        <Show when={ featureConfig?.organizations?.scopes?.update }>
                            <DangerZone
                                actionTitle={ t(
                                    "organizations:edit.dangerZone.disableOrganization" +
                                    ".disableActionTitle"
                                ) }
                                header={ t(
                                    "organizations:edit.dangerZone.disableOrganization" +
                                    ".disableActionTitle"
                                ) }
                                subheader={ t(
                                    "organizations:edit.dangerZone" +
                                    ".disableOrganization.subheader"
                                ) }
                                onActionClick={ undefined }
                                data-testid={ `${ testId }-disable-danger-zone` }
                                toggle={ {
                                    checked: organization.status !== "ACTIVE",
                                    onChange: handleDisableOrganization
                                } }
                            />
                        </Show>
                        { !isReadOnly && (
                            <Show
                                when={
                                    featureConfig?.organizations?.scopes?.delete
                                }
                            >
                                <DangerZone
                                    actionTitle={ t(
                                        "organizations:edit" +
                                        ".dangerZone.title"
                                    ) }
                                    header={ t(
                                        "organizations:edit" +
                                        ".dangerZone.title"
                                    ) }
                                    subheader={ t(
                                        "organizations:edit" +
                                        ".dangerZone.subHeader"
                                    ) }
                                    onActionClick={ () =>
                                        setShowOrgDeleteConfirmationModal(
                                            !showOrgDeleteConfirmation
                                        )
                                    }
                                    data-testid={ `${ testId }-role-danger-zone` }
                                />
                            </Show>
                        ) }
                    </DangerZoneGroup>
                ) }
            </Show>
        </>
    ) : (
        <ContentLoader dimmer />
    );
};

/**
 * Default props for the component.
 */
OrganizationOverview.defaultProps = {
    "data-testid": "organization-overview"
};
