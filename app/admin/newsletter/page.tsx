"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Users,
  Send,
  Eye,
  TrendingUp,
  Filter,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/lib/admin.service";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";

interface NewsletterStats {
  totalActive: number;
  totalInactive: number;
  total: number;
  recentSubscribers: number;
  growthRate: string | number;
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  source: string;
  tags: string[];
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export default function NewsletterPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("compose");

  // Stats
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscribersPagination, setSubscribersPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Compose
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [targetTags, setTargetTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [sending, setSending] = useState(false);

  // Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewResult, setPreviewResult] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "subscribers") {
      fetchSubscribers();
    }
  }, [activeTab, subscribersPagination.page, showActiveOnly]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const data = await adminService.getNewsletterStats();
      setStats(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch newsletter stats",
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      setSubscribersLoading(true);
      const data = await adminService.getNewsletterSubscribers({
        page: subscribersPagination.page,
        limit: subscribersPagination.limit,
        activeOnly: showActiveOnly,
      });
      setSubscribers(data.subscribers);
      setSubscribersPagination(data.pagination);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch subscribers",
        variant: "destructive",
      });
    } finally {
      setSubscribersLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !targetTags.includes(tag)) {
      setTargetTags([...targetTags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTargetTags(targetTags.filter((t) => t !== tag));
  };

  const handleSendNewsletter = async () => {
    if (!subject.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a subject line",
        variant: "destructive",
      });
      return;
    }

    if (!htmlContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter email content",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      const result = await adminService.sendNewsletter({
        subject,
        htmlContent: wrapInEmailTemplate(htmlContent),
        textContent: textContent || undefined,
        targetTags: targetTags.length > 0 ? targetTags : undefined,
        testMode,
      });

      if (testMode) {
        setPreviewResult(result);
        setPreviewOpen(true);
      } else {
        toast({
          title: "Newsletter Sent!",
          description: `Successfully sent to ${result.sentCount} subscribers${
            result.failedCount ? ` (${result.failedCount} failed)` : ""
          }`,
        });
        // Clear form after successful send
        setSubject("");
        setHtmlContent("");
        setTextContent("");
        setTargetTags([]);
      }
    } catch (error: any) {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send newsletter",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const wrapInEmailTemplate = (content: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FarmShare Newsletter</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #16a34a, #15803d); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌾 FarmShare</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Fresh from Farm to Table</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
            ${content}
          </div>
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} FarmShare. All rights reserved.</p>
            <p>
              <a href="{{unsubscribe_url}}" style="color: #16a34a; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-6 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          {/* Breadcrumbs */}
          <AdminBreadcrumbs items={[{ label: "Newsletter" }]} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Newsletter Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Compose and send newsletters to your subscribers
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStats}
              disabled={statsLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${statsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Active Subscribers
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading
                        ? "..."
                        : stats?.totalActive?.toLocaleString() ?? 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New This Week
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading
                        ? "..."
                        : stats?.recentSubscribers?.toLocaleString() ?? 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <UserMinus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Unsubscribed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading
                        ? "..."
                        : stats?.totalInactive?.toLocaleString() ?? 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Growth Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading ? "..." : `${stats?.growthRate ?? 0}%`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="compose" className="gap-2">
                <Mail className="h-4 w-4" />
                Compose
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="gap-2">
                <Users className="h-4 w-4" />
                Subscribers
              </TabsTrigger>
            </TabsList>

            {/* Compose Tab */}
            <TabsContent value="compose">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Compose Newsletter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line *</Label>
                    <Input
                      id="subject"
                      placeholder="Enter email subject..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  {/* HTML Content */}
                  <div className="space-y-2">
                    <Label htmlFor="htmlContent">Email Content (HTML) *</Label>
                    <Textarea
                      id="htmlContent"
                      placeholder="<p>Hello!</p><p>Welcome to our latest newsletter...</p>"
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      Use HTML for formatting. The content will be wrapped in
                      our email template automatically.
                    </p>
                  </div>

                  {/* Plain Text Fallback */}
                  <div className="space-y-2">
                    <Label htmlFor="textContent">
                      Plain Text Fallback (Optional)
                    </Label>
                    <Textarea
                      id="textContent"
                      placeholder="Plain text version for email clients that don't support HTML..."
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Target Tags */}
                  <div className="space-y-2">
                    <Label>Target Tags (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag to filter recipients..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button variant="outline" onClick={addTag}>
                        Add
                      </Button>
                    </div>
                    {targetTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {targetTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Leave empty to send to all active subscribers. Add tags to
                      target specific groups.
                    </p>
                  </div>

                  {/* Test Mode Toggle */}
                  <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-200">
                          Test Mode
                        </p>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Preview without sending actual emails
                        </p>
                      </div>
                    </div>
                    <Switch checked={testMode} onCheckedChange={setTestMode} />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      className="flex-1"
                      onClick={handleSendNewsletter}
                      disabled={
                        sending || !subject.trim() || !htmlContent.trim()
                      }
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {testMode ? "Previewing..." : "Sending..."}
                        </>
                      ) : (
                        <>
                          {testMode ? (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview Newsletter
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Newsletter
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscribers Tab */}
            <TabsContent value="subscribers">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Subscribers
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="activeOnly"
                          checked={showActiveOnly}
                          onCheckedChange={setShowActiveOnly}
                        />
                        <Label htmlFor="activeOnly" className="text-sm">
                          Active only
                        </Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchSubscribers}
                        disabled={subscribersLoading}
                      >
                        <RefreshCw
                          className={`h-4 w-4 mr-2 ${
                            subscribersLoading ? "animate-spin" : ""
                          }`}
                        />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {subscribersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : subscribers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No subscribers found</p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-lg border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Email</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Tags</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Subscribed</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subscribers.map((subscriber) => (
                              <TableRow key={subscriber.id}>
                                <TableCell className="font-medium">
                                  {subscriber.email}
                                </TableCell>
                                <TableCell>{subscriber.name || "-"}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {subscriber.source}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {subscriber.tags.length > 0 ? (
                                      subscriber.tags.map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      subscriber.isActive
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={
                                      subscriber.isActive
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : ""
                                    }
                                  >
                                    {subscriber.isActive
                                      ? "Active"
                                      : "Unsubscribed"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-500">
                                  {formatDate(subscriber.subscribedAt)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {subscribersPagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-sm text-gray-500">
                            Page {subscribersPagination.page} of{" "}
                            {subscribersPagination.totalPages} (
                            {subscribersPagination.total} total)
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={subscribersPagination.page <= 1}
                              onClick={() =>
                                setSubscribersPagination((prev) => ({
                                  ...prev,
                                  page: prev.page - 1,
                                }))
                              }
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!subscribersPagination.hasMore}
                              onClick={() =>
                                setSubscribersPagination((prev) => ({
                                  ...prev,
                                  page: prev.page + 1,
                                }))
                              }
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Preview Result Modal */}
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Newsletter Preview
                </DialogTitle>
                <DialogDescription>
                  Test mode preview - no emails were sent
                </DialogDescription>
              </DialogHeader>

              {previewResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Subject
                      </p>
                      <p className="font-medium">{previewResult.subject}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recipients
                      </p>
                      <p className="font-medium">
                        {previewResult.recipientCount} subscribers
                      </p>
                    </div>
                  </div>

                  {previewResult.testRecipients &&
                    previewResult.testRecipients.length > 0 && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Sample Recipients
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {previewResult.testRecipients.map((email: string) => (
                            <Badge key={email} variant="outline">
                              {email}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Content Preview
                    </p>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-gray-900 p-4 rounded border max-h-64 overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(previewResult.htmlPreview || ""),
                      }}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setTestMode(false);
                    setPreviewOpen(false);
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send for Real
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
