/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Popover, { PopoverProps } from "@mui/material/Popover";
import { ChevronDownIcon, PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Code from "@oxygen-ui/react/Code";
import Divider from "@oxygen-ui/react/Divider";
import IconButton from "@oxygen-ui/react/IconButton";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Typography from "@oxygen-ui/react/Typography";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { MouseEvent, ReactElement, SVGProps, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SecretDeleteConfirmationModal from "./secret-delete-confirmation-modal";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetSecrets } from "@wso2is/admin.secrets.v1/api/secret";
import AddSecretWizard from "@wso2is/admin.secrets.v1/components/add-secret-wizard";
import { ADAPTIVE_SCRIPT_SECRETS } from "@wso2is/admin.secrets.v1/constants/secrets.common";
import { SecretModel } from "@wso2is/admin.secrets.v1/models/secret";
import "./secret-selection-dropdown.scss";

/**
 * Proptypes for the secret selection dropdown component.
 */
export interface SecretSelectionDropdownPropsInterface extends Partial<PopoverProps>, IdentifiableComponentInterface {
    /**
     * Callback to be fired when a secret is selected.
     */
    onSecretSelect: (secret: SecretModel) => void;
    /**
     * Callback to be fired when the dropdown is opened.
     */
    onOpen: () => void;
}

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const KeyIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        { ...rest }
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            // eslint-disable-next-line max-len
            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
        ></path>
    </svg>
);

/**
 * Secret selection dropdown component.
 *
 * @param props - Props injected to the component.
 * @returns Secret selection dropdown component.
 */
const SecretSelectionDropdown = (props: SecretSelectionDropdownPropsInterface): ReactElement => {
    const { open, onSecretSelect, onClose, onOpen, [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);

    const { data: secretsList, isLoading: isSecretsListRequestLoading, mutate: mutateSecretsList } = useGetSecrets(
        ADAPTIVE_SCRIPT_SECRETS
    );

    const [ isDropdownOpen, setIsDropdownOpen ] = useState<boolean>(open);
    const [ secretsDropdownAnchorEl, setSecretsDropdownAnchorEl ] = useState<null | HTMLElement>(null);
    const [ showAddSecretModal, setShowAddSecretModal ] = useState<boolean>(false);
    const [ showDeleteSecretConfirmationModal, setShowDeleteSecretConfirmationModal ] = useState<boolean>(false);
    const [ deletingSecret, setDeletingSecret ] = useState<SecretModel>(undefined);

    /**
     * Set the dropdown open state when `open` prop changes.
     */
    useEffect(() => {
        setIsDropdownOpen(open);
    }, [ open ]);

    return (
        <>
            <Button
                className="secret-selection-menu-trigger"
                aria-controls={ isDropdownOpen ? "create-new-secret-menu" : undefined }
                aria-haspopup="true"
                aria-expanded={ isDropdownOpen ? "true" : undefined }
                onClick={ (event: MouseEvent<HTMLButtonElement>) => {
                    setSecretsDropdownAnchorEl(event.currentTarget);
                    setIsDropdownOpen(true);
                    onOpen();
                } }
                endIcon={ <ChevronDownIcon /> }
                startIcon={ <KeyIcon height={ 14 } width={ 14 } /> }
                variant="contained"
                color="secondary"
                size="small"
                data-componentid={ `${ componentId }-trigger` }
            >
                { t("authenticationFlow:scriptEditor.secretSelector.label") }
            </Button>
            <Popover
                anchorEl={ secretsDropdownAnchorEl }
                open={ isDropdownOpen }
                onClose={ (event: SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => {
                    setSecretsDropdownAnchorEl(null);
                    setIsDropdownOpen(false);
                    onClose(event, reason);
                } }
                transformOrigin={ { horizontal: "right", vertical: "top" } }
                anchorOrigin={ { horizontal: "right", vertical: "bottom" } }
                classes={ {
                    paper: "create-new-secret-dropdown"
                } }
                data-componentid={ `${ componentId }-popover` }
            >
                <List data-componentid={ `${ componentId }-list` }>
                    { isSecretsListRequestLoading ? (
                        <ListItem
                            alignItems="center"
                            className="create-new-secret-dropdown-item-loading"
                            data-componentid={ `${ componentId }-list-loader` }
                        >
                            <CircularProgress size={ 20 } />
                        </ListItem>
                    ) : secretsList?.length === 0 ? (
                        <ListItem
                            className="create-new-secret-dropdown-empty-placeholder"
                            data-componentid={ `${ componentId }-list-empty-placeholder` }
                        >
                            <ListItemText>
                                <Typography variant="body1">
                                    { t("authenticationFlow:scriptEditor.secretSelector.emptyPlaceholder.header") }
                                </Typography>
                                <Divider  />
                                <Typography variant="caption">
                                    <Trans
                                        i18nKey={
                                            "authenticationFlow:scriptEditor.secretSelector." +
                                            "emptyPlaceholder.description"
                                        }
                                    >
                                            Securely store access keys as secrets. A secret can
                                            replace the consumer secret in <Code variant="caption">
                                                callChoreo()</Code> function
                                            in the conditional authentication scripts.
                                    </Trans>
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    ) : (
                        secretsList?.map((secret: SecretModel, index: number) => (
                            <>
                                <ListItem
                                    key={ secret.secretId }
                                    data-componentid={ `${ componentId }-list-item-${ secret.secretId }` }
                                >
                                    <ListItemText
                                        primary={ <Typography noWrap>{ secret.secretName }</Typography> }
                                        secondary={ <Typography noWrap>{ secret.description }</Typography> }
                                    />
                                    <IconButton
                                        onClick={ () => onSecretSelect(secret) }
                                        data-componentid={ `${ componentId }-list-item-${ secret.secretId }-add` }
                                    >
                                        <PlusIcon size={ 14 } />
                                    </IconButton>
                                    <IconButton
                                        onClick={ () => {
                                            setDeletingSecret(secret);
                                            setShowDeleteSecretConfirmationModal(true);
                                        } }
                                        data-componentid={ `${ componentId }-list-item-${ secret.secretId }-delete` }
                                    >
                                        <TrashIcon size={ 14 } />
                                    </IconButton>
                                </ListItem>
                                { index !== secretsList?.length - 1 && <Divider /> }
                            </>
                        ))
                    ) }
                    <Divider />
                    <ListItem onClick={ () => null } disableGutters disablePadding>
                        {
                            hasRequiredScopes(featureConfig?.secretsManagement,
                                featureConfig?.secretsManagement?.scopes?.create, allowedScopes) && (
                                <Button
                                    fullWidth
                                    color="primary"
                                    className="create-new-secret-button"
                                    startIcon={ <PlusIcon size={ 14 } /> }
                                    onClick={ () => {
                                        setSecretsDropdownAnchorEl(null);
                                        setIsDropdownOpen(false);
                                        setShowAddSecretModal(true);
                                    } }
                                    data-componentid={ `${ componentId }-create-new-secret-button` }
                                >
                                    { t("authenticationFlow:scriptEditor.secretSelector.actions.create.label") }
                                </Button>
                            )
                        }
                    </ListItem>
                </List>
            </Popover>
            { showAddSecretModal && (
                <AddSecretWizard
                    onClose={ () => {
                        setShowAddSecretModal(false);
                        mutateSecretsList();
                    } }
                    data-componentid={ `${ componentId }-add-secret-modal` }
                />
            ) }
            { showDeleteSecretConfirmationModal && (
                <SecretDeleteConfirmationModal
                    deletingSecret={ deletingSecret }
                    open={ showDeleteSecretConfirmationModal }
                    onClose={ () => {
                        setShowDeleteSecretConfirmationModal(false);
                        mutateSecretsList();
                    } }
                    data-componentid={ `${ componentId }-delete-secret-modal` }
                />
            ) }
        </>
    );
};

/**
 * Default props for the component.
 */
SecretSelectionDropdown.defaultProps = {
    "data-componentid": "secret-selection-dropdown"
};

export default SecretSelectionDropdown;
