import mongoose, { Schema } from 'mongoose';
import IPermission from '../interfaces/permission';

const PermissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        role: {
            type: String,
            enum: ['admin', 'super_admin'],
            required: true
        },
        permissions: [
            {
                resource: {
                    type: String,
                    enum: ['announcements', 'course_materials', 'notifications', 'users'],
                    required: true,
                },
                action: {
                    type: String,
                    enum: ['view', 'update', 'delete', 'create'],
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);


const default_admin_permissions = [
    {
        resource: 'announcements',
        action: ['view', 'update', 'delete', 'create']
    },
    {
        resource: 'notifications',
        action: ['view', 'update', 'delete', 'create']
    },
    {
        resource: 'users',
        action: ['view']
    },
    {
        resource: 'course_materials',
        action: ['view']
    }
];

const default_super_admin_permissions = [
    {
        resource: 'announcements',
        action: ['view', 'update', 'delete', 'create']
    },
    {
        resource: 'notifications',
        action: ['view', 'update', 'delete', 'create']
    },
    {
        resource: 'users',
        action: ['view', 'create']
    },
    {
        resource: 'course_materials',
        action: ['view', 'update', 'delete', 'create']
    }
];
PermissionSchema.pre('save', async function(next) {
    if (this.isNew) {

    }

});

export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);
