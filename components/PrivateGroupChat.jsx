import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Send, Image, Video } from "lucide-react";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const PrivateGroupChat = ({ user }) => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Project Alpha",
      description: "Project discussions and updates",
      lastMessage: "Meeting at 3 PM",
      code: "ALPHA123",
      members: [1],
      isPending: false,
    },
  ]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupPic, setNewGroupPic] = useState(null);
  const [message, setMessage] = useState("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState({});
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

  const createGroup = async () => {
    /* ... */
  };

  const requestToJoinGroup = (groupId) => {
    setPendingRequests({ ...pendingRequests, [groupId]: true });
    setApprovalDialogOpen(true); // Opens the custom "waiting for approval" dialog
  };

  const joinGroup = (group) => {
    /* ... */
  };

  const sendMessage = () => {
    /* ... */
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 lg:w-[80%] mx-auto text-gray-100">
      {/* Sidebar for groups list */}
      <Card className="w-full lg:w-1/4 bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-pink-600">Private Groups</CardTitle>
        </CardHeader>
        <CardContent>
          {user && user.isVerified && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mb-4 bg-gray-700 hover:bg-gray-600 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" /> Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle className="text-pink-600">
                    Create a New Group
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">{/* Group creation form */}</div>
              </DialogContent>
            </Dialog>
          )}

          <ScrollArea className="h-[calc(100vh-300px)]">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center mb-2 p-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => joinGroup(group)}
              >
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${group.name}`}
                  />
                  <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{group.name}</div>
                  <div className="text-sm text-gray-400">
                    {Array.isArray(group.members) && user?.id
                      ? group.members.includes(user.id)
                        ? group.lastMessage
                        : "Request Access"
                      : "Request Access"}
                  </div>
                </div>
                {!group.members.includes(user?.id) && (
                  <Button
                    className="ml-auto bg-pink-500 hover:bg-pink-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      requestToJoinGroup(group.id);
                    }}
                  >
                    Request Access
                  </Button>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main chat area */}
      <Card className="w-full lg:flex-1 lg:ml-4 bg-gray-800 mt-4 lg:mt-0">
        {selectedGroup ? (
          selectedGroup.members.includes(user.id) ? (
            <>{/* Chat content */}</>
          ) : (
            <CardContent className="flex items-center justify-center h-[calc(100vh-180px)] bg-gray-700 text-white">
              <p>Your join request is pending approval.</p>
            </CardContent>
          )
        ) : (
          <CardContent className="flex items-center justify-center h-[calc(100vh-180px)] bg-gray-700 text-white">
            <p>Select a group to start chatting.</p>
          </CardContent>
        )}
      </Card>

      {/* Custom "waiting for approval" dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-pink-500">Request Sent</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-gray-300">
            <p>
              Your request to join the group is pending approval. You’ll be
              notified once accepted.
            </p>
          </div>
          <Button
            onClick={() => setApprovalDialogOpen(false)}
            className="bg-pink-500 hover:bg-pink-400 mt-4"
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrivateGroupChat;
