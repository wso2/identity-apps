import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Checkbox, DropdownProps, Form, Image } from "semantic-ui-react";
import axios from "axios";
import { AnimatedAvatar, TabPageLayout, IconButton, PrimaryButton } from "@wso2is/react-components";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { CDM_BASE_URL } from "../models/constants";

type SchemaListingScope = "core" | "identity_attributes" | "traits" | "application_data";

interface RouteParams {
  scope: SchemaListingScope;
  id: string;
}

interface SchemaAttribute {
  attribute_id: string;
  attribute_name: string;
  value_type?: string;
  merge_strategy?: string;
  mutability?: string;
  multi_valued?: boolean;
  application_identifier?: string;
  sub_attributes?: Array<{ attribute_name: string; attribute_id?: string }>;
}

const SCOPE_CONFIG = {
  core: { prefix: "", supportsSubAttributes: false, readOnlyName: true },
  identity_attributes: { prefix: "identity_attributes.", supportsSubAttributes: false, readOnlyName: true },
  traits: { prefix: "traits.", supportsSubAttributes: true, readOnlyName: true },
  application_data: { prefix: "application_data.", supportsSubAttributes: true, readOnlyName: true }
} satisfies Record<SchemaListingScope, { prefix: string; supportsSubAttributes: boolean; readOnlyName: boolean }>;

const stripPrefix = (name: string, prefix: string) =>
  prefix && name?.startsWith(prefix) ? name.substring(prefix.length) : name;

const getAttribute = async (scope: SchemaListingScope, id: string): Promise<SchemaAttribute> => {
  const res = await axios.get(`${CDM_BASE_URL}/profile-schema/${scope}/${id}`);
  return res.data;
};

const updateAttribute = async (scope: SchemaListingScope, id: string, payload: Partial<SchemaAttribute>) => {
  await axios.put(`${CDM_BASE_URL}/profile-schema/${scope}/${id}`, payload);
};

const searchSubAttrs = async (scope: SchemaListingScope, attributeName: string): Promise<SchemaAttribute[]> => {
  const prefix = stripPrefix(attributeName, `${scope}.`) + ".";
  const res = await axios.get(
    `${CDM_BASE_URL}/profile-schema/${scope}?filter=attribute_name+co+${scope}.${prefix}`
  );
  return res.data;
};

const ProfileAttributeEditPage: FunctionComponent<RouteComponentProps<RouteParams>> = (
  props: RouteComponentProps<RouteParams>
): ReactElement => {

  const { match } = props;
  const { t } = useTranslation();
  const dispatch: Dispatch = useDispatch();

  const scope = match.params.scope;
  const id = match.params.id;

  const cfg = SCOPE_CONFIG[scope];

  const [ attribute, setAttribute ] = useState<SchemaAttribute>(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isUpdating, setIsUpdating ] = useState(false);

  const [ subAttributes, setSubAttributes ] = useState<string[]>([]);
  const [ subAttributeOptions, setSubAttributeOptions ] = useState<{ key: string; text: string; value: string }[]>([]);

  useEffect(() => {
    setIsLoading(true);

    getAttribute(scope, id)
      .then((data) => {
        setAttribute(data);
        setSubAttributes(data?.sub_attributes?.map((s) => s.attribute_name) || []);
      })
      .catch((error) => {
        dispatch(addAlert({
          description: error?.message || "Failed to fetch attribute.",
          level: AlertLevels.ERROR,
          message: "Error"
        }));
      })
      .finally(() => setIsLoading(false));
  }, [ scope, id ]);

  useEffect(() => {
    if (!attribute) return;

    if (cfg.supportsSubAttributes && attribute.value_type === "complex") {
      searchSubAttrs(scope, attribute.attribute_name)
        .then((data) => {
          setSubAttributeOptions(
            (data ?? []).map((a) => ({
              key: a.attribute_id ?? a.attribute_name,
              text: stripPrefix(a.attribute_name, cfg.prefix),
              value: a.attribute_name
            }))
          );
        })
        .catch(() => setSubAttributeOptions([]));
    } else {
      setSubAttributeOptions([]);
    }
  }, [ attribute?.attribute_name, attribute?.value_type, scope ]);

  const generateClaimLetter = (attributeName: string): string => {
    const display = stripPrefix(attributeName, cfg.prefix);
    const last = display?.split(".").pop();
    return last ? last.charAt(0).toUpperCase() : "?";
  };

  const handleUpdate = () => {
    if (!attribute) return;

    const payload: Partial<SchemaAttribute> = {
      attribute_name: attribute.attribute_name,
      value_type: attribute.value_type,
      merge_strategy: attribute.merge_strategy,
      mutability: attribute.mutability,
      multi_valued: attribute.multi_valued,
      sub_attributes: subAttributes.map((name) => ({ attribute_name: name }))
    };

    setIsUpdating(true);

    updateAttribute(scope, id, payload)
      .then(() => {
        dispatch(addAlert({
          description: "Attribute updated successfully.",
          level: AlertLevels.SUCCESS,
          message: "Success"
        }));

        // route back to listing (adjust if you have separate pages per scope)
        history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES"));
      })
      .catch((error) => {
        dispatch(addAlert({
          description: error?.message || "Failed to update attribute.",
          level: AlertLevels.ERROR,
          message: "Error"
        }));
      })
      .finally(() => setIsUpdating(false));
  };

  const title = attribute?.attribute_name ? stripPrefix(attribute.attribute_name, cfg.prefix) : "Edit Attribute";

  return (
    <TabPageLayout
      isLoading={ isLoading }
      image={ (
        <Image floated="left" verticalAlign="middle" rounded centered size="tiny">
          <AnimatedAvatar />
          <span className="claims-letter">
            { attribute && generateClaimLetter(attribute.attribute_name) }
          </span>
        </Image>
      ) }
      title={ title }
      pageTitle="Edit Attribute"
      description="Edit schema attribute details."
      backButton={{
        onClick: () => history.push(AppConstants.getPaths().get("PROFILE_SCHEMA")),
        text: t("common:back", { defaultValue: "Go back" })
      }}
      titleTextAlign="left"
    >
      { attribute && (
        <Form>
          <Form.Input
            label="Name"
            value={ stripPrefix(attribute.attribute_name, cfg.prefix) }
            readOnly={ cfg.readOnlyName }
          />

          <Form.Dropdown
            label="Value Type"
            selection
            options={[
              { key: "string", text: "Text", value: "string" },
              { key: "integer", text: "Integer", value: "integer" },
              { key: "decimal", text: "Decimal", value: "decimal" },
              { key: "boolean", text: "Boolean", value: "boolean" },
              { key: "complex", text: "Complex", value: "complex" }
            ]}
            value={ attribute.value_type }
            onChange={ (_, data: DropdownProps) => {
              const newType = data.value as string;

              if (attribute.value_type === "complex" && newType !== "complex") {
                setSubAttributes([]);
              }

              setAttribute({ ...attribute, value_type: newType });
            }}
          />

          <Form.Dropdown
            label="Merge Strategy"
            selection
            options={[
              { key: "combine", text: "Combine", value: "combine" },
              { key: "latest", text: "Latest", value: "latest" },
              { key: "earliest", text: "Earliest", value: "earliest" }
            ]}
            value={ attribute.merge_strategy }
            onChange={ (_, data: DropdownProps) =>
              setAttribute({ ...attribute, merge_strategy: data.value as string })
            }
          />

          <Form.Field>
            <Checkbox
              label="Multi Valued"
              checked={ !!attribute.multi_valued }
              onChange={ () => setAttribute({ ...attribute, multi_valued: !attribute.multi_valued }) }
            />
          </Form.Field>

          { cfg.supportsSubAttributes && attribute.value_type === "complex" && (
            <>
              <Form.Dropdown
                label="Sub Attributes"
                placeholder="Select sub attributes"
                search
                selection
                options={ subAttributeOptions }
                onChange={ (_, data: any) => {
                  const v = data.value as string;
                  if (v && !subAttributes.includes(v)) {
                    setSubAttributes([ ...subAttributes, v ]);
                  }
                } }
              />

              <div style={{ marginTop: "1rem" }}>
                { subAttributes.map((attr) => (
                  <div
                    key={ attr }
                    style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}
                  >
                    <span>{ stripPrefix(attr, cfg.prefix) }</span>
                    <IconButton
                      onClick={ () => setSubAttributes(subAttributes.filter((x) => x !== attr)) }
                      style={{ marginLeft: "auto" }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </div>
                )) }
              </div>
            </>
          ) }

          <div style={{ marginTop: "2rem" }}>
            <PrimaryButton onClick={ handleUpdate } loading={ isUpdating } disabled={ isUpdating }>
              Update
            </PrimaryButton>
          </div>
        </Form>
      ) }
    </TabPageLayout>
  );
};

export default ProfileAttributeEditPage;
