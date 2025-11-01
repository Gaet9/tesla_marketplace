import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MessageThread = ({ thread, onReply = () => {}, onMarkAsRead = () => {} }) => {
  const router = useRouter();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const formatTimeAgo = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return messageDate?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleThreadClick = () => {
    if (!thread?.isRead) {
      onMarkAsRead(thread?.id);
    }
  };

  const handleReply = () => {
    if (replyMessage?.trim()) {
      onReply(thread?.id, replyMessage?.trim());
      setReplyMessage('');
      setShowReplyForm(false);
    }
  };

  const handleViewListing = () => {
    router?.push(`/tesla-offer-details?id=${thread?.listingId}`);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 tesla-transition hover:tesla-shadow-sm ${
      !thread?.isRead ? 'border-accent/50 bg-accent/5' : ''
    }`}>
      {/* Thread Header */}
      <div className="flex items-start space-x-3 mb-3">
        {/* Contact Avatar */}
        <div className="flex-shrink-0">
          {thread?.contact?.avatar ? (
            <Image
              src={thread?.contact?.avatar}
              alt={`Profile photo of ${thread?.contact?.name} - professional headshot with friendly expression`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Icon name="User" size={16} />
            </div>
          )}
          
          {!thread?.isRead && (
            <div className="h-3 w-3 bg-accent rounded-full -mt-1 ml-7 border-2 border-card"></div>
          )}
        </div>

        {/* Thread Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-card-foreground truncate">
              {thread?.contact?.name}
            </h4>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(thread?.lastMessageAt)}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2">
            Regarding: {thread?.listingTitle}
          </p>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {thread?.lastMessage}
          </p>
        </div>
      </div>
      {/* Thread Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewListing}
            iconName="Car"
            iconPosition="left"
          >
            View Listing
          </Button>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="MessageCircle" size={12} />
            <span>{thread?.messageCount} messages</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReplyForm(!showReplyForm)}
          iconName="Reply"
          iconPosition="left"
        >
          Reply
        </Button>
      </div>
      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="space-y-3">
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e?.target?.value)}
              placeholder="Type your reply..."
              className="w-full p-3 bg-input border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              rows={3}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {replyMessage?.length}/500 characters
              </span>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyMessage('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyMessage?.trim() || replyMessage?.length > 500}
                  iconName="Send"
                  iconPosition="left"
                >
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageThread;