import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagementTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    avatar: "https://images.unsplash.com/photo-1538155421123-6a79813f5deb",
    avatarAlt: "Professional headshot of middle-aged man with brown hair in dark suit",
    registrationDate: "2024-08-15",
    listingsCount: 3,
    status: "active",
    role: "user",
    lastActive: "2024-10-30"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1685374803651-abd04a3573ef",
    avatarAlt: "Professional headshot of young woman with blonde hair in white blazer",
    registrationDate: "2024-09-02",
    listingsCount: 1,
    status: "active",
    role: "user",
    lastActive: "2024-10-31"
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    avatar: "https://images.unsplash.com/photo-1610909810013-7c52994a153e",
    avatarAlt: "Professional headshot of Asian man with black hair in navy shirt",
    registrationDate: "2024-07-20",
    listingsCount: 5,
    status: "suspended",
    role: "user",
    lastActive: "2024-10-25"
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    avatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
    avatarAlt: "Professional headshot of Hispanic woman with dark hair in blue blouse",
    registrationDate: "2024-10-01",
    listingsCount: 0,
    status: "pending",
    role: "user",
    lastActive: "2024-10-31"
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@email.com",
    avatar: "https://images.unsplash.com/photo-1630257202782-ae7fbd64bd02",
    avatarAlt: "Professional headshot of bearded man with brown hair in gray sweater",
    registrationDate: "2024-06-10",
    listingsCount: 8,
    status: "active",
    role: "admin",
    lastActive: "2024-11-01"
  }];


  const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" }];


  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === "all" || user?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
    prev?.includes(userId) ?
    prev?.filter((id) => id !== userId) :
    [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers?.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map((user) => user?.id));
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    console.log(`Changing user ${userId} status to ${newStatus}`);
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'text-success', bg: 'bg-success/10', label: 'Active' },
      pending: { color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
      suspended: { color: 'text-error', bg: 'bg-error/10', label: 'Suspended' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        {config?.label}
      </span>);

  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            type="search"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="sm:max-w-xs" />

          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
            className="sm:max-w-xs" />

        </div>
        
        {selectedUsers?.length > 0 &&
        <div className="flex gap-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('activate')}
            iconName="CheckCircle"
            iconPosition="left">

              Activate ({selectedUsers?.length})
            </Button>
            <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkAction('suspend')}
            iconName="Ban"
            iconPosition="left">

              Suspend ({selectedUsers?.length})
            </Button>
          </div>
        }
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border" />

                </th>
                <th className="p-4 text-left text-sm font-semibold text-muted-foreground">User</th>
                <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Registration</th>
                <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Listings</th>
                <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Last Active</th>
                <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) =>
              <tr key={user?.id} className="border-b border-border hover:bg-muted/30 tesla-transition">
                  <td className="p-4">
                    <input
                    type="checkbox"
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={() => handleUserSelect(user?.id)}
                    className="rounded border-border" />

                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Image
                      src={user?.avatar}
                      alt={user?.avatarAlt}
                      className="h-10 w-10 rounded-full object-cover" />

                      <div>
                        <p className="font-medium text-card-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        {user?.role === 'admin' &&
                      <span className="text-xs text-accent font-medium">Administrator</span>
                      }
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-card-foreground">
                    {new Date(user.registrationDate)?.toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-card-foreground">
                    {user?.listingsCount}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(user?.status)}
                  </td>
                  <td className="p-4 text-sm text-card-foreground">
                    {new Date(user.lastActive)?.toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('View user', user?.id)}
                      iconName="Eye" />

                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Edit user', user?.id)}
                      iconName="Edit" />

                      {user?.status === 'active' ?
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(user?.id, 'suspended')}
                      iconName="Ban"
                      className="text-error hover:text-error" /> :


                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(user?.id, 'active')}
                      iconName="CheckCircle"
                      className="text-success hover:text-success" />

                    }
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredUsers?.map((user) =>
        <div key={user?.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                type="checkbox"
                checked={selectedUsers?.includes(user?.id)}
                onChange={() => handleUserSelect(user?.id)}
                className="rounded border-border mt-1" />

                <Image
                src={user?.avatar}
                alt={user?.avatarAlt}
                className="h-12 w-12 rounded-full object-cover" />

                <div>
                  <p className="font-medium text-card-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {user?.role === 'admin' &&
                <span className="text-xs text-accent font-medium">Administrator</span>
                }
                </div>
              </div>
              {getStatusBadge(user?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-muted-foreground">Registered:</span>
                <p className="text-card-foreground">{new Date(user.registrationDate)?.toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Listings:</span>
                <p className="text-card-foreground">{user?.listingsCount}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Active:</span>
                <p className="text-card-foreground">{new Date(user.lastActive)?.toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('View user', user?.id)}
              iconName="Eye" />

              <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Edit user', user?.id)}
              iconName="Edit" />

              {user?.status === 'active' ?
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleStatusChange(user?.id, 'suspended')}
              iconName="Ban" /> :


            <Button
              variant="default"
              size="sm"
              onClick={() => handleStatusChange(user?.id, 'active')}
              iconName="CheckCircle" />

            }
            </div>
          </div>
        )}
      </div>
      {filteredUsers?.length === 0 &&
      <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      }
    </div>);

};

export default UserManagementTable;