import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { AlertLevels } from "@wso2is/core/src/models";
import { addAlert } from "@wso2is/core/src/store";
import { Field, Form } from "@wso2is/form";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment
} from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../core";
import { deleteOrganization, patchOrganization } from "../api";
import { ORGANIZATION_TYPE } from "../constants";
import { OrganizationResponseInterface, PatchData } from "../models";

interface OrganizationProfilePropsInterface extends SBACInterface<FeatureConfigInterface>,
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

export const OrganizationProfile: FunctionComponent<OrganizationProfilePropsInterface> = (
    props: OrganizationProfilePropsInterface
): ReactElement => {

    const {
        organization,
        isReadOnly,
        onOrganizationUpdate,
        onOrganizationDelete,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const submitForm = useRef<() => void>();
    const editableFields: Array<string> = [
        "name",
        "description"
    ];

    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ showOrgDeleteConfirmation, setShowOrgDeleteConfirmationModal ] = useState(false);

    const handleSubmit = useCallback(
        async (values: OrganizationResponseInterface): Promise<void> => {
            setIsSubmitting(true);

            const patchData: PatchData[] = Object.keys(values)
                .filter((field) => editableFields.includes(field))
                .map((field) => {
                    return {
                        operation: "REPLACE",
                        path: `/${field}`,
                        value: values[field]
                    };
                });

            patchOrganization(organization.id, patchData)
                .then((_response) => {
                    dispatch(
                        addAlert({
                            description: t("console:manage.features.organizations.notifications.updateOrganization." +
                                "success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("console:manage.features.organizations.notifications.updateOrganization." +
                                "success.message")
                        })
                    );

                    onOrganizationUpdate(organization.id);
                }).catch((error) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(
                            addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: t("console:manage.features.organizations.notifications.updateOrganization." +
                                    "error.message")
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t("console:manage.features.organizations.notifications" +
                                ".updateOrganization.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.organizations.notifications" +
                                ".updateOrganization.genericError.message")
                        })
                    );
                })
                .finally(() => setIsSubmitting(false));
        }, [ organization, setIsSubmitting ]
    );

    const handleOnDeleteOrganization = useCallback((organizationId: string) => {
        deleteOrganization(organizationId)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.success" +
                                ".description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.success.message"
                        )
                    })
                );

                setShowOrgDeleteConfirmationModal(false);
                onOrganizationDelete(organizationId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications.deleteOrganization.error" +
                                    ".message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.deleteOrganization" +
                                ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.genericError" +
                                ".message"
                        )
                    })
                );
            })
            .finally(() => setShowOrgDeleteConfirmationModal(false));
    }, [ organization ]
    );

    return (
        organization ?
            (<EmphasizedSegment padded="very">
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 8 }>
                            <Form
                                data-testid={ `${testId}-form` }
                                onSubmit={ handleSubmit }
                                uncontrolledForm={ false }
                                triggerSubmit={ (submit) => (submitForm.current = submit) }
                            >
                                {
                                    organization?.id && (
                                        <Field.Input
                                            data-testid={ `${testId}-profile-form-id-input` }
                                            name="id"
                                            label={ t("Organization ID") }
                                            value={ organization.id }
                                            required={ true }
                                            readOnly={ true }
                                            ariaLabel={ "Organization ID" }
                                            inputType={ "identifier" }
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    organization?.name && (
                                        <Field.Input
                                            data-testid={ `${testId}-profile-form-name-input` }
                                            name="name"
                                            label={ t("Organization Name") }
                                            required={ true }
                                            requiredErrorMessage="Please enter the organization name"
                                            value={ organization.name }
                                            ariaLabel={ "Organization Name" }
                                            placeholder={ "Enter the name of the organization" }
                                            inputType={ "name" }
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    (
                                        <Field.Textarea
                                            data-testid={ `${testId}-profile-form-description-input` }
                                            name="description"
                                            label={ t("Organization Description") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            value={ organization?.description ?? "" }
                                            placeholder={ "Enter a description for the organization" }
                                            ariaLabel={ "Organization Description" }
                                            inputType={ "description" }
                                            maxLength={ 50 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    organization?.domain && (
                                        <Field.Input
                                            data-testid={ `${testId}-profile-form-domain-input` }
                                            name="domain"
                                            label={ t("Organization Domain") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            value={ organization?.domain || "" }
                                            readOnly={ true }
                                            ariaLabel={ "Organization Domain" }
                                            inputType={ "url" }
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    organization?.type && (
                                        <Field.Input
                                            data-testid={ `${testId}-profile-form-type-input` }
                                            name="type"
                                            label={ t("Organization Type") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            type="text"
                                            readOnly={ true }
                                            value={ organization.type === ORGANIZATION_TYPE.STRUCTURAL
                                                ? "Structural"
                                                : "Tenant"
                                            }
                                            ariaLabel={ "Organization Type" }
                                            inputType={ "name" }
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    organization?.created && (
                                        <Field.Input
                                            data-testid={ `${testId}-profile-form-created-input` }
                                            name="created"
                                            label={ t("Created") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            type="text"
                                            readOnly={ true }
                                            value={ moment(organization.created).format("YYYY-MM-DD hh:mm:ss") }
                                            ariaLabel={ "Created" }
                                            inputType={ "default" }
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    organization?.lastModified && (
                                        <Field.Input
                                            data-testid={ `${testId}-profile-form-last-modified-input` }
                                            name="lastModified"
                                            label={ t("Last Modified") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            type="text"
                                            readOnly={ true }
                                            value={ moment(organization.lastModified).format("YYYY-MM-DD hh:mm:ss") }
                                            ariaLabel={ "Last Modified" }
                                            inputType={ "default" }
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        {
                                            !isReadOnly && (
                                                <Button
                                                    data-testid={ `${testId}-form-update-button` }
                                                    primary
                                                    type="submit"
                                                    size="small"
                                                    className="form-button"
                                                    loading={ isSubmitting }
                                                    disabled={ isSubmitting }
                                                    onClick={ () => {
                                                        submitForm?.current && submitForm?.current();
                                                    } }
                                                >
                                                    { t("common:update") }
                                                </Button>
                                            )
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden/>
                {
                    !isReadOnly && (
                        <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                            <DangerZone
                                actionTitle={
                                    t("console:manage.features.organizations.edit" +
                                        ".dangerZone.title")
                                }
                                header={
                                    t("common:dangerZone")
                                }
                                subheader={
                                    t("console:manage.features.organizations.edit" +
                                        ".dangerZone.subHeader")
                                }
                                onActionClick={ () => setShowOrgDeleteConfirmationModal(!showOrgDeleteConfirmation) }
                                data-testid={
                                    `${testId}-role-danger-zone`
                                }
                            />
                        </DangerZoneGroup>
                    )
                }
                {
                    showOrgDeleteConfirmation && (
                        <ConfirmationModal
                            onClose={ (): void => setShowOrgDeleteConfirmationModal(false) }
                            type="warning"
                            open={ showOrgDeleteConfirmation }
                            assertionHint={ t("console:manage.features.organizations.confirmations." +
                                "deleteOrganization.assertionHint") }
                            assertionType="checkbox"
                            primaryAction="Confirm"
                            secondaryAction="Cancel"
                            onSecondaryActionClick={ (): void => setShowOrgDeleteConfirmationModal(false) }
                            onPrimaryActionClick={ (): void => handleOnDeleteOrganization(organization.id) }
                            data-testid={
                                `${testId}-role-confirmation-modal`
                            }
                            closeOnDimmerClick={ false }
                        >
                            <ConfirmationModal.Header>
                                { t("console:manage.features.organizations.confirmations.deleteOrganization.header") }
                            </ConfirmationModal.Header>
                            <ConfirmationModal.Message attached warning>
                                { t("console:manage.features.organizations.confirmations.deleteOrganization.message") }
                            </ConfirmationModal.Message>
                            <ConfirmationModal.Content>
                                { t("console:manage.features.organizations.confirmations.deleteOrganization.content") }
                            </ConfirmationModal.Content>
                        </ConfirmationModal>
                    )
                }
            </EmphasizedSegment>)
            : <ContentLoader dimmer/>
    );
};

/**
 * Default props for the component.
 */
OrganizationProfile.defaultProps = {
    "data-testid": "organization-profile"
};
