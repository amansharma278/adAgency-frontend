import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Eye, SquarePlus, MonitorPlay } from 'lucide-react';
import { MultiSelectDropdown } from '../components/multi-select-dropdown';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { PaginationControls } from '../components/pagination-controls';
import { makePostAuthrized, makeGetRequest, makeDeleteRequest } from '../lib/helperBearar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export interface Group {
  id: string | number;
  name: string;
  memberCount: number;
  members: (string | number)[];
  adCount?: number;
  assignedAds?: (string | number)[];
  createdAt?: string;
  status?: 'active' | 'inactive';
}

export function GroupManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [groups, setGroups] = useState<Group[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [adsList, setAdsList] = useState<any[]>([]);
  const [storedMembers, setStoredMembers] = useState<(string | number)[]>([]);
  const [storedAds, setStoredAds] = useState<(string | number)[]>([]);
  const [assignAdsModalOpen, setAssignAdsModalOpen] = useState(false);
  const [assignAdsLoading, setAssignAdsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createData, setCreateData] = useState({
    name: '',
  });

  const filteredGroups = groups.filter((group) => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredGroups.length / pageSize);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const response = await makeGetRequest('/user/group/');
      console.log('Groups response:', response.data);
      setGroups(
        response?.data?.map((item: any) => ({
          id: item.id,
          name: item.name,
          memberCount: item.devices?.length || 0,
          members: item.members || [],
          adCount: item.ads?.length || 0,
          assignedAds: item.ads || [],
          createdAt: item.created_at,
          status: 'active',
        })) || []
      );
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to fetch groups');
    }
  };

  // Fetch members list
  const fetchMembers = async () => {
    try {
      const response = await makeGetRequest('/device/');
      const items =
        response.data?.map((m: any) => ({
          id: m.id,
          title: m.device_name || `Member ${m.id}`,
          description: m.location || '',
        })) || [];
      setMembersList(items);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // Fetch ads list for assignment
  const fetchAds = async () => {
    try {
      const response = await makeGetRequest('/ads/');
      const items =
        response.data?.map((a: any) => ({
          id: a.id,
          title: a.title || `Ad ${a.id}`,
          description: a.description || '',
        })) || [];
      setAdsList(items);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchMembers();
    fetchAds();
  }, []);

  // Create group
  const handleCreateGroup = async () => {
    if (!createData.name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      const response = await makePostAuthrized('/user/group/create/', {
        name: createData.name,
        device_ids: storedMembers.map((id) => Number(id)),
        ad_ids: storedAds.map((id) => Number(id)),
      });

      if (!response.status) {
        toast.error(response.data?.message || 'Error creating group');
        return;
      }

      toast.success('Group created successfully');
      setCreateModalOpen(false);
      setCreateData({ name: '' });
      setStoredMembers([]);
      setStoredAds([]);
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  // Delete group
  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    try {
      const response = await makeDeleteRequest(`/user/group/delete/${selectedGroup.id}/`);
      if (!response.status) {
        toast.error('Error deleting group');
        return;
      }
      toast.success('Group deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedGroup(null);
      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  // Assign ads to group
  const handleAssignAds = async () => {
    if (!selectedGroup) return;

    setAssignAdsLoading(true);
    try {
      const response = await makePostAuthrized(`/user/group/${selectedGroup.id}/assign-ads/`, {
        ad_ids: storedAds.map((id) => Number(id)),
      });

      if (!response.status) {
        toast.error(response.data?.message || 'Error assigning ads');
        return;
      }

      toast.success('Ads assigned successfully');
      setAssignAdsModalOpen(false);
      setStoredAds([]);
      setSelectedGroup(null);
      fetchGroups();
    } catch (error) {
      console.error('Error assigning ads:', error);
      toast.error('Failed to assign ads');
    } finally {
      setAssignAdsLoading(false);
    }
  };

  // Update group members
  const handleUpdateMembers = async () => {
    if (!selectedGroup) return;

    setLoading(true);
    try {
      const response = await makePostAuthrized(`/groups/${selectedGroup.id}/update-members/`, {
        members: storedMembers.map((id) => Number(id)),
      });

      if (!response.status) {
        toast.error(response.data?.message || 'Error updating members');
        return;
      }

      toast.success('Members updated successfully');
      setManageModalOpen(false);
      setSelectedGroup(null);
      setStoredMembers([]);
      fetchGroups();
    } catch (error) {
      console.error('Error updating members:', error);
      toast.error('Failed to update members');
    } finally {
      setLoading(false);
    }
  };

  const openManageModal = (group: Group) => {
    setSelectedGroup(group);
    setStoredMembers(group.members);
    setManageModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Group Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your user groups and their members
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Group
        </Button>
      </div>

      {/* Search Filter */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">                  Ads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedGroups.map((group) => (
                <tr
                  key={group.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {group.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {group.memberCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <MonitorPlay className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {group.adCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={group.status === 'active' ? 'default' : 'outline'}
                      className="capitalize"
                    >
                      {group.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedGroup(group);
                          // You can implement view details functionality here
                          toast.info(`Viewing details for ${group.name}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedGroup(group);
                          setStoredAds(group.assignedAds || []);
                          setAssignAdsModalOpen(true);
                        }}
                      >
                        <SquarePlus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => openManageModal(group)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => {
                          setSelectedGroup(group);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginatedGroups.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No groups found</p>
          </div>
        )}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages || 1}
          pageSize={pageSize}
          totalItems={filteredGroups.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Create Group Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new group and add members to it
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={createData.name}
                onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Add Members</Label>
              <MultiSelectDropdown
                items={membersList}
                selectedIds={storedMembers}
                onSelectionChange={setStoredMembers}
                label="Select Members to Add"
                placeholder="Search members..."
                maxHeight="300px"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {storedMembers.length} member(s) selected
              </p>
            </div>
            <div className="space-y-2">
              <Label>Add Ads</Label>
              <MultiSelectDropdown
                items={adsList}
                selectedIds={storedAds}
                onSelectionChange={setStoredAds}
                label="Select Ads to Assign"
                placeholder="Search ads..."
                maxHeight="300px"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {storedAds.length} ad(s) selected
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                setCreateData({ name: '' });
                setStoredMembers([]);
                setStoredAds([]);
              }}
            >
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleCreateGroup}>
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Members Modal */}
      <Dialog open={manageModalOpen} onOpenChange={setManageModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Group Members</DialogTitle>
            <DialogDescription>
              Add or remove members from the group "{selectedGroup?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <MultiSelectDropdown
              items={membersList}
              selectedIds={storedMembers}
              onSelectionChange={setStoredMembers}
              label="Select Members"
              placeholder="Search members..."
              maxHeight="300px"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {storedMembers.length} member(s) selected
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setManageModalOpen(false);
                setSelectedGroup(null);
                setStoredMembers([]);
              }}
            >
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleUpdateMembers}>
              {loading ? 'Updating...' : 'Update Members'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Assign Ads Modal */}
      <Dialog open={assignAdsModalOpen} onOpenChange={setAssignAdsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Ads to Group</DialogTitle>
            <DialogDescription>
              Select one or more ads to assign to "{selectedGroup?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <MultiSelectDropdown
              items={adsList}
              selectedIds={storedAds}
              onSelectionChange={setStoredAds}
              label="Select Ads to Assign"
              placeholder="Search ads..."
              maxHeight="300px"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {storedAds.length} ad(s) selected
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignAdsModalOpen(false);
                setSelectedGroup(null);
                setStoredAds([]);
              }}
            >
              Cancel
            </Button>
            <Button disabled={assignAdsLoading} onClick={handleAssignAds}>
              {assignAdsLoading ? 'Assigning...' : 'Assign Ads'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the group "{selectedGroup?.name}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
