import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Search, Eye, RotateCw, Trash2, HardDrive, MapPin, Clock, Plus,SquarePlus  } from 'lucide-react';
import { mockDevices, mockVideos, Device, DeviceResponse, VideoRes } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { makeGetRequest, makeDeleteRequest, makePostRequest, makePostAuthrized } from '../lib/helperBearar';
import { MultiSelectDropdown } from '../components/multi-select-dropdown';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
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

export function DeviceManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [addDevice, setDevices] = useState<[Device] | []>([]);
  const [createDeviceModalOpen, setCreateDeviceModalOpen] = useState(false);
  const [isCreateDeviceLoding,setIsCreateDeviceLoding] = useState(false);
  const [asignAdModel, setAsignAdModel]= useState(false);
  const [storedAds, setStoredAds] = useState<(string | number)[]>([]);
  const [deviceInfo, setDeviceInfo] = useState({
    device_name:"",
    device_id:"",
    secret_key:"",
    location:""
  });
  const [adsList, setAdsList] = useState<[VideoRes]|[]>([]);

  const filteredDevices = addDevice.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.deviceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRestart = (device: Device) => {
    toast.success(`Restarting ${device.name}...`);
  };

  const handleDelete = async () => {

    const delteRes = await makeDeleteRequest(`/device/${selectedDevice?.id}/`)
    if (!delteRes.status) {
      console.error("Error");

    }
    toast.success('Device removed successfully');
    setDeleteDialogOpen(false);
    setSelectedDevice(null);
  };

  const getVideoTitle = (videoId: string | null) => {
    if (!videoId) return 'None';
    const video = mockVideos.find((v) => v.id === videoId);
    return video?.title || 'Unknown';
  };

  const getAllDevicesList = async () => {
    const response = await makeGetRequest("/device/")
    setDevices(response.data?.map((item: DeviceResponse) => {
      return {
        id: item.id,
        "name": item.device_name,
        "deviceId": item.device_id,
        location: item.location,
        status: item.is_online ? 'online' : 'offline',
        currentlyPlaying: "null",
        lastActive: item.last_active,
        storageUsed: 77,
        storageTotal: 88,
        assignedAds: item.assigned_ads,
        uptime: 9
      }
    }))
    // console.log(response.data)
  }
  const getAllAdsList = async () => {
    const response = await makeGetRequest("/ads/")
    console.log(response.data)
    setAdsList(response.data)
    
  }

  const handleAssignAd =async () => {

    console.log(storedAds)
    const response = await makePostAuthrized(`/device/${selectedDevice?.id}/assign-ad/`,{
      ads:storedAds.map((id)=>Number(id))
    })
    if(!response.status){
      toast.error(response.data.message || "Error assigning ads to device")
      return;
    }else{

      toast.success(response.data.message || "Ads assigned to device successfully")
    }

    setAsignAdModel(false);
  }
const createDevice = async () => {
  setIsCreateDeviceLoding(true);
  const respnse = await makePostAuthrized("/device/create/",{
  device_name:deviceInfo.device_name,
  device_id:deviceInfo.device_id,
  secret_key:deviceInfo.secret_key,
  location:deviceInfo.location
});

setIsCreateDeviceLoding(false)
if(!respnse.status){
  toast.error(respnse.data.message)
  return;
}
toast.success(respnse.data.message)


setCreateDeviceModalOpen(false);
getAllDevicesList();
console.log(respnse)
}
  useEffect(() => {
    getAllDevicesList();
    getAllAdsList();
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
          Device Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage all connected display devices
        </p>
        <Button onClick={() => setCreateDeviceModalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Device
                </Button>
        <Dialog open={createDeviceModalOpen} onOpenChange={setCreateDeviceModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle >Assign New Device</DialogTitle>
              <DialogDescription>
                Fill in the details to assign a new device to your network. You can manage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
             
              <div className="space-y-2">
                <Label htmlFor="title">Device Name</Label>
                <Input onChange={(e)=>setDeviceInfo({...deviceInfo,device_name:e.target.value})} id="device" placeholder="Enter device name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceid">Device ID</Label>
                <Input onChange={(e)=>setDeviceInfo({...deviceInfo,device_id:e.target.value})} id="deviceid" placeholder="Enter unique device ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secreatkey">Secret Key</Label>
                <Input onChange={(e)=>setDeviceInfo({...deviceInfo,secret_key:e.target.value})} id="secreatkey" placeholder="Enter secret key" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input onChange={(e)=>setDeviceInfo({...deviceInfo,location:e.target.value})} id="location" placeholder="Enter device location" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDeviceModalOpen(false)}>
                Cancel
              </Button>
              <Button disabled={isCreateDeviceLoding} onClick={createDevice}>Asign Device</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

   <Dialog open={asignAdModel} onOpenChange={setAsignAdModel}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Advertisement to Device</DialogTitle>
            <DialogDescription>
              You can set scheduling and priority for the ad.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <MultiSelectDropdown
              items={adsList}
              selectedIds={storedAds}
              onSelectionChange={setStoredAds}
              label="Select Advertisements to Assign"
              placeholder="Search advertisements..."
              maxHeight="240px"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAsignAdModel(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignAd}>Assign Advertisement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Currently Playing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Storage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredDevices.map((device) => {
                const storagePercentage = (device.storageUsed / device.storageTotal) * 100;
                return (
                  <tr
                    key={device.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {device.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {device.deviceId}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {device.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                        ></div>
                        <Badge
                          variant={device.status === 'online' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {device.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Uptime: {device.uptime}%
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {getVideoTitle(device.currentlyPlaying)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(device.lastActive).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {device.storageUsed.toFixed(1)} / {device.storageTotal} GB
                          </span>
                        </div>
                        <Progress value={storagePercentage} className="h-1.5" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link to={`/devices/${device.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleRestart(device)}
                        >
                          <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => {
                            setSelectedDevice(device);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          
                        </Button>
                         <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setAsignAdModel(true)
                            setSelectedDevice(device);
                          setStoredAds([]);
                          }}
                        >
                           <SquarePlus />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Device?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{selectedDevice?.name}" from your network. The device can be
              reconnected later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
