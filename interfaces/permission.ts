import mongoose, { Document } from 'mongoose';

interface IPermission extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    role: 'admin' | 'super_admin';
    permissions: [{
        resource: 'announcements' | 'course_materials' | 'notifications' | 'users',
        action: 'view' | 'update' | 'delete' | 'create'
    }];
}

export default IPermission;
