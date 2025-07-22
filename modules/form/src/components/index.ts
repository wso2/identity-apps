/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

export * from "./adapters/__DEPRECATED__adapters";
export * from "./adapters/text-field-adapter";
export * from "./adapters/url-field-adapter";
export * from "./adapters/file-picker-adapter";
export * from "./adapters/__DEPRECATED__select-field-adapter";
export * from "./adapters/checkbox-field-adapter";
export * from "./adapters/checkbox-group-field-adapter";
export * from "./adapters/checkbox-field-adapter";
export * from "./adapters/switch-field-adapter";

export { default as TextFieldAdapter } from "./adapters/text-field-adapter";
export { default as __DEPRECATED__SelectFieldAdapter } from "./adapters/__DEPRECATED__select-field-adapter";
export { default as SelectFieldAdapter } from "./adapters/select-field-adapter";
export { default as AutocompleteFieldAdapter } from "./adapters/autocomplete-field-adapter";
export { default as URLFieldAdapter } from "./adapters/url-field-adapter";
export { default as CheckboxFieldAdapter } from "./adapters/checkbox-field-adapter";
export { default as CheckboxGroupFieldAdapter } from "./adapters/checkbox-group-field-adapter";
export { default as SwitchFieldAdapter } from "./adapters/switch-field-adapter";
export { default as FilePickerAdapter } from "./adapters/file-picker-adapter";
export { default as RadioGroupFieldAdapter } from "./adapters/radio-group-field-adapter";

export * from "./field";
export * from "./field-button";
export * from "./field-color-picker";
export * from "./__DEPRECATED__field-checkbox";
export * from "./field-checkbox";
export * from "./field-checkbox-legacy";
export * from "./field-input";
export * from "./field-textarea";
export * from "./field-dropdown";
export * from "./field-query-params";
export * from "./field-radio";
export * from "./form";
export * from "./wizard";
export * from "./wizard2";
export * from "./wizardPage";

// Export react-final-form components with a different name.
export { Form as FinalForm } from "react-final-form";
export { Field as FinalFormField } from "react-final-form";
export { FormRenderProps } from "react-final-form";
export { FormSpy } from "react-final-form";
export { FormProps } from "react-final-form";

export * from "final-form";
export * as ReactFinalForm from "react-final-form";
