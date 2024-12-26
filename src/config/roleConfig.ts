import { IResourcePermissionObject, permissionAction, permissionResource, userRole } from '../interfaces/permission';

export const allPossibleResourceActions: permissionAction[] = [
	'view',
	'update',
	'delete',
	'create',
];

export const allPossibleResources: permissionResource[] = [
	'announcements',
	'users',
	'course_materials',
	'notifications',
];

export const defaultPermissions: Record<
	userRole,
    IResourcePermissionObject[]
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
        { resource: 'users', actions: { own: ['view', 'update', 'delete'], others: ['view'] } },
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
        { resource: 'users', actions: { own: ['view', 'update', 'delete'], others: ['view', 'create'] } },
        {
            resource: 'course_materials',
            actions: {
                own: ['view', 'delete', 'create'],
                others: ['view', 'delete'],
            },
        },
    ]
};

// Defines valid actions for a resource that an admin can perform on his/her account and the account of others
export const validResourceActions: IResourcePermissionObject[] = [
    {
        resource: 'announcements',
        actions: {
            own: ['view', 'update', 'delete', 'create'],
            others: ['view', 'update', 'delete']
        }
    },
    {
        resource: 'users',
        actions: {
            own: ['view', 'update', 'delete'],
            others: ['view', 'update', 'delete', 'create']
        }
    },
    {
        resource: 'course_materials',
        actions: {
            own: ['view', 'delete', 'create'],
            others: ['view', 'delete']
        }
    },
    {
        resource: 'notifications',
        actions: {
            own: ['view', 'update', 'delete', 'create'],
            others: ['view', 'update', 'delete']
        }
    }
];

