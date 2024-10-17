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

import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Typography from "@oxygen-ui/react/Typography/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import AddTenantForm from "./add-tenant-form";
import useGetTenants from "../../api/use-get-tenants";
import TenantConstants from "../../constants/tenant-constants";

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
    const { getLink } = useDocumentation();
    const { mutate: mutateTenantList } = useGetTenants();

    return (
        <Dialog
            aria-labelledby="add-tenant-modal"
            onClose={ onClose }
            data-componentid={ componentId }
            maxWidth="md"
            { ...rest }
        >
            <DialogTitle>
                <Typography variant="h4">{ t("tenants:addTenant.title") }</Typography>
                <Typography variant="body2">
                    { t("tenants:addTenant.subTitle") }
                    <DocumentationLink
                        link={ getLink("develop.multiTenancy.addTenant.learnMore") }
                        showEmptyLink={ false }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </Typography>
            </DialogTitle>
            <DialogContent
                sx={ {
                    px: "var(--wso2is-admin-modal-content-x-spacing)",
                    py: "var(--wso2is-admin-modal-content-y-spacing)"
                } }
                dividers
            >
                <AddTenantForm
                    onSubmit={ (): void => {
                        onClose(null, "backdropClick");
                        mutateTenantList();
                    } }
                />
            </DialogContent>
            <DialogActions>
                <Box sx={ { width: "100%" } }>
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
