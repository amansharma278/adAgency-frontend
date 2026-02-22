import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Pause, Play, Calendar, MonitorPlay, AwardIcon } from 'lucide-react';
import { mockVideos, mockDevices, Video,VideoRes } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { PaginationControls } from '../components/pagination-controls';
import {makePostAuthrized} from '../lib/helperBearar'
import { makeGetRequest,makeDeleteRequest } from '../lib/helperBearar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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

export function AdManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [adsVideo, setAdsVideo] = useState<[Video]|[]>([]);

  const filteredVideos = adsVideo.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVideos.length / pageSize);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete =async () => {
    console.log("helo")
  const delteRes =  await makeDeleteRequest("/device/9/")
  console.log(delteRes)
  if(!delteRes.status){
    // console.error(delteRes.);
    
  }
    toast.success('Video deleted successfully');
    setDeleteDialogOpen(false);
    setSelectedVideo(null);
  };
  handleDelete();
const baseUrl = import.meta.env.VITE_BASE_URL;
 const [selectedFile, setSelectedFile] = useState<string|Blob>("");

 const [addData, setAddData] = useState({
  title:"",
  description:"",
  video:"",
  duration:"10",
  play_limit:"",
  start_date:"",
  end_date:""

 })
 
  const handleUpload = async() => {
    
      try{
        const {title, description,video,duration,play_limit,start_date,end_date} = addData;

        if(!title || !description || !duration ||!play_limit){
          toast.error("You need to filed the all the input field")
        }
       const formData = new FormData();
       formData.append("video", selectedFile);
        const response = await fetch(baseUrl+"/ads/video/upload/",{
          method:"POST",
          headers:{
             "Authorization":`${"Bearer " + localStorage.getItem("access")}`
          },
          body:formData,
        })
        
        const data = await response.json();
        console.log(data)
      const  videoid = data.id;
       const s =  makePostAuthrized("/ads/create/", {title, description,video:videoid,duration,play_limit,start_date,end_date})
       console.log(s);
        
        toast.success('Video uploaded successfully');

    }catch(error){
          console.log(error)
    }

    

    
    setUploadModalOpen(false);
  };
const videoGet=async()=>{
   try{
    const videRes = await makeGetRequest("/ads/");
    console.log(videRes.data)
    setAdsVideo(videRes?.data?.map((item: VideoRes)=>{
      return {
        "id":item.id,
        "title":item.title,
        "description":item.description,
        "thumbnail":'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
         duration:item.duration,
        "playCountLimit": item.play_limit,
        currentPlayCount: 10,
        assignedDevices: ["d1","d2"],
        status: item.is_active? 'active' : 'inactive',
        startDate: item.start_date,
        endDate: item.end_date,
        priority:  'medium' ,
        createdAt:item.created_at
      };
    }));
      
    }catch(error){
      console.log(error)
    }
}
 useEffect(()=>{
   videoGet();
 },[])
  

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Ad Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your advertisement videos and campaigns
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Upload New Ad
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search videos..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Video
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Devices
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Schedule
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
              {paginatedVideos.map((video) => (
                <tr
                  key={video.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {video.description.substring(0, 40)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {video.duration}s
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {video.currentPlayCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        of {video.playCountLimit.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <MonitorPlay className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {video.assignedDevices.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(video.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-1">to {new Date(video.endDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        video.status === 'active'
                          ? 'default'
                          : video.status === 'paused'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {video.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => toast.success('Video paused')}
                      >
                        {video.status === 'paused' ? (
                          <Play className="w-4 h-4" />
                        ) : (
                          <Pause className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => {
                          setSelectedVideo(video);
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
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredVideos.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Advertisement</DialogTitle>
            <DialogDescription>
              Add a new video advertisement to your campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="video-file">Video File</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <input type='file' className="text-sm text-gray-600 dark:text-gray-400" onChange={(e)=>setSelectedFile(e.target.files[0])}/>
                
                
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  MP4, MOV or AVI (max. 100MB)
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input onChange={(e)=>setAddData({...addData,title:e.target.value})} id="title" placeholder="Enter video title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
              onChange={(e)=>setAddData({...addData,description:e.target.value})}
                id="description"
                placeholder="Enter video description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input onChange={(e)=>setAddData({...addData,start_date:e.target.value})} id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input onChange={(e)=>setAddData({...addData,end_date:e.target.value})} id="end-date" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="play-count">Play Count Limit</Label>
                <Input onChange={(e)=>setAddData({...addData,play_limit:e.target.value})} id="play-count" type="number" placeholder="1000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* <div className="space-y-2">
              <Label>Assign to Devices</Label>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {mockDevices.slice(0, 6).map((device) => (
                    <label
                      key={device.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                    >
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {device.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {device.location}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedVideo?.title}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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