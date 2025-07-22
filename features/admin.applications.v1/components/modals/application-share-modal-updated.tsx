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

import Alert from "@oxygen-ui/react/Alert";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Switch from "@oxygen-ui/react/Switch";
import { ApplicationSharingPolicy, RoleSharingModes } from "@wso2is/admin.console-settings.v1/models/shared-access";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Heading,
    LinkButton,
    PrimaryButton
} from "@wso2is/react-components";
import { AnimatePresence, motion } from "framer-motion";
import React, {
    ChangeEvent,
    FunctionComponent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    Divider,
    Modal,
    ModalProps
} from "semantic-ui-react";
import {
    shareApplicationWithAllOrganizations,
    shareApplicationWithSelectedOrganizationsAndRoles
} from "../../api/application-roles";
import { useGetApplication } from "../../api/use-get-application";
import { RoleShareType, ShareType } from "../../constants/application-roles";
import {
    ShareApplicationWithAllOrganizationsDataInterface,
    ShareApplicationWithSelectedOrganizationsAndRolesDataInterface
} from "../../models/application";
import OrgSelectiveShareWithAllRoles from "../forms/org-selective-share-with-all-roles";

export interface ApplicationShareModalPropsInterface
    extends ModalProps,
    IdentifiableComponentInterface {
    /**
     * ID of the application to be shared
     */
    applicationId: string;
    /**
     * ClientId of the application
     */
    clientId?: string;
    /**
     * Callback when the application sharing completed.
     */
    onApplicationSharingCompleted: () => void;
}

export const ApplicationShareModalUpdated: FunctionComponent<ApplicationShareModalPropsInterface> = (
    props: ApplicationShareModalPropsInterface
) => {
    const {
        applicationId,
        clientId,
        onApplicationSharingCompleted,
        onClose,
        [ "data-componentid" ]: componentId = "application-share-modal",
        ...rest
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ shareType, setShareType ] = useState<ShareType>(ShareType.SHARE_ALL);
    const [ roleShareTypeAll, setRoleShareTypeAll ] = useState<RoleShareType>(RoleShareType.SHARE_WITH_ALL);
    const [ selectedOrgIds, setSelectedOrgIds ] = useState<string[]>([]);
    const [ addedOrgIds, setAddedOrgIds ] = useState<string[]>([]);
    const [ removedOrgIds, setRemovedOrgIds ] = useState<string[]>([]);

    const { isOrganizationManagementEnabled } = useGlobalVariables();
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: application,
        error: applicationGetRequestError
    } = useGetApplication(applicationId, !!applicationId);

    /**
     * Handles the application get request error.
     */
    useEffect(() => {
        if (!applicationGetRequestError) {
            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplication" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.fetchApplication.genericError." +
                "message")
        }));
    }, [ applicationGetRequestError ]);

    const handleApplicationSharing = (): void => {

        if (shareType === ShareType.SHARE_ALL) {
            if (roleShareTypeAll === RoleShareType.SHARE_WITH_ALL) {
                // Share selected roles with all organizations
                shareAllOrNoRolesWithAllOrgs(true);
            } else if (roleShareTypeAll === RoleShareType.SHARE_NONE) {
                // Share all roles with all organizations
                shareAllOrNoRolesWithAllOrgs(false);
            }
        } else if (shareType === ShareType.SHARE_SELECTED) {
            // logic to handle sharing the application with selected organizations
            // Share all roles with selected organizations
            shareAllRolesWithSelectedOrgs();
        }
    };

    const shareAllOrNoRolesWithAllOrgs = (shareAllRoles: boolean = true): void => {
        const data: ShareApplicationWithAllOrganizationsDataInterface = {
            applicationId: application.id,
            policy: ApplicationSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleSharing: {
                mode: shareAllRoles ? RoleSharingModes.ALL : RoleSharingModes.NONE,
                roles: []
            }
        };

        shareApplicationWithAllOrganizations(data)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications.share.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:edit.sections.sharedAccess.notifications.share.success.message")
                }));

                eventPublisher.publish("application-share", {
                    "client-id": clientId
                });
            })
            .catch((error: Error) => {
                dispatch(addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications.share." +
                        "error.description",
                    { error: error.message }),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.sharedAccess.notifications.share.error.message")
                }));

                eventPublisher.publish("application-share-error", {
                    "client-id": clientId
                });
            })
            .finally(() => {
                onApplicationSharingCompleted();
                onClose(null, null);
            });
    };

    const shareAllRolesWithSelectedOrgs = async (): Promise<void> => {
        if (selectedOrgIds.length > 0) {
            const data: ShareApplicationWithSelectedOrganizationsAndRolesDataInterface = {
                applicationId: application.id,
                organizations: selectedOrgIds.map((orgId: string) => {
                    return {
                        orgId: orgId,
                        policy: ApplicationSharingPolicy.SELECTED_ORG_ONLY,
                        roleSharing: {
                            mode: RoleSharingModes.ALL,
                            roles: []
                        }
                    };
                })
            };

            shareApplicationWithSelectedOrganizationsAndRoles(data)
                .then(() => {
                    dispatch(addAlert({
                        description: t("applications:edit.sections.sharedAccess.notifications" +
                            ".share.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("applications:edit.sections.sharedAccess.notifications.share.success.message")
                    }));

                    eventPublisher.publish("application-share", {
                        "client-id": clientId
                    });
                })
                .catch((error: Error) => {
                    dispatch(addAlert({
                        description: t("applications:edit.sections.sharedAccess.notifications.share." +
                            "error.description",
                        { error: error.message }),
                        level: AlertLevels.ERROR,
                        message: t("applications:edit.sections.sharedAccess.notifications.share.error.message")
                    }));

                    eventPublisher.publish("application-share-error", {
                        "client-id": clientId
                    });
                })
                .finally(() => {
                    onApplicationSharingCompleted();
                    onClose(null, null);
                });
        } else {
            // Fire the application sharing completed callback
            onApplicationSharingCompleted();
            onClose(null, null);
        }
    };

    return (
        <Modal
            closeOnDimmerClick
            dimmer="blurring"
            size="small"
            closeOnDocumentClick={ true }
            closeOnEscape={ true }
            data-testid={ `${ componentId }-share-application-modal` }
            data-componentid={ `${ componentId }-share-application-modal` }
            { ...rest }
        >
            <Modal.Header>
                { t(
                    "applications:edit.sections.shareApplication.heading"
                ) }
            </Modal.Header>
            <Modal.Content>
                <Heading ellipsis as="h6">
                    { t("applications:edit.sections.sharedAccess.subTitle") }
                </Heading>
                <FormControl fullWidth>
                    <RadioGroup
                        value={ shareType }
                        onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                            setShareType(event.target.value as ShareType);
                        } }
                        data-componentid={ `${componentId}-radio-group` }
                    >
                        {
                            isOrganizationManagementEnabled && (
                                <FormControlLabel
                                    value={ ShareType.SHARE_SELECTED }
                                    label={ t("organizations:shareWithSelectedOrgsRadio") }
                                    control={ <Radio /> }
                                    data-componentid={ `${ componentId }-share-with-selected-orgs-checkbox` }
                                />
                            )
                        }
                        <AnimatePresence mode="wait">
                            {
                                shareType === ShareType.SHARE_SELECTED
                                && (
                                    <motion.div
                                        key="selected-orgs-block"
                                        initial={ { height: 0, opacity: 0 } }
                                        animate={ { height: "auto", opacity: 1 } }
                                        exit={ { height: 0, opacity: 0 } }
                                        transition={ { duration: 0.3 } }
                                        className="ml-5"
                                    >
                                        <Grid xs={ 14 }>
                                            <OrgSelectiveShareWithAllRoles
                                                application={ application }
                                                selectedItems={ selectedOrgIds }
                                                setSelectedItems={ setSelectedOrgIds }
                                                addedOrgs={ addedOrgIds }
                                                setAddedOrgs={ setAddedOrgIds }
                                                removedOrgs={ removedOrgIds }
                                                setRemovedOrgs={ setRemovedOrgIds }
                                            />
                                        </Grid>
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>
                        <FormControlLabel
                            value={ ShareType.SHARE_ALL }
                            label={ t("organizations:shareApplicationRadio") }
                            control={ <Radio /> }
                            data-componentid={ `${ componentId }-share-with-all-orgs-checkbox` }
                        />
                        <AnimatePresence mode="wait">
                            {
                                shareType === ShareType.SHARE_ALL
                                && (
                                    <motion.div
                                        key="selected-orgs-block"
                                        initial={ { height: 0, opacity: 0 } }
                                        animate={ { height: "auto", opacity: 1 } }
                                        exit={ { height: 0, opacity: 0 } }
                                        transition={ { duration: 0.3 } }
                                        className="ml-5"
                                    >
                                        <FormControlLabel
                                            control={ (
                                                <Switch
                                                    checked={ roleShareTypeAll === RoleShareType.SHARE_NONE }
                                                    onChange={ (_event: ChangeEvent, checked: boolean) => {
                                                        if (checked) {
                                                            setRoleShareTypeAll(RoleShareType.SHARE_NONE);
                                                        } else {
                                                            setRoleShareTypeAll(RoleShareType.SHARE_WITH_ALL);
                                                        }
                                                    } }
                                                    data-componentid={
                                                        `${ componentId }-share-selected-roles-all-orgs-toggle` }
                                                />
                                            ) }
                                            label={ t("applications:edit.sections.sharedAccess." +
                                                        "doNotShareRolesWithAllOrgs") }
                                        />
                                        <Divider hidden className="mb-0 mt-2" />
                                        {
                                            roleShareTypeAll === RoleShareType.SHARE_WITH_ALL
                                                ? (
                                                    <Alert severity="info">
                                                        { t("applications:edit.sections.sharedAccess." +
                                                            "allRolesAndOrgsSharingMessage") }
                                                    </Alert>
                                                ) : (
                                                    <Alert severity="info">
                                                        { t("applications:edit.sections.sharedAccess." +
                                                            "allRolesAndOrgsNotSharingMessage") }
                                                    </Alert>
                                                )
                                        }
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>
                    </RadioGroup>
                </FormControl>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    data-testid={ `${ componentId }-cancel-button` }
                    onClick={ () => onApplicationSharingCompleted() }
                >
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    disabled={
                        shareType === ShareType.SHARE_SELECTED  && selectedOrgIds?.length < 1
                    }
                    onClick={ () => {
                        handleApplicationSharing();
                    } }
                    data-testid={ `${ componentId }-save-button` }
                >
                    { t(
                        "applications:edit.sections.shareApplication.shareApplication"
                    ) }
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    );
};
