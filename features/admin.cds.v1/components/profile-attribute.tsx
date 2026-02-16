// import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useTranslation } from "react-i18next";
// import { RouteComponentProps } from "react-router";
// import { Dispatch } from "redux";
// import { Checkbox, DropdownProps, Form, Image } from "semantic-ui-react";
// import { 
//     AnimatedAvatar, 
//     TabPageLayout, 
//     IconButton, 
//     PrimaryButton, 
//     DangerZoneGroup, 
//     DangerZone, 
//     ConfirmationModal,
//     EmphasizedSegment
// } from "@wso2is/react-components";
// import { addAlert } from "@wso2is/core/store";
// import { AlertLevels } from "@wso2is/core/models";
// import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
// import { history } from "@wso2is/admin.core.v1/helpers/history";
// import { TrashIcon } from "@oxygen-ui/react-icons";
// import { 
//     SchemaListingScope, 
//     SCOPE_CONFIG, 
//     stripScopePrefix 
// } from "../models/profile-attribute-listing";
// import { 
//     ProfileSchemaAttribute, 
//     ValueType, 
//     MergeStrategy,
//     ProfileSchemaSubAttributeRef 
// } from "../models/profile-attributes";
// import {
//     fetchSchemaAttributeById,
//     updateSchemaAttributeById,
//     deleteSchemaAttributeById,
//     searchSubAttributes
// } from "../api/profile-attributes";

// interface RouteParams {
//     scope: SchemaListingScope;
//     id: string;
// }

// const ProfileAttributeEditPage: FunctionComponent<RouteComponentProps<RouteParams>> = (
//     props: RouteComponentProps<RouteParams>
// ): ReactElement => {

//     const { match } = props;
//     const { t } = useTranslation();
//     const dispatch: Dispatch = useDispatch();

//     const scope = match.params.scope;
//     const id = match.params.id;

//     const cfg = SCOPE_CONFIG[scope];

//     const [ attribute, setAttribute ] = useState<ProfileSchemaAttribute>(null);
//     const [ isLoading, setIsLoading ] = useState(false);
//     const [ isUpdating, setIsUpdating ] = useState(false);
//     const [ isDeleting, setIsDeleting ] = useState(false);
//     const [ showDeleteModal, setShowDeleteModal ] = useState(false);

//     const [ subAttributes, setSubAttributes ] = useState<ProfileSchemaSubAttributeRef[]>([]);
//     const [ subAttributeOptions, setSubAttributeOptions ] = useState<{ 
//         key: string; 
//         text: string; 
//         value: string;
//         attributeId: string;
//     }[]>([]);

//     useEffect(() => {
//         setIsLoading(true);

//         fetchSchemaAttributeById(scope, id)
//             .then((data) => {
//                 setAttribute(data);
//                 setSubAttributes(data?.sub_attributes || []);
//             })
//             .catch((error) => {
//                 dispatch(addAlert({
//                     description: error?.message || "Failed to fetch attribute.",
//                     level: AlertLevels.ERROR,
//                     message: "Error"
//                 }));
//             })
//             .finally(() => setIsLoading(false));
//     }, [ scope, id ]);

//     useEffect(() => {
//         if (!attribute) return;

//         if (cfg.supportsSubAttributes && attribute.value_type === "complex") {
//             searchSubAttributes(scope, attribute.attribute_name)
//                 .then((data) => {
//                     setSubAttributeOptions(
//                         (data ?? []).map((a) => ({
//                             key: a.attribute_id ?? a.attribute_name,
//                             text: stripScopePrefix(scope, a.attribute_name),
//                             value: a.attribute_name,
//                             attributeId: a.attribute_id
//                         }))
//                     );
//                 })
//                 .catch(() => setSubAttributeOptions([]));
//         } else {
//             setSubAttributeOptions([]);
//         }
//     }, [ attribute?.attribute_name, attribute?.value_type, scope ]);

//     const generateClaimLetter = (attributeName: string): string => {
//         const display = stripScopePrefix(scope, attributeName);
//         const last = display?.split(".").pop();
//         return last ? last.charAt(0).toUpperCase() : "?";
//     };

//     const handleUpdate = () => {
//         if (!attribute) return;

//         const payload: Partial<ProfileSchemaAttribute> = {
//             attribute_name: attribute.attribute_name,
//             value_type: attribute.value_type,
//             merge_strategy: attribute.merge_strategy,
//             mutability: attribute.mutability,
//             multi_valued: attribute.multi_valued,
//             sub_attributes: subAttributes
//         };

//         setIsUpdating(true);

//         updateSchemaAttributeById(scope, id, payload)
//             .then(() => {
//                 dispatch(addAlert({
//                     description: "Attribute updated successfully.",
//                     level: AlertLevels.SUCCESS,
//                     message: "Success"
//                 }));

//                 history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES"));
//             })
//             .catch((error) => {
//                 dispatch(addAlert({
//                     description: error?.message || "Failed to update attribute.",
//                     level: AlertLevels.ERROR,
//                     message: "Error"
//                 }));
//             })
//             .finally(() => setIsUpdating(false));
//     };

//     const handleDelete = async (): Promise<void> => {
//         setIsDeleting(true);

//         try {
//             await deleteSchemaAttributeById(scope, id);

//             dispatch(addAlert({
//                 level: AlertLevels.SUCCESS,
//                 message: "Deleted",
//                 description: "Attribute deleted successfully."
//             }));

//             history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES"));
//         } catch (error: any) {
//             dispatch(addAlert({
//                 level: AlertLevels.ERROR,
//                 message: "Delete failed",
//                 description: error?.message || "Failed to delete the attribute."
//             }));
//         } finally {
//             setIsDeleting(false);
//             setShowDeleteModal(false);
//         }
//     };

//     const title = attribute?.attribute_name 
//         ? stripScopePrefix(scope, attribute.attribute_name) 
//         : "Edit Attribute";

//     return (
//         <>
//             <TabPageLayout
//                 isLoading={ isLoading }
//                 image={ (
//                     <Image floated="left" verticalAlign="middle" rounded centered size="tiny">
//                         <AnimatedAvatar />
//                         <span className="claims-letter">
//                             { attribute && generateClaimLetter(attribute.attribute_name) }
//                         </span>
//                     </Image>
//                 ) }
//                 title={ title }
//                 pageTitle="Edit Attribute"
//                 description={ cfg.label }
//                 backButton={{
//                     onClick: () => history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES")),
//                     text: t("common:back", { defaultValue: "Go back" })
//                 }}
//                 titleTextAlign="left"
//             >
//                 { attribute && (
//                     <>
//                         <EmphasizedSegment padded="very">
//                             <div className="form-container with-max-width">
//                                 { scope === "identity_attributes" && (
//                                     <div style={{ 
//                                         padding: "1rem", 
//                                         marginBottom: "1rem", 
//                                         backgroundColor: "#e8f4fd", 
//                                         border: "1px solid #bbdefb",
//                                         borderRadius: "4px"
//                                     }}>
//                                         <strong>Note:</strong> Identity attributes are read-only here. Please update identity attributes from the Attributes section.
//                                     </div>
//                                 ) }
                                
//                                 <Form>
//                                     <Form.Input
//                                         label="Name"
//                                         value={ stripScopePrefix(scope, attribute.attribute_name) }
//                                         readOnly={ cfg.readOnlyName }
//                                     />

//                                     <Form.Dropdown
//                                         label="Value Type"
//                                         selection
//                                         disabled={ !cfg.allowValueTypeEdit }
//                                         options={[
//                                             { key: "string", text: "Text", value: "string" },
//                                             { key: "integer", text: "Integer", value: "integer" },
//                                             { key: "decimal", text: "Decimal", value: "decimal" },
//                                             { key: "boolean", text: "Boolean", value: "boolean" },
//                                             { key: "complex", text: "Complex", value: "complex" }
//                                         ]}
//                                         value={ attribute.value_type }
//                                         onChange={ (_, data: DropdownProps) => {
//                                             const newType = data.value as ValueType;

//                                             if (attribute.value_type === "complex" && newType !== "complex") {
//                                                 setSubAttributes([]);
//                                             }

//                                             setAttribute({ ...attribute, value_type: newType });
//                                         }}
//                                     />

//                                     <Form.Dropdown
//                                         label="Merge Strategy"
//                                         selection
//                                         disabled={ !cfg.allowMergeStrategyEdit }
//                                         options={[
//                                             { key: "combine", text: "Combine", value: "combine" },
//                                             { key: "overwrite", text: "Overwrite", value: "overwrite" }
//                                         ]}
//                                         value={ attribute.merge_strategy }
//                                         onChange={ (_, data: DropdownProps) =>
//                                             setAttribute({ ...attribute, merge_strategy: data.value as MergeStrategy })
//                                         }
//                                     />

//                                     <Form.Field>
//                                         <Checkbox
//                                             label="Multi Valued"
//                                             checked={ !!attribute.multi_valued }
//                                             disabled={ !cfg.allowMultiValuedEdit }
//                                             onChange={ () => setAttribute({ ...attribute, multi_valued: !attribute.multi_valued }) }
//                                         />
//                                     </Form.Field>

//                                     { cfg.supportsSubAttributes && attribute.value_type === "complex" && (
//                                         <>
//                                             <Form.Dropdown
//                                                 label="Sub Attributes"
//                                                 placeholder="Select sub attributes"
//                                                 search
//                                                 selection
//                                                 options={ subAttributeOptions }
//                                                 onChange={ (_, data: any) => {
//                                                     const selectedAttrName = data.value as string;
//                                                     const option = subAttributeOptions.find(opt => opt.value === selectedAttrName);
                                                    
//                                                     if (option && !subAttributes.some(sa => sa.attribute_name === selectedAttrName)) {
//                                                         setSubAttributes([
//                                                             ...subAttributes,
//                                                             {
//                                                                 attribute_id: option.attributeId,
//                                                                 attribute_name: selectedAttrName
//                                                             }
//                                                         ]);
//                                                     }
//                                                 } }
//                                             />

//                                             <div style={{ marginTop: "1rem" }}>
//                                                 { subAttributes.map((subAttr) => (
//                                                     <div
//                                                         key={ subAttr.attribute_id }
//                                                         style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}
//                                                     >
//                                                         <span>{ stripScopePrefix(scope, subAttr.attribute_name) }</span>
//                                                         <IconButton
//                                                             onClick={ () => setSubAttributes(
//                                                                 subAttributes.filter((x) => x.attribute_id !== subAttr.attribute_id)
//                                                             ) }
//                                                             style={{ marginLeft: "auto" }}
//                                                         >
//                                                             <TrashIcon />
//                                                         </IconButton>
//                                                     </div>
//                                                 )) }
//                                             </div>
//                                         </>
//                                     ) }

//                                     { scope !== "identity_attributes" && (
//                                         <div style={{ marginTop: "2rem" }}>
//                                             <PrimaryButton onClick={ handleUpdate } loading={ isUpdating } disabled={ isUpdating }>
//                                                 Update
//                                             </PrimaryButton>
//                                         </div>
//                                     ) }
//                                 </Form>
//                             </div>
//                         </EmphasizedSegment>

//                         { (scope === "traits" || scope === "application_data") && (
//                             <DangerZoneGroup sectionHeader="Danger Zone">
//                                 <DangerZone
//                                     actionTitle="Delete Attribute"
//                                     header="Delete this attribute"
//                                     subheader="This action is irreversible and will permanently delete the attribute."
//                                     onActionClick={ () => setShowDeleteModal(true) }
//                                     isButtonDisabled={ isDeleting }
//                                 />
//                             </DangerZoneGroup>
//                         ) }
//                     </>
//                 ) }
//             </TabPageLayout>

//             { showDeleteModal && (
//                 <ConfirmationModal
//                     onClose={ () => setShowDeleteModal(false) }
//                     type="negative"
//                     open={ showDeleteModal }
//                     assertionHint="Please confirm the deletion."
//                     assertionType="checkbox"
//                     primaryAction="Confirm"
//                     secondaryAction="Cancel"
//                     onSecondaryActionClick={ () => setShowDeleteModal(false) }
//                     onPrimaryActionClick={ handleDelete }
//                     closeOnDimmerClick={ false }
//                 >
//                     <>
//                         <ConfirmationModal.Header>Delete Attribute</ConfirmationModal.Header>
//                         <ConfirmationModal.Message attached negative>
//                             This action is irreversible!
//                         </ConfirmationModal.Message>
//                         <ConfirmationModal.Content>
//                             Are you sure you want to delete <b>{ stripScopePrefix(scope, attribute?.attribute_name) }</b>?
//                         </ConfirmationModal.Content>
//                     </>
//                 </ConfirmationModal>
//             ) }
//         </>
//     );
// };

// export default ProfileAttributeEditPage;
