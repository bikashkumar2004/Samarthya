import {  Menu } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { getUserData, logout } from "@/store/auth-slice/accountVerified";

export default function Headers({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.getdata);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <Menu />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-black text-white flex items-center justify-center text-lg font-semibold">
                <span className="text-xl">{userData?.name?.[0]?.toUpperCase()}</span>
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="cursor-pointer bg-white mr-3.5">
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-black" />
            <DropdownMenuLabel onClick={handleLogout}>
              Logout
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
