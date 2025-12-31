"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  User,
  Mail,
  Phone,
  Save,
  Camera,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { userService, type UpdateProfileData } from "@/lib/user.service";

export default function ProfilePage() {
  const { user, setUser } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    business_name: "",
    business_address: "",
    profileImage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load fresh user data from backend
  const loadUserProfile = async () => {
    if (!user) return;

    setIsRefreshing(true);
    try {
      const freshUserData = await userService.getProfile();
      setUser(freshUserData);
      setProfileData({
        name: freshUserData.name || "",
        email: freshUserData.email || "",
        phone: freshUserData.phone || "",
        business_name: freshUserData.businessName || "",
        business_address: freshUserData.businessAddress || "",
        profileImage: freshUserData.avatarUrl || "",
      });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Using cached data.",
        variant: "destructive",
      });
      // Fallback to existing user data
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        business_name: (user as any)?.business_name || "",
        business_address: (user as any)?.business_address || "",
        profileImage: (user as any)?.profileImage || "",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [user?.id]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (profileData.phone && !/^\+?[\d\s-()]+$/.test(profileData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare update data
      const updateData: UpdateProfileData = {
        name: profileData.name,
        phone: profileData.phone,
        businessName: profileData.business_name,
        businessAddress: profileData.business_address,
        avatarUrl: profileData.profileImage,
      };

      // Call real API
      const updatedUser = await userService.updateProfile(updateData);

      // Update store with fresh data
      setUser(updatedUser);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image under 2MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileData((prev) => ({
            ...prev,
            profileImage: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);

        // Upload to server
        setIsLoading(true);
        const result = await userService.uploadAvatar(file);

        // Update profile data with server URL
        setProfileData((prev) => ({
          ...prev,
          profileImage: result.avatarUrl,
        }));

        toast({
          title: "Image Uploaded",
          description: "Your profile picture has been updated.",
        });
      } catch (error: any) {
        console.error("Failed to upload image:", error);
        toast({
          title: "Upload Failed",
          description:
            error.message || "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Please log in to view and manage your profile settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-[30px] py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information and account preferences
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadUserProfile}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profileData.profileImage}
                      alt={profileData.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {profileData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </label>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="font-medium">{profileData.name}</h3>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Member since{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={errors.name ? "border-red-500" : ""}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={errors.email ? "border-red-500" : ""}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={errors.phone ? "border-red-500" : ""}
                      placeholder="+234 801 234 5678"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor/Buyer Specific Information */}
            {user.role === "vendor" && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business Name</Label>
                      <Input
                        id="business_name"
                        value={profileData.business_name}
                        onChange={(e) =>
                          handleInputChange("business_name", e.target.value)
                        }
                        placeholder="Enter your business name"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="business_address">Business Address</Label>
                      <Textarea
                        id="business_address"
                        value={profileData.business_address}
                        onChange={(e) =>
                          handleInputChange("business_address", e.target.value)
                        }
                        placeholder="Enter your business address"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Your email is{" "}
                      {user.isVerified ? "verified" : "not verified"}
                    </p>
                  </div>
                  <Badge variant={user.isVerified ? "default" : "destructive"}>
                    {user.isVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
