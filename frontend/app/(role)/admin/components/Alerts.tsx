'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Edit, Trash2, Plus } from 'lucide-react';
import LocationPicker from '@/components/LocationPicker';
import { getAuthToken } from '@/lib/cookies';
import { AlertSeverity } from '@/types';
import { toast } from 'sonner';

type Alert = {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  active: boolean
  latitude: number;
  longitude: number;
  radius_km: number;
  address: string;
  affected_areas: string[];
  instructions: string;
  start_time: string;
  end_time: string;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<Partial<Alert> | null>({
    affected_areas: [''],
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);
  const authToken = getAuthToken();

  // Fetch alerts on component mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('https://crisisaid-backend.onrender.com/api/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch {
      // console.error('Error fetching alerts:', error);
      toast.error('Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAlert = () => {
    setCurrentAlert({
      title: '',
      message: '',
      severity: 'INFO',
      latitude: 0,
      longitude: 0,
      radius_km: 0,
      address: '',
      affected_areas: [''],
      instructions: '',
      start_time: new Date().toISOString().split('T')[0],
      end_time: new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const handleEditAlert = (alert: Alert) => {
    setCurrentAlert({ ...alert });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setAlertToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAlert) return;

    // Format dates to ISO string
    const formatDate = (dateString: string) => {
      if (!dateString) return new Date().toISOString();
      // If the date string doesn't have timezone info, assume it's in local time
      const date = new Date(dateString);
      // Return ISO string without milliseconds and with 'Z' for UTC
      return date.toISOString().split('.')[0] + 'Z';
    };

    // Prepare the alert data with proper type conversion
    const alertData = {
      ...currentAlert,
      latitude: Number(currentAlert.latitude) || 0,
      longitude: Number(currentAlert.longitude) || 0,
      radius_km: Number(currentAlert.radius_km) || 0.1,
      start_time: formatDate(currentAlert.start_time || new Date().toISOString()),
      end_time: formatDate(currentAlert.end_time || new Date(Date.now() + 86400000).toISOString()),
      severity: currentAlert.severity as AlertSeverity,
    };

    const url = currentAlert.id
      ? `https://crisisaid-backend.onrender.com/api/alerts/${currentAlert.id}`
      : 'https://crisisaid-backend.onrender.com/api/alerts';

    const method = currentAlert.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(alertData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save alert');
      }

      setIsDialogOpen(false);
      fetchAlerts();
    } catch {
      // console.error('Error saving alert:', error);
      toast.error('Failed to save alert');
    }
  };

  const handleDelete = async () => {
    if (!alertToDelete) return;

    try {
      const response = await fetch(`https://crisisaid-backend.onrender.com/api/alerts/${alertToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        fetchAlerts();
      }
    } catch {
      // console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentAlert) return;
    const { name, value } = e.target;
    setCurrentAlert({ ...currentAlert, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (!currentAlert) return;
    setCurrentAlert({ ...currentAlert, [name]: value });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAffectedAreaChange = (index: number, value: string) => {
    if (!currentAlert || !currentAlert.affected_areas) return;
    const newAffectedAreas = [...currentAlert.affected_areas] as [string];
    newAffectedAreas[index] = value;
    setCurrentAlert({
      ...currentAlert,
      affected_areas: newAffectedAreas,
    });
  };

  if (isLoading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alerts Management</h1>
        <Button onClick={handleCreateAlert}>
          <Plus className="mr-2 h-4 w-4" /> Create Alert
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.title}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </TableCell>
                <TableCell>{alert.active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>{new Date(alert.start_time).toLocaleDateString()}</TableCell>
                <TableCell>{alert.end_time ? new Date(alert.end_time).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditAlert(alert)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(alert.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Alert Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentAlert?.id ? 'Edit Alert' : 'Create New Alert'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={currentAlert?.title || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="severity" className="text-sm font-medium">
                    Severity *
                  </label>
                  <Select
                    value={currentAlert?.severity}
                    onValueChange={(value) => handleSelectChange('severity', value as AlertSeverity)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INFO">Info</SelectItem>
                      <SelectItem value="WARNING">Warning</SelectItem>
                      <SelectItem value="DANGER">Danger</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className='space-y-2 w-full'>
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={currentAlert?.message || ''}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2 w-full">
                  <label htmlFor="instructions" className="text-sm font-medium">
                    Instructions *
                  </label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    value={currentAlert?.instructions || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Provide clear instructions for this alert"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="h-64 rounded-lg overflow-hidden border">
                  <LocationPicker
                    formData={{
                      latitude: currentAlert?.latitude || 0,
                      longitude: currentAlert?.longitude || 0,
                      address: currentAlert?.address || '',
                    }}
                    setFormData={setCurrentAlert}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="latitude" className="text-sm font-medium">
                    Latitude *
                  </label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.000001"
                    value={currentAlert?.latitude || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="longitude" className="text-sm font-medium">
                    Longitude *
                  </label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.000001"
                    value={currentAlert?.longitude || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="radius_km" className="text-sm font-medium">
                    Radius (km) *
                  </label>
                  <Input
                    id="radius_km"
                    name="radius_km"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={currentAlert?.radius_km || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address *
                </label>
                <Input
                  id="address"
                  name="address"
                  value={currentAlert?.address || ''}
                  onChange={handleChange}
                  placeholder="Full address of the alert location"
                  required
                />
              </div>

              <div className="space-y-4 border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Affected Areas</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!currentAlert) return;
                      const newAreas = [...(currentAlert.affected_areas || []), ''];
                      setCurrentAlert({
                        ...currentAlert,
                        affected_areas: newAreas as [string, ...string[]]
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Area
                  </Button>
                </div>

                <div className="space-y-3">
                  {(currentAlert?.affected_areas || ['']).map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={area}
                        onChange={(e) => handleAffectedAreaChange(index, e.target.value)}
                        placeholder={`Affected area #${index + 1}`}
                        className="flex-1"
                      />
                      {(currentAlert?.affected_areas?.length || 0) > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => {
                            if (!currentAlert?.affected_areas) return;
                            const newAreas = [...currentAlert.affected_areas];
                            newAreas.splice(index, 1);
                            setCurrentAlert({
                              ...currentAlert,
                              affected_areas: newAreas.length > 0
                                ? newAreas as [string, ...string[]]
                                : ['']
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="start_time" className="text-sm font-medium">
                    Start Time *
                  </label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="datetime-local"
                    value={currentAlert?.start_time?.toString().slice(0, 16) || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="end_time" className="text-sm font-medium">
                    End Time *
                  </label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="datetime-local"
                    value={currentAlert?.end_time?.toString().slice(0, 16) || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentAlert?.id ? 'Update' : 'Create'} Alert
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <DialogTitle>Delete Alert</DialogTitle>
            </div>
          </DialogHeader>
          <p>Are you sure you want to delete this alert? This action cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
