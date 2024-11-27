import { permissionAction, permissionResource } from '../interfaces/permission';

type Role = 'admin' | 'super_admin';

export const defaultPermissions: Record<
	Role,
	{ resource: permissionResource; actions: { own: permissionAction[], others: permissionAction[] } }[]
> = {
	admin: [
        {
            resource: 'announcements',
            actions: {
                own: ['view', 'update', 'delete', 'create'],
                others: ['view'],
            },
        },
        {
            resource: 'notifications',
            actions: {
                own: ['view', 'update', 'delete', 'create'],
                others: ['view'],
            },
        },
        { resource: 'users', actions: { own: ['view', 'update', 'delete', 'create'], others: ['view'] } },
        { resource: 'course_materials', actions: { own: ['view'], others: ['view'] } },
    ],
    super_admin: [
        {
            resource: 'announcements',
            actions: {
                own: ['view', 'update', 'delete', 'create'],
                others: ['view', 'update', 'delete'],
            },
        },
        {
            resource: 'notifications',
            actions: {
                own: ['view', 'update', 'delete', 'create'],
                others: ['view', 'update', 'delete'],
            },
        },
        { resource: 'users', actions: { own: ['view', 'update', 'delete', 'create'], others: ['view', 'create'] } },
        {
            resource: 'course_materials',
            actions: {
                own: ['view', 'update', 'delete', 'create'],
                others: ['view', 'update', 'delete'],
            },
        },
    ]
};

export const allResourceActions: permissionAction[] = [
	'view',
	'update',
	'delete',
	'create',
];

export const allResources: permissionResource[] = [
	'announcements',
	'users',
	'course_materials',
	'notifications',
];
