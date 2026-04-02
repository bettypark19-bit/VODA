import SectionTitle from "./SectionTitle";
import ProfileTab from "./ProfileTab";
import ProfileCard from "./ProfileCard";
import ProfileBar from "./ProfileBar";

export default function ProfileFeed() {
  return (
    <>
      <SectionTitle />

      <div className="px-4">
        <ProfileTab />
        <div className="grid grid-cols-3 gap-6 p-10">
          {/* 1. 알림 설정 (기본값) */}
          <ProfileCard type="alarm" />
          {/* 2. 계정 설정 */}
          <ProfileCard type="account" />
          {/* 3. 시청 설정 */}
          <ProfileCard type="view" />
        </div>
        <ProfileBar />
      </div>
    </>
  );
}
