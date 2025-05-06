import {z} from 'zod';

export const resolver = (orgId: string, records: Record<string, unknown>) => {
  let preset: Record<string, unknown> = {};

  const recordsForOrg = records?.[orgId] as Record<string, unknown>;
  switch (recordsForOrg?.role) {
    case Roles.admin:
      preset = adminPreset;
      break;
    case Roles.developer:
      preset = developerPreset;
      break;
    case Roles.member:
      preset = memberPreset;
      break;
    case Roles.viewer:
      preset = viewerPreset;
      break;
    default:
      break;
  }

  const resolvedPermission = (key: string): boolean => {
    return typeof recordsForOrg?.[key] !== 'undefined'
      ? !!recordsForOrg?.[key]
      : typeof preset[key] !== 'undefined'
        ? !!preset[key]
        : false;
  };

  return {
    role: recordsForOrg?.role as Roles,
    isCustom: resolvedPermission(PermissionKeys.isCustom),
  };
};

export type Permissions = ReturnType<typeof resolver>;

export const Roles = {
  admin: 'admin',
  member: 'member',
  viewer: 'viewer',
  developer: 'developer',
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];

export const PermissionKeys = {
  role: 'role',
  isCustom: 'isCustom',
} as const;

export type PermissionKeys = (typeof PermissionKeys)[keyof typeof PermissionKeys];

export const adminPreset = {
  [PermissionKeys.role]: Roles.admin as Roles,
  [PermissionKeys.isCustom]: false,
} satisfies PermissionsPreset;

export const memberPreset = {
  [PermissionKeys.role]: Roles.member,
  [PermissionKeys.isCustom]: false,
} satisfies PermissionsPreset;

export const viewerPreset = {
  [PermissionKeys.role]: Roles.viewer,
  [PermissionKeys.isCustom]: false,
} satisfies PermissionsPreset;

export const developerPreset = {
  [PermissionKeys.role]: Roles.developer,
  [PermissionKeys.isCustom]: false,
} satisfies PermissionsPreset;

export const permissionsSchema = z.object({
  [PermissionKeys.role]: z.enum([Roles.admin, Roles.member, Roles.viewer, Roles.developer]),
  [PermissionKeys.isCustom]: z.boolean(),
});

export type PermissionsPreset = z.infer<typeof permissionsSchema>;
