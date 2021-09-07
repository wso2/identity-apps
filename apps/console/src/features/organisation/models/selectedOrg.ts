export interface SelectedOrganization {
  id: string;
  name: string;
  displayName: string;
  description: string;
  status: string;
  parent: Parent;
  meta?: Meta;
  attributes?: (null)[] | null;
}
export interface Parent {
  id: string;
  ref: string;
  name: string;
  displayName: string;
}
export interface Meta {
  created: string;
  lastModified: string;
  createdBy: CreatedByOrLastModifiedBy;
  lastModifiedBy: CreatedByOrLastModifiedBy;
}
export interface CreatedByOrLastModifiedBy {
  id: string;
  ref: string;
  username: string;
}
