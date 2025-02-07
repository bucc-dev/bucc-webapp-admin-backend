import { IResourcePermissionObject, permissionAction, permissionResource } from '../interfaces/permission';
import { userRole } from '../interfaces/user';

export const allPossibleResourceActions: permissionAction[] = [
	'read',
	'update',
	'delete',
	'create',
];

export const allPossibleResources: permissionResource[] = [
	'announcements',
	'users',
	'course_materials'
];

export const defaultPermissions: Record<
	userRole,
    IResourcePermissionObject[]
> = {
    student: [
        {
            resource: 'announcements',
            actions: {
                own: ['read'],
                others: ['read'],
            },
        },
        { resource: 'users', actions: { own: ['read'], others: ['read'] } },
        { resource: 'course_materials', actions: { own: ['read'], others: ['read'] } },
    ],
	admin: [
        {
            resource: 'announcements',
            actions: {
                own: ['read', 'delete', 'create'],
                others: ['read'],
            },
        },
        { resource: 'users', actions: { own: ['read', 'update', 'delete'], others: ['read'] } },
        { resource: 'course_materials', actions: { own: ['read'], others: ['read'] } },
    ],
    super_admin: [
        {
            resource: 'announcements',
            actions: {
                own: ['read', 'delete', 'create'],
                others: ['read', 'delete']
            }
        },
        {
            resource: 'users',
            actions: {
                own: ['read', 'update', 'delete'],
                others: ['read', 'update', 'delete']
            }
        },
        {
            resource: 'course_materials',
            actions: {
                own: ['read', 'delete', 'create'],
                others: ['read', 'delete']
            }
        }
    ]
};

// Defines valid actions for a resource that an admin can perform on his/her account and the account of others
export const validResourceActions: IResourcePermissionObject[] = [
    {
        resource: 'announcements',
        actions: {
            own: ['read', 'delete', 'create'],
            others: ['read', 'delete']
        }
    },
    {
        resource: 'users',
        actions: {
            own: ['read', 'update', 'delete'],
            others: ['read', 'update', 'delete']
        }
    },
    {
        resource: 'course_materials',
        actions: {
            own: ['read', 'delete', 'create'],
            others: ['read', 'delete']
        }
    }
];

