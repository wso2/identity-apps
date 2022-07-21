import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import { FeatureConfigInterface } from "../../../core";
import { deleteOrganization, patchOrganization } from "../../api";
import { OrganizationPatchData, OrganizationResponseInterface } from "../../models";

interface OrganizationOverviewPropsInterface extends SBACInterface<FeatureConfigInterface>,
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

export const OrganizationOverview: FunctionComponent<OrganizationOverviewPropsInterface> = (
    props: OrganizationOverviewPropsInterface
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

            const patchData: OrganizationPatchData[] = Object.keys(values)
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
                    if (error.description) {
                        dispatch(
                            addAlert({
                                description: error.description,
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
                    if (error.response.data.code === "ORG-60007") {
                        dispatch(
                            addAlert({
                                description: t(
                                    "console:manage.features.organizations.notifications." +
                                    "deleteOrganizationWithSubOrganizationError",
                                    { organizationName: organization.name }
                                ),
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
                                    organization?.name && (
                                        <Field.Input
                                            data-testid={ `${testId}-overview-form-name-input` }
                                            name="name"
                                            label={ t("console:manage.features.organizations.edit.fields.name.label") }
                                            required={ true }
                                            requiredErrorMessage="Please enter the organization name"
                                            value={ organization.name }
                                            ariaLabel={ t("console:manage.features.organizations.edit.fields." +
                                                "name.ariaLabel") }
                                            placeholder={ t("console:manage.features.organizations.edit.fields." +
                                                "name.placeholder") }
                                            inputType="name"
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    (
                                        <Field.Textarea
                                            data-testid={ `${testId}-overview-form-description-input` }
                                            name="description"
                                            label={ t("console:manage.features.organizations.edit.fields." +
                                                "description.label") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            value={ organization?.description ?? "" }
                                            placeholder={ t("console:manage.features.organizations.edit.fields." +
                                                "description.placeholder") }
                                            ariaLabel={ t("console:manage.features.organizations.edit.fields." +
                                                "description.ariaLabel") }
                                            inputType="description"
                                            maxLength={ 300 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    organization?.domain && (
                                        <Field.Input
                                            data-testid={ `${testId}-overview-form-domain-input` }
                                            name="domain"
                                            label={ t("console:manage.features.organizations.edit.fields." +
                                                "domain.label") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            value={ organization?.domain || "" }
                                            readOnly={ true }
                                            ariaLabel={ t("console:manage.features.organizations.edit.fields." +
                                                "domain.ariaLabel") }
                                            inputType="url"
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    organization?.created && (
                                        <Field.Input
                                            data-testid={ `${testId}-overview-form-created-input` }
                                            name="created"
                                            label={ t("console:manage.features.organizations.edit.fields." +
                                                "created.label") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            type="text"
                                            readOnly={ true }
                                            value={ moment(organization.created).format("YYYY-MM-DD hh:mm:ss") }
                                            ariaLabel={ t("console:manage.features.organizations.edit.fields." +
                                                "created.ariaLabel") }
                                            inputType="default"
                                            maxLength={ 32 }
                                            minLength={ 3 }
                                        />
                                    )
                                }
                                {
                                    organization?.lastModified && (
                                        <Field.Input
                                            data-testid={ `${testId}-overview-form-last-modified-input` }
                                            name="lastModified"
                                            label={ t("console:manage.features.organizations.edit.fields." +
                                                "lastModified.label") }
                                            required={ false }
                                            requiredErrorMessage=""
                                            type="text"
                                            readOnly={ true }
                                            value={ moment(organization.lastModified).format("YYYY-MM-DD hh:mm:ss") }
                                            ariaLabel={ t("console:manage.features.organizations.edit.fields." +
                                                "lastModified.ariaLabel") }
                                            inputType="default"
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
                            type="negative"
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
OrganizationOverview.defaultProps = {
    "data-testid": "organization-overview"
};
