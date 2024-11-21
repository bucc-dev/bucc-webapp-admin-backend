const defaultPermissions = {
	admin: [
		{
			resource: 'announcements',
			action: ['view', 'update', 'delete', 'create'],
		},
		{
			resource: 'notifications',
			action: ['view', 'update', 'delete', 'create'],
		},
		{ resource: 'users', action: ['view'] },
		{ resource: 'course_materials', action: ['view'] },
	],
	super_admin: [
		{
			resource: 'announcements',
			action: ['view', 'update', 'delete', 'create'],
		},
		{
			resource: 'notifications',
			action: ['view', 'update', 'delete', 'create'],
		},
		{ resource: 'users', action: ['view', 'create'] },
		{
			resource: 'course_materials',
			action: ['view', 'update', 'delete', 'create'],
		},
	],
};

export default defaultPermissions;
