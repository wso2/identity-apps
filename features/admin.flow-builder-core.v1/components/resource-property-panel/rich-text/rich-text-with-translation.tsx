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

import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    ChangeEvent,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { ToolbarPluginProps } from "./helper-plugins/toolbar-plugin";
import RichText from "./rich-text";
import { Resource } from "../../../models/resources";
import I18nConfigurationCard, { LanguageTextFieldProps } from "../i18n-configuration-card";
import "./rich-text-with-translation.scss";

/**
 * Props interface for the RichTextWithTranslation component.
 */
export interface RichTextWithTranslationProps extends IdentifiableComponentInterface {
    /**
     * Options to customize the rich text editor toolbar.
     */
    ToolbarProps?: ToolbarPluginProps;
    /**
     * Listener for changes in the rich text editor content.
     *
     * @param value - The HTML string representation of the rich text editor content.
     */
    onChange: (value: string) => void;
    /**
     * Additional CSS class names to apply to the rich text editor container.
     */
    className?: string;
    /**
     * The resource associated with the rich text editor.
     */
    resource: Resource;
}

const TranslationRichText: FunctionComponent<LanguageTextFieldProps> = ({
    onChange,
    value,
    disabled
}: LanguageTextFieldProps): ReactElement => {
    /**
     * Resource object to hold the rich text editor content.
     */
    const resource: Resource = useMemo(() => {
        return {
            config: {
                text: value || ""
            }
        } as Resource;
    }, [ value ]);

    /**
     * Handles changes in the rich text editor.
     *
     * @param value - The new value of the rich text editor.
     */
    const handleRichTextChange = (value: string) => {
        onChange({
            target: {
                value
            }
        } as ChangeEvent<HTMLInputElement>);
    };

    return (
        <RichText
            onChange={ handleRichTextChange }
            resource={ resource }
            disabled={ disabled }
        />
    );
};

/**
 * Rich text editor component with translation support.
 */
const RichTextWithTranslation: FunctionComponent<RichTextWithTranslationProps> = ({
    "data-componentid": componentId = "rich-text-with-translation",
    ToolbarProps,
    className,
    onChange,
    resource
}: RichTextWithTranslationProps): ReactElement => {
    const { t } = useTranslation();
    const [ isI18nCardOpen, setIsI18nCardOpen ] = useState<boolean>(false);
    const buttonRef: MutableRefObject<HTMLButtonElement> = useRef(null);

    return (
        <Box className="rich-text-with-translation-container">
            <RichText
                data-componentid={ componentId }
                ToolbarProps={ ToolbarProps }
                className={ className }
                onChange={ onChange }
                resource={ resource }
            />
            <Tooltip
                title={ t("flows:core.elements.textPropertyField.tooltip.configureTranslation") }
            >
                <IconButton
                    ref={ buttonRef }
                    onClick={ () => setIsI18nCardOpen(!isI18nCardOpen) }
                    size="small"
                    className="rich-text-translation-icon-button"
                >
                    <PlusIcon />
                </IconButton>
            </Tooltip>
            {
                isI18nCardOpen && (
                    <I18nConfigurationCard
                        open={ isI18nCardOpen }
                        anchorEl={ buttonRef.current }
                        propertyKey="richText"
                        onClose={ () => setIsI18nCardOpen(false) }
                        data-componentid={ `${componentId}-i18n-card` }
                        i18nKey={
                            /^{{(.*)}}$/.test(resource.config?.text || "")
                                ? (resource.config?.text || "").slice(2, -2)
                                : null
                        }
                        onChange={ (i18nKey: string) => onChange(i18nKey ? `{{${i18nKey}}}` : "") }
                        LanguageTextField={ TranslationRichText }
                    />
                )
            }
        </Box>
    );
};

export default RichTextWithTranslation;
