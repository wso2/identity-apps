/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Divider from "@oxygen-ui/react/Divider";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import OrganizationAttributeConstants from "../../../constants/organization-attribute-constants";
import { OrganizationAttribute } from "../../../models/attributes";

interface DefineOrganizationAttributeModalPropsInterface extends IdentifiableComponentInterface {
    open: boolean;
    /**
     * Attribute being edited. `null` opens the dialog empty to define a new one.
     */
    attribute: OrganizationAttribute | null;
    onClose: () => void;
    onSubmit: (_attribute: OrganizationAttribute) => void;
}

/**
 * Derive an identifier from a label: "Business Type Center" becomes "businessTypeCenter".
 *
 * @param label - Label typed by the admin.
 * @returns A candidate identifier, empty when the label has no usable characters.
 */
const deriveIdentifier = (label: string): string => {
    const words: string[] = label.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);

    if (words.length === 0) {
        return "";
    }

    return words
        .map((word: string, index: number) =>
            (index === 0
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1)))
        .join("")
        .replace(/^[^a-zA-Z]+/, "");
};

/**
 * Dialog to define or edit the custom organization attribute bound to a field.
 *
 * The identifier is what the flow persists as `config.identifier`; the label is what the builder
 * and the flow extension editor display. The identifier tracks the label until it is edited by
 * hand, after which it is left alone.
 *
 * @param props - Props injected to the component.
 * @returns The DefineOrganizationAttributeModal component.
 */
const DefineOrganizationAttributeModal: FunctionComponent<DefineOrganizationAttributeModalPropsInterface> = ({
    open,
    attribute,
    onClose,
    onSubmit,
    ["data-componentid"]: componentId = "define-organization-attribute-modal"
}: DefineOrganizationAttributeModalPropsInterface): ReactElement => {

    const [ label, setLabel ] = useState<string>("");
    const [ identifier, setIdentifier ] = useState<string>("");
    const [ isIdentifierEdited, setIsIdentifierEdited ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>("");

    /**
     * Load the attribute being edited whenever the dialog opens.
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        setLabel(attribute?.displayName ?? "");
        setIdentifier(attribute?.claimURI ?? "");
        // An attribute being edited already has an identifier that must not be overwritten by
        // the next keystroke in the label field.
        setIsIdentifierEdited(!!attribute);
        setError("");
    }, [ open, attribute ]);

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value: string = event.target.value;

        setLabel(value);

        if (!isIdentifierEdited) {
            setIdentifier(deriveIdentifier(value));
        }
    };

    const handleIdentifierChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setIsIdentifierEdited(true);
        setIdentifier(event.target.value);
    };

    const handleSubmit = (): void => {
        const trimmedLabel: string = label.trim();
        const trimmedIdentifier: string = identifier.trim();

        if (!trimmedLabel) {
            setError("Enter a label for the attribute.");

            return;
        }

        if (!OrganizationAttributeConstants.KEY_PATTERN.test(trimmedIdentifier)) {
            setError("Identifier must start with a letter and contain only letters, numbers or underscores.");

            return;
        }

        const isCore: boolean = OrganizationAttributeConstants.CORE_ATTRIBUTES.some(
            (coreAttribute: OrganizationAttribute) => coreAttribute.claimURI === trimmedIdentifier
        );

        if (isCore) {
            setError("That identifier belongs to a built-in attribute. Choose a different one.");

            return;
        }

        onSubmit({ claimURI: trimmedIdentifier, displayName: trimmedLabel });
    };

    return (
        <Dialog
            open={ open }
            onClose={ onClose }
            maxWidth="xs"
            fullWidth
            data-componentid={ componentId }
        >
            <DialogTitle sx={ { pb: 0.5 } }>
                <Typography variant="subtitle2" sx={ { fontWeight: 600 } }>
                    { attribute ? "Edit Custom Attribute" : "Define Custom Attribute" }
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    The identifier is stored in the flow and sent to connected services.
                </Typography>
            </DialogTitle>
            <DialogContent sx={ { pt: "12px !important" } }>
                <Stack spacing={ 2 }>
                    <TextField
                        fullWidth
                        size="small"
                        label="Label"
                        placeholder="e.g. Business Type Center"
                        value={ label }
                        onChange={ handleLabelChange }
                        data-componentid={ `${componentId}-label` }
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Identifier"
                        placeholder="e.g. businessTypeCenter"
                        value={ identifier }
                        onChange={ handleIdentifierChange }
                        error={ !!error }
                        helperText={ error }
                        data-componentid={ `${componentId}-identifier` }
                    />
                </Stack>
            </DialogContent>
            <Divider sx={ { borderColor: "grey.100" } } />
            <DialogActions sx={ { gap: 1, px: 2.5, py: 1.5 } }>
                <Button
                    onClick={ onClose }
                    variant="outlined"
                    size="small"
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    Cancel
                </Button>
                <Button
                    onClick={ handleSubmit }
                    variant="contained"
                    size="small"
                    disabled={ !label.trim() || !identifier.trim() }
                    data-componentid={ `${componentId}-submit-button` }
                >
                    { attribute ? "Save" : "Define" }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DefineOrganizationAttributeModal;
