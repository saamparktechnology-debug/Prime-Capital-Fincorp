// modules/profile/ProfilePage.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab } from "./components/ProfileInfoTab";
import { ChangePasswordTab } from "./components/ChangePasswordTab";
import { PreferencesTab } from "./components/PreferencesTab";
import { MyKycTab } from "./components/MyKycTab";
import { useAuthStore } from "@/store/authStore";
import { ROLE } from "@/lib/constants/statuses";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const isAgent = user?.role === ROLE.AGENT;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile & Settings"
        description="Manage your account and preferences"
      />

      <Tabs defaultValue="info">
        <TabsList
          className={`grid w-full max-w-2xl ${isAgent ? "grid-cols-4" : "grid-cols-3"}`}
        >
          <TabsTrigger value="info">Profile</TabsTrigger>
          {isAgent && <TabsTrigger value="kyc">My KYC</TabsTrigger>}
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <ProfileInfoTab />
        </TabsContent>

        {isAgent && (
          <TabsContent value="kyc" className="mt-6">
            <MyKycTab />
          </TabsContent>
        )}

        <TabsContent value="password" className="mt-6">
          <ChangePasswordTab />
        </TabsContent>
        <TabsContent value="preferences" className="mt-6">
          <PreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
