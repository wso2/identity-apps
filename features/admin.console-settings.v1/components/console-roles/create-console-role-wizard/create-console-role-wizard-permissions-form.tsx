/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import Paper from "@oxygen-ui/react/Paper";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronDownIcon } from "@oxygen-ui/react-icons";
import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { CreateRolePermissionInterface } from "@wso2is/admin.roles.v2/models/roles";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import flatMap from "lodash-es/flatMap";
import fromPairs from "lodash-es/fromPairs";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import mapValues from "lodash-es/mapValues";
import omit from "lodash-es/omit";
import values from "lodash-es/values";
import React, {
    ChangeEvent,
    FunctionComponent,
    MouseEvent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useGetAPIResourceCollections from "../../../api/use-get-api-resource-collections";
import { ConsoleRolesOnboardingConstants } from "../../../constants/console-roles-onboarding-constants";
import {
    APIResourceCollectionInterface,
    APIResourceCollectionPermissionCategoryInterface,
    APIResourceCollectionResponseInterface,
    APIResourceCollectionTypes
} from "../../../models/console-roles";
import {
    PermissionScopeInterface,
    SelectedPermissionCategoryInterface,
    SelectedPermissionsInterface
} from "../../../models/permissions-ui";
import getEligibilityScopeNames from "../../../utils/get-eligibility-scope-names";
import isPermissionLevelActionable from "../../../utils/is-permission-level-actionable";
import transformResourceCollectionToPermissions from "../../../utils/transform-resource-collection-to-permissions";
import "./create-console-role-wizard-permissions-form.scss";

/**
 * Prop types for the text customization fields component.
 */
interface CreateConsoleRoleWizardPermissionsFormProps extends IdentifiableComponentInterface {
    /**
     * Should the accordion be expanded
     */
    defaultExpandedIfPermissionsAreSelected?: boolean;
    /**
     * Set of initial permissions.
     * If there are already selected permissions, they can be passed in here.
     */
    initialValues?: SelectedPermissionsInterface;
    /**
     * Callback to notify the selected permissions.
     */
    onPermissionsChange: (permissions: CreateRolePermissionInterface[]) => void;
    /**
     * Is the form read only.
     */
    isReadOnly?: boolean;
}

const TENANT_PERMISSIONS_ACCORDION_ID: string = "tenant-permissions";
const ORGANIZATION_PERMISSIONS_ACCORDION_ID: string = "organization-permissions";

type GranularPermissionLevel = "read" | "create" | "update" | "delete";

const GRANULAR_PERMISSION_COLUMNS: ReadonlyArray<GranularPermissionLevel> = [
    "read",
    "create",
    "update",
    "delete"
];

const SCOPE_NAMESPACE_SEPARATOR: string = "::";

/**
 * Namespaces a scope name by collection type so tenant and organization scopes stay distinct
 * even when they share a backend name. The two accordions are kept separate, so the granted-scope
 * set is keyed by `type::scopeName` — a scope selected under tenant never satisfies an
 * organization box, and vice versa.
 */
const qualifyScope = (type: APIResourceCollectionTypes, scopeName: string): string =>
    `${type}${SCOPE_NAMESPACE_SEPARATOR}${scopeName}`;

/**
 * Namespaces collection metadata by type too. Tenant and organization collections can share an id,
 * but their backing scopes and available levels must stay independent.
 */
const getCollectionMetadataKey = (collection: APIResourceCollectionInterface): string =>
    `${collection.type}${SCOPE_NAMESPACE_SEPARATOR}${collection.id}`;

/**
 * Returns the backend scope names backing a single (collection, level), or an empty array
 * when that level is absent from the API response. These names are the unit of truth: a level
 * checkbox is shown checked exactly when this set is fully contained in the granted scopes.
 */
const getLevelScopeNames = (
    collection: APIResourceCollectionInterface,
    level: GranularPermissionLevel
): string[] =>
    collection?.apiResources?.[level]
        ? transformResourceCollectionToPermissions(collection.apiResources[level])
            .map((scope: PermissionScopeInterface) => scope.value)
        : [];

/**
 * Per-collection, per-level data derived once from the (immutable) API response and cached, so the
 * render and selection paths never recompute it. All three maps are keyed by permission level:
 *
 * - `availableLevels` — the levels that are actually processable (read, plus any create/update/delete
 *   that carries a real action scope; see `isPermissionLevelActionable`). Used to disable read-only
 *   cells and to exclude them from every derivation / scope-building loop.
 * - `scopeNamesByLevel` — the backend scope names backing each level; a level checkbox is shown
 *   checked exactly when this set is fully contained in the granted scopes.
 * - `marginalScopeNamesByLevel` — the scopes a level contributes *beyond* View (its backing scopes
 *   minus read's). These fall away when the level is unchecked; View's are excluded so unticking a
 *   write level never clears the row's View box. When several levels share a management scope (e.g.
 *   Branding's create/update/delete all resolve to `internal_branding_preference_update`), their
 *   marginal sets overlap, so dropping one clears the shared capability and the siblings fall away
 *   together instead of a sibling immediately re-ticking the box that was just unchecked.
 */
interface CollectionLevelMetadata {
    availableLevels: GranularPermissionLevel[];
    scopeNamesByLevel: Record<GranularPermissionLevel, string[]>;
    marginalScopeNamesByLevel: Record<GranularPermissionLevel, string[]>;
}

/**
 * Collects the flat set of granted scope names from a selection map. Used both to seed the
 * granted-scope state from server-loaded values and to garbage-collect the working set down to
 * exactly the scopes still backed by a checked box (see `applyGranularSelectionChange`).
 */
const deriveScopesFromSelection = (selected: SelectedPermissionsInterface): Set<string> => {
    const scopes: Set<string> = new Set<string>();

    [ APIResourceCollectionTypes.TENANT, APIResourceCollectionTypes.ORGANIZATION ].forEach(
        (type: APIResourceCollectionTypes) => {
            Object.values(selected?.[type] ?? {}).forEach((entry: SelectedPermissionCategoryInterface) => {
                entry?.permissions?.forEach(
                    (scope: PermissionScopeInterface) => scopes.add(qualifyScope(type, scope.value)));
            });
        }
    );

    return scopes;
};

/**
 * Text customization fields component.
 *
 * @param props - Props injected to the component.
 * @returns Text customization fields component.
 */
const CreateConsoleRoleWizardPermissionsForm: FunctionComponent<CreateConsoleRoleWizardPermissionsFormProps> = (
    props: CreateConsoleRoleWizardPermissionsFormProps
): ReactElement => {
    const {
        isReadOnly,
        defaultExpandedIfPermissionsAreSelected,
        initialValues,
        onPermissionsChange,
        "data-componentid": componentId = "create-console-role-wizard-basic-info-form"
    } = props;

    const { t } = useTranslation();

    const { data: tenantAPIResourceCollections } = useGetAPIResourceCollections(true, "type eq tenant", "apiResources");

    const { data: organizationAPIResourceCollections } = useGetAPIResourceCollections(
        true,
        "type eq organization",
        "apiResources"
    );

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const enabledFeatureOverridesInConsoleRolePermissions: string[] = useSelector(
        (state: AppState) => state.config.ui.enabledFeatureOverridesInConsoleRolePermissions);

    const disabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.consoleSettings?.disabledFeatures);

    /**
     * Switches the permissions evaluation between the legacy and the granular mode.
     */
    const useGranularConsolePermissions: boolean = !disabledFeatures?.includes(
        ConsoleRolesOnboardingConstants.GRANULAR_CONSOLE_PERMISSIONS_FEATURE_KEY);

    const [ expandedAccordions, setExpandedAccordions ] = useState<string[]>([]);
    const [ selectedPermissions, setSelectedPermissions ] = useState<SelectedPermissionsInterface>(initialValues || {
        organization: {},
        tenant: {}
    });

    /**
     * The flat set of granted backend scope names — the single source of truth for the granular
     * table. Every level checkbox is derived from this set: it is shown checked exactly when all
     * of its backing scopes are present (see `deriveSelectedFromScopes`), regardless of whether
     * the user clicked it directly or it became covered by a shared scope. The set is kept tight
     * (only scopes still backed by a checked box) so it always equals what the role will store.
     */
    const [ grantedScopes, setGrantedScopes ] = useState<Set<string>>(
        deriveScopesFromSelection(initialValues || { organization: {}, tenant: {} })
    );

    const { isSubOrganization } = useGetCurrentOrganizationType();

    /**
     * Initializes the permission tree with any initial values.
     */
    useEffect(() => {
        if (!initialValues) {
            return;
        }

        setSelectedPermissions(initialValues);
        setGrantedScopes(deriveScopesFromSelection(initialValues));

        if (defaultExpandedIfPermissionsAreSelected) {
            const expanded: string[] = [];

            if (!isEmpty(initialValues.tenant)) {
                expanded.push(TENANT_PERMISSIONS_ACCORDION_ID);
            }

            if (!isEmpty(initialValues.organization)) {
                expanded.push(ORGANIZATION_PERMISSIONS_ACCORDION_ID);
            }

            setExpandedAccordions(expanded);
        }
    }, [ initialValues ]);

    // Flatten the feature config to easily access sub features.
    const flattenedFeatureConfig: FeatureConfigInterface = useMemo(() => {
        const topLevelFeatures: Record<string, Omit<FeatureAccessConfigInterface, "subFeatures">> = mapValues(
            featureConfig,
            (feature: FeatureAccessConfigInterface) => omit(feature, [ "subFeatures" ])
        );

        const subLevelFeatures: Record<string, Omit<FeatureAccessConfigInterface, "subFeatures">> = fromPairs(
            flatMap(values(featureConfig), (feature: FeatureAccessConfigInterface) => {
                return Object.entries(feature.subFeatures || {});
            })
        );

        return {
            ...topLevelFeatures,
            ...subLevelFeatures
        } as FeatureConfigInterface;

    }, [ featureConfig ]);

    const filteredTenantAPIResourceCollections: APIResourceCollectionResponseInterface = useMemo(() => {

        if (!tenantAPIResourceCollections) {
            return null;
        }

        const filteringAPIResourceCollectionNames: string[] = [];

        filteringAPIResourceCollectionNames.push(
            ConsoleRolesOnboardingConstants.ROLE_V1_API_RESOURCES_COLLECTION_NAME);

        clonedTenantAPIResourceCollections.apiResourceCollections =
                clonedTenantAPIResourceCollections?.apiResourceCollections?.filter(
                    (item: APIResourceCollectionInterface) =>
                        !filteringAPIResourceCollectionNames.includes(item?.name) &&
                        (
                            enabledFeatureOverridesInConsoleRolePermissions?.includes(item?.name)
                            || flattenedFeatureConfig?.[item?.name]?.enabled
                            || flattenedFeatureConfig?.[UIConstants.CONSOLE_FEATURE_MAP[item?.name]]?.enabled
                        )

                );

        return clonedTenantAPIResourceCollections;
    }, [ tenantAPIResourceCollections, flattenedFeatureConfig, enabledFeatureOverridesInConsoleRolePermissions ]);

    const filteredOrganizationAPIResourceCollections: APIResourceCollectionResponseInterface = useMemo(() => {

        if (!organizationAPIResourceCollections) {
            return null;
        }

        const filteringAPIResourceCollectionNames: string[] = [];

        filteringAPIResourceCollectionNames.push(
            ConsoleRolesOnboardingConstants.ORG_ROLE_V1_API_RESOURCES_COLLECTION_NAME);

        clonedOrganizationAPIResourceCollections.apiResourceCollections =
                clonedOrganizationAPIResourceCollections?.apiResourceCollections?.filter(
                    (item: APIResourceCollectionInterface) => {
                        const itemName: string = item?.name ?? "";
                        const featureNameWithoutOrgPrefix: string = itemName.startsWith(
                            ConsoleRolesOnboardingConstants.ORG_PREFIX)
                            ? itemName.substring(ConsoleRolesOnboardingConstants.ORG_PREFIX.length)
                            : itemName;

                        return !filteringAPIResourceCollectionNames.includes(itemName) &&
                            (
                                enabledFeatureOverridesInConsoleRolePermissions?.includes(featureNameWithoutOrgPrefix)
                                || flattenedFeatureConfig?.[featureNameWithoutOrgPrefix]?.enabled
                                || flattenedFeatureConfig?.[UIConstants.CONSOLE_FEATURE_MAP[
                                    featureNameWithoutOrgPrefix]]?.enabled
                            );
                    }
                );

        return clonedOrganizationAPIResourceCollections;
    }, [ organizationAPIResourceCollections, flattenedFeatureConfig, enabledFeatureOverridesInConsoleRolePermissions ]);

    /**
     * Per-collection level metadata (available levels + per-level scope/marginal name lists),
     * computed once whenever the fetched collections change. Every value here is a pure function of
     * the immutable API response, yet the render path touches it per cell (`getAvailableLevels` runs
     * for every collection × column on each render) and the selection path touches it per level on
     * each change. Caching it in a `Map` keyed by collection type + id turns those repeated
     * `transformResourceCollectionToPermissions` / eligibility computations into O(1) lookups.
     */
    const collectionLevelMetadataById: Map<string, CollectionLevelMetadata> = useMemo(() => {
        const metadataById: Map<string, CollectionLevelMetadata> = new Map<string, CollectionLevelMetadata>();
        const collections: APIResourceCollectionInterface[] = [
            ...(filteredTenantAPIResourceCollections?.apiResourceCollections ?? []),
            ...(filteredOrganizationAPIResourceCollections?.apiResourceCollections ?? [])
        ];

        collections.forEach((collection: APIResourceCollectionInterface) => {
            const scopeNamesByLevel: Record<GranularPermissionLevel, string[]> =
                {} as Record<GranularPermissionLevel, string[]>;
            const marginalScopeNamesByLevel: Record<GranularPermissionLevel, string[]> =
                {} as Record<GranularPermissionLevel, string[]>;
            const readScopeNames: Set<string> = new Set<string>(getLevelScopeNames(collection, "read"));

            GRANULAR_PERMISSION_COLUMNS.forEach((level: GranularPermissionLevel) => {
                const names: string[] = getLevelScopeNames(collection, level);

                scopeNamesByLevel[level] = names;
                marginalScopeNamesByLevel[level] = level === "read"
                    ? []
                    : names.filter((name: string) => !readScopeNames.has(name));
            });

            const availableLevels: GranularPermissionLevel[] = GRANULAR_PERMISSION_COLUMNS.filter(
                (level: GranularPermissionLevel) => isPermissionLevelActionable(collection, level));

            metadataById.set(
                getCollectionMetadataKey(collection),
                { availableLevels, marginalScopeNamesByLevel, scopeNamesByLevel }
            );
        });

        return metadataById;
    }, [ filteredTenantAPIResourceCollections, filteredOrganizationAPIResourceCollections ]);

    /**
     * Handles the accordion expand event.
     *
     * @param interactedAccordion - The accordion that was interacted with.
     */
    const handleAccordionExpand = (interactedAccordion: string) => (_: SyntheticEvent, isExpanded: boolean): void => {
        if (isExpanded) {
            setExpandedAccordions([ ...expandedAccordions, interactedAccordion ]);
        } else {
            setExpandedAccordions(expandedAccordions.filter((panel: string) => panel !== interactedAccordion));
        }
    };

    /**
     * Re-computes the `permissions` scope list from whichever flags are currently set
     * on a granular category entry. The result replaces the previous `permissions` array
     * so the flat scope list stays in sync with the checkbox state.
     *
     * Only called in granular mode.
     */
    const rebuildGranularPermissions = (
        collection: APIResourceCollectionInterface,
        entry: SelectedPermissionCategoryInterface
    ): PermissionScopeInterface[] => {
        const activeCategories: APIResourceCollectionPermissionCategoryInterface[] = [
            ...(entry.read ? (collection.apiResources.read ?? []) : []),
            ...(entry.create ? (collection.apiResources.create ?? []) : []),
            ...(entry.update ? (collection.apiResources.update ?? []) : []),
            ...(entry.delete ? (collection.apiResources.delete ?? []) : [])
        ];

        return transformResourceCollectionToPermissions(activeCategories);
    };

    /**
     * Returns the source collections array for a given accordion type.
     */
    const getSourceCollections = (
        type: APIResourceCollectionTypes
    ): APIResourceCollectionInterface[] => (
        type === APIResourceCollectionTypes.TENANT
            ? filteredTenantAPIResourceCollections?.apiResourceCollections || []
            : filteredOrganizationAPIResourceCollections?.apiResourceCollections || []
    );

    /**
     * Derives the full checkbox state from the granted scope set. For every (collection, level),
     * the level is shown checked exactly when its backing scopes are non-empty and every one of
     * them is present in `grantedScopeNames` — the literal "do the granted scopes satisfy this
     * box?" test. A box lights up the same way whether the user clicked it or a shared backend
     * scope made it covered; the model draws no distinction between an explicit and implied check.
     *
     * `read` is evaluated by the same rule, so an update-without-view row (create/update/delete
     * granted while the view scope is not) is shown exactly as it stands and saved as shown — the
     * displayed state never claims a capability the granted scopes do not hold, and never hides
     * one they do.
     */
    const deriveSelectedFromScopes = (grantedScopeNames: Set<string>): SelectedPermissionsInterface => {
        const result: SelectedPermissionsInterface = { organization: {}, tenant: {} };

        [ APIResourceCollectionTypes.TENANT, APIResourceCollectionTypes.ORGANIZATION ].forEach(
            (type: APIResourceCollectionTypes) => {
                getSourceCollections(type).forEach((collection: APIResourceCollectionInterface) => {
                    const entry: SelectedPermissionCategoryInterface = {
                        create: false,
                        delete: false,
                        permissions: [],
                        read: false,
                        update: false,
                        write: false
                    };
                    let anyActive: boolean = false;

                    getAvailableLevels(collection).forEach((level: GranularPermissionLevel) => {
                        // The eligibility check ignores the per-action feature scopes
                        // (`console:<feature>_create/_update/_delete`) so that levels backed by the same
                        // management scope — e.g. Branding's create/update/delete all resolving to
                        // `internal_branding_preference_update` — light up together: checking one searches
                        // the grid and selects every other box whose effective scopes are now covered.
                        const names: string[] =
                            getEligibilityScopeNames(getCollectionLevelScopeNames(collection, level));

                        if (names.length > 0
                            && names.every((name: string) => grantedScopeNames.has(qualifyScope(type, name)))) {
                            entry[level] = true;
                            anyActive = true;
                        }
                    });

                    if (anyActive) {
                        entry.permissions = rebuildGranularPermissions(collection, entry);
                        result[type][collection.id] = entry;
                    }
                });
            }
        );

        return result;
    };

    /**
     * Flips a single (collection, level) box on a draft selection, enforcing the View↔write
     * coupling: turning on a write level (create/update/delete) also turns View on, and turning
     * View off also turns every write level off. The collection entry is created on demand when a
     * box is switched on.
     *
     * This only sets the box flags; it never edits the scope set directly. `applyGranularSelectionChange`
     * rebuilds the scopes from the post-toggle boxes and then drops the *marginal* (beyond-View) scopes
     * of any box switched off — so a write level can be unchecked without disturbing the View scope it
     * shares with the rest of the row, while still clearing the management scope shared with its siblings.
     */
    const toggleSelectionBox = (
        draft: SelectedPermissionsInterface,
        type: APIResourceCollectionTypes,
        collection: APIResourceCollectionInterface,
        level: GranularPermissionLevel,
        checked: boolean
    ): void => {
        const entry: SelectedPermissionCategoryInterface = draft[type][collection.id] ?? {
            create: false,
            delete: false,
            permissions: [],
            read: false,
            update: false,
            write: false
        };

        if (checked) {
            entry[level] = true;

            if (level === "create" || level === "update" || level === "delete") {
                entry.read = true;
            }
        } else {
            entry[level] = false;

            if (level === "read") {
                entry.create = false;
                entry.update = false;
                entry.delete = false;
            }
        }

        draft[type][collection.id] = entry;
    };

    /**
     * Builds the granted scope set from a box selection by unioning the (cumulative) backend scopes
     * of every checked level, namespaced by collection type. This is the inverse direction of the
     * subset test in `deriveSelectedFromScopes`: scopes flow up from the boxes the user toggled,
     * and the boxes are then re-derived from those scopes (impact closure + garbage collection).
     */
    const deriveScopesFromBoxes = (selected: SelectedPermissionsInterface): Set<string> => {
        const scopes: Set<string> = new Set<string>();

        [ APIResourceCollectionTypes.TENANT, APIResourceCollectionTypes.ORGANIZATION ].forEach(
            (type: APIResourceCollectionTypes) => {
                getSourceCollections(type).forEach((collection: APIResourceCollectionInterface) => {
                    const entry: SelectedPermissionCategoryInterface | undefined =
                        selected[type]?.[collection.id];

                    if (!entry) {
                        return;
                    }

                    getAvailableLevels(collection).forEach((level: GranularPermissionLevel) => {
                        if (entry[level]) {
                            getCollectionLevelScopeNames(collection, level).forEach(
                                (name: string) => scopes.add(qualifyScope(type, name)));
                        }
                    });
                });
            }
        );

        return scopes;
    };

    /**
     * Single entry point for every granular change. It derives the current box state from the
     * granted scopes (so coupling/implied flags are correct), lets the caller flip one or more
     * boxes on that draft, then:
     *   1. rebuilds the scope set from the post-toggle boxes (`deriveScopesFromBoxes`) — a shared
     *      scope survives as long as any still-checked box carries it, which keeps cross-collection
     *      and View scopes alive when an unrelated box is toggled;
     *   2. drops the marginal scopes of every box the caller switched OFF, even when a sibling box
     *      still carries them — this is what lets an unchecked write level actually clear instead of
     *      snapping back (Branding's create/update/delete all map to the same management scope, so
     *      unticking one removes that shared scope and the siblings fall away with it);
     *   3. re-derives the full table from the resulting scopes (`deriveSelectedFromScopes`), lighting
     *      up any box a shared scope now covers across collections (impact closure);
     *   4. tightens the scope set down to exactly what the re-derived table backs
     *      (`deriveScopesFromSelection`, garbage collection) so stored scopes never drift.
     *
     * Step 4 reaches a fixpoint in one pass: the tightened set still contains every checked box's
     * scopes, so `deriveSelectedFromScopes(tightened)` equals `nextSelected` and no box flips again.
     */
    const applyGranularSelectionChange = (mutate: (draft: SelectedPermissionsInterface) => void): void => {
        const draft: SelectedPermissionsInterface = deriveSelectedFromScopes(grantedScopes);
        const before: SelectedPermissionsInterface = cloneDeep(draft);

        mutate(draft);

        // Collect the marginal scopes of every (collection, level) the mutation switched off, so a
        // capability that several levels share is dropped rather than re-asserted by a sibling that
        // is still checked (the "won't untick / looks frozen" case).
        const scopesToRemove: Set<string> = new Set<string>();

        [ APIResourceCollectionTypes.TENANT, APIResourceCollectionTypes.ORGANIZATION ].forEach(
            (type: APIResourceCollectionTypes) => {
                getSourceCollections(type).forEach((collection: APIResourceCollectionInterface) => {
                    getAvailableLevels(collection).forEach((level: GranularPermissionLevel) => {
                        const wasOn: boolean = !!get(before[type], [ collection.id, level ]);
                        const isOn: boolean = !!get(draft[type], [ collection.id, level ]);

                        if (wasOn && !isOn) {
                            getCollectionLevelMarginalScopeNames(collection, level).forEach(
                                (name: string) => scopesToRemove.add(qualifyScope(type, name)));
                        }
                    });
                });
            }
        );

        const intendedScopes: Set<string> = deriveScopesFromBoxes(draft);

        scopesToRemove.forEach((scope: string) => intendedScopes.delete(scope));

        const nextSelected: SelectedPermissionsInterface = deriveSelectedFromScopes(intendedScopes);
        const tightenedScopes: Set<string> = deriveScopesFromSelection(nextSelected);

        setGrantedScopes(tightenedScopes);
        setSelectedPermissions(nextSelected);
        processPermissionsChange(nextSelected);
    };

    /**
     * Handles the accordion-level select-all checkbox change — flips every row on (entry
     * with read=true) or off (empty map).
     *
     * Legacy mode only; the accordion select-all checkbox is not rendered in granular mode.
     */
    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>, type: APIResourceCollectionTypes): void => {
        const _selectedPermissions: SelectedPermissionsInterface = cloneDeep(selectedPermissions);
        const sourceCollections: APIResourceCollectionInterface[] = getSourceCollections(type);

        if (e.target.checked) {
            _selectedPermissions[type] = sourceCollections.reduce(
                (
                    result: { [key: string]: SelectedPermissionCategoryInterface },
                    collection: APIResourceCollectionInterface
                ) => {
                    result[collection.id] = {
                        permissions: transformResourceCollectionToPermissions(collection.apiResources.read),
                        read: true,
                        write: false
                    };

                    return result;
                },
                {}
            );
        } else {
            _selectedPermissions[type] = {};
        }

        setSelectedPermissions(_selectedPermissions);
        processPermissionsChange(_selectedPermissions);
    };

    /**
     * Processes the permissions change and notifies the parent component.
     *
     * @param permissions - Selected permissions.
     */
    const processPermissionsChange = (permissions: SelectedPermissionsInterface): void => {
        if (!useGranularConsolePermissions) {
            const uniquePermissionsSet: Set<string> = new Set<string>();

            Object.keys(permissions).forEach((key: string) => {
                const typePermissions: SelectedPermissionsInterface = permissions[key];

                Object.keys(typePermissions).forEach((id: string) => {
                    const resource: SelectedPermissionCategoryInterface = typePermissions[id];

                    if (resource.permissions && resource.permissions.length > 0) {
                        resource.permissions.forEach((permission: PermissionScopeInterface) => {
                            uniquePermissionsSet.add(JSON.stringify(permission));
                        });
                    }
                });
            });

            const flattenedPermissions: CreateRolePermissionInterface[] = Array.from(
                uniquePermissionsSet
            ).map((permissionString: string) => JSON.parse(permissionString));

            onPermissionsChange(flattenedPermissions);

            return;
        }

        // Permission objects are `{ value }`, so deduplicate by value directly — avoids a
        // JSON.stringify/parse round-trip over every scope on each change.
        const uniquePermissionsByValue: Map<string, CreateRolePermissionInterface> =
            new Map<string, CreateRolePermissionInterface>();

        Object.keys(permissions).forEach((key: string) => {
            const typePermissions: SelectedPermissionsInterface = permissions[key];

            Object.keys(typePermissions).forEach((id: string) => {
                const resource: SelectedPermissionCategoryInterface = typePermissions[id];

                resource.permissions?.forEach((permission: PermissionScopeInterface) => {
                    uniquePermissionsByValue.set(permission.value, { value: permission.value });
                });
            });
        });

        onPermissionsChange(Array.from(uniquePermissionsByValue.values()));
    };

    /**
     * Handles the select checkbox change event.
     *
     * @param e - Change event.
     * @param collection - Selected API resource collection.
     * @param type - Selected API resource collection type.
     */
    const handleSelect = (
        e: ChangeEvent<HTMLInputElement>,
        collection: APIResourceCollectionInterface,
        type: APIResourceCollectionTypes
    ): void => {
        const { id, apiResources } = collection;
        const _selectedPermissions: SelectedPermissionsInterface = cloneDeep(selectedPermissions);

        if (e.target.checked) {
            _selectedPermissions[type][id] = {
                permissions: transformResourceCollectionToPermissions(apiResources.read),
                read: true,
                write: false
            };
        } else {
            delete _selectedPermissions[type][id];
        }

        setSelectedPermissions(_selectedPermissions);
        processPermissionsChange(_selectedPermissions);
    };

    /**
     * Handles the permission level toggle change in legacy mode (ToggleButtonGroup).
     *
     * The `write` level takes precedence: when the user selects "write", only write scopes
     * are stored and `read` is set to false.
     *
     * Not called in granular mode.
     *
     * @param _ - Mouse event.
     * @param collection - Selected API resource collection.
     * @param value - Selected permission level.
     * @param type - Selected API resource collection type.
     */
    const handlePermissionLevelChange = (
        _: MouseEvent<HTMLElement>,
        collection: APIResourceCollectionInterface,
        value: string,
        type: APIResourceCollectionTypes
    ): void => {
        const { id, apiResources } = collection;
        const _selectedPermissions: SelectedPermissionsInterface = cloneDeep(selectedPermissions);

        /**
         * In practice `handlePermissionLevelChange` is only called when the
         * collection's row checkbox is checked, so `read` is always present.
         */
        const legacyCategories: APIResourceCollectionPermissionCategoryInterface[] =
            (apiResources[value as keyof typeof apiResources] as
                APIResourceCollectionPermissionCategoryInterface[] | undefined) ?? apiResources.read;

        _selectedPermissions[type][id] = {
            permissions: transformResourceCollectionToPermissions(legacyCategories),
            read: value === "read",
            write: value === "write"
        };

        setSelectedPermissions(_selectedPermissions);
        processPermissionsChange(_selectedPermissions);
    };

    /**
     * Handles an individual granular-permission checkbox toggle (Create / Update / Delete
     * or View/read) by adding or removing that level's backing scopes from the granted set.
     * The checkbox state is then re-derived from the scopes, so the box (and any other box the
     * change covers or uncovers) reflects exactly what is granted.
     *
     * Only called when `useGranularConsolePermissions` is true.
     *
     * @param e - Change event.
     * @param collection - The collection whose permission level is changing.
     * @param level - The permission level key being toggled ("read" | "create" | "update" | "delete").
     * @param type - Tenant or organisation.
     */
    const handleGranularPermissionLevelChange = (
        e: ChangeEvent<HTMLInputElement>,
        collection: APIResourceCollectionInterface,
        level: GranularPermissionLevel,
        type: APIResourceCollectionTypes
    ): void => {
        applyGranularSelectionChange((draft: SelectedPermissionsInterface) => {
            toggleSelectionBox(draft, type, collection, level, e.target.checked);
        });
    };

    /**
     * Derives the column-level select-all state for a granular permission field —
     * checked when every collection that supports the field has it active, indeterminate
     * when only some do, unchecked when none do. Collections with no backing scopes for
     * the field are ignored, since they can never carry it.
     */
    const computeColumnSelectAllState = (
        type: APIResourceCollectionTypes,
        field: GranularPermissionLevel
    ): { checked: boolean; indeterminate: boolean } => {
        const applicableCollections: APIResourceCollectionInterface[] = getSourceCollections(type).filter(
            (collection: APIResourceCollectionInterface) => getAvailableLevels(collection).includes(field)
        );

        if (applicableCollections.length === 0) {
            return { checked: false, indeterminate: false };
        }

        const activeCount: number = applicableCollections.filter((collection: APIResourceCollectionInterface) =>
            !!get(selectedPermissions[type], [ collection.id, field ])
        ).length;

        return {
            checked: activeCount === applicableCollections.length,
            indeterminate: activeCount > 0 && activeCount < applicableCollections.length
        };
    };

    /**
     * Whether the row-level checkbox for a single collection should appear checked —
     * tracks whether the collection has any entry.
     *
     * Legacy mode only; the row checkbox is not rendered in granular mode (the View
     * column checkbox tracks `read` directly there).
     */
    const isCollectionRowSelected = (
        type: APIResourceCollectionTypes,
        collectionId: string
    ): boolean => Object.keys(selectedPermissions[type]).includes(collectionId);

    /**
     * The accordion-summary select-all checkbox state — checked when every collection has
     * an entry.
     *
     * Legacy mode only; the accordion select-all checkbox is not rendered in granular mode.
     */
    const computeAccordionSelectAllState = (
        type: APIResourceCollectionTypes
    ): { checked: boolean; indeterminate: boolean } => {
        const sourceCollections: APIResourceCollectionInterface[] = getSourceCollections(type);

        return {
            checked: sourceCollections.length > 0 &&
                Object.keys(selectedPermissions[type]).length === sourceCollections.length,
            indeterminate: false
        };
    };

    /**
     * Toggles a single granular permission field across every collection of the given
     * type. Unlike `handleSelectAll` (the row-level select-all that flips entire rows),
     * this only flips one column.
     *
     * For each collection: if the field becomes true the entry is created if missing
     * (with all other granular fields preserved or defaulted to false). If the field
     * becomes false and the entry ends up with every level unchecked, the entry is
     * removed entirely — same convention as `handleGranularPermissionLevelChange`.
     *
     * Only called in granular mode.
     */
    const handleColumnSelectAll = (
        e: ChangeEvent<HTMLInputElement>,
        field: GranularPermissionLevel,
        type: APIResourceCollectionTypes
    ): void => {
        const checked: boolean = e.target.checked;

        applyGranularSelectionChange((draft: SelectedPermissionsInterface) => {
            getSourceCollections(type).forEach((collection: APIResourceCollectionInterface) => {
                if (!getAvailableLevels(collection).includes(field)) {
                    return;
                }

                toggleSelectionBox(draft, type, collection, field, checked);
            });
        });
    };

    /**
     * Returns the granular levels that are actually processable for a collection. `read` is always
     * present; create / update / delete only when the level carries a corresponding action scope —
     * i.e. it grants a real management scope beyond read, not merely its per-action feature scope
     * (see `isPermissionLevelActionable`). A level that is not actionable is treated as read-only:
     * its cell renders disabled and it is excluded from every derivation / scope-building path that
     * iterates these levels, so it is never processed.
     *
     * Backed by `collectionLevelMetadataById`, so this is an O(1) lookup rather than a recomputation
     * on every call (it runs once per collection × column on each render).
     */
    const getAvailableLevels = (
        collection: APIResourceCollectionInterface
    ): GranularPermissionLevel[] =>
        collectionLevelMetadataById.get(getCollectionMetadataKey(collection))?.availableLevels ?? [ "read" ];

    /**
     * The backend scope names backing a single (collection, level) — an O(1) lookup into the cached
     * per-collection metadata. Empty when the level is absent from the API response.
     */
    const getCollectionLevelScopeNames = (
        collection: APIResourceCollectionInterface,
        level: GranularPermissionLevel
    ): string[] =>
        collectionLevelMetadataById.get(getCollectionMetadataKey(collection))?.scopeNamesByLevel[level] ?? [];

    /**
     * The scopes a level contributes beyond View (its marginal capability) — an O(1) lookup into the
     * cached per-collection metadata. See `CollectionLevelMetadata`.
     */
    const getCollectionLevelMarginalScopeNames = (
        collection: APIResourceCollectionInterface,
        level: GranularPermissionLevel
    ): string[] =>
        collectionLevelMetadataById.get(getCollectionMetadataKey(collection))?.marginalScopeNamesByLevel[level] ?? [];

    /**
     * Derives the row-level select-all state for a single collection — checked when every
     * available level is active, indeterminate when only some are, unchecked otherwise.
     */
    const computeRowSelectAllState = (
        type: APIResourceCollectionTypes,
        collection: APIResourceCollectionInterface
    ): { checked: boolean; indeterminate: boolean } => {
        const entry: SelectedPermissionCategoryInterface | undefined =
            selectedPermissions[type][collection.id];

        if (!entry) {
            return { checked: false, indeterminate: false };
        }

        const availableLevels: GranularPermissionLevel[] = getAvailableLevels(collection);
        const activeCount: number = availableLevels.filter(
            (level: GranularPermissionLevel) => !!entry[level]
        ).length;

        return {
            checked: activeCount === availableLevels.length,
            indeterminate: activeCount > 0 && activeCount < availableLevels.length
        };
    };

    /**
     * Row-level select-all handler — flips every available level of a single collection on
     * or off. Unchecking clears all levels, which drops the entry entirely.
     *
     * Only called in granular mode.
     */
    const handleRowSelectAll = (
        e: ChangeEvent<HTMLInputElement>,
        collection: APIResourceCollectionInterface,
        type: APIResourceCollectionTypes
    ): void => {
        const checked: boolean = e.target.checked;

        applyGranularSelectionChange((draft: SelectedPermissionsInterface) => {
            getAvailableLevels(collection).forEach((level: GranularPermissionLevel) => {
                toggleSelectionBox(draft, type, collection, level, checked);
            });
        });
    };

    /**
     * Renders the leading row-level select-all checkbox for a collection (granular mode).
     */
    const renderGranularRowSelectAll = (
        collection: APIResourceCollectionInterface,
        type: APIResourceCollectionTypes
    ): ReactElement => {
        const { checked, indeterminate } = computeRowSelectAllState(type, collection);

        return (
            <Checkbox
                readOnly={ isReadOnly }
                disabled={ isReadOnly }
                color="primary"
                size="small"
                checked={ checked }
                indeterminate={ indeterminate }
                onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                    handleRowSelectAll(e, collection, type)
                }
                inputProps={ {
                    "aria-label": t("consoleSettings:roles.permissionLevels.selectAll", {
                        label: collection.displayName
                    })
                } }
            />
        );
    };

    /**
     * Renders the column-header row with a select-all checkbox for each permission level.
     * Every column (including View) keeps its select-all enabled regardless of the row
     * state — View can always be selected/cleared across all rows.
     */
    const renderGranularHeader = (type: APIResourceCollectionTypes): ReactElement => {
        return (
            <TableHead>
                <TableRow className="granular-permission-header-row">
                    <TableCell padding="checkbox" />
                    <TableCell />
                    { GRANULAR_PERMISSION_COLUMNS.map((field: GranularPermissionLevel) => {
                        const { checked, indeterminate } = computeColumnSelectAllState(type, field);
                        const label: string = t(`consoleSettings:roles.permissionLevels.${field}`);

                        return (
                            <TableCell
                                key={ field }
                                align="center"
                                className="granular-permission-column-cell"
                            >
                                <span className="granular-permission-column-header">
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        className="granular-permission-column-label"
                                    >
                                        { label }
                                    </Typography>
                                    <Checkbox
                                        readOnly={ isReadOnly }
                                        disabled={ isReadOnly }
                                        color="primary"
                                        size="small"
                                        checked={ checked }
                                        indeterminate={ indeterminate }
                                        onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                                            handleColumnSelectAll(e, field, type)
                                        }
                                        inputProps={ {
                                            "aria-label": t("consoleSettings:roles.permissionLevels.selectAll", {
                                                label
                                            })
                                        } }
                                    />
                                </span>
                            </TableCell>
                        );
                    }) }
                </TableRow>
            </TableHead>
        );
    };

    /**
     * Renders a single granular-permission data cell (one column) for a collection row.
     *
     * Each checkbox reflects its real underlying state — checked exactly when the granted scopes
     * satisfy that level. Selecting create/update/delete lights up View on its own, because each
     * write level's scope definition already contains the row's view scope; clearing View still
     * clears the write levels, so a directly-edited row is never write-without-view.
     * A write-without-view row can still appear when a shared backend scope makes a write level
     * effectively granted while that collection's view scope is not — that capability genuinely
     * exists, so it is shown and saved as-is rather than hidden, never claiming more or fewer scopes
     * than the role holds.
     *
     * Levels that are not actionable for the collection — create / update / delete that carry no
     * action scope of their own, only their per-action feature scope (e.g. Approvals, which has no
     * `<Create>`/`<Update>`/`<Delete>` management scope) — are disabled, since toggling them would
     * grant nothing real. They are excluded from `getAvailableLevels`, so they never appear checked
     * and are never processed.
     *
     * Only used in granular mode.
     */
    const renderGranularCell = (
        collection: APIResourceCollectionInterface,
        field: GranularPermissionLevel,
        type: APIResourceCollectionTypes
    ): ReactElement => {
        const isLevelAvailable: boolean = getAvailableLevels(collection).includes(field);

        return (
            <TableCell
                key={ field }
                align="center"
                className="granular-permission-column-cell"
            >
                <Checkbox
                    readOnly={ isReadOnly }
                    disabled={ isReadOnly || !isLevelAvailable }
                    color="primary"
                    size="small"
                    checked={ !!get(selectedPermissions[type], [ collection.id, field ]) }
                    onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                        handleGranularPermissionLevelChange(e, collection, field, type);
                    } }
                    inputProps={ {
                        "aria-label": t("consoleSettings:roles.permissionLevels.selectCollection", {
                            collection: collection.displayName,
                            label: t(`consoleSettings:roles.permissionLevels.${field}`)
                        })
                    } }
                />
            </TableCell>
        );
    };

    /**
     * Renders the legacy-mode permission cell for a collection row — an exclusive
     * read / write toggle in a single right-aligned cell.
     *
     * Not used in granular mode.
     */
    const renderLegacyCell = (
        collection: APIResourceCollectionInterface,
        type: APIResourceCollectionTypes
    ): ReactElement => {
        const hasEntry: boolean = Object.keys(selectedPermissions[type]).includes(collection.id);
        const value: string | null = hasEntry
            ? (get(selectedPermissions[type], collection.id)?.write ? "write" : "read")
            : null;

        return (
            <TableCell align="right">
                <ToggleButtonGroup
                    disabled={ isReadOnly }
                    value={ value }
                    exclusive
                    onChange={ (e: MouseEvent<HTMLElement>, selectedValue: string) => {
                        // If no value is selected and exclusive is true the value is null.
                        // Guard against the null value to prevent submitting an empty selection.
                        if (!selectedValue) {
                            return;
                        }

                        handlePermissionLevelChange(e, collection, selectedValue, type);
                    } }
                    aria-label="text alignment"
                    size="small"
                >
                    <ToggleButton value="read" aria-label="left aligned">
                        { t("consoleSettings:roles.permissionLevels.view") }
                    </ToggleButton>
                    <ToggleButton value="write" aria-label="right aligned">
                        { t("consoleSettings:roles.permissionLevels.edit") }
                    </ToggleButton>
                </ToggleButtonGroup>
            </TableCell>
        );
    };

    return (
        <div className="create-console-role-wizard-permissions-form" data-componentid={ componentId }>
            { !isSubOrganization() && (
                <div className="accordion-container">
                    <Accordion
                        elevation={ 0 }
                        expanded={ expandedAccordions.includes(TENANT_PERMISSIONS_ACCORDION_ID) }
                        onChange={ handleAccordionExpand(TENANT_PERMISSIONS_ACCORDION_ID) }
                        className="tenant-permissions-accordion"
                    >
                        <AccordionSummary
                            expandIcon={ <ChevronDownIcon /> }
                            aria-controls="tenant-permissions-content"
                            id="tenant-permissions-header"
                        >
                            { !useGranularConsolePermissions && (
                                <Checkbox
                                    readOnly={ isReadOnly }
                                    disabled={ isReadOnly }
                                    color="primary"
                                    checked={
                                        computeAccordionSelectAllState(APIResourceCollectionTypes.TENANT).checked
                                    }
                                    onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                        handleSelectAll(e, APIResourceCollectionTypes.TENANT);
                                    } }
                                    inputProps={ {
                                        "aria-label": "Select all tenant permissions"
                                    } }
                                />
                            ) }
                            <div className="permissions-accordion-heading">
                                <Typography className="permissions-accordion-label">
                                    { t("consoleSettings:roles.add.tenantPermissions.label") }
                                </Typography>
                                { typeof filteredTenantAPIResourceCollections?.apiResourceCollections?.length
                                    === "number" && (
                                    <Chip
                                        className="permissions-count-chip"
                                        size="small"
                                        label={ t("consoleSettings:roles.add.permissionsCount", {
                                            count: filteredTenantAPIResourceCollections.apiResourceCollections.length
                                        }) }
                                    />
                                ) }
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={ Paper } elevation={ 0 }>
                                <Table className="permissions-table" size="small" aria-label="tenant permissions table">
                                    { useGranularConsolePermissions &&
                                        renderGranularHeader(APIResourceCollectionTypes.TENANT) }
                                    <TableBody>
                                        { filteredTenantAPIResourceCollections?.apiResourceCollections?.map(
                                            (collection: APIResourceCollectionInterface) => (
                                                <TableRow key={ collection.id } className="permissions-table-data-row">
                                                    <TableCell padding="checkbox">
                                                        { useGranularConsolePermissions
                                                            ? renderGranularRowSelectAll(
                                                                collection,
                                                                APIResourceCollectionTypes.TENANT
                                                            )
                                                            : (
                                                                <Checkbox
                                                                    readOnly={ isReadOnly }
                                                                    disabled={ isReadOnly }
                                                                    color="primary"
                                                                    checked={ isCollectionRowSelected(
                                                                        APIResourceCollectionTypes.TENANT,
                                                                        collection.id
                                                                    ) }
                                                                    onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                                                                        handleSelect(
                                                                            e,
                                                                            collection,
                                                                            APIResourceCollectionTypes.TENANT
                                                                        )
                                                                    }
                                                                    inputProps={ {
                                                                        "aria-label": `Select ${
                                                                            collection.displayName } permission`
                                                                    } }
                                                                />
                                                            ) }
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        { collection.displayName }
                                                    </TableCell>
                                                    { useGranularConsolePermissions
                                                        ? (
                                                            GRANULAR_PERMISSION_COLUMNS.map(
                                                                (field: GranularPermissionLevel) =>
                                                                    renderGranularCell(
                                                                        collection,
                                                                        field,
                                                                        APIResourceCollectionTypes.TENANT
                                                                    )
                                                            )
                                                        )
                                                        : renderLegacyCell(
                                                            collection,
                                                            APIResourceCollectionTypes.TENANT
                                                        )
                                                    }
                                                </TableRow>
                                            )
                                        ) }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                </div>
            ) }
            <div className="accordion-container">
                <Accordion
                    elevation={ 0 }
                    expanded={ expandedAccordions.includes(ORGANIZATION_PERMISSIONS_ACCORDION_ID) }
                    onChange={ handleAccordionExpand(ORGANIZATION_PERMISSIONS_ACCORDION_ID) }
                    className="organization-permissions-accordion"
                >
                    <AccordionSummary
                        expandIcon={ <ChevronDownIcon /> }
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        { !useGranularConsolePermissions && (
                            <Checkbox
                                readOnly={ isReadOnly }
                                disabled={ isReadOnly }
                                color="primary"
                                checked={
                                    computeAccordionSelectAllState(APIResourceCollectionTypes.ORGANIZATION).checked
                                }
                                indeterminate={
                                    computeAccordionSelectAllState(
                                        APIResourceCollectionTypes.ORGANIZATION
                                    ).indeterminate
                                }
                                onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                    handleSelectAll(e, APIResourceCollectionTypes.ORGANIZATION);
                                } }
                                inputProps={ {
                                    "aria-label": "Select all organization permissions"
                                } }
                            />
                        ) }
                        <div className="permissions-accordion-heading">
                            <Typography className="permissions-accordion-label">
                                { t("consoleSettings:roles.add.organizationPermissions.label") }
                            </Typography>
                            { typeof filteredOrganizationAPIResourceCollections?.apiResourceCollections?.length
                                === "number" && (
                                <Chip
                                    className="permissions-count-chip"
                                    size="small"
                                    label={ t("consoleSettings:roles.add.permissionsCount", {
                                        count: filteredOrganizationAPIResourceCollections.apiResourceCollections.length
                                    }) }
                                />
                            ) }
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={ Paper } elevation={ 0 }>
                            <Table
                                className="permissions-table"
                                size="small"
                                aria-label="organization permissions table"
                            >
                                { useGranularConsolePermissions &&
                                    renderGranularHeader(APIResourceCollectionTypes.ORGANIZATION) }
                                <TableBody>
                                    { filteredOrganizationAPIResourceCollections?.apiResourceCollections?.map(
                                        (collection: APIResourceCollectionInterface) => (
                                            <TableRow key={ collection.id } className="permissions-table-data-row">
                                                <TableCell padding="checkbox">
                                                    { useGranularConsolePermissions
                                                        ? renderGranularRowSelectAll(
                                                            collection,
                                                            APIResourceCollectionTypes.ORGANIZATION
                                                        )
                                                        : (
                                                            <Checkbox
                                                                readOnly={ isReadOnly }
                                                                disabled={ isReadOnly }
                                                                color="primary"
                                                                checked={ isCollectionRowSelected(
                                                                    APIResourceCollectionTypes.ORGANIZATION,
                                                                    collection.id
                                                                ) }
                                                                onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                                                                    handleSelect(
                                                                        e,
                                                                        collection,
                                                                        APIResourceCollectionTypes.ORGANIZATION
                                                                    )
                                                                }
                                                                inputProps={ {
                                                                    "aria-label":
                                                                        `Select ${collection.displayName} permission`
                                                                } }
                                                            />
                                                        ) }
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    { collection.displayName }
                                                </TableCell>
                                                { useGranularConsolePermissions
                                                    ? (
                                                        GRANULAR_PERMISSION_COLUMNS.map(
                                                            (field: GranularPermissionLevel) =>
                                                                renderGranularCell(
                                                                    collection,
                                                                    field,
                                                                    APIResourceCollectionTypes.ORGANIZATION
                                                                )
                                                        )
                                                    )
                                                    : renderLegacyCell(
                                                        collection,
                                                        APIResourceCollectionTypes.ORGANIZATION
                                                    )
                                                }
                                            </TableRow>
                                        )
                                    ) }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
};

export default CreateConsoleRoleWizardPermissionsForm;
