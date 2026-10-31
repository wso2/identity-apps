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

import { Theme, styled } from "@mui/material/styles";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Divider from "@oxygen-ui/react/Divider";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import IconButton from "@oxygen-ui/react/IconButton";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon } from "@oxygen-ui/react-icons";
import React, {
    ChangeEvent,
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { OrganizationAttributeEntryInterface } from "./organization-attributes";
import { OrganizationContextConstants } from "../../constants/organization-context-constants";

interface AddOrganizationAttributeModalPropsInterface {
    open: boolean;
    /**
     * Attributes the published flow collects, offered as ready-made options.
     */
    attributeOptions: OrganizationAttributeEntryInterface[];
    /**
     * Keys already present under the container, excluded from the options.
     */
    existingKeys: string[];
    onClose: () => void;
    onSubmit: (_attributes: OrganizationAttributeEntryInterface[]) => void;
    "data-componentid"?: string;

}

const DefinePanel: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5)
}));

const DefineAddButton: typeof IconButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
    "&.Mui-disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled
    },
    "&:hover": {
        backgroundColor: theme.palette.primary.dark
    },
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.contrastText,
    flexShrink: 0,
    height: theme.spacing(5),
    width: theme.spacing(5)
}));


/**
 * Modal to add organization attributes to the attributes container.
 *
 * Offers the attributes the published flow already collects, and lets a key be defined by hand for
 * the case where the extension is configured before the flow that collects it exists.
 *
 * @param props - Props injected to the component.
 * @returns The AddOrganizationAttributeModal component.
 */
const AddOrganizationAttributeModal: FunctionComponent<AddOrganizationAttributeModalPropsInterface> = ({
    open,
    attributeOptions,
    existingKeys,
    onClose,
    onSubmit,
    ["data-componentid"]: componentId = "add-organization-attribute-modal"
}: AddOrganizationAttributeModalPropsInterface): ReactElement => {

    const { t } = useTranslation();

    // Shared by the tooltip and the aria-label, since the button carries no visible text.
    const defineLabel: string = t("flowExtension:contextTree.addOrganizationAttributeModal." +
        "defineCustomAttribute.addButton");

    const [ selected, setSelected ] = useState<OrganizationAttributeEntryInterface[]>([]);
    const [ customAttributes, setCustomAttributes ] = useState<OrganizationAttributeEntryInterface[]>([]);
    const [ customKey, setCustomKey ] = useState<string>("");
    const [ customLabel, setCustomLabel ] = useState<string>("");
    const [ defineError, setDefineError ] = useState<string>("");

    // Attributes defined here join the option list so they render as selected options rather than
    // as values with no matching option.
    const available: OrganizationAttributeEntryInterface[] = [ ...attributeOptions, ...customAttributes ].filter(
        (attribute: OrganizationAttributeEntryInterface) => !existingKeys.includes(attribute.key)
    );

    const handleDefine = (): void => {
        const key: string = customKey.trim();
        const label: string = customLabel.trim();

        if (!OrganizationContextConstants.KEY_PATTERN.test(key)) {
            setDefineError(t("flowExtension:contextTree.addOrganizationAttributeModal.invalidKey"));

            return;
        }

        const isTaken: boolean = existingKeys.includes(key)
            || available.some((attribute: OrganizationAttributeEntryInterface) => attribute.key === key);

        if (isTaken) {
            setDefineError(t("flowExtension:contextTree.addOrganizationAttributeModal.duplicateKey"));

            return;
        }

        const attribute: OrganizationAttributeEntryInterface = { key, label: label || key };

        setCustomAttributes((previous: OrganizationAttributeEntryInterface[]) => [ ...previous, attribute ]);
        setSelected((previous: OrganizationAttributeEntryInterface[]) => [ ...previous, attribute ]);
        setCustomKey("");
        setCustomLabel("");
        setDefineError("");
    };

    const handleCustomKeyChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setCustomKey(event.target.value);
        setDefineError("");
    };

    const reset = (): void => {
        setSelected([]);
        setCustomAttributes([]);
        setCustomKey("");
        setCustomLabel("");
        setDefineError("");
    };

    const handleClose = (): void => {
        reset();
        onClose();
    };

    const handleSubmit = (): void => {
        if (selected.length === 0) {
            return;
        }

        onSubmit(selected);
        reset();
    };

    return (
        <Dialog
            open={ open }
            onClose={ handleClose }
            maxWidth="sm"
            fullWidth
            data-componentid={ componentId }
            PaperProps={ {
                sx: { border: "1px solid", borderColor: "grey.200", borderRadius: "10px" }
            } }
            sx={ {
                filter: "none !important"
            } }
        >
            <DialogTitle sx={ { pb: 0.5 } }>
                <Typography variant="subtitle2" sx={ { fontWeight: 600 } }>
                    { t("flowExtension:contextTree.addOrganizationAttributeModal.title") }
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    { t("flowExtension:contextTree.addOrganizationAttributeModal.subtitle") }
                </Typography>
            </DialogTitle>
            <DialogContent sx={ { pt: "12px !important" } }>
                <Autocomplete
                    multiple
                    fullWidth
                    disableCloseOnSelect
                    options={ available }
                    value={ selected }
                    onChange={ (_event: SyntheticEvent, value: OrganizationAttributeEntryInterface[]) =>
                        setSelected(value) }
                    getOptionLabel={ (attribute: OrganizationAttributeEntryInterface) =>
                        attribute?.label || attribute?.key || "" }
                    isOptionEqualToValue={ (
                        option: OrganizationAttributeEntryInterface,
                        value: OrganizationAttributeEntryInterface
                    ) => option?.key === value?.key }
                    noOptionsText={ t("flowExtension:contextTree.addOrganizationAttributeModal.noOptions") }
                    renderOption={ (
                        props: HTMLAttributes<HTMLLIElement>,
                        attribute: OrganizationAttributeEntryInterface
                    ) => (
                        <li { ...props } key={ attribute.key }>
                            <Box sx={ { minWidth: 0, overflow: "hidden", width: "100%" } }>
                                <Typography variant="body2" sx={ { fontWeight: 500 } }>
                                    { attribute.label }
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    sx={ {
                                        display: "block",
                                        fontFamily: "monospace",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    } }
                                >
                                    { attribute.key }
                                </Typography>
                            </Box>
                        </li>
                    ) }
                    renderInput={ (params: AutocompleteRenderInputParams) => (
                        <TextField
                            { ...params }
                            size="small"
                            placeholder={
                                t("flowExtension:contextTree.addOrganizationAttributeModal.searchPlaceholder")
                            }
                            data-componentid={ `${componentId}-search` }
                        />
                    ) }
                    data-componentid={ `${componentId}-select` }
                />
                <DefinePanel>
                    <Typography variant="body2" sx={ { fontWeight: 600 } }>
                        { t("flowExtension:contextTree.addOrganizationAttributeModal.defineCustomAttribute.title") }
                    </Typography>
                    <Stack direction="row" spacing={ 1 } alignItems="end" sx={ { pt: 1.5 } }>
                        <TextField
                            fullWidth
                            required
                            size="small"
                            label={
                                t("flowExtension:contextTree.addOrganizationAttributeModal." +
                                    "defineCustomAttribute.keyLabel")
                            }
                            placeholder={
                                t("flowExtension:contextTree.addOrganizationAttributeModal." +
                                    "defineCustomAttribute.keyPlaceholder")
                            }
                            value={ customKey }
                            onChange={ handleCustomKeyChange }
                            error={ !!defineError }
                            data-componentid={ `${componentId}-custom-key` }
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label={
                                t("flowExtension:contextTree.addOrganizationAttributeModal." +
                                    "defineCustomAttribute.labelLabel")
                            }
                            placeholder={
                                t("flowExtension:contextTree.addOrganizationAttributeModal." +
                                    "defineCustomAttribute.labelPlaceholder")
                            }
                            value={ customLabel }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                setCustomLabel(event.target.value) }
                            data-componentid={ `${componentId}-custom-label` }
                        />
                        <Tooltip title={ defineLabel }>
                            <span>
                                <DefineAddButton
                                    size="small"
                                    onClick={ handleDefine }
                                    disabled={ !customKey.trim() }
                                    aria-label={ defineLabel }
                                    data-componentid={ `${componentId}-define-button` }
                                >
                                    <PlusIcon size={ 14 } />
                                </DefineAddButton>
                            </span>
                        </Tooltip>
                    </Stack>
                    { defineError && (
                        <FormHelperText error data-componentid={ `${componentId}-define-error` }>
                            { defineError }
                        </FormHelperText>
                    ) }
                </DefinePanel>
            </DialogContent>
            <Divider sx={ { borderColor: "grey.100" } } />
            <DialogActions sx={ { gap: 1, px: 2.5, py: 1.5 } }>
                <Button
                    onClick={ handleClose }
                    variant="outlined"
                    size="small"
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    { t("flowExtension:contextTree.addOrganizationAttributeModal.cancelButton") }
                </Button>
                <Button
                    onClick={ handleSubmit }
                    variant="contained"
                    size="small"
                    disabled={ selected.length === 0 }
                    data-componentid={ `${componentId}-submit-button` }
                >
                    { t("flowExtension:contextTree.addOrganizationAttributeModal.addButton") }
                    { selected.length > 0 ? ` (${selected.length})` : "" }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddOrganizationAttributeModal;
