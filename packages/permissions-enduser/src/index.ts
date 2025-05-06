import {adminPreset, developerPreset, memberPreset, permissionsSchema, resolver, viewerPreset} from './resolver';

export { PermissionKeys, Roles, type Permissions, type PermissionsPreset } from './resolver';

export const endUserPermissions = {
  resolver,
  schema: permissionsSchema,
  presets: {
    admin: adminPreset,
    member: memberPreset,
    viewer: viewerPreset,
    developer: developerPreset,
  },
};
