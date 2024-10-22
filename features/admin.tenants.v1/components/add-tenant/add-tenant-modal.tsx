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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Dialog, { DialogProps } from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import AddTenantForm from "./add-tenant-form";
import addTenant from "../../api/add-tenant";
import TenantConstants from "../../constants/tenant-constants";
import useTenants from "../../hooks/use-tenants";
import { AddTenantRequestPayload } from "../../models/tenants";
import "./add-tenant-modal.scss";

/**
 * Props interface of {@link AddTenantModal}
 */
export type AddTenantModalProps = DialogProps & IdentifiableComponentInterface;

/**
 * Modal to render the form to add a new tenant.
 *
 * @param props - Props injected to the component.
 * @returns Tenant Add Modal component.
 */
const AddTenantModal: FunctionComponent<AddTenantModalProps> = ({
    ["data-componentid"]: componentId = "add-tenant-modal",
    onClose,
    ...rest
}: AddTenantModalProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();
    const { mutateTenantList } = useTenants();

    /**
     * Handles the form submission.
     * @param payload - Form values.
     */
    const handleSubmit = (payload: AddTenantRequestPayload): void => {
        addTenant(payload)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:addTenant.notifications.addTenant.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("tenants:addTenant.notifications.addTenant.success.message")
                    })
                );

                mutateTenantList();
                onClose(null, "backdropClick");
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:addTenant.notifications.addTenant.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("tenants:addTenant.notifications.addTenant.error.message")
                    })
                );
            });
    };

    return (
        <Dialog
            aria-labelledby="add-tenant-modal"
            onClose={ onClose }
            data-componentid={ componentId }
            maxWidth="md"
            className="add-tenant-modal"
            { ...rest }
        >
            <DialogTitle>
                <Typography variant="h4">{ t("tenants:addTenant.title") }</Typography>
                <Typography variant="body2">
                    { t("tenants:addTenant.subtitle") }
                    <DocumentationLink
                        showEmptyLink={ false }
                        link={ getLink("develop.multiTenancy.addTenant.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </Typography>
            </DialogTitle>
            <DialogContent className="add-tenant-modal-content" dividers>
                <AddTenantForm onSubmit={ handleSubmit } />
            </DialogContent>
            <DialogActions>
                <Box className="add-tenant-modal-actions">
                    <Stack direction="row" justifyContent="space-between">
                        <Button
                            variant="text"
                            color="primary"
                            onClick={ (e: MouseEvent<HTMLButtonElement>) => onClose(e, "backdropClick") }
                        >
                            { t("tenants:addTenant.actions.cancel.label") }
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            autoFocus
                            onClick={ () => {
                                document
                                    .getElementById(TenantConstants.ADD_TENANT_FORM_ID)
                                    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                            } }
                        >
                            { t("tenants:addTenant.actions.save.label") }
                        </Button>
                    </Stack>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AddTenantModal;
