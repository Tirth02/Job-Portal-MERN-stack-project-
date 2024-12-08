import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/constants/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.map(skill => skill) ||"",
    file: user?.profile?.resume ||"",
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
   const fileChangeHandler = (e) =>{
      const file = e.target.files?.[0];
      setInput({...input, file});
   }
  const submitHandler = async (e) =>{
    e.preventDefault();
    const formData = new FormData;
    formData.append("fullname",input.fullname);
    formData.append("email",input.email);
    formData.append("phoneNumber",input.phoneNumber);
    formData.append("bio",input.bio);
    formData.append("skills",input.skills);
    if(input.file)
    {
        formData.append("file",input.file);
    }

    try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials: true
            });
            console.log("res is ",res);
            if(res.data.success)
            {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
    finally
    {
      setLoading(false);
    }
    setOpen(false);
    console.log(input);
  } 

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  className="col-span-3"
                  onChange={changeEventHandler}
                  value={input.fullname}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  onChange={changeEventHandler}
                  className="col-span-3"
                  value={input.email}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="number" className="text-right">
                  Mobile-no
                </Label>
                <Input
                  id="number"
                  name="number"
                  onChange={changeEventHandler}
                  className="col-span-3"
                  value={input.phoneNumber}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input
                  id="bio"
                  name="bio"
                  onChange={changeEventHandler}
                  className="col-span-3"
                  value={input.bio}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right">
                  Skills
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  onChange={changeEventHandler}
                  className="col-span-3"
                  value={input.skills}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resume" className="text-right">
                  Resume
                </Label>
                <Input
                  id="resume"
                  onChange={fileChangeHandler}
                  name="resume"
                  className="col-span-3"
                  type="file"
                  accept="application/pdf"
                />
              </div>
            </div>
            <DialogFooter>
              {loading ? (
                <Button className="w-full my-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" className="w-full my-4">
                  Update
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog;
