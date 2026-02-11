// utils/profile-schema-listing.ts
import { ProfileSchemaAttribute, ProfileSchemaFullResponse } from "./models/profile-attributes";
import {  ProfileSchemaListingRow, SchemaListingScope  } from "./models/profile-attribute-listing";

const lastSegment = (name: string): string => {
    if (!name) return "";
    const parts = name.split(".");
    return parts[parts.length - 1] || name;
};

const rowId = (scope: SchemaListingScope, attributeName: string, attributeId?: string): string =>
    attributeId ? `${scope}:${attributeId}` : `${scope}:${attributeName}`;

export const toProfileSchemaListingRows = (schema: ProfileSchemaFullResponse): ProfileSchemaListingRow[] => {
    const rows: ProfileSchemaListingRow[] = [];

    // ✅ core: no chips, no belongs_to, no delete, no edit
    rows.push({
        id: rowId("core", "profile_id"),
        scope: "core",
        attribute_name: "profile_id",
        display_name: "profile_id",
        editable: false,
        deletable: false
    });

    rows.push({
        id: rowId("core", "user_id"),
        scope: "core",
        attribute_name: "user_id",
        display_name: "user_id",
        editable: false,
        deletable: false
    });

    // ✅ identity_attributes: chip, no delete
    (schema.identity_attributes ?? []).forEach((a: ProfileSchemaAttribute) => {
        rows.push({
            id: rowId("identity_attributes", a.attribute_name, a.attribute_id),
            scope: "identity_attributes",
            attribute_id: a.attribute_id,
            attribute_name: a.attribute_name,
            display_name: lastSegment(a.attribute_name),
            chip_label: "identity_attributes",
            editable: true,
            deletable: false
        });
    });

    // ✅ traits: chip, delete allowed
    (schema.traits ?? []).forEach((a: ProfileSchemaAttribute) => {
        const name = a.attribute_name ?? "";
        const display = lastSegment(name).replace(/^traits\./, ""); // just in case
        rows.push({
            id: rowId("traits", name, a.attribute_id),
            scope: "traits",
            attribute_id: a.attribute_id,
            attribute_name: name,
            display_name: display,
            chip_label: "traits",
            editable: true,
            deletable: true
        });
    });

    // ✅ application_data: chip + belongs_to appId
    const appData = schema.application_data ?? {};
    Object.entries(appData).forEach(([ appId, attrs ]) => {
        (attrs ?? []).forEach((a: ProfileSchemaAttribute) => {
            const fullName = a.attribute_name ?? "";
            rows.push({
                id: rowId("application_data", fullName, a.attribute_id),
                scope: "application_data",
                attribute_id: a.attribute_id,
                attribute_name: fullName,
                display_name: lastSegment(fullName),
                chip_label: "application_data",
                belongs_to: appId,
                editable: true,
                deletable: true // change to false if you want to block deletion
            });
        });
    });

    return rows;
};
