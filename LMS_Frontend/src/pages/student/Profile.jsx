import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "./Course";
import { toast } from "sonner";

function Profile() {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    { isLoading: updateUserIsLoading, isError, isSuccess, error },
  ] = useUpdateUserMutation();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Profile updated");
    }
    if (isError) {
      toast.error(error?.message || "Error updating profile");
    }
  }, [isSuccess, isError]);

  const changeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(file);
    }
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profile", profile);
    await updateUser(formData);
  };

  if (isLoading) return <h1>Profile loading...</h1>;

  const { user } = data;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6 transition-colors overflow-x-hidden">
      <div className="max-w-full sm:max-w-4xl mx-auto px-2">
        <h1 className="text-3xl font-bold mb-6 ml-1 text-gray-900 dark:text-white">
          Profile
        </h1>

        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          <CardHeader className="flex flex-col items-start gap-3">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={user.photoUrl || "https://github.com/shadcn.png"}
                alt="User"
              />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              {user.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </CardHeader>
          <CardContent className="mt-4">
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="file">Upload Photo</Label>
                      <Input
                        id="file"
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    {updateUserIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Please Wait
                      </>
                    ) : (
                      <Button type="submit" onClick={updateUserHandler}>
                        Save changes
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </CardContent>
        </Card>
        {user?.role === "student" && (
          <div className="mt-10">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-4 ml-1">
              Courses You Are Enrolled In
            </h5>
            {user.enrollCourses?.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 ml-1">
                You are not enrolled in any courses.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {user.enrollCourses?.map((course) => (
                  <Course course={course} key={course._id} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
