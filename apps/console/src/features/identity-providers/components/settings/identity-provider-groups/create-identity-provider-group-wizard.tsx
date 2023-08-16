/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Form, Grid, Modal } from "semantic-ui-react";
import { updateIdentityProviderGroup } from "../../../api";
import { IdentityProviderConstants } from "../../../constants";
import { IdentityProviderGroupInterface } from "../../../models";

const FORM_ID: string = "create-idp-group-form";

/**
 * Interface which captures create group props.
 */
interface CreateGroupProps extends IdentifiableComponentInterface {
    closeWizard: () => void;
    updateList: () => void;
    idpId: string;
    groupsList: IdentityProviderGroupInterface[];
}

/**
 * Component to handle addition of a new group to the system.
 */
export const CreateIdPGroupWizard: FunctionComponent<CreateGroupProps> = (props: CreateGroupProps): ReactElement => {

    const {
        closeWizard,
        updateList,
        idpId,
        groupsList,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ groupName, setGroupName ] = useState<string>("");

    /**
     * Function to create the idp group.
     */
    const createIdpGroup = (): void => {
        setIsSubmitting(true);
        const newIdpGroupList: IdentityProviderGroupInterface[] = [ 
            ...groupsList,
            {
                id: "",
                name: groupName.trim()
            }
        ];

        // Check if the group name is aleady present in the groupsList
        if (groupsList.some((group: IdentityProviderGroupInterface) => group.name === groupName.trim())) {
            dispatch(addAlert({
                description: t("extensions:console.identityProviderGroups.createGroupWizard.notifications." +
                    "duplicateGroupError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:console.identityProviderGroups.createGroupWizard.notifications." +
                    "duplicateGroupError.message")
            }));
            closeWizard();
            setIsSubmitting(false);

            return;
        }

        updateIdentityProviderGroup(idpId, newIdpGroupList)
            .then(() => {
                dispatch(addAlert({
                    description: t("extensions:console.identityProviderGroups.createGroupWizard.notifications." +
                        "createIdentityProviderGroup.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:console.identityProviderGroups.createGroupWizard.notifications." +
                        "createIdentityProviderGroup.success.message")
                }));
                closeWizard();
                updateList();
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("extensions:console.identityProviderGroups.createGroupWizard.notifications." +
                        "createIdentityProviderGroup.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:console.identityProviderGroups.createGroupWizard.notifications." +
                        "createIdentityProviderGroup.genericError.message")
                }));
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal
            open={ true }
            className="wizard create-role-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape= { false }
            data-componentid={ componentId }
            as={ Form }
            onSubmit={ createIdpGroup }
            id={ FORM_ID }
        >
            <Modal.Header className="wizard-header">
                {
                    t("console:manage.features.roles.addRoleWizard.heading", { type: "Group" })
                }
                <Heading as="h6">
                    { t("extensions:console.identityProviderGroups.createGroupWizard.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="pb-6" scrolling>
                <Grid>
                    <Grid.Row columns={ 1 } key={ 1 }>
                        <Grid.Column  mobile={ 16 } tablet={ 16 } computer={ 10 } key="identityProviderGroupName">
                            <Form.Input
                                name="identityProviderGroupName"
                                label={ t("extensions:console.identityProviderGroups.createGroupWizard." +
                                    "groupNameLabel") }
                                placeholder={ t("extensions:console.identityProviderGroups.createGroupWizard." +
                                    "groupNamePlaceHolder") }
                                onChange={ (e: any) => setGroupName(e.target.value) }
                                value={ groupName }
                                required={ true }
                                maxLength={ IdentityProviderConstants.CLAIM_CONFIG_FIELD_MAX_LENGTH }
                                minLength={ IdentityProviderConstants.CLAIM_CONFIG_FIELD_MIN_LENGTH }
                                width={ 16 }
                                data-componentid={ `${ componentId }-group-name` }
                            />
                            <Hint>
                                { t("extensions:console.identityProviderGroups.createGroupWizard." +
                                    "groupNameHint") }
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 } key={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                                data-componentid={ `${ componentId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                data-componentid={ `${ componentId }-finish-button` }
                                disabled={ (groupName.trim().length <= 0) || isSubmitting }
                                loading={ isSubmitting }
                                type="submit"
                            >
                                { t("console:manage.features.roles.addRoleWizard.buttons.finish") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};


CreateIdPGroupWizard.defaultProps = {
    "data-componentid": "identity-provider-group-create-wizard"
};
