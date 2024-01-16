/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Tabs from "@oxygen-ui/react/Tabs";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import React, {
    FunctionComponent,
    LazyExoticComponent,
    ReactElement,
    SyntheticEvent,
    lazy,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import CustomTextFields from "./custom-text-fields";
import CustomTextUnsavedChangesConfirmationModal from "./custom-text-unsaved-changes-confirmation-modal";
import { CustomTextPreferenceConstants } from "../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../hooks/use-branding-preference";
import { BrandingSubFeatures, PreviewScreenType } from "../../models";
import { CustomTextConfigurationModes, CustomTextInterface } from "../../models/custom-text-preference";
import replaceObjectKeySymbols from "../../utils/replace-object-key-symbols";
import LocaleDropdown from "../locale-dropdown";
import ScreenDropdown from "../screen-dropdown";
import "./custom-text.scss";

const MonacoEditor: LazyExoticComponent<any> = lazy(() =>
    import("@monaco-editor/react" /* webpackChunkName: "MDMonacoEditor" */)
);

/**
 * Prop types for the text customization component.
 */
export interface CustomTextProps extends IdentifiableComponentInterface {
    /**
     * Is readonly.
     */
    readOnly?: boolean;
}

/**
 * Interface for tabs.
 */
interface DisplayTabInterface extends IdentifiableComponentInterface {
    /**
     * Tab id.
     */
    id: CustomTextConfigurationModes;
    /**
     * Tab class name.
     */
    className: string;
    /**
     * Tab label.
     */
    label: string;
    /**
     * Tab value.
     */
    value: number;
    /**
     * Tab pane.
     */
    pane: ReactElement;
}

/**
 * Text customization parent component.
 *
 * @param props - Props injected to the component.
 * @returns Text customization component.
 */
const CustomText: FunctionComponent<CustomTextProps> = (props: CustomTextProps): ReactElement => {
    const {
        readOnly,
        "data-componentid": componentId
    } = props;

    const { t } = useTranslation();

    const {
        customText,
        getScreens,
        getLocales,
        customTextFormSubscription,
        onSelectedPreviewScreenChange,
        onSelectedLocaleChange,
        updateCustomTextFormSubscription,
        updateCustomTextPreference,
        updateActiveCustomTextConfigurationMode
    } = useBrandingPreference();

    const [ requestedPreviewScreen, setRequestedPreviewScreen ] = useState<PreviewScreenType>(null);
    const [
        showCustomTextUnsavedChangesConfirmationModal,
        setShowCustomTextUnsavedChangesConfirmationModal
    ] = useState<boolean>(false);

    const handleSubmit = (values: any) => {
        updateCustomTextPreference(values);
    };

    const DisplayTabs: DisplayTabInterface[] = useMemo(
        () => [
            {
                className: "text-fields-view",
                "data-componentid": `${componentId}-text-fields-view`,
                id: CustomTextConfigurationModes.TEXT_FIELDS,
                label: t("console:brandingCustomText.modes.text.label"),
                pane: (
                    <div className="form-container with-max-width">
                        <CustomTextFields readOnly={ readOnly } onSubmit={ handleSubmit } fields={ customText } />
                    </div>
                ),
                value: 0
            },
            {
                className: "json-view",
                "data-componentid": `${componentId}-json-view`,
                id: CustomTextConfigurationModes.JSON,
                label: t("console:brandingCustomText.modes.json.label"),
                pane: (
                    <MonacoEditor
                        loading={ null }
                        className="script-editor"
                        width="100%"
                        height="100%"
                        language="json"
                        theme="vs-dark"
                        value={ JSON.stringify(customText, null, 4) }
                        options={ {
                            automaticLayout: true,
                            lineNumbers: "off",
                            readOnly
                        } }
                        lineNumbers="off"
                        onChange={ (values: string) => {
                            try {
                                updateCustomTextFormSubscription({
                                    values: replaceObjectKeySymbols(JSON.parse(values), "_", ".") as CustomTextInterface
                                });
                            } catch (e) {
                                updateCustomTextFormSubscription({
                                    values: cloneDeep(
                                        replaceObjectKeySymbols(customText, "_", ".") as CustomTextInterface
                                    )
                                });
                            }
                        } }
                        data-componentid={ `${componentId}-code-editor` }
                    />
                ),
                value: 1
            }
        ],
        [ customText, handleSubmit ]
    );

    const [ activeCustomTextMode, setActiveCustomTextMode ] = useState<number>(DisplayTabs[0].value);

    return (
        <div className="branding-preference-custom-text">
            <div className="branding-preference-custom-text-static-header">
                <LocaleDropdown
                    required
                    defaultLocale={ CustomTextPreferenceConstants.DEFAULT_LOCALE }
                    locales={ getLocales(BrandingSubFeatures.CUSTOM_TEXT) }
                    onChange={ (locale: string) => {
                        onSelectedLocaleChange(locale);
                    } }
                />
                <ScreenDropdown
                    required
                    defaultScreen={ PreviewScreenType.COMMON }
                    screens={ getScreens(BrandingSubFeatures.CUSTOM_TEXT) }
                    onChange={ (screen: PreviewScreenType) => {
                        if (customTextFormSubscription?.dirty) {
                            setRequestedPreviewScreen(screen);
                            setShowCustomTextUnsavedChangesConfirmationModal(true);
                        } else {
                            onSelectedPreviewScreenChange(screen);
                        }
                    } }
                />
            </div>
            <div className="branding-preference-custom-text-content">
                <Tabs
                    value={ activeCustomTextMode }
                    onChange={ (_: SyntheticEvent, newValue: number) => {
                        setActiveCustomTextMode(newValue);

                        const activeMode: DisplayTabInterface = DisplayTabs.find((tab: DisplayTabInterface) => {
                            return tab.value === newValue;
                        });

                        updateActiveCustomTextConfigurationMode(activeMode.id);
                    } }
                    aria-label="basic tabs example"
                >
                    { DisplayTabs.map((tab: DisplayTabInterface) => (
                        <Tab key={ tab.value } label={ tab.label } />
                    )) }
                </Tabs>
                { DisplayTabs.map((tab: DisplayTabInterface, index: number) => (
                    <TabPanel
                        key={ tab.value }
                        value={ activeCustomTextMode }
                        index={ index }
                        className={ tab.className }
                        data-componentid={ tab["data-componentid"] }
                    >
                        { tab.pane }
                    </TabPanel>
                )) }
            </div>
            { showCustomTextUnsavedChangesConfirmationModal && (
                <CustomTextUnsavedChangesConfirmationModal
                    open={ showCustomTextUnsavedChangesConfirmationModal }
                    onClose={ () => setShowCustomTextUnsavedChangesConfirmationModal(false) }
                    onPrimaryActionClick={ () => {
                        onSelectedPreviewScreenChange(requestedPreviewScreen);
                        setShowCustomTextUnsavedChangesConfirmationModal(false);
                    } }
                />
            ) }
        </div>
    );
};

/**
 * Default props for the component.
 */
CustomText.defaultProps = {
    "data-componentid": "custom-text"
};

export default CustomText;
