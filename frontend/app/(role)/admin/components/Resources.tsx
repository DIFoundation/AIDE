import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import LocationPicker from '@/components/LocationPicker';
import { toast } from "sonner";

// Types
type ResourceType =
  | "FOOD"
  | "WATER"
  | "SHELTER"
  | "MEDICAL"
  | "CLOTHING"
  | "OTHER";
type ResourceStatus =
  | "AVAILABLE"
  | "LIMITED"
  | "TEMPORARILY_CLOSED"
  | "UNAVAILABLE";

type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  verified: boolean;
  description: string;
  capacity: number;
  current_occupancy: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  operating_hours: string;
  notes: string;
  submitted_by: {
    id: string;
    name: string;
  };
};

type FilterType = "all" | ResourceType;

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentResource, setCurrentResource] =
    useState<Partial<Resource> | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Resource types for dropdown with user-friendly display names
  const resourceTypes = [
    { value: "FOOD", label: "Food & Meals" },
    { value: "WATER", label: "Drinking Water" },
    { value: "SHELTER", label: "Emergency Shelter" },
    { value: "MEDICAL", label: "Medical Supplies" },
    { value: "CLOTHING", label: "Clothing" },
    { value: "OTHER", label: "Other Resources" },
  ] as const;

  const resourceStatuses: ResourceStatus[] = [
    "AVAILABLE",
    "LIMITED",
    "TEMPORARILY_CLOSED",
    "UNAVAILABLE",
  ];

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("authToken");
        const response = await fetch(
          "https://aide-backend-qj4f.onrender.com/api/resources",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        const data = await response.json();
        setResources(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []); // Empty dependency array means this runs once on mount

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesFilter = filter === "all" || resource.type === filter;
    const matchesSearch =
      resource.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.status?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle CRUD operations
  const handleCreateNew = () => {
    setCurrentResource({
      name: "",
      description: "",
      type: "FOOD",
      status: "AVAILABLE",
      capacity: 1,
      current_occupancy: 0,
      latitude: 0,
      longitude: 0,
      address: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      email: "",
      operating_hours: "",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    setCurrentResource({ ...resource });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setResourceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;

    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `https://aide-backend-qj4f.onrender.com/api/resources/${resourceToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      // Update local state
      setResources(resources.filter((r) => r.id !== resourceToDelete));
      setIsDeleteDialogOpen(false);
      setResourceToDelete(null);
      toast.success("Resource deleted successfully");
    } catch {
      // console.error("Error deleting resource:", err);
      toast.error("Error deleting resource");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResource) return;

    try {
      const token = Cookies.get("authToken");
      const isUpdate = !!currentResource.id;
      const url = isUpdate
        ? `https://aide-backend-qj4f.onrender.com/api/resources/${currentResource.id}`
        : "https://aide-backend-qj4f.onrender.com/api/resources";

      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentResource),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? "update" : "create"} resource`);
      }

      const data = await response.json();

      // Update local state
      if (isUpdate) {
        setResources(resources.map((r) => (r.id === data.id ? data : r)));
      } else {
        setResources([...resources, data]);
      }

      setIsDialogOpen(false);
      setCurrentResource(null);
      toast.success("Resource submitted successfully");
    } catch (err) {
      // console.error("Error saving resource:", err);
      toast.error("Error saving resource " + err);
    }
  };

  // const handleLocationSelect = (location: any) => {
  //   setCurrentResource((prev) => ({
  //     ...prev,
  //     latitude: location.lat,
  //     longitude: location.lng,
  //     address: location.address || "",
  //     city: location.city || "",
  //     state: location.state || "",
  //     country: location.country || "",
  //   }));
  // };

  // Status badge color mapping
  const getStatusBadgeVariant = (status: ResourceStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "default";
      case "LIMITED":
        return "secondary";
      case "TEMPORARILY_CLOSED":
        return "outline";
      case "UNAVAILABLE":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Type badge color mapping
  const getTypeBadgeVariant = (type: ResourceType) => {
    switch (type) {
      case "FOOD":
        return "default";
      case "WATER":
        return "secondary";
      case "SHELTER":
        return "outline";
      case "MEDICAL":
        return "destructive";
      case "CLOTHING":
        return "outline";
      case "OTHER":
        return "outline";
      default:
        return "outline";
    }
  };

  const getVerifiedBadgeVariant = (verified: boolean) => {
    return verified ? "default" : "destructive";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Resources</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select
            value={filter}
            onValueChange={(value: FilterType) => setFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {resourceTypes.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateNew} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Add Resource
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Operating Hours</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResources.length > 0 ? (
              paginatedResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{resource.name}</span>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {resource.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(resource.type)}>
                      {resourceTypes.find((t) => t.value === resource.type)
                        ?.label || resource.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(resource.status)}>
                      {resource.status
                        .split("_")
                        .map(
                          (word) => word.charAt(0) + word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={resource.verified ? "true" : "false"}
                      onValueChange={async (value) => {
                        try {
                          const token = Cookies.get("authToken");
                          const response = await fetch(
                            `https://aide-backend-qj4f.onrender.com/api/resources/${resource.id}/verify`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                verified: value === "true",
                              }),
                            }
                          );

                          if (!response.ok) {
                            throw new Error("Failed to update verification status");
                          }

                          // Update the local state to reflect the change
                          setResources(
                            resources.map((r) =>
                              r.id === resource.id
                                ? { ...r, verified: value === "true" }
                                : r
                            )
                          );
                          toast.success("Verification status updated successfully");
                        } catch (error) {
                          console.error("Error updating verification status:", error);
                          toast.error("Failed to update verification status");
                        }
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Verified</SelectItem>
                        <SelectItem value="false">Unverified</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{resource.capacity}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {resource.address}
                  </TableCell>
                  <TableCell>
                    {resource.operating_hours}
                  </TableCell>
                  <TableCell>
                    {resource.submitted_by.name}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(resource)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchQuery || filter !== "all"
                    ? "No resources match your search criteria."
                    : 'No resources found. Click "Add Resource" to get started.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add/Edit Resource Dialog */}
      {currentResource && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isDialogOpen ? 'block' : 'hidden'}`}>
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {currentResource.id ? 'Edit Resource' : 'Add New Resource'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resource Name *</label>
                  <Input
                    value={currentResource.name || ''}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter resource name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Resource Type</label>
                  <Select
                    value={currentResource.type}
                    onValueChange={(value: ResourceType) =>
                      setCurrentResource({
                        ...currentResource,
                        type: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={currentResource.status}
                    onValueChange={(value: ResourceStatus) =>
                      setCurrentResource({
                        ...currentResource,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status
                            .split('_')
                            .map((s) => s.charAt(0) + s.slice(1).toLowerCase())
                            .join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacity</label>
                  <Input
                    type="number"
                    value={currentResource.capacity || ''}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                    placeholder="Enter capacity"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Occupancy</label>
                  <Input
                    type="number"
                    value={currentResource.current_occupancy || ''}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        current_occupancy: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    placeholder="Enter current occupancy"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <textarea
                  value={currentResource.description || ''}
                  onChange={(e) =>
                    setCurrentResource({
                      ...currentResource,
                      description: e.target.value,
                    })
                  }
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <div className="h-64 rounded-lg overflow-hidden border">
                    <LocationPicker
                      formData={{
                        latitude: currentResource?.latitude || 0,
                        longitude: currentResource?.longitude || 0,
                        address: currentResource?.address || '',
                        city: currentResource?.city || '',
                        state: currentResource?.state || '',
                        country: currentResource?.country || ''
                      }}
                      setFormData={setCurrentResource}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address *</label>
                    <Input
                      value={currentResource.address || ''}
                      onChange={(e) =>
                        setCurrentResource({
                          ...currentResource,
                          address: e.target.value,
                        })
                      }
                      placeholder="Full address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City *</label>
                    <Input
                      value={currentResource.city || ''}
                      onChange={(e) =>
                        setCurrentResource({
                          ...currentResource,
                          city: e.target.value,
                        })
                      }
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State/Region *</label>
                    <Input
                      value={currentResource.state || ''}
                      onChange={(e) =>
                        setCurrentResource({
                          ...currentResource,
                          state: e.target.value,
                        })
                      }
                      placeholder="State/Region"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country *</label>
                    <Input
                      value={currentResource.country || ''}
                      onChange={(e) =>
                        setCurrentResource({
                          ...currentResource,
                          country: e.target.value,
                        })
                      }
                      placeholder="Country"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Coordinates *</label>
                    <div className="flex space-x-2">
                      <Input
                        value={currentResource.latitude || 0}
                        placeholder="Latitude"
                        readOnly
                        className="text-muted-foreground"
                        required
                      />
                      <Input
                        value={currentResource.longitude || 0}
                        placeholder="Longitude"
                        readOnly
                        className="text-muted-foreground"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email *</label>
                  <Input
                    type="email"
                    value={currentResource.email || ''}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        email: e.target.value,
                      })
                    }
                    placeholder="contact@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={currentResource.phone || ''}
                    onChange={(e) =>
                      setCurrentResource({
                        ...currentResource,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Operating Hours</label>
                <Input
                  value={currentResource.operating_hours || ''}
                  onChange={(e) =>
                    setCurrentResource({
                      ...currentResource,
                      operating_hours: e.target.value,
                    })
                  }
                  placeholder="e.g., Mon-Fri 9:00 AM - 5:00 PM"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes</label>
                <textarea
                  value={currentResource.notes || ''}
                  onChange={(e) =>
                    setCurrentResource({
                      ...currentResource,
                      notes: e.target.value,
                    })
                  }
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                  placeholder="Any additional information or special instructions"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {currentResource.id ? 'Update' : 'Create'} Resource
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Delete Resource</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this resource? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setResourceToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
