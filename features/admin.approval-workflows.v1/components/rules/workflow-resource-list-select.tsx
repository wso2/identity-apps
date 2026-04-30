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

import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import { AppState } from "@wso2is/admin.core.v1/store";
import useRulesContext from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ConditionExpressionMetaInterface } from "@wso2is/admin.rules.v1/models/meta";
import { ResourceInterface } from "@wso2is/admin.rules.v1/models/resource";
import { ExpressionFieldTypes } from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    Dispatch,
    FunctionComponent,
    HTMLAttributes,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AutoCompleteRenderOption from "./auto-complete-render-option";
import WorkflowResourceAutocomplete from "./workflow-resource-autocomplete";
import useGetWorkflowResources from "../../hooks/use-get-workflow-resources";
import { normalizeResourceResponse, processResourceItems } from "../../utils/resource-utils";

/**
 * Props interface of {@link WorkflowResourceListSelect}
 */
export interface WorkflowResourceListSelectPropsInterface extends IdentifiableComponentInterface {
    conditionId: string;
    expressionId: string;
    expressionValue: string;
    ruleId: string;
    filterBaseResourcesUrl: string;
    findMetaValuesAgainst: ConditionExpressionMetaInterface;
    initialResourcesLoadUrl: string;
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
    hiddenResources?: string[];
    readonly?: boolean;
    showValidationError?: boolean;
}

/**
 * Resource list select component for workflow fields.
 * Handles searchable autocomplete (roles, groups) and simple Select (userstores).
 *
 * @param props - Props injected to the component.
 * @returns WorkflowResourceListSelect component.
 */
const WorkflowResourceListSelect: FunctionComponent<WorkflowResourceListSelectPropsInterface> = ({
    ["data-componentid"]: _componentId = "workflow-condition-expression-input-value",
    ruleId: _ruleId,
    conditionId: _conditionId,
    setIsResourceMissing,
    expressionValue: _expressionValue,
    expressionId: _expressionId,
    findMetaValuesAgainst,
    initialResourcesLoadUrl,
    filterBaseResourcesUrl,
    hiddenResources: _hiddenResources = [],
    readonly: isReadonly,
    showValidationError = false
}: WorkflowResourceListSelectPropsInterface) => {
    const [ resourceDetails, setResourceDetails ] = useState<ResourceInterface>(null);
    const valueReferenceAttribute: string = findMetaValuesAgainst?.value?.valueReferenceAttribute || "id";
    const valueDisplayAttribute: string = findMetaValuesAgainst?.value?.valueDisplayAttribute || "name";

    const { updateConditionExpression } = useRulesContext();
    const { t } = useTranslation();

    const systemReservedUserStores: string[] = useSelector(
        (state: AppState) => state?.config?.ui?.systemReservedUserStores
    );

    // Generic detail fetch for non-claim fields.
    const needsDetailFetch: boolean = valueReferenceAttribute !== valueDisplayAttribute;
    const detailBaseUrl: string = initialResourcesLoadUrl?.split("?")[0];

    const shouldFetchDetails: boolean =
        !!_expressionValue && !!detailBaseUrl && needsDetailFetch;
    const detailsUrl: string = shouldFetchDetails
        ? `${detailBaseUrl}/${_expressionValue}`
        : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resourcesListResponse: any = useGetWorkflowResources(initialResourcesLoadUrl, true);
    const fetchedResourcesList: any = resourcesListResponse.data;
    const isResourcesListLoading: boolean = resourcesListResponse.isLoading;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resourceDetailsResponse: any = useGetWorkflowResources(detailsUrl, shouldFetchDetails);
    const resourcesDetails: any = resourceDetailsResponse.data;
    const isResourceDetailsLoading: boolean = resourceDetailsResponse.isLoading;
    const resourceDetailsError: any = resourceDetailsResponse.error;

    useEffect(() => {
        if (!shouldFetchDetails) {
            setResourceDetails(null);
            setIsResourceMissing(false);

            return;
        }

        if (!isResourceDetailsLoading) {
            if (resourceDetailsError) {
                setIsResourceMissing(true);
                setResourceDetails(null);
            } else {
                setResourceDetails(resourcesDetails);
            }
        }
    }, [ isResourceDetailsLoading, resourceDetailsError, shouldFetchDetails ]);

    if (isResourcesListLoading || !fetchedResourcesList) {
        return <CircularProgress size={ 20 } />;
    }

    // If filtering is supported, use searchable autocomplete.
    if (filterBaseResourcesUrl && initialResourcesLoadUrl) {
        return (
            <WorkflowResourceAutocomplete
                conditionId={ _conditionId }
                ruleId={ _ruleId }
                expressionId={ _expressionId }
                expressionValue={ _expressionValue }
                resourceDetails={ resourceDetails }
                valueReferenceAttribute={ valueReferenceAttribute }
                valueDisplayAttribute={ valueDisplayAttribute }
                initialResourcesLoadUrl={ initialResourcesLoadUrl }
                filterBaseResourcesUrl={ filterBaseResourcesUrl }
                shouldFetch={ true }
                hiddenResources={ _hiddenResources }
                showClearFilter={ false }
                readonly={ isReadonly }
                showValidationError={ showValidationError }
            />
        );
    }

    // Otherwise fallback to a normal Select dropdown.
    const { items: normalizedItems } = normalizeResourceResponse(fetchedResourcesList);
    const ROLES_ENDPOINT: string = "/Roles";

    // Special handling for userstores (user.domain / initiator.domain).
    const processedItems: ResourceInterface[] = processResourceItems(
        normalizedItems,
        initialResourcesLoadUrl,
        systemReservedUserStores
    );

    const items: ResourceInterface[] =
        resourceDetails &&
        _expressionValue &&
        !processedItems.some(
            (item: ResourceInterface) => item[valueReferenceAttribute] === _expressionValue
        )
            ? [ resourceDetails, ...processedItems ]
            : processedItems;

    return (
        <Select
            disabled={ isReadonly }
            value={ _expressionValue || "" }
            displayEmpty
            error={ showValidationError }
            data-componentid={ _componentId }
            MenuProps={ {
                disablePortal: false,
                sx: { zIndex: 9999 }
            } }
            onChange={ (e: SelectChangeEvent) => {
                updateConditionExpression(
                    e.target.value,
                    _ruleId,
                    _conditionId,
                    _expressionId,
                    ExpressionFieldTypes.Value,
                    true
                );
            } }
            renderValue={ (selected: string) => {
                if (!selected) {
                    return (
                        <Box component="span" sx={ { color: "text.disabled" } }>
                            { t("rules:fields.autocomplete.selectPlaceholderText") }
                        </Box>
                    );
                }

                return selected;
            } }
        >
            { items
                ?.filter(
                    (resource: ResourceInterface) =>
                        !_hiddenResources.includes(resource[valueReferenceAttribute])
                )
                .map((resource: ResourceInterface, index: number) => {

                    const isRolesResource: boolean =
                        initialResourcesLoadUrl?.includes(ROLES_ENDPOINT);

                    if (isRolesResource) {
                        return (
                            <MenuItem
                                value={ resource[valueReferenceAttribute] }
                                key={ `${_expressionId}-${index}` }
                            >
                                <AutoCompleteRenderOption
                                    displayName={ resource[valueDisplayAttribute] }
                                    audience={ resource.audience?.type }
                                    audienceDisplay={ resource.audience?.display }
                                    renderOptionProps={ {} as HTMLAttributes<HTMLLIElement> }
                                />
                            </MenuItem>
                        );
                    }

                    return (
                        <MenuItem
                            value={ resource[valueReferenceAttribute] }
                            key={ `${_expressionId}-${index}` }
                        >
                            { resource[valueDisplayAttribute] }
                        </MenuItem>
                    );
                }) }
        </Select>
    );
};

export default WorkflowResourceListSelect;
