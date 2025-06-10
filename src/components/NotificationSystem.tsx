import { useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "vote" | "proposal" | "achievement" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "vote",
      title: "New Vote Cast",
      message: "Your vote on 'Community Treasury Management' has been recorded",
      timestamp: "2 minutes ago",
      read: false,
      action: {
        label: "View Proposal",
        onClick: () => console.log("View proposal"),
      },
    },
    {
      id: "2",
      type: "proposal",
      title: "New Proposal",
      message: "A new proposal 'Platform Development Roadmap' has been created",
      timestamp: "1 hour ago",
      read: false,
      action: {
        label: "View Proposal",
        onClick: () => console.log("View proposal"),
      },
    },
    {
      id: "3",
      type: "achievement",
      title: "Achievement Unlocked",
      message: "You've earned the 'Active Voter' badge",
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "system",
      title: "System Update",
      message: "New voting features have been added to the platform",
      timestamp: "1 day ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, read: true }))
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "vote":
        return "🗳️";
      case "proposal":
        return "📝";
      case "achievement":
        return "🏆";
      case "system":
        return "⚙️";
      default:
        return "📢";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start gap-2 p-4",
                  !notification.read && "bg-muted/50"
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {notification.action && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-8 px-0"
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </Button>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationSystem; 